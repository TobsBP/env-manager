'use client';

import { collection, onSnapshot, query } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firestore';
import {
	createSubprojectVariableAction,
	deleteSubprojectVariableAction,
	updateSubprojectVariableAction,
} from '@/lib/variables/subproject-variable-actions';
import type { AuthResult } from '@/types/auth';
import type { EnvVariable } from '@/types/variable';

export function useSubprojectVariables(
	projectId: string,
	subprojectId: string,
	envId: string,
) {
	const [variables, setVariables] = useState<EnvVariable[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const q = query(
			collection(
				db,
				'projects',
				projectId,
				'subprojects',
				subprojectId,
				'environments',
				envId,
				'variables',
			),
		);

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as EnvVariable[];
				docs.sort((a, b) => {
					const ta =
						(a.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ??
						0;
					const tb =
						(b.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ??
						0;
					return ta - tb;
				});
				setVariables(docs);
				setIsLoading(false);
			},
			(err) => {
				setError(err.message);
				setIsLoading(false);
			},
		);

		return unsubscribe;
	}, [projectId, subprojectId, envId]);

	const createVariable = useCallback(
		async (key: string, value: string): Promise<AuthResult> => {
			const tempId = `temp-${Date.now()}`;
			const tempVar: EnvVariable = { id: tempId, key, value, createdAt: null };
			setVariables((prev) => [...prev, tempVar]);

			const result = await createSubprojectVariableAction(
				projectId,
				subprojectId,
				envId,
				{
					key,
					value,
				},
			);
			if (!result.success) {
				setVariables((prev) => prev.filter((v) => v.id !== tempId));
				setError(result.error);
			}
			return result;
		},
		[projectId, subprojectId, envId],
	);

	const updateVariable = useCallback(
		async (varId: string, key: string, value: string): Promise<AuthResult> => {
			setVariables((prev) =>
				prev.map((v) => (v.id === varId ? { ...v, key, value } : v)),
			);

			const result = await updateSubprojectVariableAction(
				projectId,
				subprojectId,
				envId,
				varId,
				{ key, value },
			);
			if (!result.success) {
				setError(result.error);
			}
			return result;
		},
		[projectId, subprojectId, envId],
	);

	const deleteVariable = useCallback(
		async (varId: string): Promise<AuthResult> => {
			setVariables((prev) => prev.filter((v) => v.id !== varId));
			const result = await deleteSubprojectVariableAction(
				projectId,
				subprojectId,
				envId,
				varId,
			);
			if (!result.success) {
				setError(result.error);
			}
			return result;
		},
		[projectId, subprojectId, envId],
	);

	return {
		variables,
		isLoading,
		error,
		createVariable,
		updateVariable,
		deleteVariable,
	};
}

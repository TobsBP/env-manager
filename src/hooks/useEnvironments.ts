'use client';

import { collection, onSnapshot, query } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firestore';
import {
	createEnvironmentAction,
	deleteEnvironmentAction,
} from '@/lib/projects/actions';
import type { AuthResult } from '@/types/auth';
import type { Environment } from '@/types/project';

export function useEnvironments(projectId: string) {
	const [environments, setEnvironments] = useState<Environment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const q = query(collection(db, 'projects', projectId, 'environments'));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as Environment[];
				docs.sort((a, b) => {
					const ta =
						(a.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ??
						0;
					const tb =
						(b.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ??
						0;
					return tb - ta;
				});
				setEnvironments(docs);
				setIsLoading(false);
			},
			(err) => {
				setError(err.message);
				setIsLoading(false);
			},
		);

		return unsubscribe;
	}, [projectId]);

	const createEnvironment = useCallback(
		async (name: string): Promise<AuthResult> => {
			const tempId = `temp-${Date.now()}`;
			const tempEnv: Environment = { id: tempId, name, createdAt: null };
			setEnvironments((prev) => [tempEnv, ...prev]);

			const result = await createEnvironmentAction(projectId, { name });
			if (!result.success) {
				setEnvironments((prev) => prev.filter((e) => e.id !== tempId));
				setError(result.error);
			}
			return result;
		},
		[projectId],
	);

	const deleteEnvironment = useCallback(
		async (envId: string): Promise<AuthResult> => {
			setEnvironments((prev) => prev.filter((e) => e.id !== envId));
			const result = await deleteEnvironmentAction(projectId, envId);
			if (!result.success) {
				setError(result.error);
			}
			return result;
		},
		[projectId],
	);

	return {
		environments,
		isLoading,
		error,
		createEnvironment,
		deleteEnvironment,
	};
}

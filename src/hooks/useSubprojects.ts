'use client';

import { collection, onSnapshot, query } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firestore';
import {
	createSubprojectAction,
	deleteSubprojectAction,
	updateSubprojectAction,
} from '@/lib/projects/subproject-actions';
import type { AuthResult } from '@/types/auth';
import type { Subproject } from '@/types/project';

export function useSubprojects(projectId: string) {
	const [subprojects, setSubprojects] = useState<Subproject[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const q = query(collection(db, 'projects', projectId, 'subprojects'));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as Subproject[];
				docs.sort((a, b) => {
					const ta =
						(a.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ??
						0;
					const tb =
						(b.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ??
						0;
					return tb - ta;
				});
				setSubprojects(docs);
				setIsLoading(false);
			},
			(err) => {
				setError(err.message);
				setIsLoading(false);
			},
		);

		return unsubscribe;
	}, [projectId]);

	const createSubproject = useCallback(
		async (name: string, emoji: string): Promise<AuthResult> => {
			const tempId = `temp-${Date.now()}`;
			const tempSub: Subproject = { id: tempId, name, emoji, createdAt: null };
			setSubprojects((prev) => [tempSub, ...prev]);

			const result = await createSubprojectAction(projectId, { name, emoji });
			if (!result.success) {
				setSubprojects((prev) => prev.filter((s) => s.id !== tempId));
				setError(result.error);
			}
			return result;
		},
		[projectId],
	);

	const updateSubproject = useCallback(
		async (
			subprojectId: string,
			name: string,
			emoji: string,
		): Promise<AuthResult> => {
			setSubprojects((prev) =>
				prev.map((s) => (s.id === subprojectId ? { ...s, name, emoji } : s)),
			);

			const result = await updateSubprojectAction(projectId, subprojectId, {
				name,
				emoji,
			});
			if (!result.success) {
				setError(result.error);
			}
			return result;
		},
		[projectId],
	);

	const deleteSubproject = useCallback(
		async (subprojectId: string): Promise<AuthResult> => {
			setSubprojects((prev) => prev.filter((s) => s.id !== subprojectId));
			const result = await deleteSubprojectAction(projectId, subprojectId);
			if (!result.success) {
				setError(result.error);
			}
			return result;
		},
		[projectId],
	);

	return {
		subprojects,
		isLoading,
		error,
		createSubproject,
		updateSubproject,
		deleteSubproject,
	};
}

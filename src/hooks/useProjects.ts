'use client';

import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { db } from '@/lib/firebase/firestore';
import {
	createProjectAction,
	deleteProjectAction,
	updateProjectAction,
} from '@/lib/projects/actions';
import type { AuthResult } from '@/types/auth';
import type { Project } from '@/types/project';

export function useProjects() {
	const { user } = useUser();
	const [projects, setProjects] = useState<Project[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) {
			setProjects([]);
			setIsLoading(false);
			return;
		}

		const q = query(
			collection(db, 'projects'),
			where('userId', '==', user.uid),
		);

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as Project[];
				docs.sort((a, b) => {
					const ta =
						(a.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ??
						0;
					const tb =
						(b.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ??
						0;
					return tb - ta;
				});
				setProjects(docs);
				setIsLoading(false);
			},
			(err) => {
				setError(err.message);
				setIsLoading(false);
			},
		);

		return unsubscribe;
	}, [user]);

	const createProject = useCallback(
		async (name: string, emoji = '📁'): Promise<AuthResult> => {
			const tempId = `temp-${Date.now()}`;
			const tempProject: Project = {
				id: tempId,
				name,
				emoji,
				userId: user?.uid ?? '',
				createdAt: null,
			};
			setProjects((prev) => [tempProject, ...prev]);

			const result = await createProjectAction({ name, emoji });
			if (!result.success) {
				setProjects((prev) => prev.filter((p) => p.id !== tempId));
				setError(result.error);
			}
			return result;
		},
		[user],
	);

	const updateProject = useCallback(
		async (
			projectId: string,
			name: string,
			emoji: string,
		): Promise<AuthResult> => {
			setProjects((prev) =>
				prev.map((p) => (p.id === projectId ? { ...p, name, emoji } : p)),
			);
			const result = await updateProjectAction(projectId, { name, emoji });
			if (!result.success) setError(result.error);
			return result;
		},
		[],
	);

	const deleteProject = useCallback(
		async (projectId: string): Promise<AuthResult> => {
			setProjects((prev) => prev.filter((p) => p.id !== projectId));
			const result = await deleteProjectAction(projectId);
			if (!result.success) {
				setError(result.error);
			}
			return result;
		},
		[],
	);

	return {
		projects,
		isLoading,
		error,
		createProject,
		updateProject,
		deleteProject,
	};
}

'use client';

import {
	collection,
	doc,
	getDoc,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { db } from '@/lib/firebase/firestore';
import {
	createProjectAction,
	deleteProjectAction,
	updateProjectAction,
} from '@/lib/projects/actions';
import type { AuthResult } from '@/types/auth';
import type { ProjectRole } from '@/types/interfaces/project';
import type { Project, ProjectType } from '@/types/project';

export type ProjectWithRole = Project & { role: ProjectRole };

function sortByCreatedAt(projects: ProjectWithRole[]): ProjectWithRole[] {
	return [...projects].sort((a, b) => {
		const ta =
			(a.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ?? 0;
		const tb =
			(b.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ?? 0;
		return tb - ta;
	});
}

export function useProjects() {
	const { user } = useUser();
	const [ownedProjects, setOwnedProjects] = useState<ProjectWithRole[]>([]);
	const [sharedProjects, setSharedProjects] = useState<ProjectWithRole[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const ownedLoaded = useRef(false);
	const sharedLoaded = useRef(false);

	useEffect(() => {
		if (!user) {
			setOwnedProjects([]);
			setSharedProjects([]);
			setIsLoading(false);
			return;
		}

		ownedLoaded.current = false;
		sharedLoaded.current = false;
		setIsLoading(true);

		// Query A — projetos do owner
		const unsubOwned = onSnapshot(
			query(collection(db, 'projects'), where('userId', '==', user.uid)),
			(snapshot) => {
				const docs = snapshot.docs.map((d) => ({
					id: d.id,
					...d.data(),
					role: 'owner' as ProjectRole,
				})) as ProjectWithRole[];
				setOwnedProjects(docs);
				ownedLoaded.current = true;
				if (sharedLoaded.current) setIsLoading(false);
			},
			(err) => {
				setError(err.message);
				ownedLoaded.current = true;
				if (sharedLoaded.current) setIsLoading(false);
			},
		);

		// Query B — projetos compartilhados
		const unsubShared = onSnapshot(
			query(
				collection(db, 'projects'),
				where('memberUids', 'array-contains', user.uid),
			),
			async (snapshot) => {
				const uid = user.uid;
				const withRoles = await Promise.all(
					snapshot.docs.map(async (d) => {
						try {
							const memberSnap = await getDoc(
								doc(db, 'projects', d.id, 'members', uid),
							);
							const role: ProjectRole = memberSnap.exists()
								? (memberSnap.data()?.role as 'editor' | 'viewer')
								: 'viewer';
							return { id: d.id, ...d.data(), role } as ProjectWithRole;
						} catch {
							return {
								id: d.id,
								...d.data(),
								role: 'viewer' as ProjectRole,
							} as ProjectWithRole;
						}
					}),
				);
				setSharedProjects(withRoles);
				sharedLoaded.current = true;
				if (ownedLoaded.current) setIsLoading(false);
			},
			(err) => {
				setError(err.message);
				sharedLoaded.current = true;
				if (ownedLoaded.current) setIsLoading(false);
			},
		);

		return () => {
			unsubOwned();
			unsubShared();
		};
	}, [user]);

	const projects = sortByCreatedAt([...ownedProjects, ...sharedProjects]);

	const createProject = useCallback(
		async (
			name: string,
			emoji = '📁',
			projectType: ProjectType = 'single',
		): Promise<AuthResult> => {
			const tempId = `temp-${Date.now()}`;
			const tempProject: ProjectWithRole = {
				id: tempId,
				name,
				emoji,
				userId: user?.uid ?? '',
				createdAt: null,
				projectType,
				role: 'owner',
			};
			setOwnedProjects((prev) => [tempProject, ...prev]);

			const result = await createProjectAction({ name, emoji, projectType });
			if (!result.success) {
				setOwnedProjects((prev) => prev.filter((p) => p.id !== tempId));
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
			setOwnedProjects((prev) =>
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
			setOwnedProjects((prev) => prev.filter((p) => p.id !== projectId));
			const result = await deleteProjectAction(projectId);
			if (!result.success) setError(result.error);
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

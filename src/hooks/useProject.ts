'use client';

import { doc, onSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firestore';
import {
	updateProjectAction,
	updateProjectTypeAction,
} from '@/lib/projects/actions';
import type { AuthResult } from '@/types/auth';
import type { Project, ProjectType } from '@/types/project';

export function useProject(projectId: string) {
	const [project, setProject] = useState<Project | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			doc(db, 'projects', projectId),
			(snapshot) => {
				if (snapshot.exists()) {
					setProject({ id: snapshot.id, ...snapshot.data() } as Project);
				} else {
					setProject(null);
				}
				setIsLoading(false);
			},
			() => setIsLoading(false),
		);

		return unsubscribe;
	}, [projectId]);

	const updateProjectType = useCallback(
		async (projectType: ProjectType): Promise<AuthResult> => {
			return updateProjectTypeAction(projectId, projectType);
		},
		[projectId],
	);

	const updateFigmaUrl = useCallback(
		async (figmaUrl: string): Promise<AuthResult> => {
			if (!project) return { success: false, error: 'Project not loaded' };
			return updateProjectAction(projectId, {
				name: project.name,
				emoji: project.emoji ?? '📁',
				figmaUrl,
			});
		},
		[projectId, project],
	);

	return { project, isLoading, updateProjectType, updateFigmaUrl };
}

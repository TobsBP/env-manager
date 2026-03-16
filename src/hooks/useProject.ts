'use client';

import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firestore';
import type { Project } from '@/types/project';

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

	return { project, isLoading };
}

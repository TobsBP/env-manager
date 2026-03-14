'use client';

import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { db } from '@/lib/firebase/firestore';
import type { Environment } from '@/types/project';

export interface ProjectEnvPair {
	projectId: string;
	projectName: string;
	envId: string;
	envName: string;
}

export function useAllEnvironments() {
	const { projects, isLoading: projectsLoading } = useProjects();
	const [pairs, setPairs] = useState<ProjectEnvPair[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (projectsLoading) return;
		if (projects.length === 0) {
			setPairs([]);
			setIsLoading(false);
			return;
		}

		const unsubscribers: (() => void)[] = [];
		const envsByProject = new Map<string, Environment[]>();

		let settled = 0;

		for (const project of projects) {
			const q = query(collection(db, 'projects', project.id, 'environments'));
			const unsub = onSnapshot(q, (snapshot) => {
				const envs = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as Environment[];
				envsByProject.set(project.id, envs);
				settled += 1;

				if (settled >= projects.length) {
					const result: ProjectEnvPair[] = [];
					for (const p of projects) {
						for (const env of envsByProject.get(p.id) ?? []) {
							result.push({
								projectId: p.id,
								projectName: p.name,
								envId: env.id,
								envName: env.name,
							});
						}
					}
					setPairs(result);
					setIsLoading(false);
				}
			});
			unsubscribers.push(unsub);
		}

		return () => {
			for (const unsub of unsubscribers) unsub();
		};
	}, [projects, projectsLoading]);

	return { pairs, isLoading };
}

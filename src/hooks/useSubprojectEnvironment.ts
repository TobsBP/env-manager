'use client';

import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firestore';
import type { Environment } from '@/types/project';

export function useSubprojectEnvironment(
	projectId: string,
	subprojectId: string,
	envId: string,
) {
	const [environment, setEnvironment] = useState<Environment | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const ref = doc(
			db,
			'projects',
			projectId,
			'subprojects',
			subprojectId,
			'environments',
			envId,
		);

		const unsubscribe = onSnapshot(ref, (snapshot) => {
			if (snapshot.exists()) {
				setEnvironment({ id: snapshot.id, ...snapshot.data() } as Environment);
			} else {
				setEnvironment(null);
			}
			setIsLoading(false);
		});

		return unsubscribe;
	}, [projectId, subprojectId, envId]);

	return { environment, isLoading };
}

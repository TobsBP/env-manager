'use client';

import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firestore';
import type { Environment } from '@/types/project';

export function useEnvironment(projectId: string, envId: string) {
	const [environment, setEnvironment] = useState<Environment | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const ref = doc(db, 'projects', projectId, 'environments', envId);

		const unsubscribe = onSnapshot(
			ref,
			(snapshot) => {
				if (snapshot.exists()) {
					setEnvironment({ id: snapshot.id, ...snapshot.data() } as Environment);
				} else {
					setEnvironment(null);
				}
				setIsLoading(false);
			},
			() => {
				setIsLoading(false);
			},
		);

		return unsubscribe;
	}, [projectId, envId]);

	return { environment, isLoading };
}

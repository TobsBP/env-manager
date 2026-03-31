'use client';

import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firestore';
import type { Subproject } from '@/types/project';

export function useSubproject(projectId: string, subprojectId: string) {
	const [subproject, setSubproject] = useState<Subproject | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const ref = doc(db, 'projects', projectId, 'subprojects', subprojectId);

		const unsubscribe = onSnapshot(ref, (snapshot) => {
			if (snapshot.exists()) {
				setSubproject({ id: snapshot.id, ...snapshot.data() } as Subproject);
			} else {
				setSubproject(null);
			}
			setIsLoading(false);
		});

		return unsubscribe;
	}, [projectId, subprojectId]);

	return { subproject, isLoading };
}

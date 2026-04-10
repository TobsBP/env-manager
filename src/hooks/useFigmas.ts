'use client';

import { collection, onSnapshot, query } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firestore';
import {
	createSubFigmaAction,
	deleteSubFigmaAction,
	updateSubFigmaAction,
} from '@/lib/projects/figma-actions';
import type { AuthResult } from '@/types/auth';
import type { SubFigma } from '@/types/project';

export function useFigmas(projectId: string) {
	const [figmas, setFigmas] = useState<SubFigma[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const q = query(collection(db, 'projects', projectId, 'figmas'));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as SubFigma[];
				docs.sort((a, b) => {
					const ta =
						(a.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ??
						0;
					const tb =
						(b.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ??
						0;
					return ta - tb;
				});
				setFigmas(docs);
				setIsLoading(false);
			},
			() => setIsLoading(false),
		);

		return unsubscribe;
	}, [projectId]);

	const createFigma = useCallback(
		async (name: string, url: string): Promise<AuthResult> => {
			const tempId = `temp-${Date.now()}`;
			const temp: SubFigma = { id: tempId, name, url, createdAt: null };
			setFigmas((prev) => [...prev, temp]);

			const result = await createSubFigmaAction(projectId, { name, url });
			if (!result.success) {
				setFigmas((prev) => prev.filter((f) => f.id !== tempId));
			}
			return result;
		},
		[projectId],
	);

	const updateFigma = useCallback(
		async (figmaId: string, name: string, url: string): Promise<AuthResult> => {
			setFigmas((prev) =>
				prev.map((f) => (f.id === figmaId ? { ...f, name, url } : f)),
			);
			return updateSubFigmaAction(projectId, figmaId, { name, url });
		},
		[projectId],
	);

	const deleteFigma = useCallback(
		async (figmaId: string): Promise<AuthResult> => {
			setFigmas((prev) => prev.filter((f) => f.id !== figmaId));
			return deleteSubFigmaAction(projectId, figmaId);
		},
		[projectId],
	);

	return { figmas, isLoading, createFigma, updateFigma, deleteFigma };
}

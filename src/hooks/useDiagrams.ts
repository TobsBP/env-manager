'use client';

import { collection, onSnapshot, query } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import {
	createDiagramAction,
	deleteDiagramAction,
	updateDiagramAction,
} from '@/lib/diagrams/actions';
import { db } from '@/lib/firebase/firestore';
import type { AuthResult } from '@/types/auth';
import type { Diagram } from '@/types/diagram';

export function useDiagrams(projectId: string) {
	const [diagrams, setDiagrams] = useState<Diagram[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const q = query(collection(db, 'projects', projectId, 'diagrams'));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as Diagram[];
				docs.sort((a, b) => {
					const ta =
						(a.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ??
						0;
					const tb =
						(b.createdAt as { toMillis?: () => number } | null)?.toMillis?.() ??
						0;
					return ta - tb;
				});
				setDiagrams(docs);
				setIsLoading(false);
			},
			(err) => {
				setError(err.message);
				setIsLoading(false);
			},
		);

		return unsubscribe;
	}, [projectId]);

	const createDiagram = useCallback(
		async (name: string, code: string): Promise<AuthResult> => {
			const result = await createDiagramAction(projectId, { name, code });
			if (!result.success) setError(result.error);
			return result;
		},
		[projectId],
	);

	const updateDiagram = useCallback(
		async (
			diagramId: string,
			name: string,
			code: string,
		): Promise<AuthResult> => {
			setDiagrams((prev) =>
				prev.map((d) => (d.id === diagramId ? { ...d, name, code } : d)),
			);
			const result = await updateDiagramAction(projectId, diagramId, {
				name,
				code,
			});
			if (!result.success) setError(result.error);
			return result;
		},
		[projectId],
	);

	const deleteDiagram = useCallback(
		async (diagramId: string): Promise<AuthResult> => {
			setDiagrams((prev) => prev.filter((d) => d.id !== diagramId));
			const result = await deleteDiagramAction(projectId, diagramId);
			if (!result.success) setError(result.error);
			return result;
		},
		[projectId],
	);

	return {
		diagrams,
		isLoading,
		error,
		createDiagram,
		updateDiagram,
		deleteDiagram,
	};
}

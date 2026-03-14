'use client';

import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import {
	createConnectionAction,
	deleteConnectionAction,
} from '@/lib/connections/actions';
import { db } from '@/lib/firebase/firestore';
import type { AuthResult } from '@/types/auth';
import type { Connection, CreateConnectionInput } from '@/types/connection';

export function useConnections() {
	const { user } = useUser();
	const [connections, setConnections] = useState<Connection[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) {
			setConnections([]);
			setIsLoading(false);
			return;
		}

		const q = query(
			collection(db, 'connections'),
			where('userId', '==', user.uid),
		);

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const docs = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as Connection[];
				setConnections(docs);
				setIsLoading(false);
			},
			(err) => {
				setError(err.message);
				setIsLoading(false);
			},
		);

		return unsubscribe;
	}, [user]);

	const createConnection = useCallback(
		async (input: CreateConnectionInput): Promise<AuthResult> => {
			const result = await createConnectionAction(input);
			if (!result.success) {
				setError(result.error);
			}
			return result;
		},
		[],
	);

	const deleteConnection = useCallback(
		async (connectionId: string): Promise<AuthResult> => {
			setConnections((prev) => prev.filter((c) => c.id !== connectionId));
			const result = await deleteConnectionAction(connectionId);
			if (!result.success) {
				setError(result.error);
			}
			return result;
		},
		[],
	);

	return { connections, isLoading, error, createConnection, deleteConnection };
}

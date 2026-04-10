'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase/client';
import type { SessionUser } from '@/types/auth';
import type { AuthProviderProps } from '@/types/interfaces/auth';
import { AuthContext } from '@/utils/consts/auth';

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
	const [user, setUser] = useState<SessionUser | null>(initialUser);
	const [isLoading, setIsLoading] = useState(!initialUser);
	const { signOut } = useAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			if (firebaseUser) {
				setUser({
					uid: firebaseUser.uid,
					email: firebaseUser.email,
					displayName: firebaseUser.displayName,
				});
			} else {
				setUser(null);
			}
			setIsLoading(false);
		});

		return unsubscribe;
	}, []);

	return (
		<AuthContext.Provider value={{ user, isLoading, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

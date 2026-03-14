'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase/client';
import type { AuthContextValue, SessionUser } from '@/types/auth';

export const AuthContext = createContext<AuthContextValue>({
	user: null,
	isLoading: true,
	signOut: async () => {},
});

interface AuthProviderProps {
	children: React.ReactNode;
	initialUser: SessionUser | null;
}

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

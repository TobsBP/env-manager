import { createContext } from 'react';
import type { AuthContextValue } from '@/types/auth';

export const AuthContext = createContext<AuthContextValue>({
	user: null,
	isLoading: true,
	signOut: async () => {},
});

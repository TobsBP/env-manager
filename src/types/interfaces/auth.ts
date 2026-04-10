export interface SessionUser {
	uid: string;
	email: string | null;
	displayName: string | null;
}

export interface AuthContextValue {
	user: SessionUser | null;
	isLoading: boolean;
	signOut: () => Promise<void>;
}

export interface AuthProviderProps {
	children: React.ReactNode;
	initialUser: SessionUser | null;
}

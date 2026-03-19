import { z } from 'zod';

// --- Schemas ---

export const loginSchema = z.object({
	email: z.email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
	fullName: z.string().min(1, 'Name is required').optional(),
	email: z.email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const forgotPasswordSchema = z.object({
	email: z.email('Invalid email address'),
});

// --- Inferred types ---

export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// --- App types ---

export type AuthResult =
	| { success: true; message?: string }
	| { success: false; error: string };

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

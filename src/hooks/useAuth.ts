'use client';

import {
	createUserWithEmailAndPassword,
	signOut as firebaseSignOut,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth';
import { useState } from 'react';
import { createSessionAction, signOutAction } from '@/lib/auth/actions';
import { auth } from '@/lib/firebase/client';
import { getFirebaseAuthErrorMessage } from '@/lib/firebase/errors';
import {
	type AuthResult,
	type ForgotPasswordInput,
	forgotPasswordSchema,
	type LoginCredentials,
	loginSchema,
	type RegisterCredentials,
	registerSchema,
} from '@/types/auth';

export function useAuth() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const signIn = async (credentials: LoginCredentials): Promise<AuthResult> => {
		setIsLoading(true);
		setError(null);

		const parsed = loginSchema.safeParse(credentials);
		if (!parsed.success) {
			const msg = parsed.error.issues[0].message;
			setError(msg);
			setIsLoading(false);
			return { success: false, error: msg };
		}

		try {
			const { user } = await signInWithEmailAndPassword(
				auth,
				parsed.data.email,
				parsed.data.password,
			);
			const idToken = await user.getIdToken();
			await createSessionAction(idToken);
			// createSessionAction redirects — code below won't run on success
			return { success: true };
		} catch (err) {
			const msg = getFirebaseAuthErrorMessage(err);
			setError(msg);
			setIsLoading(false);
			return { success: false, error: msg };
		}
	};

	const signUp = async (
		credentials: RegisterCredentials,
	): Promise<AuthResult> => {
		setIsLoading(true);
		setError(null);

		const parsed = registerSchema.safeParse(credentials);
		if (!parsed.success) {
			const msg = parsed.error.issues[0].message;
			setError(msg);
			setIsLoading(false);
			return { success: false, error: msg };
		}

		try {
			const { user } = await createUserWithEmailAndPassword(
				auth,
				parsed.data.email,
				parsed.data.password,
			);
			if (parsed.data.fullName) {
				await updateProfile(user, { displayName: parsed.data.fullName });
			}
			const idToken = await user.getIdToken();
			await createSessionAction(idToken);
			return { success: true };
		} catch (err) {
			const msg = getFirebaseAuthErrorMessage(err);
			setError(msg);
			setIsLoading(false);
			return { success: false, error: msg };
		}
	};

	const forgotPassword = async (
		email: ForgotPasswordInput['email'],
	): Promise<AuthResult> => {
		setIsLoading(true);
		setError(null);

		const parsed = forgotPasswordSchema.safeParse({ email });
		if (!parsed.success) {
			const msg = parsed.error.issues[0].message;
			setError(msg);
			setIsLoading(false);
			return { success: false, error: msg };
		}

		try {
			await sendPasswordResetEmail(auth, parsed.data.email);
			setIsLoading(false);
			return {
				success: true,
				message: 'Password reset email sent. Check your inbox.',
			};
		} catch (err) {
			const msg = getFirebaseAuthErrorMessage(err);
			setError(msg);
			setIsLoading(false);
			return { success: false, error: msg };
		}
	};

	const signOut = async (): Promise<void> => {
		setIsLoading(true);
		await firebaseSignOut(auth);
		await signOutAction();
	};

	const clearError = () => setError(null);

	return {
		signIn,
		signUp,
		forgotPassword,
		signOut,
		isLoading,
		error,
		clearError,
	};
}

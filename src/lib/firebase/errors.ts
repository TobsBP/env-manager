import { FirebaseError } from 'firebase/app';

export function getFirebaseAuthErrorMessage(error: unknown): string {
	if (error instanceof FirebaseError) {
		switch (error.code) {
			case 'auth/user-not-found':
			case 'auth/wrong-password':
			case 'auth/invalid-credential':
				return 'Invalid email or password.';
			case 'auth/email-already-in-use':
				return 'An account with this email already exists.';
			case 'auth/weak-password':
				return 'Password must be at least 6 characters.';
			case 'auth/invalid-email':
				return 'Invalid email address.';
			case 'auth/too-many-requests':
				return 'Too many failed attempts. Please try again later.';
			case 'auth/user-disabled':
				return 'This account has been disabled.';
			default:
				return error.message;
		}
	}
	return 'An unexpected error occurred.';
}

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminAuth, SESSION_COOKIE } from '@/lib/firebase/admin';

const SESSION_DURATION_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function createSessionAction(idToken: string): Promise<void> {
	const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
		expiresIn: SESSION_DURATION_MS,
	});

	const cookieStore = await cookies();
	cookieStore.set(SESSION_COOKIE, sessionCookie, {
		maxAge: SESSION_DURATION_MS / 1000,
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
	});

	redirect('/dashboard');
}

export async function signOutAction(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_COOKIE);
	redirect('/login');
}

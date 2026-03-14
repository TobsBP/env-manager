import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import type { SessionUser } from '@/types/auth';

const SESSION_COOKIE = 'session';

function getAdminApp() {
	if (getApps().length) return getApp();

	return initializeApp({
		credential: cert({
			projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
			clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
		}),
	});
}

export function getAdminAuth() {
	return getAuth(getAdminApp());
}

export async function getSessionUser(): Promise<SessionUser | null> {
	const cookieStore = await cookies();
	const session = cookieStore.get(SESSION_COOKIE)?.value;

	if (!session) return null;

	try {
		const decoded = await getAdminAuth().verifySessionCookie(session, true);
		return {
			uid: decoded.uid,
			email: decoded.email ?? null,
			displayName: (decoded.name as string | undefined) ?? null,
		};
	} catch {
		return null;
	}
}

export { SESSION_COOKIE };

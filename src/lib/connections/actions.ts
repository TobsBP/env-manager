'use server';

import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getAdminAuth, getSessionUser } from '@/lib/firebase/admin';
import type { AuthResult } from '@/types/auth';
import { createConnectionSchema } from '@/types/connection';

function getAdminDb() {
	getAdminAuth();
	return getFirestore();
}

export async function createConnectionAction(
	input: unknown,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const result = createConnectionSchema.safeParse(input);
	if (!result.success)
		return { success: false, error: result.error.issues[0].message };

	const db = getAdminDb();
	await db.collection('connections').add({
		userId: user.uid,
		fromProjectId: result.data.fromProjectId,
		fromEnvId: result.data.fromEnvId,
		toProjectId: result.data.toProjectId,
		toEnvId: result.data.toEnvId,
		createdAt: FieldValue.serverTimestamp(),
	});

	return { success: true };
}

export async function deleteConnectionAction(
	connectionId: string,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const db = getAdminDb();
	const ref = db.collection('connections').doc(connectionId);
	const doc = await ref.get();

	if (!doc.exists) return { success: false, error: 'Connection not found' };
	if (doc.data()?.userId !== user.uid)
		return { success: false, error: 'Unauthorized' };

	await ref.delete();

	return { success: true };
}

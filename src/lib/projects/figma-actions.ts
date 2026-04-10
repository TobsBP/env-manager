'use server';

import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getAdminAuth, getSessionUser } from '@/lib/firebase/admin';
import { getProjectAccess } from '@/lib/projects/access';
import type { AuthResult } from '@/types/auth';
import { createSubFigmaSchema, updateSubFigmaSchema } from '@/types/project';

function getAdminDb() {
	getAdminAuth();
	return getFirestore();
}

export async function createSubFigmaAction(
	projectId: string,
	input: unknown,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const result = createSubFigmaSchema.safeParse(input);
	if (!result.success)
		return { success: false, error: result.error.issues[0].message };

	const db = getAdminDb();
	const { project, role } = await getProjectAccess(db, projectId, user.uid);
	if (!project) return { success: false, error: 'Project not found' };
	if (!role || role === 'viewer')
		return { success: false, error: 'Unauthorized' };

	await db.collection('projects').doc(projectId).collection('figmas').add({
		name: result.data.name,
		url: result.data.url,
		createdAt: FieldValue.serverTimestamp(),
	});

	return { success: true };
}

export async function updateSubFigmaAction(
	projectId: string,
	figmaId: string,
	input: unknown,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const result = updateSubFigmaSchema.safeParse(input);
	if (!result.success)
		return { success: false, error: result.error.issues[0].message };

	const db = getAdminDb();
	const { project, role } = await getProjectAccess(db, projectId, user.uid);
	if (!project) return { success: false, error: 'Project not found' };
	if (!role || role === 'viewer')
		return { success: false, error: 'Unauthorized' };

	await db
		.collection('projects')
		.doc(projectId)
		.collection('figmas')
		.doc(figmaId)
		.update({ name: result.data.name, url: result.data.url });

	return { success: true };
}

export async function deleteSubFigmaAction(
	projectId: string,
	figmaId: string,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const db = getAdminDb();
	const { project, role } = await getProjectAccess(db, projectId, user.uid);
	if (!project) return { success: false, error: 'Project not found' };
	if (!role || role === 'viewer')
		return { success: false, error: 'Unauthorized' };

	await db
		.collection('projects')
		.doc(projectId)
		.collection('figmas')
		.doc(figmaId)
		.delete();

	return { success: true };
}

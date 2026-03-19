'use server';

import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getAdminAuth, getSessionUser } from '@/lib/firebase/admin';
import type { AuthResult } from '@/types/auth';
import { createDiagramSchema, updateDiagramSchema } from '@/types/diagram';

function getAdminDb() {
	getAdminAuth();
	return getFirestore();
}

async function getAuthorizedProject(projectId: string) {
	const user = await getSessionUser();
	if (!user)
		return { user: null, projectRef: null, error: 'Not authenticated' };

	const db = getAdminDb();
	const projectRef = db.collection('projects').doc(projectId);
	const project = await projectRef.get();

	if (!project.exists)
		return { user: null, projectRef: null, error: 'Project not found' };
	if (project.data()?.userId !== user.uid)
		return { user: null, projectRef: null, error: 'Unauthorized' };

	return { user, projectRef, error: null };
}

export async function createDiagramAction(
	projectId: string,
	input: unknown,
): Promise<AuthResult> {
	const { projectRef, error } = await getAuthorizedProject(projectId);
	if (error || !projectRef)
		return { success: false, error: error ?? 'Unknown error' };

	const result = createDiagramSchema.safeParse(input);
	if (!result.success)
		return { success: false, error: result.error.issues[0].message };

	await projectRef.collection('diagrams').add({
		name: result.data.name,
		code: result.data.code,
		createdAt: FieldValue.serverTimestamp(),
		updatedAt: FieldValue.serverTimestamp(),
	});

	return { success: true };
}

export async function updateDiagramAction(
	projectId: string,
	diagramId: string,
	input: unknown,
): Promise<AuthResult> {
	const { projectRef, error } = await getAuthorizedProject(projectId);
	if (error || !projectRef)
		return { success: false, error: error ?? 'Unknown error' };

	const result = updateDiagramSchema.safeParse(input);
	if (!result.success)
		return { success: false, error: result.error.issues[0].message };

	await projectRef.collection('diagrams').doc(diagramId).update({
		name: result.data.name,
		code: result.data.code,
		updatedAt: FieldValue.serverTimestamp(),
	});

	return { success: true };
}

export async function deleteDiagramAction(
	projectId: string,
	diagramId: string,
): Promise<AuthResult> {
	const { projectRef, error } = await getAuthorizedProject(projectId);
	if (error || !projectRef)
		return { success: false, error: error ?? 'Unknown error' };

	await projectRef.collection('diagrams').doc(diagramId).delete();

	return { success: true };
}

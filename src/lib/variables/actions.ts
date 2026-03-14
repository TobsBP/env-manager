'use server';

import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getAdminAuth, getSessionUser } from '@/lib/firebase/admin';
import type { AuthResult } from '@/types/auth';
import { createVariableSchema, updateVariableSchema } from '@/types/variable';

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

export async function createVariableAction(
	projectId: string,
	envId: string,
	input: unknown,
): Promise<AuthResult> {
	const { projectRef, error } = await getAuthorizedProject(projectId);
	if (error || !projectRef)
		return { success: false, error: error ?? 'Unknown error' };

	const result = createVariableSchema.safeParse(input);
	if (!result.success)
		return { success: false, error: result.error.issues[0].message };

	await projectRef
		.collection('environments')
		.doc(envId)
		.collection('variables')
		.add({
			key: result.data.key,
			value: result.data.value,
			createdAt: FieldValue.serverTimestamp(),
		});

	return { success: true };
}

export async function updateVariableAction(
	projectId: string,
	envId: string,
	varId: string,
	input: unknown,
): Promise<AuthResult> {
	const { projectRef, error } = await getAuthorizedProject(projectId);
	if (error || !projectRef)
		return { success: false, error: error ?? 'Unknown error' };

	const result = updateVariableSchema.safeParse(input);
	if (!result.success)
		return { success: false, error: result.error.issues[0].message };

	await projectRef
		.collection('environments')
		.doc(envId)
		.collection('variables')
		.doc(varId)
		.update({
			key: result.data.key,
			value: result.data.value,
		});

	return { success: true };
}

export async function deleteVariableAction(
	projectId: string,
	envId: string,
	varId: string,
): Promise<AuthResult> {
	const { projectRef, error } = await getAuthorizedProject(projectId);
	if (error || !projectRef)
		return { success: false, error: error ?? 'Unknown error' };

	await projectRef
		.collection('environments')
		.doc(envId)
		.collection('variables')
		.doc(varId)
		.delete();

	return { success: true };
}

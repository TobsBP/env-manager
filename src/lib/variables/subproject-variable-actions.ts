'use server';

import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getAdminAuth, getSessionUser } from '@/lib/firebase/admin';
import type { AuthResult } from '@/types/auth';
import { createVariableSchema, updateVariableSchema } from '@/types/variable';

function getAdminDb() {
	getAdminAuth();
	return getFirestore();
}

async function getAuthorizedSubproject(
	projectId: string,
	subprojectId: string,
) {
	const user = await getSessionUser();
	if (!user) return { subprojectRef: null, error: 'Not authenticated' };

	const db = getAdminDb();
	const projectRef = db.collection('projects').doc(projectId);
	const project = await projectRef.get();

	if (!project.exists)
		return { subprojectRef: null, error: 'Project not found' };
	if (project.data()?.userId !== user.uid)
		return { subprojectRef: null, error: 'Unauthorized' };

	const subprojectRef = projectRef.collection('subprojects').doc(subprojectId);
	return { subprojectRef, error: null };
}

export async function createSubprojectVariableAction(
	projectId: string,
	subprojectId: string,
	envId: string,
	input: unknown,
): Promise<AuthResult> {
	const { subprojectRef, error } = await getAuthorizedSubproject(
		projectId,
		subprojectId,
	);
	if (error || !subprojectRef)
		return { success: false, error: error ?? 'Unknown error' };

	const result = createVariableSchema.safeParse(input);
	if (!result.success)
		return { success: false, error: result.error.issues[0].message };

	await subprojectRef
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

export async function updateSubprojectVariableAction(
	projectId: string,
	subprojectId: string,
	envId: string,
	varId: string,
	input: unknown,
): Promise<AuthResult> {
	const { subprojectRef, error } = await getAuthorizedSubproject(
		projectId,
		subprojectId,
	);
	if (error || !subprojectRef)
		return { success: false, error: error ?? 'Unknown error' };

	const result = updateVariableSchema.safeParse(input);
	if (!result.success)
		return { success: false, error: result.error.issues[0].message };

	await subprojectRef
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

export async function deleteSubprojectVariableAction(
	projectId: string,
	subprojectId: string,
	envId: string,
	varId: string,
): Promise<AuthResult> {
	const { subprojectRef, error } = await getAuthorizedSubproject(
		projectId,
		subprojectId,
	);
	if (error || !subprojectRef)
		return { success: false, error: error ?? 'Unknown error' };

	await subprojectRef
		.collection('environments')
		.doc(envId)
		.collection('variables')
		.doc(varId)
		.delete();

	return { success: true };
}

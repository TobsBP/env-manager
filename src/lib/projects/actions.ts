'use server';

import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getAdminAuth, getSessionUser } from '@/lib/firebase/admin';
import type { AuthResult } from '@/types/auth';
import {
	createEnvironmentSchema,
	createProjectSchema,
	updateProjectSchema,
} from '@/types/project';

function getAdminDb() {
	// Ensure admin app is initialized via getAdminAuth, then get Firestore
	getAdminAuth();
	return getFirestore();
}

export async function createProjectAction(input: unknown): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const result = createProjectSchema.safeParse(input);
	if (!result.success)
		return { success: false, error: result.error.issues[0].message };

	const db = getAdminDb();
	await db.collection('projects').add({
		name: result.data.name,
		emoji: result.data.emoji,
		userId: user.uid,
		createdAt: FieldValue.serverTimestamp(),
	});

	return { success: true };
}

export async function updateProjectAction(
	projectId: string,
	input: unknown,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const result = updateProjectSchema.safeParse(input);
	if (!result.success)
		return { success: false, error: result.error.issues[0].message };

	const db = getAdminDb();
	const projectRef = db.collection('projects').doc(projectId);
	const project = await projectRef.get();

	if (!project.exists) return { success: false, error: 'Project not found' };
	if (project.data()?.userId !== user.uid)
		return { success: false, error: 'Unauthorized' };

	await projectRef.update({ name: result.data.name });

	return { success: true };
}

export async function deleteProjectAction(
	projectId: string,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const db = getAdminDb();
	const projectRef = db.collection('projects').doc(projectId);
	const project = await projectRef.get();

	if (!project.exists) return { success: false, error: 'Project not found' };
	if (project.data()?.userId !== user.uid)
		return { success: false, error: 'Unauthorized' };

	// Delete all sub-collections would need recursive delete; for now delete the doc
	await projectRef.delete();

	return { success: true };
}

export async function createEnvironmentAction(
	projectId: string,
	input: unknown,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const result = createEnvironmentSchema.safeParse(input);
	if (!result.success)
		return { success: false, error: result.error.issues[0].message };

	const db = getAdminDb();
	const projectRef = db.collection('projects').doc(projectId);
	const project = await projectRef.get();

	if (!project.exists) return { success: false, error: 'Project not found' };
	if (project.data()?.userId !== user.uid)
		return { success: false, error: 'Unauthorized' };

	await projectRef.collection('environments').add({
		name: result.data.name,
		createdAt: FieldValue.serverTimestamp(),
	});

	return { success: true };
}

export async function deleteEnvironmentAction(
	projectId: string,
	envId: string,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const db = getAdminDb();
	const projectRef = db.collection('projects').doc(projectId);
	const project = await projectRef.get();

	if (!project.exists) return { success: false, error: 'Project not found' };
	if (project.data()?.userId !== user.uid)
		return { success: false, error: 'Unauthorized' };

	await projectRef.collection('environments').doc(envId).delete();

	return { success: true };
}

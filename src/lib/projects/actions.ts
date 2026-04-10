'use server';

import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';
import { getAdminAuth, getSessionUser } from '@/lib/firebase/admin';
import { getProjectAccess } from '@/lib/projects/access';
import type { AuthResult } from '@/types/auth';
import {
	createEnvironmentSchema,
	createProjectSchema,
	projectTypeSchema,
	updateProjectSchema,
} from '@/types/project';

const easypanelConfigSchema = z.object({
	easypanelUrl: z.url('Invalid URL').optional().or(z.literal('')),
	easypanelToken: z.string().optional(),
	easypanelServiceName: z.string().optional(),
});

function getAdminDb() {
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
		projectType: result.data.projectType,
		userId: user.uid,
		memberUids: [],
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
	const { project, role } = await getProjectAccess(db, projectId, user.uid);
	if (!project) return { success: false, error: 'Project not found' };
	if (role !== 'owner') return { success: false, error: 'Unauthorized' };

	await db
		.collection('projects')
		.doc(projectId)
		.update({
			name: result.data.name,
			emoji: result.data.emoji,
			figmaUrl: result.data.figmaUrl ?? '',
		});

	return { success: true };
}

export async function deleteProjectAction(
	projectId: string,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const db = getAdminDb();
	const { project, role } = await getProjectAccess(db, projectId, user.uid);
	if (!project) return { success: false, error: 'Project not found' };
	if (role !== 'owner') return { success: false, error: 'Unauthorized' };

	await db.collection('projects').doc(projectId).delete();

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
	const { project, role } = await getProjectAccess(db, projectId, user.uid);
	if (!project) return { success: false, error: 'Project not found' };
	if (!role || role === 'viewer')
		return { success: false, error: 'Unauthorized' };

	await db
		.collection('projects')
		.doc(projectId)
		.collection('environments')
		.add({
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
	const { project, role } = await getProjectAccess(db, projectId, user.uid);
	if (!project) return { success: false, error: 'Project not found' };
	if (!role || role === 'viewer')
		return { success: false, error: 'Unauthorized' };

	await db
		.collection('projects')
		.doc(projectId)
		.collection('environments')
		.doc(envId)
		.delete();

	return { success: true };
}

export async function cloneEnvironmentAction(
	projectId: string,
	sourceEnvId: string,
	newName: string,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const db = getAdminDb();
	const { project, role } = await getProjectAccess(db, projectId, user.uid);
	if (!project) return { success: false, error: 'Project not found' };
	if (!role || role === 'viewer')
		return { success: false, error: 'Unauthorized' };

	const trimmed = newName.trim();
	if (!trimmed) return { success: false, error: 'Name is required' };

	const projectRef = db.collection('projects').doc(projectId);
	const newEnvRef = await projectRef.collection('environments').add({
		name: trimmed,
		createdAt: FieldValue.serverTimestamp(),
	});

	const variablesSnap = await projectRef
		.collection('environments')
		.doc(sourceEnvId)
		.collection('variables')
		.get();

	if (!variablesSnap.empty) {
		const batch = db.batch();
		for (const doc of variablesSnap.docs) {
			const varRef = newEnvRef.collection('variables').doc();
			batch.set(varRef, {
				key: doc.data().key,
				value: doc.data().value,
				createdAt: FieldValue.serverTimestamp(),
			});
		}
		await batch.commit();
	}

	return { success: true };
}

export async function updateEnvironmentEasypanelAction(
	projectId: string,
	envId: string,
	config: unknown,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const result = easypanelConfigSchema.safeParse(config);
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
		.collection('environments')
		.doc(envId)
		.update({
			easypanelUrl: result.data.easypanelUrl ?? '',
			easypanelToken: result.data.easypanelToken ?? '',
			easypanelServiceName: result.data.easypanelServiceName ?? '',
		});

	return { success: true };
}

export async function deployToEasypanelAction(
	projectId: string,
	envId: string,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const db = getAdminDb();
	const { project, role } = await getProjectAccess(db, projectId, user.uid);
	if (!project) return { success: false, error: 'Project not found' };
	if (!role || role === 'viewer')
		return { success: false, error: 'Unauthorized' };

	const envRef = db
		.collection('projects')
		.doc(projectId)
		.collection('environments')
		.doc(envId);
	const env = await envRef.get();
	if (!env.exists) return { success: false, error: 'Environment not found' };

	const envData = env.data();
	const { easypanelUrl, easypanelToken, easypanelServiceName } = envData ?? {};

	if (!easypanelUrl || !easypanelToken || !easypanelServiceName)
		return { success: false, error: 'EasyPanel config incomplete' };

	const variablesSnap = await envRef.collection('variables').get();
	const content = variablesSnap.docs
		.map((doc) => {
			const d = doc.data();
			return `${d.key}=${d.value}`;
		})
		.join('\n');

	const headers = {
		Authorization: `Bearer ${easypanelToken}`,
		'Content-Type': 'application/json',
	};

	const setEnvRes = await fetch(
		`${easypanelUrl}/api/trpc/services.setEnvContent`,
		{
			method: 'POST',
			headers,
			body: JSON.stringify({
				json: {
					projectName: easypanelServiceName,
					serviceName: easypanelServiceName,
					content,
				},
			}),
		},
	);

	if (!setEnvRes.ok) {
		const text = await setEnvRes.text();
		return { success: false, error: `Failed to set env vars: ${text}` };
	}

	const deployRes = await fetch(`${easypanelUrl}/api/trpc/services.deploy`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			json: {
				projectName: easypanelServiceName,
				serviceName: easypanelServiceName,
			},
		}),
	});

	if (!deployRes.ok) {
		const text = await deployRes.text();
		return { success: false, error: `Failed to deploy: ${text}` };
	}

	return { success: true };
}

export async function updateProjectTypeAction(
	projectId: string,
	projectType: unknown,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const result = projectTypeSchema.safeParse(projectType);
	if (!result.success) return { success: false, error: 'Invalid project type' };

	const db = getAdminDb();
	const { project, role } = await getProjectAccess(db, projectId, user.uid);
	if (!project) return { success: false, error: 'Project not found' };
	if (role !== 'owner') return { success: false, error: 'Unauthorized' };

	await db
		.collection('projects')
		.doc(projectId)
		.update({ projectType: result.data });

	return { success: true };
}

'use server';

import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getAdminAuth, getSessionUser } from '@/lib/firebase/admin';
import { getProjectAccess } from '@/lib/projects/access';
import type { AuthResult } from '@/types/auth';
import type { ProjectMember } from '@/types/interfaces/project';

function getAdminDb() {
	getAdminAuth();
	return getFirestore();
}

export async function addProjectMember(
	projectId: string,
	email: string,
	role: 'viewer' | 'editor',
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const db = getAdminDb();
	const { role: callerRole } = await getProjectAccess(db, projectId, user.uid);
	if (callerRole !== 'owner') return { success: false, error: 'Unauthorized' };

	let targetUser: { uid: string; email?: string };
	try {
		targetUser = await getAdminAuth().getUserByEmail(email);
	} catch {
		return { success: false, error: 'No account found with that email' };
	}

	if (targetUser.uid === user.uid) {
		return { success: false, error: 'Cannot share with yourself' };
	}

	const memberRef = db
		.collection('projects')
		.doc(projectId)
		.collection('members')
		.doc(targetUser.uid);

	const existing = await memberRef.get();
	if (existing.exists) {
		return { success: false, error: 'User already has access to this project' };
	}

	const batch = db.batch();
	batch.set(memberRef, {
		uid: targetUser.uid,
		email: targetUser.email ?? email,
		role,
		addedAt: FieldValue.serverTimestamp(),
	});
	batch.update(db.collection('projects').doc(projectId), {
		memberUids: FieldValue.arrayUnion(targetUser.uid),
	});
	await batch.commit();

	return { success: true };
}

export async function removeProjectMember(
	projectId: string,
	targetUid: string,
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const db = getAdminDb();
	const { role } = await getProjectAccess(db, projectId, user.uid);
	if (role !== 'owner') return { success: false, error: 'Unauthorized' };

	const batch = db.batch();
	batch.delete(
		db
			.collection('projects')
			.doc(projectId)
			.collection('members')
			.doc(targetUid),
	);
	batch.update(db.collection('projects').doc(projectId), {
		memberUids: FieldValue.arrayRemove(targetUid),
	});
	await batch.commit();

	return { success: true };
}

export async function updateProjectMemberRole(
	projectId: string,
	targetUid: string,
	newRole: 'viewer' | 'editor',
): Promise<AuthResult> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const db = getAdminDb();
	const { role } = await getProjectAccess(db, projectId, user.uid);
	if (role !== 'owner') return { success: false, error: 'Unauthorized' };

	await db
		.collection('projects')
		.doc(projectId)
		.collection('members')
		.doc(targetUid)
		.update({ role: newRole });

	return { success: true };
}

export async function getProjectMembers(
	projectId: string,
): Promise<
	| { success: true; members: ProjectMember[] }
	| { success: false; error: string }
> {
	const user = await getSessionUser();
	if (!user) return { success: false, error: 'Not authenticated' };

	const db = getAdminDb();
	const { role } = await getProjectAccess(db, projectId, user.uid);
	if (!role) return { success: false, error: 'Unauthorized' };

	const snap = await db
		.collection('projects')
		.doc(projectId)
		.collection('members')
		.get();

	const members = snap.docs.map((doc) => {
		const data = doc.data();
		return {
			uid: data.uid,
			email: data.email,
			role: data.role,
			addedAt: data.addedAt?.toMillis?.() ?? null,
		} as ProjectMember;
	});
	return { success: true, members };
}

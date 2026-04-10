import type { Firestore } from 'firebase-admin/firestore';
import type { ProjectRole } from '@/types/interfaces/project';

export async function getProjectAccess(
	db: Firestore,
	projectId: string,
	userId: string,
): Promise<
	| { project: FirebaseFirestore.DocumentSnapshot; role: ProjectRole }
	| { project: null; role: null }
> {
	const projectRef = db.collection('projects').doc(projectId);
	const project = await projectRef.get();

	if (!project.exists) return { project: null, role: null };

	if (project.data()?.userId === userId) {
		return { project, role: 'owner' };
	}

	const memberDoc = await projectRef.collection('members').doc(userId).get();
	if (memberDoc.exists) {
		return { project, role: memberDoc.data()?.role as 'editor' | 'viewer' };
	}

	return { project: null, role: null };
}

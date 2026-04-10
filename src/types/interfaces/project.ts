import type { ProjectType } from '@/types/project';

export type ProjectRole = 'owner' | 'editor' | 'viewer';

export interface Project {
	id: string;
	name: string;
	emoji: string;
	userId: string;
	createdAt: unknown;
	projectType?: ProjectType;
	memberUids?: string[];
	figmaUrl?: string;
}

export interface ProjectMember {
	uid: string;
	email: string;
	role: 'viewer' | 'editor';
	addedAt: number | null;
}

export interface Subproject {
	id: string;
	name: string;
	emoji: string;
	createdAt: unknown;
}

export interface Environment {
	id: string;
	name: string;
	createdAt: unknown;
	easypanelUrl?: string;
	easypanelToken?: string;
	easypanelServiceName?: string;
}

export interface SubFigma {
	id: string;
	name: string;
	url: string;
	createdAt: unknown;
}

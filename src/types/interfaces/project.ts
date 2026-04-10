import type { ProjectType } from '@/types/project';

export interface Project {
	id: string;
	name: string;
	emoji: string;
	userId: string;
	createdAt: unknown;
	projectType?: ProjectType;
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

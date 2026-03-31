import { z } from 'zod';

export const createProjectSchema = z.object({
	name: z
		.string()
		.min(1, 'Project name is required')
		.max(50, 'Project name too long'),
	emoji: z.string().default('📁'),
});

export const updateProjectSchema = z.object({
	name: z
		.string()
		.min(1, 'Project name is required')
		.max(50, 'Project name too long'),
	emoji: z.string().default('📁'),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const createEnvironmentSchema = z.object({
	name: z
		.string()
		.min(1, 'Environment name is required')
		.max(30, 'Environment name too long'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type CreateEnvironmentInput = z.infer<typeof createEnvironmentSchema>;

export interface Project {
	id: string;
	name: string;
	emoji: string;
	userId: string;
	createdAt: unknown;
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

export const createSubprojectSchema = z.object({
	name: z
		.string()
		.min(1, 'Subproject name is required')
		.max(50, 'Subproject name too long'),
	emoji: z.string().default('📦'),
});

export const updateSubprojectSchema = z.object({
	name: z
		.string()
		.min(1, 'Subproject name is required')
		.max(50, 'Subproject name too long'),
	emoji: z.string().default('📦'),
});

export type CreateSubprojectInput = z.infer<typeof createSubprojectSchema>;
export type UpdateSubprojectInput = z.infer<typeof updateSubprojectSchema>;

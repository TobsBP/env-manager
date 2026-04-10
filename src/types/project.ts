import { z } from 'zod';

export const projectTypeSchema = z.enum(['single', 'subprojects', 'both']);
export type ProjectType = z.infer<typeof projectTypeSchema>;

export const createProjectSchema = z.object({
	name: z
		.string()
		.min(1, 'Project name is required')
		.max(50, 'Project name too long'),
	emoji: z.string().default('📁'),
	projectType: projectTypeSchema.default('single'),
});

export const updateProjectSchema = z.object({
	name: z
		.string()
		.min(1, 'Project name is required')
		.max(50, 'Project name too long'),
	emoji: z.string().default('📁'),
	figmaUrl: z.url('URL inválida').optional().or(z.literal('')),
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

export type {
	Environment,
	Project,
	SubFigma,
	Subproject,
} from '@/types/interfaces/project';

export const createSubFigmaSchema = z.object({
	name: z.string().min(1, 'Name is required').max(60, 'Name too long'),
	url: z.url('URL inválida'),
});

export const updateSubFigmaSchema = z.object({
	name: z.string().min(1, 'Name is required').max(60, 'Name too long'),
	url: z.url('URL inválida'),
});

export type CreateSubFigmaInput = z.infer<typeof createSubFigmaSchema>;
export type UpdateSubFigmaInput = z.infer<typeof updateSubFigmaSchema>;

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

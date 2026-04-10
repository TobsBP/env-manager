import { z } from 'zod';

export const createVariableSchema = z.object({
	key: z
		.string()
		.min(1, 'Key is required')
		.max(100, 'Key too long')
		.regex(
			/^[A-Z_][A-Z0-9_]*$/,
			'Key must be uppercase letters, digits, and underscores',
		),
	value: z.string().min(1, 'Value is required'),
});

export const updateVariableSchema = z.object({
	key: z
		.string()
		.min(1, 'Key is required')
		.max(100, 'Key too long')
		.regex(
			/^[A-Z_][A-Z0-9_]*$/,
			'Key must be uppercase letters, digits, and underscores',
		),
	value: z.string().min(1, 'Value is required'),
});

export type CreateVariableInput = z.infer<typeof createVariableSchema>;
export type UpdateVariableInput = z.infer<typeof updateVariableSchema>;

export type { EnvVariable } from '@/types/interfaces/variable';

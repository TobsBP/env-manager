import { z } from 'zod';

export const createConnectionSchema = z.object({
	fromProjectId: z.string().min(1),
	fromEnvId: z.string().min(1),
	toProjectId: z.string().min(1),
	toEnvId: z.string().min(1),
});

export type CreateConnectionInput = z.infer<typeof createConnectionSchema>;

export type { Connection } from '@/types/interfaces/connection';

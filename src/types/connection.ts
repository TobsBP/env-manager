import { z } from 'zod';

export const createConnectionSchema = z.object({
	fromProjectId: z.string().min(1),
	fromEnvId: z.string().min(1),
	toProjectId: z.string().min(1),
	toEnvId: z.string().min(1),
});

export type CreateConnectionInput = z.infer<typeof createConnectionSchema>;

export interface Connection {
	id: string;
	userId: string;
	fromProjectId: string;
	fromEnvId: string;
	toProjectId: string;
	toEnvId: string;
	createdAt: unknown;
}

import { z } from 'zod';

export const createDiagramSchema = z.object({
	name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
	code: z.string().min(1, 'Diagram code is required'),
});

export const updateDiagramSchema = z.object({
	name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
	code: z.string().min(1, 'Diagram code is required'),
});

export type CreateDiagramInput = z.infer<typeof createDiagramSchema>;
export type UpdateDiagramInput = z.infer<typeof updateDiagramSchema>;

export interface Diagram {
	id: string;
	name: string;
	code: string;
	createdAt: unknown;
	updatedAt: unknown;
}

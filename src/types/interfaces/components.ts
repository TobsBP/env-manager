import type { MutationResult } from '@/types/auth';
import type { EnvVariable } from '@/types/interfaces/variable';

export interface VariableRowProps {
	variable: EnvVariable;
	onUpdate: (id: string, key: string, value: string) => Promise<MutationResult>;
	onDelete: (id: string) => Promise<MutationResult>;
}

export interface AddVariableFormProps {
	onCreate: (key: string, value: string) => Promise<MutationResult>;
}

export interface MermaidRendererProps {
	code: string;
}

export interface EnvDiffProps {
	projectId: string;
	envAId: string;
	envAName: string;
	envBId: string;
	envBName: string;
}

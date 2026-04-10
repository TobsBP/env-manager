import type { MutationResult } from '@/types/auth';
import type { Diagram } from '@/types/interfaces/diagram';
import type {
	Environment,
	Project,
	ProjectRole,
	Subproject,
} from '@/types/interfaces/project';

export interface ProjectCardProps {
	project: Project;
	role?: ProjectRole;
	onUpdate?: (
		id: string,
		name: string,
		emoji: string,
	) => Promise<MutationResult>;
	onDelete?: (id: string) => void;
	onShare?: () => void;
}

export interface SubprojectCardProps {
	subproject: Subproject;
	projectId: string;
	onUpdate: (
		id: string,
		name: string,
		emoji: string,
	) => Promise<MutationResult>;
	onDelete: (id: string) => void;
}

export interface DiagramCardProps {
	diagram: Diagram;
	projectId: string;
	onDelete: (id: string) => void;
	onEdit: (diagram: Diagram) => void;
}

export interface EnvironmentCardProps {
	environment: Environment;
	projectId: string;
	subprojectId?: string;
	onDelete: (id: string) => void;
	onClone: (env: Environment) => void;
}

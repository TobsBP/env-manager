import type { AuthResult } from '@/types/auth';
import type { ProjectType } from '@/types/project';

export interface NewProjectModalProps {
	onClose: () => void;
	onCreate: (
		name: string,
		emoji: string,
		projectType: ProjectType,
	) => Promise<AuthResult>;
}

export interface NewEnvironmentModalProps {
	onClose: () => void;
	onCreate: (name: string) => Promise<AuthResult>;
}

export interface NewSubprojectModalProps {
	onClose: () => void;
	onCreate: (name: string, emoji: string) => Promise<AuthResult>;
}

export interface CloneEnvironmentModalProps {
	envName: string;
	onClose: () => void;
	onClone: (newName: string) => Promise<AuthResult>;
}

export interface NewDiagramModalProps {
	onClose: () => void;
	onSave: (name: string, code: string) => Promise<AuthResult>;
	initialName?: string;
	initialCode?: string;
	mode?: 'create' | 'edit';
}

export interface ShareProjectModalProps {
	projectId: string;
	onClose: () => void;
}

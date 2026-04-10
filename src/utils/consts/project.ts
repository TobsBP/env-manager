import type { ProjectType } from '@/types/project';

export const PROJECT_TYPES: {
	value: ProjectType;
	label: string;
	description: string;
	icon: string;
}[] = [
	{
		value: 'single',
		label: 'Único',
		description: 'Um projeto com ambientes diretos, sem divisões.',
		icon: '📄',
	},
	{
		value: 'subprojects',
		label: 'Subprojetos',
		description:
			'Organize o projeto em serviços como Backend, Frontend, Worker…',
		icon: '📦',
	},
	{
		value: 'both',
		label: 'Ambos',
		description: 'Ambientes diretos e subprojetos no mesmo projeto.',
		icon: '🗂️',
	},
];

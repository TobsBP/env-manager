'use client';

import Link from 'next/link';
import type { Environment } from '@/types/project';

const ENV_BADGE: Record<string, string> = {
	prod: 'bg-red-500/15 text-red-400 border-red-500/30',
	production: 'bg-red-500/15 text-red-400 border-red-500/30',
	dev: 'bg-green-500/15 text-green-400 border-green-500/30',
	development: 'bg-green-500/15 text-green-400 border-green-500/30',
	homolog: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
	staging: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
};

interface Props {
	environment: Environment;
	projectId: string;
	onDelete: (id: string) => void;
}

export function EnvironmentCard({ environment, projectId, onDelete }: Props) {
	const badge =
		ENV_BADGE[environment.name.toLowerCase()] ??
		'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';

	return (
		<div className="glass-card flex items-center justify-between px-6 py-4">
			<Link
				href={`/projects/${projectId}/environments/${environment.id}`}
				className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
			>
				<span className="text-2xl">🌍</span>
				<div>
					<p className="font-medium">{environment.name}</p>
					<span className={`text-xs px-2 py-0.5 rounded-full border ${badge}`}>
						{environment.name}
					</span>
				</div>
			</Link>
			<button
				type="button"
				onClick={() => onDelete(environment.id)}
				className="ml-4 text-zinc-600 hover:text-red-400 transition-colors p-1 shrink-0"
				aria-label="Delete environment"
			>
				✕
			</button>
		</div>
	);
}

'use client';

import Link from 'next/link';
import type { Environment } from '@/types/project';

const ENV_CONFIG: Record<string, { badge: string; dot: string; icon: string }> =
	{
		prod: {
			badge: 'bg-red-500/10 text-red-400 border-red-500/25',
			dot: 'bg-red-400',
			icon: '🔴',
		},
		production: {
			badge: 'bg-red-500/10 text-red-400 border-red-500/25',
			dot: 'bg-red-400',
			icon: '🔴',
		},
		dev: {
			badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
			dot: 'bg-emerald-400',
			icon: '🟢',
		},
		development: {
			badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
			dot: 'bg-emerald-400',
			icon: '🟢',
		},
		homolog: {
			badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
			dot: 'bg-amber-400',
			icon: '🟡',
		},
		staging: {
			badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
			dot: 'bg-amber-400',
			icon: '🟡',
		},
	};

const DEFAULT_ENV = {
	badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/25',
	dot: 'bg-zinc-400',
	icon: '⚙️',
};

interface Props {
	environment: Environment;
	projectId: string;
	onDelete: (id: string) => void;
	onClone: (env: Environment) => void;
}

export function EnvironmentCard({ environment, projectId, onDelete, onClone }: Props) {
	const config = ENV_CONFIG[environment.name.toLowerCase()] ?? DEFAULT_ENV;

	return (
		<div className="glass-card flex items-center justify-between px-5 py-4 group hover:border-violet-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.06)]">
			<Link
				href={`/projects/${projectId}/environments/${environment.id}`}
				className="flex items-center gap-4 flex-1 min-w-0"
			>
				<div className="w-10 h-10 rounded-xl bg-zinc-800/80 ring-1 ring-white/8 flex items-center justify-center shrink-0 group-hover:ring-violet-500/20 transition-all">
					<div
						className={`w-2.5 h-2.5 rounded-full ${config.dot} shadow-[0_0_8px_currentColor]`}
					/>
				</div>
				<div className="min-w-0 flex-1">
					<p className="font-medium group-hover:text-violet-300 transition-colors">
						{environment.name}
					</p>
					<span
						className={`inline-block text-xs px-2 py-0.5 rounded-full border mt-0.5 ${config.badge}`}
					>
						{environment.name}
					</span>
				</div>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-zinc-700 group-hover:text-violet-400 transition-all shrink-0 mr-2 group-hover:translate-x-0.5"
					aria-hidden="true"
				>
					<path d="M9 18l6-6-6-6" />
				</svg>
			</Link>
			<button
				type="button"
				onClick={() => onClone(environment)}
				className="ml-1 p-2 text-zinc-600 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all shrink-0 opacity-0 group-hover:opacity-100"
				aria-label="Clone environment"
			>
				<svg
					width="13"
					height="13"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
				</svg>
			</button>
			<button
				type="button"
				onClick={() => onDelete(environment.id)}
				className="ml-1 p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0 opacity-0 group-hover:opacity-100"
				aria-label="Delete environment"
			>
				<svg
					width="13"
					height="13"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<polyline points="3 6 5 6 21 6" />
					<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
					<path d="M10 11v6M14 11v6" />
					<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
				</svg>
			</button>
		</div>
	);
}

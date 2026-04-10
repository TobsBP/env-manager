'use client';

import Link from 'next/link';
import type { DiagramCardProps } from '@/types/interfaces/cards';

export function DiagramCard({
	diagram,
	projectId,
	onDelete,
	onEdit,
}: DiagramCardProps) {
	return (
		<div className="glass-card flex items-center justify-between px-5 py-4 group hover:border-violet-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.06)]">
			<Link
				href={`/projects/${projectId}/diagrams/${diagram.id}`}
				className="flex items-center gap-4 flex-1 min-w-0"
			>
				<div className="w-10 h-10 rounded-xl bg-zinc-800/80 ring-1 ring-white/8 flex items-center justify-center shrink-0 group-hover:ring-violet-500/20 transition-all text-lg">
					📊
				</div>
				<div className="min-w-0 flex-1">
					<p className="font-medium group-hover:text-violet-300 transition-colors truncate">
						{diagram.name}
					</p>
					<p className="text-xs text-zinc-600 mt-0.5 truncate font-mono">
						{diagram.code.split('\n')[0]}
					</p>
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
				onClick={() => onEdit(diagram)}
				className="ml-1 p-2 text-zinc-600 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all shrink-0 opacity-0 group-hover:opacity-100"
				aria-label="Edit diagram"
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
					<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
					<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
				</svg>
			</button>
			<button
				type="button"
				onClick={() => onDelete(diagram.id)}
				className="ml-1 p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0 opacity-0 group-hover:opacity-100"
				aria-label="Delete diagram"
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

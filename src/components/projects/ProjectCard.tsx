'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Project } from '@/types/project';

interface Props {
	project: Project;
	onUpdate: (
		id: string,
		name: string,
	) => Promise<{ success: boolean; error?: string }>;
	onDelete: (id: string) => void;
}

export function ProjectCard({ project, onUpdate, onDelete }: Props) {
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState(project.name);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function startEdit(e: React.MouseEvent) {
		e.preventDefault();
		setName(project.name);
		setError(null);
		setEditing(true);
	}

	function cancelEdit() {
		setEditing(false);
		setError(null);
	}

	async function handleSave() {
		const trimmed = name.trim();
		if (!trimmed || trimmed === project.name) {
			cancelEdit();
			return;
		}
		setIsSaving(true);
		const result = await onUpdate(project.id, trimmed);
		setIsSaving(false);
		if (result.success) {
			setEditing(false);
		} else {
			setError(result.error ?? 'Failed to update');
		}
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === 'Enter') handleSave();
		if (e.key === 'Escape') cancelEdit();
	}

	if (editing) {
		return (
			<div className="glass-card flex flex-col gap-2 px-5 py-4 border-violet-500/20">
				{error && <p className="text-xs text-red-400">{error}</p>}
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 rounded-xl bg-zinc-800/80 ring-1 ring-violet-500/30 flex items-center justify-center text-xl shrink-0">
						{project.emoji ?? '📁'}
					</div>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						onKeyDown={handleKeyDown}
						disabled={isSaving}
						className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition"
					/>
					<button
						type="button"
						onClick={handleSave}
						disabled={isSaving}
						className="btn-primary shrink-0 px-3 py-1.5 text-sm disabled:opacity-50"
						style={{ width: 'auto' }}
					>
						{isSaving ? '…' : 'Save'}
					</button>
					<button
						type="button"
						onClick={cancelEdit}
						disabled={isSaving}
						className="shrink-0 px-2 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="glass-card flex items-center justify-between px-5 py-4 group hover:border-violet-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.06)]">
			<Link
				href={`/projects/${project.id}`}
				className="flex items-center gap-4 flex-1 min-w-0"
			>
				<div className="w-10 h-10 rounded-xl bg-zinc-800/80 ring-1 ring-white/8 flex items-center justify-center text-xl shrink-0 group-hover:ring-violet-500/20 transition-all">
					{project.emoji ?? '📁'}
				</div>
				<div className="min-w-0 flex-1">
					<p className="font-medium truncate group-hover:text-violet-300 transition-colors">
						{project.name}
					</p>
					<p className="text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors mt-0.5">Open project</p>
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
			<div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					type="button"
					onClick={startEdit}
					className="p-2 text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all cursor-pointer"
					aria-label="Rename project"
					title="Rename"
				>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
						<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
						<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
					</svg>
				</button>
				<button
					type="button"
					onClick={() => onDelete(project.id)}
					className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
					aria-label="Delete project"
					title="Delete"
				>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
						<polyline points="3 6 5 6 21 6" />
						<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
						<path d="M10 11v6M14 11v6" />
						<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
					</svg>
				</button>
			</div>
		</div>
	);
}

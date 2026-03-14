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
			<div className="glass-card flex flex-col gap-2 px-6 py-4">
				{error && <p className="text-xs text-red-400">{error}</p>}
				<div className="flex items-center gap-2">
					<span className="text-2xl shrink-0">{project.emoji ?? '📁'}</span>
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
		<div className="glass-card flex items-center justify-between px-6 py-4 group">
			<Link
				href={`/projects/${project.id}`}
				className="flex items-center gap-3 flex-1 min-w-0"
			>
				<span className="text-2xl shrink-0">{project.emoji ?? '📁'}</span>
				<div className="min-w-0">
					<p className="font-medium truncate group-hover:text-violet-300 transition-colors">
						{project.name}
					</p>
					<p className="text-xs text-zinc-500">Open project →</p>
				</div>
			</Link>
			<div className="flex items-center gap-1 ml-4 shrink-0">
				<button
					type="button"
					onClick={startEdit}
					className="p-1.5 text-zinc-600 hover:text-violet-400 transition-colors text-sm cursor-pointer"
					aria-label="Rename project"
					title="Rename"
				>
					✏️
				</button>
				<button
					type="button"
					onClick={() => onDelete(project.id)}
					className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
					aria-label="Delete project"
					title="Delete"
				>
					✕
				</button>
			</div>
		</div>
	);
}

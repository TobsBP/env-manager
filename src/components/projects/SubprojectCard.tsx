'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { SubprojectCardProps } from '@/types/interfaces/cards';
import { EMOJI_OPTIONS } from '@/utils/consts/emoji';

export function SubprojectCard({
	subproject,
	projectId,
	onUpdate,
	onDelete,
}: SubprojectCardProps) {
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState(subproject.name);
	const [emoji, setEmoji] = useState(subproject.emoji ?? '📦');
	const [showPicker, setShowPicker] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function startEdit(e: React.MouseEvent) {
		e.preventDefault();
		setName(subproject.name);
		setEmoji(subproject.emoji ?? '📦');
		setShowPicker(false);
		setError(null);
		setEditing(true);
	}

	function cancelEdit() {
		setEditing(false);
		setShowPicker(false);
		setError(null);
	}

	async function handleSave() {
		const trimmed = name.trim();
		if (!trimmed) {
			cancelEdit();
			return;
		}
		if (trimmed === subproject.name && emoji === subproject.emoji) {
			cancelEdit();
			return;
		}
		setIsSaving(true);
		const result = await onUpdate(subproject.id, trimmed, emoji);
		setIsSaving(false);
		if (result.success) {
			setEditing(false);
			setShowPicker(false);
		} else {
			setError(result.error ?? 'Failed to update');
		}
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === 'Enter') handleSave();
		if (e.key === 'Escape') cancelEdit();
	}

	const href = `/projects/${projectId}/subprojects/${subproject.id}`;

	if (editing) {
		return (
			<div className="glass-card flex flex-col gap-3 px-5 py-4 border-violet-500/20">
				{error && <p className="text-xs text-red-400">{error}</p>}

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => setShowPicker((v) => !v)}
						disabled={isSaving}
						title="Change icon"
						className="w-10 h-10 rounded-xl bg-zinc-800/80 ring-1 ring-violet-500/40 flex items-center justify-center text-xl shrink-0 hover:ring-violet-500/70 hover:bg-zinc-700/80 transition-all"
					>
						{emoji}
					</button>

					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						onKeyDown={handleKeyDown}
						disabled={isSaving}
						autoFocus
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

				{showPicker && (
					<div className="grid grid-cols-8 gap-1 pt-1 border-t border-white/5">
						{EMOJI_OPTIONS.map((e) => (
							<button
								key={e}
								type="button"
								onClick={() => {
									setEmoji(e);
									setShowPicker(false);
								}}
								className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-all ${
									emoji === e
										? 'bg-violet-500/30 ring-1 ring-violet-500'
										: 'hover:bg-zinc-700/60'
								}`}
							>
								{e}
							</button>
						))}
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="glass-card flex items-center gap-2 px-5 py-4 group hover:border-violet-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.06)]">
			<Link href={href} className="flex items-center gap-4 flex-1 min-w-0">
				<div className="w-10 h-10 rounded-xl bg-zinc-800/80 ring-1 ring-white/8 flex items-center justify-center text-xl shrink-0 group-hover:ring-violet-500/20 transition-all">
					{subproject.emoji ?? '📦'}
				</div>
				<div className="min-w-0 flex-1">
					<p className="font-medium truncate group-hover:text-violet-300 transition-colors">
						{subproject.name}
					</p>
					<p className="text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors mt-0.5">
						Open subproject
					</p>
				</div>
			</Link>
			<div className="flex items-center gap-0.5 shrink-0">
				<button
					type="button"
					onClick={startEdit}
					className="p-2 text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all cursor-pointer"
					aria-label="Rename subproject"
					title="Rename"
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
					onClick={() => onDelete(subproject.id)}
					className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
					aria-label="Delete subproject"
					title="Delete"
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
				<Link
					href={href}
					className="p-2 text-zinc-700 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all"
					aria-hidden="true"
					tabIndex={-1}
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M9 18l6-6-6-6" />
					</svg>
				</Link>
			</div>
		</div>
	);
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShareProjectModal } from '@/components/projects/ShareProjectModal';
import type { ProjectCardProps } from '@/types/interfaces/cards';
import { EMOJI_OPTIONS } from '@/utils/consts/emoji';

export function ProjectCard({
	project,
	role,
	onUpdate,
	onDelete,
	onShare,
}: ProjectCardProps) {
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState(project.name);
	const [emoji, setEmoji] = useState(project.emoji ?? '📁');
	const [figmaUrl, setFigmaUrl] = useState(project.figmaUrl ?? '');
	const [showPicker, setShowPicker] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);

	const isOwner = role === 'owner' || role === undefined;

	function startEdit(e: React.MouseEvent) {
		e.preventDefault();
		setName(project.name);
		setEmoji(project.emoji ?? '📁');
		setFigmaUrl(project.figmaUrl ?? '');
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
		if (!onUpdate) return;
		const trimmed = name.trim();
		if (!trimmed) {
			cancelEdit();
			return;
		}
		if (
			trimmed === project.name &&
			emoji === project.emoji &&
			figmaUrl.trim() === (project.figmaUrl ?? '')
		) {
			cancelEdit();
			return;
		}
		setIsSaving(true);
		const result = await onUpdate(project.id, trimmed, emoji, figmaUrl.trim());
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

				<div className="flex items-center gap-2 pl-0.5">
					<span className="text-base shrink-0">🎨</span>
					<input
						type="url"
						value={figmaUrl}
						onChange={(e) => setFigmaUrl(e.target.value)}
						disabled={isSaving}
						placeholder="https://figma.com/file/..."
						className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition placeholder:text-zinc-600"
					/>
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
		<>
			<div className="glass-card flex items-center gap-2 px-5 py-4 group hover:border-violet-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.06)]">
				<Link
					href={`/projects/${project.id}`}
					className="flex items-center gap-4 flex-1 min-w-0"
				>
					<div className="w-10 h-10 rounded-xl bg-zinc-800/80 ring-1 ring-white/8 flex items-center justify-center text-xl shrink-0 group-hover:ring-violet-500/20 transition-all">
						{project.emoji ?? '📁'}
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<p className="font-medium truncate group-hover:text-violet-300 transition-colors">
								{project.name}
							</p>
							{(role === 'editor' || role === 'viewer') && (
								<span className="shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-700/60 text-zinc-400 border border-zinc-600/40">
									{role === 'editor' ? 'Editor' : 'Viewer'}
								</span>
							)}
						</div>
						<p className="text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors mt-0.5">
							Open project
						</p>
					</div>
				</Link>
				<div className="flex items-center gap-0.5 shrink-0">
					{confirmDelete ? (
						<div className="flex items-center gap-1 pl-1">
							<span className="text-xs text-zinc-400 mr-1">Deletar?</span>
							<button
								type="button"
								onClick={() => onDelete?.(project.id)}
								className="px-2 py-1 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-all"
							>
								Sim
							</button>
							<button
								type="button"
								onClick={() => setConfirmDelete(false)}
								className="px-2 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 rounded-md transition-all"
							>
								Não
							</button>
						</div>
					) : (
						<>
							{isOwner && (
								<button
									type="button"
									onClick={() => {
										if (onShare) onShare();
										else setShowShareModal(true);
									}}
									className="p-2 text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all cursor-pointer"
									aria-label="Share project"
									title="Share"
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
										<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
										<polyline points="16 6 12 2 8 6" />
										<line x1="12" y1="2" x2="12" y2="15" />
									</svg>
								</button>
							)}
							{onUpdate && (
								<button
									type="button"
									onClick={startEdit}
									className="p-2 text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all cursor-pointer"
									aria-label="Rename project"
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
							)}
							{onDelete && (
								<button
									type="button"
									onClick={() => setConfirmDelete(true)}
									className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
									aria-label="Delete project"
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
							)}
						</>
					)}
					<Link
						href={`/projects/${project.id}`}
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

			{showShareModal && (
				<ShareProjectModal
					projectId={project.id}
					onClose={() => setShowShareModal(false)}
				/>
			)}
		</>
	);
}

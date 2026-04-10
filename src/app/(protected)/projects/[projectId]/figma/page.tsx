'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import { useFigmas } from '@/hooks/useFigmas';
import { useProject } from '@/hooks/useProject';
import { useUser } from '@/hooks/useUser';
import { signOutAction } from '@/lib/auth/actions';
import type { SubFigma } from '@/types/project';

interface Props {
	params: Promise<{ projectId: string }>;
}

function FigmaIcon({ size = 14 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
			<path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
			<path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
			<path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
			<path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
		</svg>
	);
}

function SubFigmaCard({
	figma,
	canEdit,
	onView,
	onEdit,
	onDelete,
}: {
	figma: SubFigma;
	canEdit: boolean;
	onView: (f: SubFigma) => void;
	onEdit: (f: SubFigma) => void;
	onDelete: (id: string) => void;
}) {
	const [confirmDelete, setConfirmDelete] = useState(false);

	return (
		<div className="glass-card flex items-center gap-3 px-5 py-4 group hover:border-violet-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.06)] transition-all">
			<button
				type="button"
				onClick={() => onView(figma)}
				className="flex items-center gap-4 flex-1 min-w-0 text-left"
			>
				<div className="w-10 h-10 rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center shrink-0 group-hover:ring-violet-500/40 transition-all text-violet-400">
					<FigmaIcon size={18} />
				</div>
				<div className="min-w-0 flex-1">
					<p className="font-medium truncate group-hover:text-violet-300 transition-colors">
						{figma.name}
					</p>
					<p className="text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors mt-0.5 truncate">
						{figma.url}
					</p>
				</div>
			</button>

			<div className="flex items-center gap-0.5 shrink-0">
				{confirmDelete ? (
					<div className="flex items-center gap-1 pl-1">
						<span className="text-xs text-zinc-400 mr-1">Deletar?</span>
						<button
							type="button"
							onClick={() => onDelete(figma.id)}
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
						{canEdit && (
							<>
								<button
									type="button"
									onClick={() => onEdit(figma)}
									className="p-2 text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all"
									title="Editar"
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
									onClick={() => setConfirmDelete(true)}
									className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
									title="Deletar"
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
							</>
						)}
						<button
							type="button"
							onClick={() => onView(figma)}
							className="p-2 text-zinc-700 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all"
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
						</button>
					</>
				)}
			</div>
		</div>
	);
}

export default function FigmaPage({ params }: Props) {
	const { projectId } = use(params);
	const { user } = useUser();
	const { project } = useProject(projectId);
	const { figmas, isLoading, createFigma, updateFigma, deleteFigma } =
		useFigmas(projectId);

	const isOwner = !project || project.userId === user?.uid;

	// Add modal
	const [showAddModal, setShowAddModal] = useState(false);
	const [addName, setAddName] = useState('');
	const [addUrl, setAddUrl] = useState('');
	const [addError, setAddError] = useState<string | null>(null);
	const [isAdding, setIsAdding] = useState(false);

	// Edit modal
	const [editTarget, setEditTarget] = useState<SubFigma | null>(null);
	const [editName, setEditName] = useState('');
	const [editUrl, setEditUrl] = useState('');
	const [editError, setEditError] = useState<string | null>(null);
	const [isSavingEdit, setIsSavingEdit] = useState(false);

	// Embed viewer modal
	const [viewTarget, setViewTarget] = useState<SubFigma | null>(null);

	async function handleAdd() {
		const name = addName.trim();
		const url = addUrl.trim();
		if (!name || !url) return;
		setIsAdding(true);
		setAddError(null);
		const result = await createFigma(name, url);
		setIsAdding(false);
		if (result.success) {
			setShowAddModal(false);
			setAddName('');
			setAddUrl('');
		} else {
			setAddError(result.error ?? 'Erro ao adicionar');
		}
	}

	function openEdit(figma: SubFigma) {
		setEditTarget(figma);
		setEditName(figma.name);
		setEditUrl(figma.url);
		setEditError(null);
	}

	async function handleSaveEdit() {
		if (!editTarget) return;
		const name = editName.trim();
		const url = editUrl.trim();
		if (!name || !url) return;
		setIsSavingEdit(true);
		setEditError(null);
		const result = await updateFigma(editTarget.id, name, url);
		setIsSavingEdit(false);
		if (result.success) {
			setEditTarget(null);
		} else {
			setEditError(result.error ?? 'Erro ao salvar');
		}
	}

	const embedUrl = (url: string) => {
		const base = url.replace(
			'https://www.figma.com/',
			'https://embed.figma.com/',
		);
		const sep = base.includes('?') ? '&' : '?';
		return `${base}${sep}embed-host=share`;
	};

	return (
		<div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
			{/* Background orbs */}
			<div className="page-orb w-150 h-150 bg-violet-700 -top-20 -right-20" />
			<div className="page-orb w-100 h-100 bg-indigo-700 bottom-10 -left-10" />

			{/* Header */}
			<header className="relative border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
				<div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 ring-1 ring-violet-500/30 text-base">
							🔐
						</div>
						<span className="font-semibold tracking-tight">Env Manager</span>
					</div>
					<div className="flex items-center gap-4">
						<span className="hidden sm:block text-sm text-zinc-500">
							{user?.email}
						</span>
						<form action={signOutAction}>
							<button
								type="submit"
								className="rounded-lg border border-zinc-700/80 px-4 py-1.5 text-sm text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
							>
								Sign out
							</button>
						</form>
					</div>
				</div>
			</header>

			{/* Main */}
			<main className="relative mx-auto max-w-5xl px-6 py-12">
				{/* Breadcrumb */}
				<div className="mb-6 flex items-center gap-1.5 text-sm text-zinc-600">
					<Link
						href="/dashboard"
						className="hover:text-zinc-300 transition-colors"
					>
						Projects
					</Link>
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M9 18l6-6-6-6" />
					</svg>
					<Link
						href={`/projects/${projectId}`}
						className="hover:text-zinc-300 transition-colors"
					>
						{project ? `${project.emoji} ${project.name}` : 'Project'}
					</Link>
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M9 18l6-6-6-6" />
					</svg>
					<span className="text-zinc-300">Figma</span>
				</div>

				{/* Title row */}
				<div className="mb-8 flex items-center justify-between">
					<div>
						<div className="flex items-center gap-3 mb-1">
							<h1 className="text-3xl font-semibold tracking-tight">
								<span className="text-zinc-500">
									{project ? `${project.emoji} ${project.name}` : ''}
								</span>
								<span className="text-zinc-700 mx-2">/</span>
								Figma
							</h1>
							{!isLoading && figmas.length > 0 && (
								<span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-xs font-medium text-violet-300">
									{figmas.length}
								</span>
							)}
						</div>
						<p className="text-zinc-500">
							Gerencie os designs Figma deste projeto.
						</p>
					</div>
					{isOwner && (
						<button
							type="button"
							onClick={() => {
								setAddName('');
								setAddUrl('');
								setAddError(null);
								setShowAddModal(true);
							}}
							className="btn-primary flex items-center gap-2 w-fit! h-9 px-4 text-sm"
						>
							<span className="text-base leading-none">+</span>
							New Figma
						</button>
					)}
				</div>

				{/* List */}
				{isLoading ? (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{[1, 2].map((n) => (
							<div
								key={n}
								className="glass-card h-18 animate-pulse bg-white/2"
							/>
						))}
					</div>
				) : figmas.length === 0 ? (
					<div className="glass-card px-6 py-16 text-center">
						<div className="w-14 h-14 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center text-violet-400 mx-auto mb-4">
							<FigmaIcon size={26} />
						</div>
						<p className="text-base font-medium text-zinc-200 mb-1">
							Nenhum Figma adicionado
						</p>
						<p className="text-sm text-zinc-500">
							{isOwner ? (
								<>
									Clique em{' '}
									<button
										type="button"
										onClick={() => {
											setAddName('');
											setAddUrl('');
											setAddError(null);
											setShowAddModal(true);
										}}
										className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
									>
										New Figma
									</button>{' '}
									para adicionar um design.
								</>
							) : (
								'Nenhum design Figma foi adicionado ainda.'
							)}
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{figmas.map((f) => (
							<SubFigmaCard
								key={f.id}
								figma={f}
								canEdit={isOwner}
								onView={setViewTarget}
								onEdit={openEdit}
								onDelete={deleteFigma}
							/>
						))}
					</div>
				)}
			</main>

			{/* Add modal */}
			{showAddModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
					<div className="glass-card w-full max-w-md p-6 flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-lg bg-violet-500/15 ring-1 ring-violet-500/25 flex items-center justify-center text-violet-400 shrink-0">
								<FigmaIcon size={16} />
							</div>
							<div>
								<h2 className="text-sm font-semibold text-zinc-100">
									Novo Figma
								</h2>
								<p className="text-xs text-zinc-500">
									Adicione um design ao projeto
								</p>
							</div>
						</div>

						{addError && (
							<p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
								{addError}
							</p>
						)}

						<div className="flex flex-col gap-2">
							<input
								type="text"
								value={addName}
								onChange={(e) => setAddName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleAdd();
									if (e.key === 'Escape') setShowAddModal(false);
								}}
								disabled={isAdding}
								autoFocus
								placeholder="Nome (ex: Tela de login)"
								className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition placeholder:text-zinc-600"
							/>
							<input
								type="url"
								value={addUrl}
								onChange={(e) => setAddUrl(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleAdd();
									if (e.key === 'Escape') setShowAddModal(false);
								}}
								disabled={isAdding}
								placeholder="https://figma.com/file/..."
								className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition placeholder:text-zinc-600"
							/>
						</div>

						<div className="flex items-center justify-end gap-2">
							<button
								type="button"
								onClick={() => setShowAddModal(false)}
								disabled={isAdding}
								className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
							>
								Cancelar
							</button>
							<button
								type="button"
								onClick={handleAdd}
								disabled={isAdding || !addName.trim() || !addUrl.trim()}
								className="btn-primary px-4 py-2 text-sm disabled:opacity-40"
							>
								{isAdding ? 'Adicionando…' : 'Adicionar'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Edit modal */}
			{editTarget && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
					<div className="glass-card w-full max-w-md p-6 flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-lg bg-violet-500/15 ring-1 ring-violet-500/25 flex items-center justify-center text-violet-400 shrink-0">
								<FigmaIcon size={16} />
							</div>
							<div>
								<h2 className="text-sm font-semibold text-zinc-100">
									Editar Figma
								</h2>
								<p className="text-xs text-zinc-500">
									Atualize o nome ou a URL
								</p>
							</div>
						</div>

						{editError && (
							<p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
								{editError}
							</p>
						)}

						<div className="flex flex-col gap-2">
							<input
								type="text"
								value={editName}
								onChange={(e) => setEditName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleSaveEdit();
									if (e.key === 'Escape') setEditTarget(null);
								}}
								disabled={isSavingEdit}
								autoFocus
								placeholder="Nome"
								className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition placeholder:text-zinc-600"
							/>
							<input
								type="url"
								value={editUrl}
								onChange={(e) => setEditUrl(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleSaveEdit();
									if (e.key === 'Escape') setEditTarget(null);
								}}
								disabled={isSavingEdit}
								placeholder="https://figma.com/file/..."
								className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition placeholder:text-zinc-600"
							/>
						</div>

						<div className="flex items-center justify-end gap-2">
							<button
								type="button"
								onClick={() => setEditTarget(null)}
								disabled={isSavingEdit}
								className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
							>
								Cancelar
							</button>
							<button
								type="button"
								onClick={handleSaveEdit}
								disabled={isSavingEdit || !editName.trim() || !editUrl.trim()}
								className="btn-primary px-4 py-2 text-sm disabled:opacity-40"
							>
								{isSavingEdit ? 'Salvando…' : 'Salvar'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Embed viewer modal */}
			{viewTarget && (
				<div className="fixed inset-0 z-50 flex flex-col bg-zinc-950">
					<div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md">
						<div className="flex items-center gap-3">
							<div className="text-violet-400">
								<FigmaIcon size={16} />
							</div>
							<span className="text-sm font-medium text-zinc-200">
								{viewTarget.name}
							</span>
						</div>
						<button
							type="button"
							onClick={() => setViewTarget(null)}
							className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-zinc-700/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all"
						>
							Fechar
						</button>
					</div>
					<iframe
						style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
						className="flex-1 w-full"
						src={embedUrl(viewTarget.url)}
						title={viewTarget.name}
						allowFullScreen
					/>
				</div>
			)}
		</div>
	);
}

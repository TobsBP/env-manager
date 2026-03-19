'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { MermaidRenderer } from '@/components/diagrams/MermaidRenderer';
import { NewDiagramModal } from '@/components/diagrams/NewDiagramModal';
import { useDiagrams } from '@/hooks/useDiagrams';
import { useProject } from '@/hooks/useProject';
import { useUser } from '@/hooks/useUser';
import { signOutAction } from '@/lib/auth/actions';

interface Props {
	params: Promise<{ projectId: string; diagramId: string }>;
}

export default function DiagramDetailPage({ params }: Props) {
	const { projectId, diagramId } = use(params);
	const { user } = useUser();
	const { project } = useProject(projectId);
	const { diagrams, isLoading, updateDiagram, deleteDiagram } =
		useDiagrams(projectId);
	const router = useRouter();
	const [showEdit, setShowEdit] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showExportMenu, setShowExportMenu] = useState(false);
	const [showExpanded, setShowExpanded] = useState(false);

	function exportSvg() {
		const svgEl = document.querySelector<SVGElement>('.mermaid-output svg');
		if (!svgEl) return;
		const blob = new Blob([svgEl.outerHTML], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${diagram?.name ?? 'diagram'}.svg`;
		a.click();
		URL.revokeObjectURL(url);
		setShowExportMenu(false);
	}

	function exportMmd() {
		if (!diagram) return;
		const blob = new Blob([diagram.code], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${diagram.name}.mmd`;
		a.click();
		URL.revokeObjectURL(url);
		setShowExportMenu(false);
	}

	const diagram = diagrams.find((d) => d.id === diagramId);

	async function handleDelete() {
		setIsDeleting(true);
		await deleteDiagram(diagramId);
		router.push(`/projects/${projectId}/diagrams`);
	}

	return (
		<div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
			<div className="page-orb w-150 h-150 bg-violet-700 -top-20 -right-20" />
			<div className="page-orb w-100 h-100 bg-indigo-700 bottom-10 -left-10" />

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

			<main className="relative mx-auto max-w-5xl px-6 py-12">
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
						{project?.name ?? projectId}
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
						href={`/projects/${projectId}/diagrams`}
						className="hover:text-zinc-300 transition-colors"
					>
						Diagrams
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
					<span className="text-zinc-300">{diagram?.name ?? '…'}</span>
				</div>

				{isLoading ? (
					<div className="glass-card h-64 animate-pulse bg-white/2" />
				) : !diagram ? (
					<div className="glass-card px-6 py-16 text-center">
						<p className="text-zinc-400">Diagram not found.</p>
						<Link
							href={`/projects/${projectId}/diagrams`}
							className="mt-3 inline-block text-sm text-violet-400 hover:text-violet-300 transition-colors"
						>
							Back to Diagrams
						</Link>
					</div>
				) : (
					<>
						<div className="mb-6 flex items-start justify-between">
							<div>
								<h1 className="text-3xl font-semibold tracking-tight mb-1">
									{diagram.name}
								</h1>
							</div>
							<div className="flex items-center gap-2">
								<div className="relative">
									<button
										type="button"
										onClick={() => setShowExportMenu((v) => !v)}
										className="flex items-center gap-2 h-9 px-4 text-sm rounded-lg border border-zinc-700/80 text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
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
											<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
											<polyline points="7 10 12 15 17 10" />
											<line x1="12" y1="15" x2="12" y2="3" />
										</svg>
										Export
									</button>
									{showExportMenu && (
										// biome-ignore lint/a11y/noStaticElementInteractions: click-outside closes menu
										<div
											className="absolute right-0 top-full mt-1 z-10 w-36 rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl py-1"
											onMouseLeave={() => setShowExportMenu(false)}
										>
											<button
												type="button"
												onClick={exportSvg}
												className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
											>
												Export as SVG
											</button>
											<button
												type="button"
												onClick={exportMmd}
												className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
											>
												Export as .mmd
											</button>
										</div>
									)}
								</div>
								<button
									type="button"
									onClick={() => setShowExpanded(true)}
									className="flex items-center gap-2 h-9 px-4 text-sm rounded-lg border border-zinc-700/80 text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
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
										<polyline points="15 3 21 3 21 9" />
										<polyline points="9 21 3 21 3 15" />
										<line x1="21" y1="3" x2="14" y2="10" />
										<line x1="3" y1="21" x2="10" y2="14" />
									</svg>
									Expand
								</button>
								<button
									type="button"
									onClick={() => setShowEdit(true)}
									className="flex items-center gap-2 h-9 px-4 text-sm rounded-lg border border-zinc-700/80 text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
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
									Edit
								</button>
								<button
									type="button"
									onClick={() => setConfirmDelete(true)}
									className="flex items-center gap-2 h-9 px-4 text-sm rounded-lg border border-zinc-700/80 text-zinc-400 transition-all hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10"
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
									Delete
								</button>
							</div>
						</div>

						<div className="glass-card p-6 overflow-auto mermaid-output">
							<MermaidRenderer code={diagram.code} />
						</div>
					</>
				)}
			</main>

			{showEdit && diagram && (
				<NewDiagramModal
					mode="edit"
					initialName={diagram.name}
					initialCode={diagram.code}
					onClose={() => setShowEdit(false)}
					onSave={(name, code) => updateDiagram(diagramId, name, code)}
				/>
			)}

			{confirmDelete && (
				// biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
					onClick={(e) =>
						e.target === e.currentTarget && setConfirmDelete(false)
					}
					onKeyDown={(e) => e.key === 'Escape' && setConfirmDelete(false)}
				>
					<div className="glass-card w-full max-w-sm mx-4 p-6">
						<h2 className="text-lg font-semibold mb-2">Delete diagram?</h2>
						<p className="text-sm text-zinc-400 mb-5">
							This will permanently delete{' '}
							<span className="text-zinc-200 font-medium">{diagram?.name}</span>
							. This action cannot be undone.
						</p>
						<div className="flex items-center justify-between">
							<button
								type="button"
								onClick={() => setConfirmDelete(false)}
								className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleDelete}
								disabled={isDeleting}
								className="px-4 py-2 text-sm rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:border-red-500/50 transition-all disabled:opacity-50"
							>
								{isDeleting ? 'Deleting…' : 'Delete'}
							</button>
						</div>
					</div>
				</div>
			)}
			{showExpanded && diagram && (
				// biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
					onClick={(e) =>
						e.target === e.currentTarget && setShowExpanded(false)
					}
					onKeyDown={(e) => e.key === 'Escape' && setShowExpanded(false)}
				>
					<div className="relative w-full h-full flex items-center justify-center p-8">
						<button
							type="button"
							onClick={() => setShowExpanded(false)}
							className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-lg border border-zinc-700/80 text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
							aria-label="Close"
						>
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
						<div className="w-full max-w-7xl overflow-auto max-h-full">
							<MermaidRenderer code={diagram.code} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

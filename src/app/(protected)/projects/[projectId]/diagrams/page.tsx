'use client';

import Link from 'next/link';
import { use, useEffect, useRef, useState } from 'react';
import { DiagramCard } from '@/components/diagrams/DiagramCard';
import { MermaidRenderer } from '@/components/diagrams/MermaidRenderer';
import { NewDiagramModal } from '@/components/diagrams/NewDiagramModal';
import { useDiagrams } from '@/hooks/useDiagrams';
import { useProject } from '@/hooks/useProject';
import { useUser } from '@/hooks/useUser';
import { signOutAction } from '@/lib/auth/actions';
import type { Diagram } from '@/types/diagram';
import { downloadDiagramsAsSVG, openDiagramsAsPDF } from '@/utils/diagrams';

interface Props {
	params: Promise<{ projectId: string }>;
}

export default function DiagramsPage({ params }: Props) {
	const { projectId } = use(params);
	const { user } = useUser();
	const { project } = useProject(projectId);
	const {
		diagrams,
		isLoading,
		error,
		createDiagram,
		updateDiagram,
		deleteDiagram,
	} = useDiagrams(projectId);
	const [showModal, setShowModal] = useState(false);
	const [editTarget, setEditTarget] = useState<Diagram | null>(null);
	const [viewAll, setViewAll] = useState(false);
	const [isExporting, setIsExporting] = useState(false);
	const [showExportMenu, setShowExportMenu] = useState(false);
	const [showSVGConfirm, setShowSVGConfirm] = useState(false);
	const exportMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				exportMenuRef.current &&
				!exportMenuRef.current.contains(e.target as Node)
			) {
				setShowExportMenu(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	async function exportAsSVG() {
		if (!diagrams.length || isExporting) return;
		setShowSVGConfirm(false);
		setIsExporting(true);
		try {
			await downloadDiagramsAsSVG(diagrams);
		} finally {
			setIsExporting(false);
		}
	}

	async function exportAsPDF() {
		if (!diagrams.length || isExporting) return;
		setShowExportMenu(false);
		setIsExporting(true);
		try {
			await openDiagramsAsPDF(diagrams, project?.name);
		} finally {
			setIsExporting(false);
		}
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
					<span className="text-zinc-300">Diagrams</span>
				</div>

				<div className="mb-8 flex items-start justify-between">
					<div>
						<div className="flex items-center gap-3 mb-1">
							<h1 className="text-3xl font-semibold tracking-tight">
								{project ? (
									<>
										<span className="text-zinc-500">
											{project.emoji} {project.name}
										</span>
										<span className="text-zinc-700 mx-2">/</span>
										Diagrams
									</>
								) : (
									'Diagrams'
								)}
							</h1>
							{!isLoading && diagrams.length > 0 && (
								<span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-xs font-medium text-violet-300">
									{diagrams.length}
								</span>
							)}
						</div>
						<p className="text-zinc-500">
							Mermaid diagrams associated with this project.
						</p>
					</div>
					<div className="flex items-center gap-2">
						{!isLoading && diagrams.length > 0 && (
							<div className="relative" ref={exportMenuRef}>
								<button
									type="button"
									onClick={() => setShowExportMenu((v) => !v)}
									disabled={isExporting}
									className="flex items-center gap-2 rounded-lg border border-zinc-700/80 px-4 py-1.5 text-sm text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isExporting ? (
										<>
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="animate-spin"
												aria-hidden="true"
											>
												<path d="M21 12a9 9 0 1 1-6.219-8.56" />
											</svg>
											Exporting…
										</>
									) : (
										<>
											<svg
												width="14"
												height="14"
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
											Export All
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
												<polyline points="6 9 12 15 18 9" />
											</svg>
										</>
									)}
								</button>

								{showExportMenu && (
									<div className="absolute right-0 mt-1.5 w-44 rounded-lg border border-zinc-700/80 bg-zinc-900 shadow-xl z-10 overflow-hidden">
										<button
											type="button"
											onClick={() => {
												setShowExportMenu(false);
												setShowSVGConfirm(true);
											}}
											className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
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
												aria-hidden="true"
											>
												<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
												<path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
											</svg>
											Export as SVG
										</button>
										<div className="border-t border-zinc-800" />
										<button
											type="button"
											onClick={exportAsPDF}
											className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
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
												aria-hidden="true"
											>
												<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
												<polyline points="14 2 14 8 20 8" />
												<line x1="16" y1="13" x2="8" y2="13" />
												<line x1="16" y1="17" x2="8" y2="17" />
												<polyline points="10 9 9 9 8 9" />
											</svg>
											Export as PDF
										</button>
									</div>
								)}
							</div>
						)}
						{!isLoading && diagrams.length > 0 && (
							<button
								type="button"
								onClick={() => setViewAll((v) => !v)}
								className="flex items-center gap-2 rounded-lg border border-zinc-700/80 px-4 py-1.5 text-sm text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 h-9"
							>
								{viewAll ? (
									<>
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<line x1="8" y1="6" x2="21" y2="6" />
											<line x1="8" y1="12" x2="21" y2="12" />
											<line x1="8" y1="18" x2="21" y2="18" />
											<line x1="3" y1="6" x2="3.01" y2="6" />
											<line x1="3" y1="12" x2="3.01" y2="12" />
											<line x1="3" y1="18" x2="3.01" y2="18" />
										</svg>
										List View
									</>
								) : (
									<>
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
											<circle cx="12" cy="12" r="3" />
										</svg>
										View All
									</>
								)}
							</button>
						)}
						<button
							type="button"
							onClick={() => setShowModal(true)}
							className="btn-primary flex items-center gap-2 w-fit! h-9 px-4 text-sm"
						>
							<span className="text-base leading-none">+</span>
							New Diagram
						</button>
					</div>
				</div>

				{error && (
					<div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
						<span className="font-medium">Firestore error:</span> {error}
					</div>
				)}

				{isLoading ? (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{[1, 2].map((n) => (
							<div
								key={n}
								className="glass-card h-18 animate-pulse bg-white/2"
							/>
						))}
					</div>
				) : diagrams.length === 0 ? (
					<div className="glass-card px-6 py-16 text-center">
						<div className="w-14 h-14 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center text-2xl mx-auto mb-4">
							📊
						</div>
						<p className="text-base font-medium text-zinc-200 mb-1">
							No diagrams yet
						</p>
						<p className="text-sm text-zinc-500">
							Click{' '}
							<button
								type="button"
								onClick={() => setShowModal(true)}
								className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
							>
								New Diagram
							</button>{' '}
							to create your first Mermaid diagram.
						</p>
					</div>
				) : viewAll ? (
					<div className="grid grid-cols-1 gap-6">
						{diagrams.map((diagram) => (
							<div key={diagram.id} className="glass-card p-6">
								<h2 className="text-sm font-medium text-zinc-300 mb-4">
									{diagram.name}
								</h2>
								<MermaidRenderer code={diagram.code} />
							</div>
						))}
					</div>
				) : (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{diagrams.map((diagram) => (
							<DiagramCard
								key={diagram.id}
								diagram={diagram}
								projectId={projectId}
								onDelete={deleteDiagram}
								onEdit={setEditTarget}
							/>
						))}
					</div>
				)}
			</main>

			{showModal && (
				<NewDiagramModal
					onClose={() => setShowModal(false)}
					onSave={(name, code) => createDiagram(name, code)}
				/>
			)}

			{showSVGConfirm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
					<div className="w-full max-w-sm rounded-xl border border-zinc-700/80 bg-zinc-900 p-6 shadow-2xl">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 ring-1 ring-violet-500/25 mb-4">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-violet-400"
								aria-hidden="true"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" y1="15" x2="12" y2="3" />
							</svg>
						</div>
						<h2 className="text-base font-semibold text-zinc-100 mb-1">
							Export all diagrams as SVG?
						</h2>
						<p className="text-sm text-zinc-500 mb-6">
							{diagrams.length}{' '}
							{diagrams.length === 1 ? 'file will be' : 'files will be'}{' '}
							downloaded to your computer.
						</p>
						<div className="flex items-center justify-end gap-2">
							<button
								type="button"
								onClick={() => setShowSVGConfirm(false)}
								className="rounded-lg border border-zinc-700/80 px-4 py-1.5 text-sm text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={exportAsSVG}
								className="btn-primary flex items-center gap-2 px-4 py-1.5 text-sm"
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
								Download {diagrams.length}{' '}
								{diagrams.length === 1 ? 'file' : 'files'}
							</button>
						</div>
					</div>
				</div>
			)}

			{editTarget && (
				<NewDiagramModal
					mode="edit"
					initialName={editTarget.name}
					initialCode={editTarget.code}
					onClose={() => setEditTarget(null)}
					onSave={(name, code) => updateDiagram(editTarget.id, name, code)}
				/>
			)}
		</div>
	);
}

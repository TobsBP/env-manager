'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import { DiagramCard } from '@/components/diagrams/DiagramCard';
import { NewDiagramModal } from '@/components/diagrams/NewDiagramModal';
import { useDiagrams } from '@/hooks/useDiagrams';
import { useProject } from '@/hooks/useProject';
import { useUser } from '@/hooks/useUser';
import { signOutAction } from '@/lib/auth/actions';
import type { Diagram } from '@/types/diagram';

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

	return (
		<div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
			<div className="page-orb w-[600px] h-[600px] bg-violet-700 -top-20 -right-20" />
			<div className="page-orb w-[400px] h-[400px] bg-indigo-700 bottom-10 -left-10" />

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
					<button
						type="button"
						onClick={() => setShowModal(true)}
						className="btn-primary flex items-center gap-2 !w-fit h-9 px-4 text-sm"
					>
						<span className="text-base leading-none">+</span>
						New Diagram
					</button>
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
								className="glass-card h-[72px] animate-pulse bg-white/[0.02]"
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

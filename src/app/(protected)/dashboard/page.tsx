'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NewProjectModal } from '@/components/projects/NewProjectModal';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { useProjects } from '@/hooks/useProjects';
import { useUser } from '@/hooks/useUser';
import { signOutAction } from '@/lib/auth/actions';

export default function DashboardPage() {
	const { user } = useUser();
	const {
		projects,
		isLoading,
		error,
		createProject,
		updateProject,
		deleteProject,
	} = useProjects();
	const [showModal, setShowModal] = useState(false);

	return (
		<div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
			{/* Subtle background orbs */}
			<div className="page-orb w-[700px] h-[700px] bg-violet-600 -top-40 -right-40" />
			<div className="page-orb w-[500px] h-[500px] bg-blue-700 bottom-0 -left-20" />

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
						<span className="hidden sm:block text-sm text-zinc-500">{user?.email}</span>
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

			{/* Main content */}
			<main className="relative mx-auto max-w-5xl px-6 py-12">
				<div className="mb-8 flex items-start justify-between">
					<div>
						<div className="flex items-center gap-3 mb-1">
							<h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
							{!isLoading && projects.length > 0 && (
								<span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-xs font-medium text-violet-300">
									{projects.length}
								</span>
							)}
						</div>
						<p className="text-zinc-500">
							Welcome back{user?.displayName ? `, ${user.displayName}` : ''}!
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Link
							href="/graph"
							className="flex h-9 items-center gap-2 rounded-lg border border-zinc-700/80 px-4 text-sm text-zinc-400 transition-all hover:border-violet-500/50 hover:text-violet-300 hover:bg-violet-500/5"
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
								<circle cx="5" cy="12" r="3" />
								<circle cx="19" cy="5" r="3" />
								<circle cx="19" cy="19" r="3" />
								<line x1="8" y1="11" x2="16" y2="6" />
								<line x1="8" y1="13" x2="16" y2="18" />
							</svg>
							Fluxo
						</Link>
						<button
							type="button"
							onClick={() => setShowModal(true)}
							className="btn-primary w-auto flex h-9 items-center gap-2 px-4 text-sm"
						>
							<span className="text-base leading-none">+</span>
							New Project
						</button>
					</div>
				</div>

				{error && (
					<div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
						{error}
					</div>
				)}

				{isLoading ? (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{[1, 2, 3].map((n) => (
							<div key={n} className="glass-card h-[72px] animate-pulse bg-white/[0.02]" />
						))}
					</div>
				) : projects.length === 0 ? (
					<div className="glass-card px-6 py-16 text-center">
						<div className="w-14 h-14 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center text-2xl mx-auto mb-4">
							📁
						</div>
						<p className="text-base font-medium text-zinc-200 mb-1">No projects yet</p>
						<p className="text-sm text-zinc-500">
							Click{' '}
							<button
								type="button"
								onClick={() => setShowModal(true)}
								className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
							>
								New Project
							</button>{' '}
							to get started.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{projects.map((project) => (
							<ProjectCard
								key={project.id}
								project={project}
								onUpdate={updateProject}
								onDelete={deleteProject}
							/>
						))}
					</div>
				)}
			</main>

			{showModal && (
				<NewProjectModal
					onClose={() => setShowModal(false)}
					onCreate={(name, emoji) => createProject(name, emoji)}
				/>
			)}
		</div>
	);
}

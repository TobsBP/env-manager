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
		<div className="min-h-screen bg-zinc-950 text-zinc-50">
			{/* Header */}
			<header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
				<div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-lg">
							🔐
						</div>
						<span className="font-semibold">Env Manager</span>
					</div>
					<div className="flex items-center gap-4">
						<span className="text-sm text-zinc-400">{user?.email}</span>
						<form action={signOutAction}>
							<button
								type="submit"
								className="rounded-lg border border-zinc-700 px-4 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-50"
							>
								Sign out
							</button>
						</form>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="mx-auto max-w-5xl px-6 py-12">
				<div className="mb-8 flex items-start justify-between">
					<div>
						<h1 className="text-3xl font-semibold">Projects</h1>
						<p className="mt-1 text-zinc-400">
							Welcome back{user?.displayName ? `, ${user.displayName}` : ''}!
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Link
							href="/graph"
							className="flex h-10 items-center gap-2 rounded-lg border border-zinc-700 px-5 text-sm text-zinc-300 transition-colors hover:border-violet-500 hover:text-violet-300"
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
							className="btn-primary w-auto flex h-10 items-center gap-2 px-5 text-sm"
						>
							<span className="text-lg leading-none">+</span>
							New Project
						</button>
					</div>
				</div>

				{error && (
					<div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
						{error}
					</div>
				)}

				{isLoading ? (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{[1, 2, 3].map((n) => (
							<div key={n} className="glass-card h-16 animate-pulse" />
						))}
					</div>
				) : projects.length === 0 ? (
					<div className="glass-card px-6 py-12 text-center text-zinc-400">
						<p className="text-4xl mb-3">📁</p>
						<p className="text-lg font-medium text-zinc-300">No projects yet</p>
						<p className="mt-1 text-sm">
							Click{' '}
							<button
								type="button"
								onClick={() => setShowModal(true)}
								className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
							>
								+ New Project
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

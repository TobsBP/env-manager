'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import { EnvironmentCard } from '@/components/projects/EnvironmentCard';
import { NewEnvironmentModal } from '@/components/projects/NewEnvironmentModal';
import { useEnvironments } from '@/hooks/useEnvironments';
import { useUser } from '@/hooks/useUser';
import { signOutAction } from '@/lib/auth/actions';

interface Props {
	params: Promise<{ projectId: string }>;
}

export default function ProjectPage({ params }: Props) {
	const { projectId } = use(params);
	const { user } = useUser();
	const { environments, isLoading, createEnvironment, deleteEnvironment } =
		useEnvironments(projectId);
	const [showModal, setShowModal] = useState(false);

	return (
		<div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
			{/* Subtle background orbs */}
			<div className="page-orb w-[600px] h-[600px] bg-violet-700 -top-20 -right-20" />
			<div className="page-orb w-[400px] h-[400px] bg-indigo-700 bottom-10 -left-10" />

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

			{/* Main content */}
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
					<span className="text-zinc-300">Environments</span>
				</div>

				<div className="mb-8 flex items-start justify-between">
					<div>
						<div className="flex items-center gap-3 mb-1">
							<h1 className="text-3xl font-semibold tracking-tight">
								Environments
							</h1>
							{!isLoading && environments.length > 0 && (
								<span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-xs font-medium text-violet-300">
									{environments.length}
								</span>
							)}
						</div>
						<p className="text-zinc-500">
							Manage the environments for this project.
						</p>
					</div>
					<button
						type="button"
						onClick={() => setShowModal(true)}
						className="btn-primary flex items-center gap-2 !w-fit h-9 px-4 text-sm"
					>
						<span className="text-base leading-none">+</span>
						New Environment
					</button>
				</div>

				{isLoading ? (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{[1, 2].map((n) => (
							<div
								key={n}
								className="glass-card h-[72px] animate-pulse bg-white/[0.02]"
							/>
						))}
					</div>
				) : environments.length === 0 ? (
					<div className="glass-card px-6 py-16 text-center">
						<div className="w-14 h-14 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center text-2xl mx-auto mb-4">
							🌍
						</div>
						<p className="text-base font-medium text-zinc-200 mb-1">
							No environments yet
						</p>
						<p className="text-sm text-zinc-500">
							Click{' '}
							<button
								type="button"
								onClick={() => setShowModal(true)}
								className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
							>
								New Environment
							</button>{' '}
							to add prod, dev, or staging.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{environments.map((env) => (
							<EnvironmentCard
								key={env.id}
								environment={env}
								projectId={projectId}
								onDelete={deleteEnvironment}
							/>
						))}
					</div>
				)}
			</main>

			{showModal && (
				<NewEnvironmentModal
					onClose={() => setShowModal(false)}
					onCreate={createEnvironment}
				/>
			)}
		</div>
	);
}

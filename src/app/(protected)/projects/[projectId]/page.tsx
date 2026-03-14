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
				{/* Breadcrumb */}
				<div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
					<Link
						href="/dashboard"
						className="hover:text-zinc-300 transition-colors"
					>
						Projects
					</Link>
					<span>/</span>
					<span className="text-zinc-300">Environments</span>
				</div>

				<div className="mb-8 flex items-start justify-between">
					<div>
						<h1 className="text-3xl font-semibold">Environments</h1>
						<p className="mt-1 text-zinc-400">
							Manage the environments for this project.
						</p>
					</div>
					<button
						type="button"
						onClick={() => setShowModal(true)}
						className="btn-primary flex items-center gap-2 !w-fit px-5 py-2.5 text-sm"
					>
						<span className="text-lg leading-none">+</span>
						New Environment
					</button>
				</div>

				{isLoading ? (
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{[1, 2].map((n) => (
							<div key={n} className="glass-card h-16 animate-pulse" />
						))}
					</div>
				) : environments.length === 0 ? (
					<div className="glass-card px-6 py-12 text-center text-zinc-400">
						<p className="text-4xl mb-3">🌍</p>
						<p className="text-lg font-medium text-zinc-300">
							No environments yet
						</p>
						<p className="mt-1 text-sm">
							Click{' '}
							<button
								type="button"
								onClick={() => setShowModal(true)}
								className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
							>
								+ New Environment
							</button>{' '}
							to add prod, dev, or homolog.
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

'use client';

import Link from 'next/link';
import { ProjectGraph } from '@/components/graph/ProjectGraph';
import { useUser } from '@/hooks/useUser';
import { signOutAction } from '@/lib/auth/actions';

export default function GraphPage() {
	const { user } = useUser();

	return (
		<div className="flex h-screen flex-col bg-zinc-950 text-zinc-50">
			{/* Header */}
			<header className="border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md shrink-0">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 ring-1 ring-violet-500/30 text-base">
								🔐
							</div>
							<span className="font-semibold tracking-tight">Env Manager</span>
						</div>
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-zinc-700"
							aria-hidden="true"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
						<Link
							href="/dashboard"
							className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
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
							className="text-zinc-700"
							aria-hidden="true"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
						<span className="text-sm text-zinc-200">Dependency Graph</span>
					</div>
					<div className="flex items-center gap-4">
						<span className="hidden text-xs text-zinc-600 sm:block">
							Hover an arrow to delete it
						</span>
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

			{/* Graph canvas — fills remaining height */}
			<main className="flex-1 overflow-hidden">
				<ProjectGraph />
			</main>
		</div>
	);
}

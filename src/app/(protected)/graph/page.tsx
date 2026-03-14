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
			<header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm shrink-0">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-lg">
								🔐
							</div>
							<span className="font-semibold">Env Manager</span>
						</div>
						<span className="text-zinc-600">/</span>
						<Link
							href="/dashboard"
							className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
						>
							Projects
						</Link>
						<span className="text-zinc-600">/</span>
						<span className="text-sm text-zinc-200">Dependency Graph</span>
					</div>
					<div className="flex items-center gap-4">
						<span className="hidden text-sm text-zinc-500 sm:block">
							Hover an arrow to delete it
						</span>
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

			{/* Graph canvas — fills remaining height */}
			<main className="flex-1 overflow-hidden">
				<ProjectGraph />
			</main>
		</div>
	);
}

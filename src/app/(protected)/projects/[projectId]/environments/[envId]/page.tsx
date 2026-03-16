'use client';

import Link from 'next/link';
import { use, useCallback, useState } from 'react';
import { AddVariableForm } from '@/components/variables/AddVariableForm';
import { VariableRow } from '@/components/variables/VariableRow';
import { useUser } from '@/hooks/useUser';
import { useVariables } from '@/hooks/useVariables';
import { signOutAction } from '@/lib/auth/actions';

interface Props {
	params: Promise<{ projectId: string; envId: string }>;
}

export default function EnvironmentPage({ params }: Props) {
	const { projectId, envId } = use(params);
	const { user } = useUser();
	const {
		variables,
		isLoading,
		error,
		createVariable,
		updateVariable,
		deleteVariable,
	} = useVariables(projectId, envId);
	const [copied, setCopied] = useState(false);

	const copyAll = useCallback(async () => {
		const text = variables.map((v) => `${v.key}=${v.value}`).join('\n');
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [variables]);

	return (
		<div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
			{/* Subtle background orbs */}
			<div className="page-orb w-[500px] h-[500px] bg-violet-700 -top-20 -right-10" />
			<div className="page-orb w-[400px] h-[400px] bg-blue-800 bottom-0 left-20" />

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
				{/* Breadcrumb */}
				<div className="mb-6 flex items-center gap-1.5 text-sm text-zinc-600">
					<Link
						href="/dashboard"
						className="hover:text-zinc-300 transition-colors"
					>
						Projects
					</Link>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
						<path d="M9 18l6-6-6-6" />
					</svg>
					<Link
						href={`/projects/${projectId}`}
						className="hover:text-zinc-300 transition-colors"
					>
						Environments
					</Link>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
						<path d="M9 18l6-6-6-6" />
					</svg>
					<span className="text-zinc-300">Variables</span>
				</div>

				<div className="mb-8 flex items-start justify-between">
					<div>
						<div className="flex items-center gap-3 mb-1">
							<h1 className="text-3xl font-semibold tracking-tight">Variables</h1>
							{!isLoading && variables.length > 0 && (
								<span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-xs font-medium text-violet-300">
									{variables.length}
								</span>
							)}
						</div>
						<p className="text-zinc-500">
							Values are masked by default.
						</p>
					</div>
					{variables.length > 0 && (
						<button
							type="button"
							onClick={copyAll}
							className="flex h-9 items-center gap-2 rounded-lg border border-zinc-700/80 px-4 text-sm text-zinc-400 transition-all hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5"
						>
							{copied ? (
								<>
									<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
										<polyline points="20 6 9 17 4 12" />
									</svg>
									Copied!
								</>
							) : (
								<>
									<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
										<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
										<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
									</svg>
									Copy .env
								</>
							)}
						</button>
					)}
				</div>

				{error && (
					<div className="mb-4 rounded-xl bg-red-500/8 border border-red-500/20 px-4 py-3 text-sm text-red-400">
						{error}
					</div>
				)}

				{/* Add variable form */}
				<div className="mb-4">
					<AddVariableForm onCreate={createVariable} />
				</div>

				{/* Variable list */}
				{isLoading ? (
					<div className="flex flex-col gap-2">
						{[1, 2, 3].map((n) => (
							<div key={n} className="glass-card h-12 animate-pulse bg-white/[0.02]" />
						))}
					</div>
				) : variables.length === 0 ? (
					<div className="glass-card px-6 py-16 text-center">
						<div className="w-14 h-14 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center text-2xl mx-auto mb-4">
							🔑
						</div>
						<p className="text-base font-medium text-zinc-200 mb-1">
							No variables yet
						</p>
						<p className="text-sm text-zinc-500">
							Add your first variable using the form above.
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{variables.map((variable) => (
							<VariableRow
								key={variable.id}
								variable={variable}
								onUpdate={updateVariable}
								onDelete={deleteVariable}
							/>
						))}
					</div>
				)}
			</main>
		</div>
	);
}

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
					<Link
						href={`/projects/${projectId}`}
						className="hover:text-zinc-300 transition-colors"
					>
						Environments
					</Link>
					<span>/</span>
					<span className="text-zinc-300">Variables</span>
				</div>

				<div className="mb-8 flex items-start justify-between">
					<div>
						<h1 className="text-3xl font-semibold">Variables</h1>
						<p className="mt-1 text-zinc-400">
							Manage environment variables. Values are masked by default.
						</p>
					</div>
					{variables.length > 0 && (
						<button
							type="button"
							onClick={copyAll}
							className="flex h-10 items-center gap-2 rounded-lg border border-zinc-700 px-4 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-50"
						>
							{copied ? '✓ Copied!' : '📋 Copy .env'}
						</button>
					)}
				</div>

				{error && (
					<div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
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
							<div key={n} className="glass-card h-12 animate-pulse" />
						))}
					</div>
				) : variables.length === 0 ? (
					<div className="glass-card px-6 py-12 text-center text-zinc-400">
						<p className="text-4xl mb-3">🔑</p>
						<p className="text-lg font-medium text-zinc-300">
							No variables yet
						</p>
						<p className="mt-1 text-sm">
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

'use client';

import Link from 'next/link';
import { use, useCallback, useEffect, useState } from 'react';
import { AddVariableForm } from '@/components/variables/AddVariableForm';
import { VariableRow } from '@/components/variables/VariableRow';
import { useEnvironment } from '@/hooks/useEnvironment';
import { useUser } from '@/hooks/useUser';
import { useVariables } from '@/hooks/useVariables';
import { signOutAction } from '@/lib/auth/actions';
import {
	deployToEasypanelAction,
	updateEnvironmentEasypanelAction,
} from '@/lib/projects/actions';

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
	const { environment } = useEnvironment(projectId, envId);
	const [copied, setCopied] = useState(false);

	// EasyPanel state
	const [epOpen, setEpOpen] = useState(false);
	const [epUrl, setEpUrl] = useState('');
	const [epToken, setEpToken] = useState('');
	const [epService, setEpService] = useState('');
	const [epSaving, setEpSaving] = useState(false);
	const [epSaveMsg, setEpSaveMsg] = useState<string | null>(null);
	const [epDeploying, setEpDeploying] = useState(false);
	const [epDeployResult, setEpDeployResult] = useState<{
		ok: boolean;
		msg: string;
	} | null>(null);

	useEffect(() => {
		if (environment) {
			setEpUrl(environment.easypanelUrl ?? '');
			setEpToken(environment.easypanelToken ?? '');
			setEpService(environment.easypanelServiceName ?? '');
		}
	}, [environment]);

	const saveEpConfig = useCallback(async () => {
		setEpSaving(true);
		setEpSaveMsg(null);
		const result = await updateEnvironmentEasypanelAction(projectId, envId, {
			easypanelUrl: epUrl,
			easypanelToken: epToken,
			easypanelServiceName: epService,
		});
		setEpSaving(false);
		setEpSaveMsg(result.success ? 'Saved!' : (result.error ?? 'Error'));
		setTimeout(() => setEpSaveMsg(null), 3000);
	}, [projectId, envId, epUrl, epToken, epService]);

	const deploy = useCallback(async () => {
		setEpDeploying(true);
		setEpDeployResult(null);
		const result = await deployToEasypanelAction(projectId, envId);
		setEpDeploying(false);
		setEpDeployResult({
			ok: result.success,
			msg: result.success ? 'Deployed!' : (result.error ?? 'Deploy failed'),
		});
		setTimeout(() => setEpDeployResult(null), 5000);
	}, [projectId, envId]);

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
					<Link
						href={`/projects/${projectId}`}
						className="hover:text-zinc-300 transition-colors"
					>
						Environments
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
					<span className="text-zinc-300">Variables</span>
				</div>

				<div className="mb-8 flex items-start justify-between">
					<div>
						<div className="flex items-center gap-3 mb-1">
							<h1 className="text-3xl font-semibold tracking-tight">
								Variables
							</h1>
							{!isLoading && variables.length > 0 && (
								<span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-xs font-medium text-violet-300">
									{variables.length}
								</span>
							)}
						</div>
						<p className="text-zinc-500">Values are masked by default.</p>
					</div>
					{variables.length > 0 && (
						<button
							type="button"
							onClick={copyAll}
							className="flex h-9 items-center gap-2 rounded-lg border border-zinc-700/80 px-4 text-sm text-zinc-400 transition-all hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5"
						>
							{copied ? (
								<>
									<svg
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<polyline points="20 6 9 17 4 12" />
									</svg>
									Copied!
								</>
							) : (
								<>
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
										<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
										<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
									</svg>
									Copy .env
								</>
							)}
						</button>
					)}
				</div>

				{/* EasyPanel Integration */}
				<div className="mb-6 rounded-xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden">
					<button
						type="button"
						onClick={() => setEpOpen((v) => !v)}
						className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-zinc-800/30 transition-colors"
					>
						<div className="flex items-center gap-3">
							<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 ring-1 ring-violet-500/25 text-sm">
								🚀
							</div>
							<span className="text-sm font-medium text-zinc-200">
								EasyPanel Integration
							</span>
							{environment?.easypanelServiceName && (
								<span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-xs text-emerald-400">
									{environment.easypanelServiceName}
								</span>
							)}
						</div>
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
							className={`text-zinc-500 transition-transform ${epOpen ? 'rotate-180' : ''}`}
						>
							<path d="M6 9l6 6 6-6" />
						</svg>
					</button>

					{epOpen && (
						<div className="border-t border-zinc-800/80 px-5 py-5 flex flex-col gap-4">
							<div className="grid gap-3 sm:grid-cols-3">
								<div className="flex flex-col gap-1.5">
									<label className="text-xs text-zinc-500" htmlFor="ep-url">
										EasyPanel URL
									</label>
									<input
										id="ep-url"
										type="url"
										value={epUrl}
										onChange={(e) => setEpUrl(e.target.value)}
										placeholder="https://panel.myserver.com"
										className="rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
									/>
								</div>
								<div className="flex flex-col gap-1.5">
									<label className="text-xs text-zinc-500" htmlFor="ep-token">
										API Token
									</label>
									<input
										id="ep-token"
										type="password"
										value={epToken}
										onChange={(e) => setEpToken(e.target.value)}
										placeholder="••••••••"
										className="rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
									/>
								</div>
								<div className="flex flex-col gap-1.5">
									<label
										className="text-xs text-zinc-500"
										htmlFor="ep-service"
									>
										Service / Project Name
									</label>
									<input
										id="ep-service"
										type="text"
										value={epService}
										onChange={(e) => setEpService(e.target.value)}
										placeholder="my-service"
										className="rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
									/>
								</div>
							</div>

							<div className="flex items-center gap-3 flex-wrap">
								<button
									type="button"
									onClick={saveEpConfig}
									disabled={epSaving}
									className="flex h-8 items-center gap-2 rounded-lg border border-zinc-700/80 px-4 text-xs text-zinc-300 transition-all hover:border-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/50 disabled:opacity-50"
								>
									{epSaving ? 'Saving…' : 'Save config'}
								</button>

								<button
									type="button"
									onClick={deploy}
									disabled={epDeploying}
									className="flex h-8 items-center gap-2 rounded-lg bg-violet-600 px-4 text-xs font-medium text-white transition-all hover:bg-violet-500 disabled:opacity-50"
								>
									{epDeploying ? (
										<>
											<svg
												className="animate-spin"
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2.5"
												aria-hidden="true"
											>
												<path d="M21 12a9 9 0 1 1-6.219-8.56" />
											</svg>
											Deploying…
										</>
									) : (
										<>
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
												<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
												<path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
												<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
												<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
											</svg>
											Deploy
										</>
									)}
								</button>

								{epSaveMsg && (
									<span
										className={`text-xs ${epSaveMsg === 'Saved!' ? 'text-emerald-400' : 'text-red-400'}`}
									>
										{epSaveMsg}
									</span>
								)}

								{epDeployResult && (
									<span
										className={`text-xs ${epDeployResult.ok ? 'text-emerald-400' : 'text-red-400'}`}
									>
										{epDeployResult.msg}
									</span>
								)}
							</div>
						</div>
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
							<div
								key={n}
								className="glass-card h-12 animate-pulse bg-white/[0.02]"
							/>
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

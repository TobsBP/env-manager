'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import { EnvDiff } from '@/components/projects/EnvDiff';
import { useEnvironments } from '@/hooks/useEnvironments';
import { useUser } from '@/hooks/useUser';
import { signOutAction } from '@/lib/auth/actions';
import type { Environment } from '@/types/project';

interface Props {
	params: Promise<{ projectId: string }>;
}

const ENV_DOT: Record<string, string> = {
	prod: 'bg-red-400',
	production: 'bg-red-400',
	dev: 'bg-emerald-400',
	development: 'bg-emerald-400',
	homolog: 'bg-amber-400',
	staging: 'bg-amber-400',
};

interface EnvPickerProps {
	label: string;
	value: string;
	onChange: (id: string) => void;
	environments: Environment[];
	disabledId: string;
	isLoading: boolean;
}

function EnvPicker({
	label,
	value,
	onChange,
	environments,
	disabledId,
	isLoading,
}: EnvPickerProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const selected = environments.find((e) => e.id === value);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node))
				setOpen(false);
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, []);

	return (
		<div ref={ref} className="relative flex-1">
			<button
				type="button"
				onClick={() => !isLoading && setOpen((o) => !o)}
				disabled={isLoading}
				className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm transition-all
					${open ? 'border-violet-500/60 bg-zinc-900 ring-2 ring-violet-500/15' : 'border-white/10 bg-zinc-900/60 hover:border-white/20 hover:bg-zinc-900'}
					disabled:opacity-50 disabled:cursor-not-allowed`}
			>
				<span className="flex items-center gap-2.5 min-w-0">
					{selected ? (
						<>
							<span
								className={`w-2 h-2 rounded-full shrink-0 ${ENV_DOT[selected.name.toLowerCase()] ?? 'bg-zinc-400'}`}
							/>
							<span className="font-medium text-zinc-100 truncate">
								{selected.name}
							</span>
						</>
					) : (
						<span className="text-zinc-500">{label}</span>
					)}
				</span>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className={`text-zinc-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
					aria-hidden="true"
				>
					<path d="M6 9l6 6 6-6" />
				</svg>
			</button>

			{open && (
				<div className="absolute z-20 mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-900 shadow-xl shadow-black/40 overflow-hidden">
					{environments.length === 0 && (
						<p className="px-4 py-3 text-sm text-zinc-500">No environments</p>
					)}
					{environments.map((env) => {
						const dot = ENV_DOT[env.name.toLowerCase()] ?? 'bg-zinc-400';
						const isDisabled = env.id === disabledId;
						const isSelected = env.id === value;
						return (
							<button
								key={env.id}
								type="button"
								disabled={isDisabled}
								onClick={() => {
									onChange(env.id);
									setOpen(false);
								}}
								className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors
									${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 cursor-pointer'}
									${isSelected ? 'text-violet-300 bg-violet-500/10' : 'text-zinc-200'}`}
							>
								<span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
								{env.name}
								{isSelected && (
									<svg
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="ml-auto text-violet-400"
										aria-hidden="true"
									>
										<polyline points="20 6 9 17 4 12" />
									</svg>
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default function DiffPage({ params }: Props) {
	const { projectId } = use(params);
	const { user } = useUser();
	const { environments, isLoading } = useEnvironments(projectId);
	const searchParams = useSearchParams();

	const [envAId, setEnvAId] = useState(searchParams.get('a') ?? '');
	const [envBId, setEnvBId] = useState(searchParams.get('b') ?? '');

	const envA = environments.find((e) => e.id === envAId);
	const envB = environments.find((e) => e.id === envBId);

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
					<span className="text-zinc-300">Compare</span>
				</div>

				<div className="mb-8">
					<h1 className="text-3xl font-semibold tracking-tight mb-1">
						Compare Environments
					</h1>
					<p className="text-zinc-500">
						Select two environments to see a variable diff.
					</p>
				</div>

				<div className="flex items-center gap-3 mb-8">
					<EnvPicker
						label="Select environment A…"
						value={envAId}
						onChange={setEnvAId}
						environments={environments}
						disabledId={envBId}
						isLoading={isLoading}
					/>

					<div className="shrink-0 w-8 h-8 rounded-lg bg-zinc-800/80 ring-1 ring-white/8 flex items-center justify-center">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-zinc-500"
							aria-hidden="true"
						>
							<path d="M18 8l4 4-4 4" />
							<path d="M6 16l-4-4 4-4" />
							<line x1="2" y1="12" x2="22" y2="12" />
						</svg>
					</div>

					<EnvPicker
						label="Select environment B…"
						value={envBId}
						onChange={setEnvBId}
						environments={environments}
						disabledId={envAId}
						isLoading={isLoading}
					/>
				</div>

				{envA && envB ? (
					<EnvDiff
						projectId={projectId}
						envAId={envA.id}
						envAName={envA.name}
						envBId={envB.id}
						envBName={envB.name}
					/>
				) : (
					<div className="glass-card px-6 py-16 text-center">
						<div className="w-14 h-14 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center text-2xl mx-auto mb-4">
							⚡
						</div>
						<p className="text-base font-medium text-zinc-200 mb-1">
							Select two environments
						</p>
						<p className="text-sm text-zinc-500">
							Choose environments A and B above to see the diff.
						</p>
					</div>
				)}
			</main>
		</div>
	);
}

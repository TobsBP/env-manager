'use client';

import { useState } from 'react';
import type { AuthResult } from '@/types/auth';

const PRESET_ENVS = ['prod', 'dev', 'homolog'];

interface Props {
	onClose: () => void;
	onCreate: (name: string) => Promise<AuthResult>;
}

export function NewEnvironmentModal({ onClose, onCreate }: Props) {
	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleCreate(envName: string) {
		const trimmed = envName.trim();
		if (!trimmed || isLoading) return;

		setIsLoading(true);
		setError(null);

		const result = await onCreate(trimmed);
		setIsLoading(false);

		if (result.success) {
			onClose();
		} else {
			setError(result.error);
		}
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop closes on click/Escape
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
			onClick={(e) => e.target === e.currentTarget && onClose()}
			onKeyDown={(e) => e.key === 'Escape' && onClose()}
		>
			<div className="glass-card w-full max-w-md mx-4 p-6">
				<h2 className="text-xl font-semibold mb-1">New Environment</h2>
				<p className="text-sm text-zinc-400 mb-5">
					Choose a preset or enter a custom environment name.
				</p>

				<div className="flex gap-2 mb-5">
					{PRESET_ENVS.map((env) => (
						<button
							key={env}
							type="button"
							onClick={() => handleCreate(env)}
							disabled={isLoading}
							className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:border-violet-500 hover:text-violet-300 transition-colors disabled:opacity-50"
						>
							{env}
						</button>
					))}
				</div>

				<div className="flex gap-2">
					<input
						className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition disabled:opacity-50"
						placeholder="Custom name…"
						value={name}
						onChange={(e) => setName(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleCreate(name)}
						disabled={isLoading}
					/>
					<button
						type="button"
						onClick={() => handleCreate(name)}
						disabled={isLoading || !name.trim()}
						className="btn-primary shrink-0 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
						style={{ width: 'auto' }}
					>
						Add
					</button>
				</div>

				{error && <p className="text-sm text-red-400 mt-3">{error}</p>}

				<button
					type="button"
					onClick={onClose}
					className="mt-4 text-sm text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
				>
					Cancel
				</button>
			</div>
		</div>
	);
}

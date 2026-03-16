'use client';

import { useState } from 'react';
import type { AuthResult } from '@/types/auth';

interface Props {
	envName: string;
	onClose: () => void;
	onClone: (newName: string) => Promise<AuthResult>;
}

export function CloneEnvironmentModal({ envName, onClose, onClone }: Props) {
	const [name, setName] = useState(`Copy of ${envName}`);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleClone() {
		const trimmed = name.trim();
		if (!trimmed || isLoading) return;

		setIsLoading(true);
		setError(null);

		const result = await onClone(trimmed);
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
				<h2 className="text-xl font-semibold mb-1">Clone Environment</h2>
				<p className="text-sm text-zinc-400 mb-5">
					Enter a name for the cloned environment. All variables will be copied.
				</p>

				<div className="flex gap-2">
					<input
						className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition disabled:opacity-50"
						placeholder="Environment name…"
						value={name}
						onChange={(e) => setName(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleClone()}
						disabled={isLoading}
						autoFocus
					/>
					<button
						type="button"
						onClick={handleClone}
						disabled={isLoading || !name.trim()}
						className="btn-primary shrink-0 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
						style={{ width: 'auto' }}
					>
						{isLoading ? 'Cloning…' : 'Clone'}
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

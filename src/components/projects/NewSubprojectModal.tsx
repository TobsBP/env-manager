'use client';

import { useState } from 'react';
import type { AuthResult } from '@/types/auth';
import { EMOJI_OPTIONS } from '@/utils/consts/emoji';

interface Props {
	onClose: () => void;
	onCreate: (name: string, emoji: string) => Promise<AuthResult>;
}

export function NewSubprojectModal({ onClose, onCreate }: Props) {
	const [name, setName] = useState('');
	const [emoji, setEmoji] = useState('📦');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.ChangeEvent) {
		e.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) return;

		setIsLoading(true);
		setError(null);

		const result = await onCreate(trimmed, emoji);
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
				<h2 className="text-xl font-semibold mb-1">New Subproject</h2>
				<p className="text-sm text-zinc-400 mb-5">
					Give your subproject a name and icon.
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Emoji picker */}
					<div>
						<p className="text-xs text-zinc-500 mb-2">Icon</p>
						<div className="grid grid-cols-8 gap-1">
							{EMOJI_OPTIONS.map((e) => (
								<button
									key={e}
									type="button"
									onClick={() => setEmoji(e)}
									className={`flex h-9 w-9 items-center justify-center rounded-lg text-xl transition-colors ${
										emoji === e
											? 'bg-violet-500/30 ring-1 ring-violet-500'
											: 'hover:bg-zinc-700/50'
									}`}
								>
									{e}
								</button>
							))}
						</div>
					</div>

					{/* Name input */}
					<input
						className="auth-input w-full"
						placeholder="e.g. Backend, Frontend, Worker..."
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={isLoading}
					/>

					{error && <p className="text-sm text-red-400">{error}</p>}

					<div className="flex gap-3 justify-end pt-1">
						<button
							type="button"
							onClick={onClose}
							className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading || !name.trim()}
							className="btn-primary w-auto px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? 'Creating…' : 'Create'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

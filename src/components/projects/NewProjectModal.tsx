'use client';

import { useState } from 'react';
import type { AuthResult } from '@/types/auth';
import type { ProjectType } from '@/types/project';
import { EMOJI_OPTIONS } from '@/utils/consts/emoji';
import { PROJECT_TYPES } from '@/utils/consts/project';

interface Props {
	onClose: () => void;
	onCreate: (
		name: string,
		emoji: string,
		projectType: ProjectType,
	) => Promise<AuthResult>;
}

export function NewProjectModal({ onClose, onCreate }: Props) {
	const [name, setName] = useState('');
	const [emoji, setEmoji] = useState('📁');
	const [projectType, setProjectType] = useState<ProjectType>('single');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) return;

		setIsLoading(true);
		setError(null);

		const result = await onCreate(trimmed, emoji, projectType);
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
				<h2 className="text-xl font-semibold mb-1">New Project</h2>
				<p className="text-sm text-zinc-400 mb-5">
					Give your project a name and icon.
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
						placeholder="e.g. My API, Frontend, Backend..."
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={isLoading}
					/>

					{/* Project type selector */}
					<div>
						<p className="text-xs text-zinc-500 mb-2">Tipo de projeto</p>
						<div className="grid grid-cols-3 gap-2">
							{PROJECT_TYPES.map((type) => (
								<button
									key={type.value}
									type="button"
									onClick={() => setProjectType(type.value)}
									className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-center transition-colors ${
										projectType === type.value
											? 'border-violet-500 bg-violet-500/10 text-zinc-100'
											: 'border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200'
									}`}
								>
									<span className="text-xl">{type.icon}</span>
									<span className="text-xs font-medium">{type.label}</span>
									<span className="text-[10px] leading-tight text-zinc-500 hidden sm:block">
										{type.description}
									</span>
								</button>
							))}
						</div>
					</div>

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

'use client';

import { useRef, useState } from 'react';
import type { AuthResult } from '@/types/auth';
import { MermaidRenderer } from './MermaidRenderer';

interface Props {
	onClose: () => void;
	onSave: (name: string, code: string) => Promise<AuthResult>;
	initialName?: string;
	initialCode?: string;
	mode?: 'create' | 'edit';
}

export function NewDiagramModal({
	onClose,
	onSave,
	initialName = '',
	initialCode = '',
	mode = 'create',
}: Props) {
	const [name, setName] = useState(initialName);
	const [code, setCode] = useState(initialCode);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPreview, setShowPreview] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	async function handleSave() {
		const trimmedName = name.trim();
		const trimmedCode = code.trim();
		if (!trimmedName || !trimmedCode || isLoading) return;

		setIsLoading(true);
		setError(null);

		const result = await onSave(trimmedName, trimmedCode);
		setIsLoading(false);

		if (result.success) {
			onClose();
		} else {
			setError(result.error);
		}
	}

	function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			const text = ev.target?.result;
			if (typeof text === 'string') setCode(text);
		};
		reader.readAsText(file);
		// Reset input so same file can be re-selected
		e.target.value = '';
	}

	const title = mode === 'edit' ? 'Edit Diagram' : 'New Diagram';
	const saveLabel = mode === 'edit' ? 'Save' : 'Create';

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop closes on click/Escape
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
			onClick={(e) => e.target === e.currentTarget && onClose()}
			onKeyDown={(e) => e.key === 'Escape' && onClose()}
		>
			<div className="glass-card w-full max-w-2xl mx-4 p-6 flex flex-col gap-4">
				<div>
					<h2 className="text-xl font-semibold mb-1">{title}</h2>
					<p className="text-sm text-zinc-400">
						Enter a name and Mermaid diagram code.
					</p>
				</div>

				<input
					className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition disabled:opacity-50"
					placeholder="Diagram name…"
					value={name}
					onChange={(e) => setName(e.target.value)}
					disabled={isLoading}
					maxLength={50}
				/>

				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<label
							htmlFor=""
							className="text-xs text-zinc-500 uppercase tracking-wider"
						>
							Mermaid code
						</label>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								disabled={isLoading}
								className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-50"
							>
								Import file
							</button>
							<input
								ref={fileInputRef}
								type="file"
								accept=".mmd,.md,.txt"
								className="hidden"
								onChange={handleFileImport}
							/>
							<button
								type="button"
								onClick={() => setShowPreview(true)}
								disabled={!code.trim()}
								className="text-xs px-3 py-1.5 rounded-lg border border-violet-700/60 text-violet-400 hover:border-violet-500 hover:text-violet-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Preview
							</button>
						</div>
					</div>
					<textarea
						className="w-full min-h-50 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition disabled:opacity-50 font-mono resize-y"
						placeholder={'graph TD\n  A[Start] --> B[End]'}
						value={code}
						onChange={(e) => setCode(e.target.value)}
						disabled={isLoading}
					/>
				</div>

				{error && <p className="text-sm text-red-400">{error}</p>}

				<div className="flex items-center justify-between pt-1">
					<button
						type="button"
						onClick={onClose}
						className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSave}
						disabled={isLoading || !name.trim() || !code.trim()}
						className="btn-primary w-fit! px-5 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? 'Saving…' : saveLabel}
					</button>
				</div>
			</div>

			{showPreview && (
				// biome-ignore lint/a11y/noStaticElementInteractions: nested preview modal
				<div
					className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm"
					onClick={(e) => e.target === e.currentTarget && setShowPreview(false)}
					onKeyDown={(e) => e.key === 'Escape' && setShowPreview(false)}
				>
					<div className="glass-card w-full max-w-3xl mx-4 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold">Preview</h3>
							<button
								type="button"
								onClick={() => setShowPreview(false)}
								className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
							>
								Close
							</button>
						</div>
						<div className="overflow-auto">
							<MermaidRenderer code={code} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

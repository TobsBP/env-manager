'use client';

import { useState } from 'react';
import type { MutationResult } from '@/types/auth';
import type { EnvVariable } from '@/types/variable';

interface Props {
	variable: EnvVariable;
	onUpdate: (id: string, key: string, value: string) => Promise<MutationResult>;
	onDelete: (id: string) => Promise<MutationResult>;
}

export function VariableRow({ variable, onUpdate, onDelete }: Props) {
	const [visible, setVisible] = useState(false);
	const [editing, setEditing] = useState(false);
	const [editKey, setEditKey] = useState(variable.key);
	const [editValue, setEditValue] = useState(variable.value);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function startEdit() {
		setEditKey(variable.key);
		setEditValue(variable.value);
		setError(null);
		setEditing(true);
	}

	function cancelEdit() {
		setEditing(false);
		setError(null);
	}

	async function handleSave() {
		setIsSaving(true);
		setError(null);
		const result = await onUpdate(variable.id, editKey.trim(), editValue);
		setIsSaving(false);
		if (result.success) {
			setEditing(false);
		} else {
			setError(result.error ?? 'Failed to update');
		}
	}

	async function handleDelete() {
		await onDelete(variable.id);
	}

	const inputClass =
		'flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-mono text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition';

	if (editing) {
		return (
			<div className="glass-card px-4 py-3 flex flex-col gap-2">
				{error && <p className="text-xs text-red-400">{error}</p>}
				<div className="flex items-center gap-2">
					<input
						type="text"
						value={editKey}
						onChange={(e) => setEditKey(e.target.value.toUpperCase())}
						className={inputClass}
						placeholder="KEY"
						disabled={isSaving}
						autoComplete="off"
						spellCheck={false}
					/>
					<span className="text-zinc-500 text-sm shrink-0">=</span>
					<input
						type="text"
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
						className={inputClass}
						placeholder="VALUE"
						disabled={isSaving}
						autoComplete="off"
						spellCheck={false}
					/>
					<button
						type="button"
						onClick={handleSave}
						disabled={isSaving}
						className="btn-primary shrink-0 px-3 py-1.5 text-sm disabled:opacity-50"
						style={{ width: 'auto' }}
					>
						{isSaving ? '…' : 'Save'}
					</button>
					<button
						type="button"
						onClick={cancelEdit}
						disabled={isSaving}
						className="shrink-0 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="glass-card px-4 py-3 flex items-center gap-3 group hover:border-white/12 transition-all">
			<span className="font-mono text-sm text-violet-300 w-2/5 truncate shrink-0">
				{variable.key}
			</span>
			<span className="text-zinc-700 text-xs font-medium shrink-0">=</span>
			<span
				className={`font-mono text-sm flex-1 truncate transition-colors ${visible ? 'text-zinc-300' : 'text-zinc-600 tracking-widest text-xs'}`}
			>
				{visible ? variable.value : '••••••••'}
			</span>
			<div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					type="button"
					onClick={() => setVisible((v) => !v)}
					className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-md transition-all"
					aria-label={visible ? 'Hide value' : 'Show value'}
					title={visible ? 'Hide value' : 'Show value'}
				>
					{visible ? (
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
							<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
							<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
							<line x1="1" y1="1" x2="23" y2="23" />
						</svg>
					) : (
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
							<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
							<circle cx="12" cy="12" r="3" />
						</svg>
					)}
				</button>
				<button
					type="button"
					onClick={startEdit}
					className="p-1.5 text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-md transition-all"
					aria-label="Edit variable"
					title="Edit"
				>
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
						<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
						<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
					</svg>
				</button>
				<button
					type="button"
					onClick={handleDelete}
					className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
					aria-label="Delete variable"
					title="Delete"
				>
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
						<polyline points="3 6 5 6 21 6" />
						<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
						<path d="M10 11v6M14 11v6" />
						<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
					</svg>
				</button>
			</div>
		</div>
	);
}

'use client';

import { useState } from 'react';
import type { EnvVariable } from '@/types/variable';

interface Props {
	variable: EnvVariable;
	onUpdate: (
		id: string,
		key: string,
		value: string,
	) => Promise<{ success: boolean; error?: string }>;
	onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
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
		<div className="glass-card px-4 py-3 flex items-center gap-3">
			<span className="font-mono text-sm text-violet-300 flex-1 truncate">
				{variable.key}
			</span>
			<span className="text-zinc-600 text-sm">=</span>
			<span className="font-mono text-sm text-zinc-300 flex-1 truncate">
				{visible ? variable.value : '••••••••'}
			</span>
			<div className="flex items-center gap-1 shrink-0">
				<button
					type="button"
					onClick={() => setVisible((v) => !v)}
					className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
					aria-label={visible ? 'Hide value' : 'Show value'}
					title={visible ? 'Hide value' : 'Show value'}
				>
					{visible ? '🙈' : '👁'}
				</button>
				<button
					type="button"
					onClick={startEdit}
					className="p-1.5 text-zinc-500 hover:text-violet-400 transition-colors text-sm"
					aria-label="Edit variable"
					title="Edit"
				>
					✏️
				</button>
				<button
					type="button"
					onClick={handleDelete}
					className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
					aria-label="Delete variable"
					title="Delete"
				>
					✕
				</button>
			</div>
		</div>
	);
}

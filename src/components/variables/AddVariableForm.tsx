'use client';

import { useRef, useState } from 'react';

type Mode = 'single' | 'paste' | 'upload';

interface Props {
	onCreate: (
		key: string,
		value: string,
	) => Promise<{ success: boolean; error?: string }>;
}

function parseEnvText(text: string): Array<{ key: string; value: string }> {
	return text
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('#'))
		.flatMap((line) => {
			const idx = line.indexOf('=');
			if (idx < 1) return [];
			const key = line.slice(0, idx).trim().toUpperCase();
			const raw = line.slice(idx + 1).trim();
			// Strip surrounding quotes if present
			const value = raw.replace(/^(['"])(.*)\1$/, '$2');
			if (!key || value === '') return [];
			return [{ key, value }];
		});
}

export function AddVariableForm({ onCreate }: Props) {
	const [mode, setMode] = useState<Mode>('single');

	// Single mode
	const [key, setKey] = useState('');
	const [value, setValue] = useState('');
	const [singleLoading, setSingleLoading] = useState(false);
	const [singleError, setSingleError] = useState<string | null>(null);

	// Paste / upload mode
	const [bulkText, setBulkText] = useState('');
	const [bulkLoading, setBulkLoading] = useState(false);
	const [bulkError, setBulkError] = useState<string | null>(null);
	const [bulkSuccess, setBulkSuccess] = useState<string | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	async function handleSingle(e: React.FormEvent) {
		e.preventDefault();
		setSingleError(null);
		setSingleLoading(true);
		const result = await onCreate(key.trim(), value);
		setSingleLoading(false);
		if (result.success) {
			setKey('');
			setValue('');
		} else {
			setSingleError(result.error ?? 'Failed to add variable');
		}
	}

	async function handleBulk(e: React.FormEvent) {
		e.preventDefault();
		setBulkError(null);
		setBulkSuccess(null);
		const pairs = parseEnvText(bulkText);
		if (pairs.length === 0) {
			setBulkError('No valid KEY=VALUE lines found.');
			return;
		}
		setBulkLoading(true);
		const errors: string[] = [];
		for (const { key: k, value: v } of pairs) {
			const result = await onCreate(k, v);
			if (!result.success) errors.push(`${k}: ${result.error}`);
		}
		setBulkLoading(false);
		if (errors.length > 0) {
			setBulkError(errors.join(' · '));
		} else {
			setBulkSuccess(
				`${pairs.length} variable${pairs.length > 1 ? 's' : ''} added.`,
			);
			setBulkText('');
		}
	}

	function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			setBulkText((ev.target?.result as string) ?? '');
			setBulkSuccess(null);
			setBulkError(null);
			setMode('paste');
		};
		reader.readAsText(file);
		// Reset so the same file can be re-selected
		e.target.value = '';
	}

	const inputClass =
		'flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-mono text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition';

	return (
		<div className="glass-card px-4 py-3 flex flex-col gap-3">
			{/* Mode tabs */}
			<div className="flex items-center gap-1 text-xs">
				{(['single', 'paste', 'upload'] as Mode[]).map((m) => (
					<button
						key={m}
						type="button"
						onClick={() => {
							setMode(m);
							if (m === 'upload') fileRef.current?.click();
						}}
						className={`px-3 py-1 rounded-md transition-colors ${
							mode === m
								? 'bg-violet-500/20 text-violet-300'
								: 'text-zinc-500 hover:text-zinc-300'
						}`}
					>
						{m === 'single' && 'Single'}
						{m === 'paste' && 'Paste .env'}
						{m === 'upload' && 'Upload .env'}
					</button>
				))}
				{/* Hidden file input */}
				<input
					ref={fileRef}
					type="file"
					accept=".env,text/plain"
					className="hidden"
					onChange={handleFile}
				/>
			</div>

			{/* Single variable */}
			{mode === 'single' && (
				<form onSubmit={handleSingle} className="flex flex-col gap-2">
					{singleError && <p className="text-xs text-red-400">{singleError}</p>}
					<div className="flex items-center gap-2">
						<input
							type="text"
							value={key}
							onChange={(e) => setKey(e.target.value.toUpperCase())}
							className={inputClass}
							placeholder="KEY"
							disabled={singleLoading}
							autoComplete="off"
							spellCheck={false}
						/>
						<span className="text-zinc-500 text-sm shrink-0">=</span>
						<input
							type="text"
							value={value}
							onChange={(e) => setValue(e.target.value)}
							className={inputClass}
							placeholder="VALUE"
							disabled={singleLoading}
							autoComplete="off"
							spellCheck={false}
						/>
						<button
							type="submit"
							disabled={singleLoading || !key.trim() || !value}
							className="btn-primary shrink-0 flex items-center gap-1.5 px-4 py-1.5 text-sm disabled:opacity-50"
							style={{ width: 'auto' }}
						>
							<span className="text-base leading-none">+</span>
							{singleLoading ? 'Adding…' : 'Add'}
						</button>
					</div>
				</form>
			)}

			{/* Paste / upload .env */}
			{(mode === 'paste' || mode === 'upload') && (
				<form onSubmit={handleBulk} className="flex flex-col gap-2">
					{bulkError && <p className="text-xs text-red-400">{bulkError}</p>}
					{bulkSuccess && (
						<p className="text-xs text-green-400">{bulkSuccess}</p>
					)}
					<textarea
						value={bulkText}
						onChange={(e) => {
							setBulkText(e.target.value);
							setBulkSuccess(null);
							setBulkError(null);
						}}
						className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition resize-y"
						placeholder={
							'# Paste your .env content here\nDATABASE_URL=postgres://...\nAPI_KEY=secret'
						}
						rows={6}
						disabled={bulkLoading}
						spellCheck={false}
						autoComplete="off"
					/>
					<div className="flex justify-end">
						<button
							type="submit"
							disabled={bulkLoading || !bulkText.trim()}
							className="btn-primary flex items-center gap-1.5 px-5 py-1.5 text-sm disabled:opacity-50"
							style={{ width: 'auto' }}
						>
							{bulkLoading ? 'Importing…' : 'Import all'}
						</button>
					</div>
				</form>
			)}
		</div>
	);
}

'use client';

import { useState } from 'react';
import { useVariables } from '@/hooks/useVariables';
import { computeEnvDiff } from '@/utils/env-diff';

interface Props {
	projectId: string;
	envAId: string;
	envAName: string;
	envBId: string;
	envBName: string;
}

const PencilIcon = () => (
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
		<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
		<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
	</svg>
);

export function EnvDiff({
	projectId,
	envAId,
	envAName,
	envBId,
	envBName,
}: Props) {
	const {
		variables: varsA,
		isLoading: loadingA,
		updateVariable: updateA,
	} = useVariables(projectId, envAId);
	const {
		variables: varsB,
		isLoading: loadingB,
		updateVariable: updateB,
	} = useVariables(projectId, envBId);

	const [editingCell, setEditingCell] = useState<{
		key: string;
		side: 'a' | 'b';
	} | null>(null);
	const [editValue, setEditValue] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	if (loadingA || loadingB) {
		return (
			<div className="glass-card px-6 py-10 text-center text-zinc-500 text-sm animate-pulse">
				Loading variables…
			</div>
		);
	}

	const mapA = new Map(varsA.map((v) => [v.key, { id: v.id, value: v.value }]));
	const mapB = new Map(varsB.map((v) => [v.key, { id: v.id, value: v.value }]));

	const { rows, onlyInA, onlyInB, different, same } = computeEnvDiff(
		varsA,
		varsB,
	);

	if (mapA.size === 0 && mapB.size === 0) {
		return (
			<div className="glass-card px-6 py-10 text-center text-zinc-500 text-sm">
				Both environments have no variables.
			</div>
		);
	}

	function startEdit(key: string, side: 'a' | 'b', currentValue: string) {
		setEditingCell({ key, side });
		setEditValue(currentValue);
	}

	function cancelEdit() {
		setEditingCell(null);
		setEditValue('');
	}

	async function saveEdit(key: string, side: 'a' | 'b') {
		const map = side === 'a' ? mapA : mapB;
		const entry = map.get(key);
		if (!entry) return;
		setIsSaving(true);
		const updateFn = side === 'a' ? updateA : updateB;
		await updateFn(entry.id, key, editValue);
		setIsSaving(false);
		setEditingCell(null);
		setEditValue('');
	}

	const inputClass =
		'w-full bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs font-mono text-zinc-100 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition';

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-4 text-xs text-zinc-500">
				<span className="flex items-center gap-1.5">
					<span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
					Only in one env ({onlyInA.length + onlyInB.length})
				</span>
				<span className="flex items-center gap-1.5">
					<span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
					Different value ({different.length})
				</span>
				<span className="flex items-center gap-1.5">
					<span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
					Identical ({same.length})
				</span>
			</div>

			<div className="glass-card overflow-hidden">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-zinc-800/80">
							<th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 w-[38%]">
								{envAName}
							</th>
							<th className="px-4 py-3 text-center text-xs font-medium text-zinc-500 w-[24%]">
								KEY
							</th>
							<th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 w-[38%]">
								{envBName}
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.map(({ key, type }) => {
							const entryA = mapA.get(key);
							const entryB = mapB.get(key);
							const valA = entryA?.value;
							const valB = entryB?.value;

							const isEditingA =
								editingCell?.key === key && editingCell.side === 'a';
							const isEditingB =
								editingCell?.key === key && editingCell.side === 'b';

							const rowBg =
								type === 'same'
									? ''
									: type === 'different'
										? 'bg-amber-500/5'
										: 'bg-red-500/5';

							const cellA =
								type === 'only-b'
									? 'text-zinc-700 italic'
									: type === 'different'
										? 'text-amber-300'
										: type === 'only-a'
											? 'text-red-300'
											: 'text-emerald-300';

							const cellB =
								type === 'only-a'
									? 'text-zinc-700 italic'
									: type === 'different'
										? 'text-amber-300'
										: type === 'only-b'
											? 'text-red-300'
											: 'text-emerald-300';

							return (
								<tr
									key={key}
									className={`border-b border-zinc-800/40 last:border-0 ${rowBg}`}
								>
									{/* Env A cell */}
									<td className="px-4 py-2 max-w-0 w-[38%]">
										{isEditingA ? (
											<div className="flex items-center gap-1.5">
												<input
													type="text"
													value={editValue}
													onChange={(e) => setEditValue(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === 'Enter') saveEdit(key, 'a');
														if (e.key === 'Escape') cancelEdit();
													}}
													className={inputClass}
													disabled={isSaving}
													autoFocus
													autoComplete="off"
													spellCheck={false}
												/>
												<button
													type="button"
													onClick={() => saveEdit(key, 'a')}
													disabled={isSaving}
													className="shrink-0 text-xs text-violet-400 hover:text-violet-300 disabled:opacity-50 transition-colors"
												>
													{isSaving ? '…' : 'Save'}
												</button>
												<button
													type="button"
													onClick={cancelEdit}
													disabled={isSaving}
													className="shrink-0 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
												>
													✕
												</button>
											</div>
										) : (
											<div
												className={`group/cell flex items-center gap-1.5 font-mono text-xs ${cellA}`}
											>
												<span className="truncate">{valA ?? '—'}</span>
												{entryA && (
													<button
														type="button"
														onClick={() => startEdit(key, 'a', valA ?? '')}
														className="shrink-0 opacity-0 group-hover/cell:opacity-100 text-zinc-600 hover:text-violet-400 transition-all"
														title={`Edit in ${envAName}`}
													>
														<PencilIcon />
													</button>
												)}
											</div>
										)}
									</td>

									{/* Key cell */}
									<td className="px-4 py-2 text-center font-mono text-xs font-medium text-zinc-300">
										{key}
									</td>

									{/* Env B cell */}
									<td className="px-4 py-2 max-w-0 w-[38%]">
										{isEditingB ? (
											<div className="flex items-center justify-end gap-1.5">
												<button
													type="button"
													onClick={cancelEdit}
													disabled={isSaving}
													className="shrink-0 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
												>
													✕
												</button>
												<button
													type="button"
													onClick={() => saveEdit(key, 'b')}
													disabled={isSaving}
													className="shrink-0 text-xs text-violet-400 hover:text-violet-300 disabled:opacity-50 transition-colors"
												>
													{isSaving ? '…' : 'Save'}
												</button>
												<input
													type="text"
													value={editValue}
													onChange={(e) => setEditValue(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === 'Enter') saveEdit(key, 'b');
														if (e.key === 'Escape') cancelEdit();
													}}
													className={inputClass}
													disabled={isSaving}
													autoFocus
													autoComplete="off"
													spellCheck={false}
												/>
											</div>
										) : (
											<div
												className={`group/cell flex items-center justify-end gap-1.5 font-mono text-xs ${cellB}`}
											>
												{entryB && (
													<button
														type="button"
														onClick={() => startEdit(key, 'b', valB ?? '')}
														className="shrink-0 opacity-0 group-hover/cell:opacity-100 text-zinc-600 hover:text-violet-400 transition-all"
														title={`Edit in ${envBName}`}
													>
														<PencilIcon />
													</button>
												)}
												<span className="truncate">{valB ?? '—'}</span>
											</div>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

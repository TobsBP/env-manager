'use client';

import { useVariables } from '@/hooks/useVariables';

interface Props {
	projectId: string;
	envAId: string;
	envAName: string;
	envBId: string;
	envBName: string;
}

export function EnvDiff({ projectId, envAId, envAName, envBId, envBName }: Props) {
	const { variables: varsA, isLoading: loadingA } = useVariables(projectId, envAId);
	const { variables: varsB, isLoading: loadingB } = useVariables(projectId, envBId);

	if (loadingA || loadingB) {
		return (
			<div className="glass-card px-6 py-10 text-center text-zinc-500 text-sm animate-pulse">
				Loading variables…
			</div>
		);
	}

	const mapA = new Map(varsA.map((v) => [v.key, v.value]));
	const mapB = new Map(varsB.map((v) => [v.key, v.value]));
	const allKeys = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort();

	const onlyInA: string[] = [];
	const onlyInB: string[] = [];
	const different: string[] = [];
	const same: string[] = [];

	for (const key of allKeys) {
		const inA = mapA.has(key);
		const inB = mapB.has(key);
		if (inA && !inB) onlyInA.push(key);
		else if (!inA && inB) onlyInB.push(key);
		else if (mapA.get(key) !== mapB.get(key)) different.push(key);
		else same.push(key);
	}

	if (allKeys.length === 0) {
		return (
			<div className="glass-card px-6 py-10 text-center text-zinc-500 text-sm">
				Both environments have no variables.
			</div>
		);
	}

	const rows: { key: string; type: 'only-a' | 'only-b' | 'different' | 'same' }[] = [
		...onlyInA.map((k) => ({ key: k, type: 'only-a' as const })),
		...onlyInB.map((k) => ({ key: k, type: 'only-b' as const })),
		...different.map((k) => ({ key: k, type: 'different' as const })),
		...same.map((k) => ({ key: k, type: 'same' as const })),
	];

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
							const valA = mapA.get(key);
							const valB = mapB.get(key);

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
								<tr key={key} className={`border-b border-zinc-800/40 last:border-0 ${rowBg}`}>
									<td className={`px-4 py-3 font-mono text-xs truncate max-w-0 w-[38%] ${cellA}`}>
										{valA ?? '—'}
									</td>
									<td className="px-4 py-3 text-center font-mono text-xs font-medium text-zinc-300">
										{key}
									</td>
									<td className={`px-4 py-3 font-mono text-xs truncate max-w-0 w-[38%] text-right ${cellB}`}>
										{valB ?? '—'}
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

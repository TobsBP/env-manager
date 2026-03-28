export const ENV_DOT: Record<string, string> = {
	prod: 'bg-red-400',
	production: 'bg-red-400',
	dev: 'bg-emerald-400',
	development: 'bg-emerald-400',
	homolog: 'bg-amber-400',
	staging: 'bg-amber-400',
};

export type DiffRowType = 'only-a' | 'only-b' | 'different' | 'same';

export interface DiffRow {
	key: string;
	type: DiffRowType;
}

export interface DiffResult {
	rows: DiffRow[];
	onlyInA: string[];
	onlyInB: string[];
	different: string[];
	same: string[];
}

export function computeEnvDiff(
	varsA: { key: string; value: string }[],
	varsB: { key: string; value: string }[],
): DiffResult {
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

	const rows: DiffRow[] = [
		...onlyInA.map((k) => ({ key: k, type: 'only-a' as const })),
		...onlyInB.map((k) => ({ key: k, type: 'only-b' as const })),
		...different.map((k) => ({ key: k, type: 'different' as const })),
		...same.map((k) => ({ key: k, type: 'same' as const })),
	];

	return { rows, onlyInA, onlyInB, different, same };
}

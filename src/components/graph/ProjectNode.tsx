'use client';

import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';

type ProjectNodeData = {
	label: string;
	envName: string;
};

const ENV_COLORS: Record<string, string> = {
	prod: 'bg-red-500/20 text-red-400 border-red-500/30',
	production: 'bg-red-500/20 text-red-400 border-red-500/30',
	dev: 'bg-green-500/20 text-green-400 border-green-500/30',
	development: 'bg-green-500/20 text-green-400 border-green-500/30',
	staging: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
	homolog: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

function getEnvColor(envName: string): string {
	const key = envName.toLowerCase();
	return ENV_COLORS[key] ?? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}

export function ProjectNode({ data }: NodeProps) {
	const nodeData = data as ProjectNodeData;
	const badgeClass = getEnvColor(nodeData.envName);

	return (
		<div className="glass-card min-w-40 px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900/80 backdrop-blur-sm shadow-lg">
			<Handle
				type="target"
				position={Position.Left}
				className="w-3! h-3! bg-violet-500! border-2! border-zinc-900!"
			/>
			<div className="flex flex-col gap-1.5">
				<span className="text-sm font-medium text-zinc-100 truncate max-w-35">
					{nodeData.label.split(' (')[0]}
				</span>
				<span
					className={`self-start rounded-full border px-2 py-0.5 text-xs font-medium ${badgeClass}`}
				>
					{nodeData.envName}
				</span>
			</div>
			<Handle
				type="source"
				position={Position.Right}
				className="w-3! h-3! bg-violet-500! border-2! border-zinc-900!"
			/>
		</div>
	);
}

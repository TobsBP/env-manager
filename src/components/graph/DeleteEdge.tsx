'use client';

import {
	BaseEdge,
	EdgeLabelRenderer,
	type EdgeProps,
	getBezierPath,
} from '@xyflow/react';

type DeleteEdgeData = {
	onDelete: (id: string) => void;
};

export function DeleteEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data,
}: EdgeProps) {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const edgeData = data as DeleteEdgeData;

	return (
		<>
			<BaseEdge path={edgePath} style={{ stroke: '#8b5cf6', strokeWidth: 2 }} />
			<EdgeLabelRenderer>
				<div
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						pointerEvents: 'all',
					}}
					className="nodrag nopan group"
				>
					<button
						type="button"
						onClick={() => edgeData.onDelete(id)}
						className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900 text-xs text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100! hover:border-red-500 hover:text-red-400"
					>
						×
					</button>
				</div>
			</EdgeLabelRenderer>
		</>
	);
}

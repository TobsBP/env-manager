'use client';

import {
	applyNodeChanges,
	Background,
	BackgroundVariant,
	Controls,
	type Edge,
	type Connection as FlowConnection,
	MiniMap,
	Panel,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from '@xyflow/react';
import { useCallback, useEffect, useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import { useAllEnvironments } from '@/hooks/useAllEnvironments';
import { useConnections } from '@/hooks/useConnections';
import { DeleteEdge } from './DeleteEdge';
import { ProjectNode } from './ProjectNode';

const nodeTypes = { projectNode: ProjectNode };
const edgeTypes = { deleteEdge: DeleteEdge };

const COLS = 3;
const COL_WIDTH = 240;
const ROW_HEIGHT = 130;
const STORAGE_KEY = 'graph:node-positions';

function loadPositions(): Record<string, { x: number; y: number }> {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
	} catch {
		return {};
	}
}

function savePositions(positions: Record<string, { x: number; y: number }>) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

export function ProjectGraph() {
	const { pairs, isLoading: pairsLoading } = useAllEnvironments();
	const {
		connections,
		isLoading: connLoading,
		error: connError,
		createConnection,
		deleteConnection,
	} = useConnections();

	const computedNodes = useMemo(() => {
		const saved = loadPositions();
		return pairs.map((pair, i) => {
			const id = `${pair.projectId}:${pair.envId}`;
			const position = saved[id] ?? {
				x: (i % COLS) * COL_WIDTH,
				y: Math.floor(i / COLS) * ROW_HEIGHT,
			};
			return {
				id,
				position,
				data: {
					label: `${pair.projectName} (${pair.envName})`,
					envName: pair.envName,
				},
				type: 'projectNode',
			};
		});
	}, [pairs]);

	const [nodes, setNodes, onNodesChange] = useNodesState(computedNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

	const handleNodesChange = useCallback(
		(changes: Parameters<typeof onNodesChange>[0]) => {
			const next = applyNodeChanges(changes, nodes);
			const hasDragEnd = changes.some(
				(c) => c.type === 'position' && !('dragging' in c && c.dragging),
			);
			if (hasDragEnd) {
				const positions = loadPositions();
				for (const node of next) {
					positions[node.id] = node.position;
				}
				savePositions(positions);
			}
			onNodesChange(changes);
		},
		[nodes, onNodesChange],
	);

	const handleDelete = useCallback(
		async (edgeId: string) => {
			setEdges((prev) => prev.filter((e) => e.id !== edgeId));
			await deleteConnection(edgeId);
		},
		[deleteConnection, setEdges],
	);

	useEffect(() => {
		setNodes(computedNodes);
	}, [computedNodes, setNodes]);

	useEffect(() => {
		setEdges(
			connections.map((conn) => ({
				id: conn.id,
				source: `${conn.fromProjectId}:${conn.fromEnvId}`,
				target: `${conn.toProjectId}:${conn.toEnvId}`,
				type: 'deleteEdge',
				animated: true,
				data: { onDelete: handleDelete },
			})),
		);
	}, [connections, handleDelete, setEdges]);

	const onConnect = useCallback(
		async (params: FlowConnection) => {
			const [fromProjectId, fromEnvId] = params.source.split(':');
			const [toProjectId, toEnvId] = params.target.split(':');

			if (!fromProjectId || !fromEnvId || !toProjectId || !toEnvId) return;
			if (params.source === params.target) return;

			await createConnection({
				fromProjectId,
				fromEnvId,
				toProjectId,
				toEnvId,
			});
		},
		[createConnection],
	);

	const sortNodes = useCallback(() => {
		// Count connections per node
		const connCount: Record<string, number> = {};
		for (const node of nodes) connCount[node.id] = 0;
		for (const edge of edges) {
			connCount[edge.source] = (connCount[edge.source] ?? 0) + 1;
			connCount[edge.target] = (connCount[edge.target] ?? 0) + 1;
		}

		const sorted = [...nodes].sort((a, b) => {
			const diff = (connCount[b.id] ?? 0) - (connCount[a.id] ?? 0);
			if (diff !== 0) return diff;
			// Tiebreak by envName alphabetically
			const envA = (a.data as { envName: string }).envName ?? '';
			const envB = (b.data as { envName: string }).envName ?? '';
			return envA.localeCompare(envB);
		});

		const positions: Record<string, { x: number; y: number }> = {};
		const updated = sorted.map((node, i) => {
			const pos = {
				x: (i % COLS) * COL_WIDTH,
				y: Math.floor(i / COLS) * ROW_HEIGHT,
			};
			positions[node.id] = pos;
			return { ...node, position: pos };
		});

		savePositions(positions);
		setNodes(updated);
	}, [nodes, edges, setNodes]);

	if (pairsLoading || connLoading) {
		return (
			<div className="flex h-full items-center justify-center text-zinc-400">
				<div className="text-center">
					<div className="mb-3 text-4xl">🔗</div>
					<p>Loading graph...</p>
				</div>
			</div>
		);
	}

	if (pairs.length === 0) {
		return (
			<div className="flex h-full items-center justify-center text-zinc-400">
				<div className="text-center glass-card px-8 py-12 rounded-xl">
					<p className="text-4xl mb-3">📭</p>
					<p className="text-lg font-medium text-zinc-300">
						No environments yet
					</p>
					<p className="mt-1 text-sm">
						Create projects and environments to visualize their dependencies.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative h-full w-full">
			{connError && (
				<div className="absolute top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
					Connections error: {connError}
				</div>
			)}
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={handleNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				fitView={false}
				className="bg-zinc-950"
			>
				<Background
					variant={BackgroundVariant.Dots}
					color="#3f3f46"
					gap={20}
					size={1}
				/>
				<Controls className="[&>button]:bg-zinc-800 [&>button]:border-zinc-700 [&>button]:text-zinc-300 [&>button:hover]:bg-zinc-700" />
				<MiniMap
					nodeColor="#8b5cf6"
					maskColor="rgba(9,9,11,0.8)"
					className="bg-zinc-900! border! border-zinc-700! rounded-xl!"
				/>
				<Panel position="top-right">
					<button
						type="button"
						onClick={sortNodes}
						className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-300 backdrop-blur-sm transition-colors hover:border-violet-500 hover:text-violet-300 cursor-pointer"
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
							<line x1="4" y1="6" x2="20" y2="6" />
							<line x1="4" y1="12" x2="14" y2="12" />
							<line x1="4" y1="18" x2="9" y2="18" />
						</svg>
						Ordenar
					</button>
				</Panel>
			</ReactFlow>
		</div>
	);
}

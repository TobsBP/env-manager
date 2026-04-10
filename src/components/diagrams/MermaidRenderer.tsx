'use client';

import mermaid from 'mermaid';
import { useEffect, useRef, useState } from 'react';
import type { MermaidRendererProps } from '@/types/interfaces/components';

let initialized = false;

export function MermaidRenderer({ code }: MermaidRendererProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [renderError, setRenderError] = useState<string | null>(null);

	useEffect(() => {
		if (!initialized) {
			mermaid.initialize({
				startOnLoad: false,
				theme: 'dark',
				darkMode: true,
			});
			initialized = true;
		}
	}, []);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || !code.trim()) return;

		const id = `mermaid-${Math.random().toString(36).slice(2)}`;
		setRenderError(null);

		mermaid
			.render(id, code)
			.then(({ svg }) => {
				if (container) {
					container.innerHTML = svg;
				}
			})
			.catch((err: unknown) => {
				setRenderError(
					err instanceof Error ? err.message : 'Failed to render diagram',
				);
			});
	}, [code]);

	if (renderError) {
		return (
			<div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
				<p className="font-medium mb-1">Render error</p>
				<pre className="text-xs whitespace-pre-wrap break-all">
					{renderError}
				</pre>
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			className="flex items-center justify-center min-h-30 [&_svg]:max-w-full [&_svg]:h-auto"
		/>
	);
}

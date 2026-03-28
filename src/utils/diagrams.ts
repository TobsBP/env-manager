import mermaid from 'mermaid';
import type { Diagram } from '@/types/diagram';

export async function downloadDiagramsAsSVG(
	diagrams: Diagram[],
): Promise<void> {
	for (const diagram of diagrams) {
		const id = `export-${Math.random().toString(36).slice(2)}`;
		const { svg } = await mermaid.render(id, diagram.code);
		const blob = new Blob([svg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${diagram.name.replace(/[^a-z0-9]/gi, '_')}.svg`;
		a.click();
		URL.revokeObjectURL(url);
		await new Promise((r) => setTimeout(r, 150));
	}
}

export async function openDiagramsAsPDF(
	diagrams: Diagram[],
	projectName?: string,
): Promise<void> {
	const svgs: { name: string; svg: string }[] = [];
	for (const diagram of diagrams) {
		const id = `pdf-${Math.random().toString(36).slice(2)}`;
		const { svg } = await mermaid.render(id, diagram.code);
		svgs.push({ name: diagram.name, svg });
	}

	const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${projectName ?? 'Diagrams'} — Diagrams</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #fff; color: #111; }
  .page { page-break-after: always; padding: 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
  .page:last-child { page-break-after: avoid; }
  h2 { font-size: 18px; font-weight: 600; margin-bottom: 32px; color: #333; text-align: center; }
  svg { max-width: 100%; height: auto; }
  @media print { @page { margin: 0; } }
</style>
</head>
<body>
${svgs.map(({ name, svg }) => `<div class="page"><h2>${name}</h2>${svg}</div>`).join('\n')}
<script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }</script>
</body>
</html>`;

	const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
	const url = URL.createObjectURL(blob);
	window.open(url, '_blank');
	setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

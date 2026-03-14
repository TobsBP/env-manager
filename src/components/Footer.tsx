export function Footer() {
	return (
		<footer className="border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
			<div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/20 text-sm">
						🔐
					</div>
					<span className="text-sm font-medium text-zinc-400">Env Manager</span>
				</div>

				<p className="text-xs text-zinc-600">
					© {new Date().getFullYear()} — secure by default
				</p>
			</div>
		</footer>
	);
}

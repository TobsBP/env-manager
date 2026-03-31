export const ENV_CONFIG: Record<
	string,
	{ badge: string; dot: string; label: string }
> = {
	prod: {
		badge: 'bg-red-500/10 text-red-400 border-red-500/25',
		dot: 'bg-red-400',
		label: 'Production',
	},
	production: {
		badge: 'bg-red-500/10 text-red-400 border-red-500/25',
		dot: 'bg-red-400',
		label: 'Production',
	},
	dev: {
		badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
		dot: 'bg-emerald-400',
		label: 'Development',
	},
	development: {
		badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
		dot: 'bg-emerald-400',
		label: 'Development',
	},
	homolog: {
		badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
		dot: 'bg-amber-400',
		label: 'Homologation',
	},
	staging: {
		badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
		dot: 'bg-amber-400',
		label: 'Staging',
	},
};

export const DEFAULT_ENV = {
	badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/25',
	dot: 'bg-zinc-400',
	label: null,
};

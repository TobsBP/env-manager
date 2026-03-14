interface AuthCardProps {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
	return (
		<div className="glass-card w-full max-w-md px-8 py-10">
			<div className="mb-8 text-center">
				<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20">
					<span className="text-2xl">🔐</span>
				</div>
				<h1 className="text-2xl font-semibold text-zinc-50">{title}</h1>
				{subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
			</div>
			{children}
		</div>
	);
}

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4">
			{/* Animated background orbs */}
			<div className="orb orb-1" />
			<div className="orb orb-2" />
			<div className="orb orb-3" />

			{/* Subtle grid overlay */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
					backgroundSize: '40px 40px',
				}}
			/>

			<div className="relative z-10 w-full max-w-md">{children}</div>
		</div>
	);
}

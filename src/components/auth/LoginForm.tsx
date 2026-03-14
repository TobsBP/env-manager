'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/types/auth';

type FieldErrors = Partial<Record<'email' | 'password', string>>;

export function LoginForm() {
	const { signIn, isLoading, error } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFieldErrors({});

		const parsed = loginSchema.safeParse({ email, password });
		if (!parsed.success) {
			const errors: FieldErrors = {};
			for (const issue of parsed.error.issues) {
				const field = issue.path[0] as keyof FieldErrors;
				errors[field] = issue.message;
			}
			setFieldErrors(errors);
			return;
		}

		await signIn(parsed.data);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			{error && (
				<div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
					{error}
				</div>
			)}

			<div className="flex flex-col gap-1">
				<div className="relative">
					<MdEmail
						className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
						size={18}
					/>
					<input
						className="auth-input"
						type="email"
						placeholder="Email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
					/>
				</div>
				{fieldErrors.email && (
					<p className="pl-1 text-xs text-red-400">{fieldErrors.email}</p>
				)}
			</div>

			<div className="flex flex-col gap-1">
				<div className="relative">
					<MdLock
						className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
						size={18}
					/>
					<input
						className="auth-input pr-10"
						type={showPassword ? 'text' : 'password'}
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="current-password"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						{showPassword ? (
							<MdVisibilityOff size={18} />
						) : (
							<MdVisibility size={18} />
						)}
					</button>
				</div>
				{fieldErrors.password && (
					<p className="pl-1 text-xs text-red-400">{fieldErrors.password}</p>
				)}
			</div>

			<div className="text-right">
				<Link
					href="/forgot-password"
					className="text-sm text-violet-400 transition-colors hover:text-violet-300"
				>
					Forgot password?
				</Link>
			</div>

			<button type="submit" className="btn-primary mt-1" disabled={isLoading}>
				{isLoading ? 'Signing in…' : 'Sign in'}
			</button>

			<p className="text-center text-sm text-zinc-400">
				Don&apos;t have an account?{' '}
				<Link
					href="/register"
					className="text-violet-400 transition-colors hover:text-violet-300"
				>
					Create one
				</Link>
			</p>
		</form>
	);
}

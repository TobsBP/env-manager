'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';
import { forgotPasswordSchema } from '@/types/auth';

export function ForgotPasswordForm() {
	const { forgotPassword, isLoading, error } = useAuth();
	const [email, setEmail] = useState('');
	const [fieldError, setFieldError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFieldError(null);

		const parsed = forgotPasswordSchema.safeParse({ email });
		if (!parsed.success) {
			setFieldError(parsed.error.issues[0].message);
			return;
		}

		const result = await forgotPassword(parsed.data.email);
		if (result.success && result.message) {
			setSuccessMessage(result.message);
		}
	};

	if (successMessage) {
		return (
			<div className="flex flex-col items-center gap-4 text-center">
				<div className="rounded-lg border border-green-500/20 bg-green-500/10 px-6 py-4 text-sm text-green-400">
					{successMessage}
				</div>
				<Link
					href="/login"
					className="text-sm text-violet-400 transition-colors hover:text-violet-300"
				>
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			{error && (
				<div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
					{error}
				</div>
			)}

			<p className="text-sm text-zinc-400">
				Enter your email and we&apos;ll send you a link to reset your password.
			</p>

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
				{fieldError && (
					<p className="pl-1 text-xs text-red-400">{fieldError}</p>
				)}
			</div>

			<button type="submit" className="btn-primary mt-1" disabled={isLoading}>
				{isLoading ? 'Sending…' : 'Send reset link'}
			</button>

			<p className="text-center text-sm text-zinc-400">
				<Link
					href="/login"
					className="text-violet-400 transition-colors hover:text-violet-300"
				>
					Back to sign in
				</Link>
			</p>
		</form>
	);
}

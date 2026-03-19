'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
	MdEmail,
	MdLock,
	MdPerson,
	MdVisibility,
	MdVisibilityOff,
} from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema } from '@/types/auth';

type FieldErrors = Partial<Record<'fullName' | 'email' | 'password', string>>;

export function RegisterForm() {
	const { signUp, isLoading, error } = useAuth();
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFieldErrors({});

		const parsed = registerSchema.safeParse({ fullName, email, password });
		if (!parsed.success) {
			const errors: FieldErrors = {};
			for (const issue of parsed.error.issues) {
				const field = issue.path[0] as keyof FieldErrors;
				errors[field] = issue.message;
			}
			setFieldErrors(errors);
			return;
		}

		const result = await signUp(parsed.data);
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

			<div className="flex flex-col gap-1">
				<div className="relative">
					<MdPerson
						className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
						size={18}
					/>
					<input
						className="auth-input"
						type="text"
						placeholder="Full name (optional)"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						autoComplete="name"
					/>
				</div>
				{fieldErrors.fullName && (
					<p className="pl-1 text-xs text-red-400">{fieldErrors.fullName}</p>
				)}
			</div>

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
						placeholder="Password (min 6 characters)"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						autoComplete="new-password"
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

			<button type="submit" className="btn-primary mt-1" disabled={isLoading}>
				{isLoading ? 'Creating account…' : 'Create account'}
			</button>

			<p className="text-center text-sm text-zinc-400">
				Already have an account?{' '}
				<Link
					href="/login"
					className="text-violet-400 transition-colors hover:text-violet-300"
				>
					Sign in
				</Link>
			</p>
		</form>
	);
}

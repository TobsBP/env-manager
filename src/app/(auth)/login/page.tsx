import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
	return (
		<AuthCard title="Welcome back" subtitle="Sign in to your account">
			<LoginForm />
		</AuthCard>
	);
}

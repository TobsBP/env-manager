import { AuthCard } from '@/components/auth/AuthCard';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
	return (
		<AuthCard
			title="Create an account"
			subtitle="Start managing your environment variables"
		>
			<RegisterForm />
		</AuthCard>
	);
}

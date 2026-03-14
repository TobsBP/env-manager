import { AuthCard } from '@/components/auth/AuthCard';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
	return (
		<AuthCard title="Reset password" subtitle="We'll send you a recovery link">
			<ForgotPasswordForm />
		</AuthCard>
	);
}

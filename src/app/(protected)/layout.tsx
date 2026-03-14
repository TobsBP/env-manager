import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/firebase/admin';

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getSessionUser();

	if (!user) {
		redirect('/login');
	}

	return <>{children}</>;
}

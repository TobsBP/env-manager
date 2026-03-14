import type { Metadata } from 'next';
import './globals.css';
import { getSessionUser } from '@/lib/firebase/admin';
import { AuthProvider } from '@/providers/AuthProvider';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
	title: 'Env Manager',
	description: 'Manage your environment variables securely',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getSessionUser();

	return (
		<html lang="en">
			<body>
				<AuthProvider initialUser={user}>{children}</AuthProvider>
			<Footer/>
      </body>
		</html>
	);
}

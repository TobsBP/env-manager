import { type NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'session';
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];
const AUTH_PATHS = ['/login', '/register', '/forgot-password'];

export function proxy(request: NextRequest) {
	const session = request.cookies.get(SESSION_COOKIE)?.value;
	const pathname = request.nextUrl.pathname;

	// Redirect authenticated users away from auth pages
	if (session && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// Redirect unauthenticated users away from protected pages
	if (
		!session &&
		!PUBLIC_PATHS.some((p) => pathname.startsWith(p)) &&
		pathname !== '/'
	) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};

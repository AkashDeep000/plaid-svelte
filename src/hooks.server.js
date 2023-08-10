import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_ID, GITHUB_SECRET, AUTH_SECRET } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';

async function authorization({ event, resolve }) {
	// Protect any routes under /authenticated
	if (event.url.pathname.startsWith('/dashboard') || event.url.pathname.startsWith('/api')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/');
		}
	}
	const session = await event.locals.getSession();
	if (session && event.url.pathname === '/') {
		throw redirect(303, '/dashboard');
	}
	// If the request is still here, just proceed as normally
	return resolve(event);
}

export const handle = sequence(
	SvelteKitAuth({
		providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
		//  secret: AUTH_SECRET,
		//  trustHost: true,
		debug: true
	}),
	authorization
);

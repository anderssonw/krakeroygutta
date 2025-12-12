import type { Profile } from './types/database-helpers';

export type RouteVisibility = 'public' | 'unauthenticated' | 'authenticated' | 'admin';

export type RouteLink = {
	href: string;
	label: string;
	visibility: RouteVisibility;
	requiresAuth: boolean;
	requiresAdmin: boolean;
	index: number;
};

export const routes: RouteLink[] = [
	{ href: '/', label: 'Hjem', visibility: 'public', requiresAuth: false, requiresAdmin: false, index: 0 },
	{ href: '/login', label: 'Logg inn', visibility: 'unauthenticated', requiresAuth: false, requiresAdmin: false, index: 1 },
	{ href: '/spillere', label: 'Spillere', visibility: 'authenticated', requiresAuth: true, requiresAdmin: false, index: 2 },
	{ href: '/statistikk', label: 'Statistikk', visibility: 'authenticated', requiresAuth: true, requiresAdmin: false, index: 3 },
	{ href: '/profil', label: 'Profil', visibility: 'authenticated', requiresAuth: true, requiresAdmin: false, index: 4 },
	{ href: '/admin', label: 'Admin', visibility: 'admin', requiresAuth: true, requiresAdmin: true, index: 5 }
];

export function getVisibleRoutes(profile: Profile | null): RouteLink[] {
	return routes
		.filter((route) => {
			switch (route.visibility) {
				case 'public':
					return true;
				case 'unauthenticated':
					return profile == null;
				case 'authenticated':
					return profile != null;
				case 'admin':
					return profile?.is_admin === true;
				default:
					return false;
			}
		})
		.sort((a, b) => a.index - b.index);
}

import type { Profile } from './types/database-helpers';
import type { Component } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';
import HomeIcon from '~icons/mdi/home';
import LoginIcon from '~icons/mdi/login';
import TrophyIcon from '~icons/mdi/trophy';
import AccountGroupIcon from '~icons/mdi/account-group';
import SparklesIcon from '~icons/mdi/sparkles';
import ChartBarIcon from '~icons/mdi/chart-bar';
import AccountIcon from '~icons/mdi/account';
import ShieldCrownIcon from '~icons/mdi/shield-crown';
import CalendarIcon from '~icons/mdi/calendar';
import SoccerIcon from '~icons/mdi/soccer';
import ShieldIcon from '~icons/mdi/shield';

type RouteVisibility = 'public' | 'unauthenticated' | 'authenticated' | 'admin';

type RouteDefinition = {
	href: string;
	label: string;
	icon: Component<SvelteHTMLElements['svg']>;
	visibility: RouteVisibility;
	requiresAuth: boolean;
	requiresAdmin: boolean;
	index: number;
	subRoutes?: RouteDefinition[];
};

export type RouteLink = RouteDefinition & {
	readonly parent?: RouteLink;
	subRoutes?: RouteLink[];
};

function buildRouteTree(routes: RouteDefinition[], parent?: RouteLink): RouteLink[] {
	return routes.map((route) => {
		const routeLink: RouteLink = {
			...route,
			parent,
			subRoutes: undefined
		};

		if (route.subRoutes) {
			routeLink.subRoutes = buildRouteTree(route.subRoutes, routeLink);
		}

		return routeLink;
	});
}

const routeDefinitions: RouteDefinition[] = [
	{ href: '/', label: 'Hjem', icon: HomeIcon, visibility: 'public', requiresAuth: false, requiresAdmin: false, index: 0 },
	{
		href: '/login',
		label: 'Logg inn',
		icon: LoginIcon,
		visibility: 'unauthenticated',
		requiresAuth: false,
		requiresAdmin: false,
		index: 1
	},
	{
		href: '/sesong',
		label: 'Sesong',
		icon: TrophyIcon,
		visibility: 'authenticated',
		requiresAuth: true,
		requiresAdmin: false,
		index: 2,
		subRoutes: [
			{
				href: '/spillere',
				label: 'Spillere',
				icon: AccountGroupIcon,
				visibility: 'authenticated',
				requiresAuth: true,
				requiresAdmin: false,
				index: 0
			},
			{
				href: '/fantasy',
				label: 'Fantasy',
				icon: SparklesIcon,
				visibility: 'authenticated',
				requiresAuth: true,
				requiresAdmin: false,
				index: 1
			}
		]
	},

	{
		href: '/statistikk',
		label: 'Statistikk',
		icon: ChartBarIcon,
		visibility: 'authenticated',
		requiresAuth: true,
		requiresAdmin: false,
		index: 3
	},
	{ href: '/profil', label: 'Profil', icon: AccountIcon, visibility: 'authenticated', requiresAuth: true, requiresAdmin: false, index: 4 },
	{
		href: '/admin',
		label: 'Admin',
		icon: ShieldCrownIcon,
		visibility: 'admin',
		requiresAuth: true,
		requiresAdmin: true,
		index: 5,
		subRoutes: [
			{ href: '/sesonger', label: 'Sesonger', icon: CalendarIcon, visibility: 'admin', requiresAuth: true, requiresAdmin: true, index: 0 },
			{
				href: '/spillere',
				label: 'Spillere',
				icon: AccountGroupIcon,
				visibility: 'admin',
				requiresAuth: true,
				requiresAdmin: true,
				index: 1
			},
			{ href: '/kamper', label: 'Kamper', icon: SoccerIcon, visibility: 'admin', requiresAuth: true, requiresAdmin: true, index: 2 },
			{ href: '/lag', label: 'Lag', icon: ShieldIcon, visibility: 'admin', requiresAuth: true, requiresAdmin: true, index: 3 }
		]
	}
];

export const routes: RouteLink[] = buildRouteTree(routeDefinitions);

export function getFullRoute(route: RouteLink): string {
	const parts: string[] = [];
	let current: RouteLink | undefined = route;

	while (current) {
		parts.unshift(current.href);
		current = current.parent;
	}

	const fullPath = parts.join('');
	return fullPath || '/';
}

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

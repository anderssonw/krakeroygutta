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
import PartnerExchangeIcon from '~icons/material-symbols/partner-exchange';

type RouteVisibility = 'public' | 'unauthenticated' | 'authenticated' | 'admin';

type RouteDefinition = {
	href: string;
	label: string;
	icon: Component<SvelteHTMLElements['svg']>;
	description: string;
	color: string;
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
	{
		href: '/',
		label: 'Hjem',
		icon: HomeIcon,
		description: 'Hovedside',
		color: 'bg-blue-500/30',
		visibility: 'public',
		requiresAuth: false,
		requiresAdmin: false,
		index: 0
	},
	{
		href: '/login',
		label: 'Logg inn',
		icon: LoginIcon,
		description: 'Logg inn på din konto',
		color: 'bg-gray-500/30',
		visibility: 'unauthenticated',
		requiresAuth: false,
		requiresAdmin: false,
		index: 1
	},
	{
		href: '/sesong',
		label: 'Sesong',
		icon: TrophyIcon,
		description: 'Utforsk sesongens innhold',
		color: 'bg-amber-500/30',
		visibility: 'authenticated',
		requiresAuth: true,
		requiresAdmin: false,
		index: 2,
		subRoutes: [
			{
				href: '/spillere',
				label: 'Spillere',
				icon: AccountGroupIcon,
				description: 'Se spillere og deres statistikk',
				color: 'bg-green-500/30',
				visibility: 'authenticated',
				requiresAuth: true,
				requiresAdmin: false,
				index: 0
			},
			{
				href: '/fantasy',
				label: 'Fantasy',
				icon: SparklesIcon,
				description: 'Lag ditt Fantasy-lag',
				color: 'bg-purple-500/30',
				visibility: 'authenticated',
				requiresAuth: true,
				requiresAdmin: false,
				index: 1
			},
			{
				href: '/kamper',
				label: 'Kamper',
				icon: SoccerIcon,
				description: 'Se kampoversikt og resultater',
				color: 'bg-orange-500/30',
				visibility: 'authenticated',
				requiresAuth: true,
				requiresAdmin: false,
				index: 2
			},
			{
				href: '/lag',
				label: 'Lag',
				icon: ShieldIcon,
				description: 'Se laginformasjon',
				color: 'bg-blue-500/30',
				visibility: 'authenticated',
				requiresAuth: true,
				requiresAdmin: false,
				index: 3
			},
			{
				href: '/veddemal',
				label: 'Veddemål',
				icon: PartnerExchangeIcon,
				description: 'Delta i veddemål',
				color: 'bg-amber-500/30',
				visibility: 'authenticated',
				requiresAuth: true,
				requiresAdmin: false,
				index: 4
			}
		]
	},

	{
		href: '/statistikk',
		label: 'Statistikk',
		icon: ChartBarIcon,
		description: 'Se detaljert statistikk',
		color: 'bg-cyan-500/30',
		visibility: 'authenticated',
		requiresAuth: true,
		requiresAdmin: false,
		index: 3
	},
	{
		href: '/profil',
		label: 'Profil',
		icon: AccountIcon,
		description: 'Din brukerprofil',
		color: 'bg-indigo-500/30',
		visibility: 'authenticated',
		requiresAuth: true,
		requiresAdmin: false,
		index: 4
	},
	{
		href: '/admin',
		label: 'Admin',
		icon: ShieldCrownIcon,
		description: 'Administrasjonspanel',
		color: 'bg-red-500/30',
		visibility: 'admin',
		requiresAuth: true,
		requiresAdmin: true,
		index: 5,
		subRoutes: [
			{
				href: '/sesonger',
				label: 'Sesonger',
				icon: CalendarIcon,
				description: 'Administrer sesonger',
				color: 'bg-blue-500/30',
				visibility: 'admin',
				requiresAuth: true,
				requiresAdmin: true,
				index: 0
			},
			{
				href: '/spillere',
				label: 'Spillere',
				icon: AccountGroupIcon,
				description: 'Rediger spillerinformasjon',
				color: 'bg-green-500/30',
				visibility: 'admin',
				requiresAuth: true,
				requiresAdmin: true,
				index: 1
			},
			{
				href: '/kamper',
				label: 'Kamper',
				icon: SoccerIcon,
				description: 'Legg til kamper og resultater',
				color: 'bg-orange-500/30',
				visibility: 'admin',
				requiresAuth: true,
				requiresAdmin: true,
				index: 2
			},
			{
				href: '/lag',
				label: 'Lag',
				icon: ShieldIcon,
				description: 'Administrer lag',
				color: 'bg-purple-500/30',
				visibility: 'admin',
				requiresAuth: true,
				requiresAdmin: true,
				index: 3
			}
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

// Protect routes
export const nonLoggedInRoutes = ['register', 'login'];
export const loggedInRoutes = ['season', 'fantasy', 'players', 'profile', 'teams', 'matches'];
export const adminRoutes = ['admin'];

// Navbar routes
export interface Route {
	name: string;
	url: string;
}
export interface MainRoute {
	route: Route;
	subRoute: Route[];
}

export const navNoSessionRoutes: MainRoute[] = [
	{
		route: {
			name: 'Hjem',
			url: '/'
		},
		subRoute: []
	},
	{
		route: {
			name: 'Logg inn',
			url: '/login'
		},
		subRoute: []
	}
];

export const navSessionRoutes: MainRoute[] = [
	{
		route: {
			name: 'Hjem',
			url: '/'
		},
		subRoute: []
	},
	{
		route: {
			name: 'Sesong',
			url: '/season'
		},
		subRoute: [
			{
				name: 'Spillere',
				url: '/players'
			},
			{
				name: 'Lag',
				url: '/teams'
			},
			{
				name: 'Kamper',
				url: '/matches'
			},
			{
				name: 'Veddemål',
				url: '/bets'
			}
		]
	},
	{
		route: {
			name: 'Mitt Lag',
			url: '/fantasy'
		},
		subRoute: []
	},
	{
		route: {
			name: 'Statistikk',
			url: '/statistics'
		},
		subRoute: []
	},
	{
		route: {
			name: 'Profil',
			url: '/profile'
		},
		subRoute: []
	}
];

export const navAdminRoutes: MainRoute[] = [
	{
		route: {
			name: 'Admin',
			url: '/admin'
		},
		subRoute: []
	}
];

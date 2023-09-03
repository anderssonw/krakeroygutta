
// Protect routes 
export const nonLoggedInRoutes = ['register', 'login']
export const loggedInRoutes = ['fantasy', 'players', 'profile', 'teams', 'matches'];
export const adminRoutes = ['admin'];

// Navbar routes
export interface Route {
    name: string;
    route: string;
}
export const navNoSessionRoutes: Route[] = [
    {
        name: "Hjem",
        route: "/"
    },
    {
        name: "Logg inn",
        route: "/login"
    },
    {
        name: "Registrer deg",
        route: "/register"
    }
]

export const navSessionRoutes: Route[] = [
    {
        name: "Sesong",
        route: "/"
    },
    {
        name: "Mitt lag",
        route: "/fantasy"
    },
    {
        name: "Profil",
        route: "/profile"
    }
]

export const navAdminRoutes: Route[] = [
    {
        name: "Admin",
        route: "/admin"
    },
]
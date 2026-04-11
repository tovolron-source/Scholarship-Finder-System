import { createBrowserRouter } from 'react-router';
import { LandingPage } from './pages/landing';
import { RegisterPage } from './pages/register';
import { LoginPage } from './pages/login';
import { SearchPage } from './pages/search';
import { ProfilePage } from './pages/profile';
import { NotFoundPage } from './pages/not-found';
import { DesignSystemPage } from './pages/design-system';
import { NotificationsPage } from './pages/notifications';
import { ScholarshipDetailPage } from './pages/scholarship-detail';
import { FavoritesPage } from './pages/favorites';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: LandingPage,
    },
    {
        path: '/register',
        Component: RegisterPage,
    },
    {
        path: '/login',
        Component: LoginPage,
    },
    {
        path: '/search',
        Component: SearchPage,
    },
    {
        path: '/scholarship/:id',
        Component: ScholarshipDetailPage,
    },
    {
        path: '/favorites',
        Component: FavoritesPage,
    },
    {
        path: '/profile',
        Component: ProfilePage,
    },
    {
        path: '/notifications',
        Component: NotificationsPage,
    },

    {
        path: '/design-system',
        Component: DesignSystemPage,
    },
    {
        path: '*',
        Component: NotFoundPage,
    },
]);
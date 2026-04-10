import { createBrowserRouter } from 'react-router';
import { LandingPage } from './pages/landing';
import { RegisterPage } from './pages/register';
import { LoginPage } from './pages/login';
import { SearchPage } from './pages/search';
import { ProfilePage } from './pages/profile';
import { NotFoundPage } from './pages/not-found';
import { DesignSystemPage } from './pages/design-system';
import { NotificationsPage } from './pages/notifications';

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
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
import { AdminDashboardPage } from './pages/admin/admin-dashboard';
import { AdminAccountSettingsPage } from './pages/admin/admin-account-settings';
import { CreateScholarshipPage } from './pages/admin/admin-scholarship-form';

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
        path: '/profile',
        Component: ProfilePage,
    },
    {
        path: '/notifications',
        Component: NotificationsPage,
    },
    {
        path: '/admin/dashboard',
        Component: AdminDashboardPage,
    },
    {
        path: '/admin/account-settings',
        Component: AdminAccountSettingsPage,
    },
    {
        path: '/admin/create-scholarship',
        Component: CreateScholarshipPage,
    },
    {
        path: '/admin/edit-scholarship/:id',
        Component: CreateScholarshipPage,
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
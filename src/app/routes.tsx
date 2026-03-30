import { createBrowserRouter } from 'react-router';
import { LandingPage } from './pages/landing';
import { RegisterPage } from './pages/register';
import { LoginPage } from './pages/login';
import { ErrorPage } from './pages/error';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: LandingPage,
        errorElement: <ErrorPage />,
    },
    {
        path: '/register',
        Component: RegisterPage,
        errorElement: <ErrorPage />,
    },
    {
        path: '/login',
        Component: LoginPage,
        errorElement: <ErrorPage />,
    },
]);
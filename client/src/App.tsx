import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { FC, ReactElement, Suspense } from 'react';
import { Header } from './components/Header';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Home } from './pages/Home';
import { Logout } from './pages/Logout';
import { OrganisationList } from './pages/OrganisationList';
import { useAuthenticationContext } from './AuthenticationContext';
import { LoadingPage } from './components/LoadingPage';
import { CreateOrganisation } from './pages/CreateOrganisation';

const ProtectedRoute: FC<{ children: ReactElement }> = ({ children }) => {
    const { token } = useAuthenticationContext();

    if (!token) {
        return <Navigate to="/" />;
    }

    return children;
};

export const Root = () => (
    <Suspense fallback={<LoadingPage />}>
        <Header />
        <Outlet />
    </Suspense>
);

export const router = createBrowserRouter([{
    path: '/',
    element: <Root />,
    children: [
        {
            path: '/sign-up',
            element: <SignUp />,
        },
        {
            path: '/sign-in',
            element: <SignIn />,
        },
        {
            path: '/organisations',
            element: <ProtectedRoute><OrganisationList /></ProtectedRoute>,
        },
        {
            path: '/organisations/create',
            element: <ProtectedRoute><CreateOrganisation /></ProtectedRoute>,
        },
        {
            path: '/',
            element: <Home />,
        },
    ],
}, {
    path: '/logout',
    element: <Logout />,
}]);

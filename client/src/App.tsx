import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { FC, ReactElement, Suspense } from 'react';
import { ErrorPage } from 'pages/Error';
import { Header } from './components/Header';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Home } from './pages/Home';
import { OrganisationList } from './pages/OrganisationList';
import { useAuthenticationContext } from './AuthenticationContext';
import { LoadingPage } from './components/LoadingPage';
import { OrganisationRoot } from './pages/organisation';
import { CreateOrganisation } from './pages/CreateOrganisation';
import { ProfileContextProvider } from './ProfileContext';
import { ConfirmationContextProvider } from './ConfirmationContext';

const ProtectedRoute: FC<{ children: ReactElement }> = ({ children }) => {
    const { token } = useAuthenticationContext();

    if (!token) {
        return <Navigate to="/" />;
    }

    return children;
};

export const Root = () => (
    <Suspense fallback={<LoadingPage />}>
        <ConfirmationContextProvider>
            <ProfileContextProvider>
                <Header />
                <Suspense fallback={<LoadingPage />}>
                    <Outlet />
                </Suspense>
            </ProfileContextProvider>
        </ConfirmationContextProvider>
    </Suspense>
);

export const router = createBrowserRouter([{
    path: '',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [{
        path: 'sign-up',
        element: <SignUp />,
    }, {
        path: 'sign-in',
        element: <SignIn />,
    }, {
        path: 'organisations/:organisationName/*',
        element: <ProtectedRoute><OrganisationRoot /></ProtectedRoute>,
    }, {
        path: 'organisations',
        element: <ProtectedRoute><OrganisationList /></ProtectedRoute>,
    }, {
        path: 'organisations/create',
        element: <ProtectedRoute><CreateOrganisation /></ProtectedRoute>,
    }, {
        index: true,
        element: <Home />,
    }],
}]);

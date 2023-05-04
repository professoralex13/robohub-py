import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { ErrorPage } from 'pages/Error';
import { Settings } from 'pages/Settings';
import { ProtectedRoute } from 'components/ProtectedRoute';
import { ConfirmationContextProvider } from 'contexts/ConfirmationContext';
import { ProfileContextProvider } from 'contexts/ProfileContext';
import { Header } from './components/Header';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Home } from './pages/Home';
import { OrganisationList } from './pages/OrganisationList';
import { LoadingPage } from './components/LoadingPage';
import { OrganisationRoot } from './pages/organisation';
import { CreateOrganisation } from './pages/CreateOrganisation';

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
        path: 'settings',
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
    }, {
        index: true,
        element: <Home />,
    }],
}]);

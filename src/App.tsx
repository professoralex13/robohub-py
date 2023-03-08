import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { SignUp } from './pages/SignUp';

export const Root = () => (
    <>
        <Header />
        <Outlet />
    </>
);

export const router = createBrowserRouter([{
    path: '/',
    element: <Root />,
    children: [
        {
            path: '/sign-up',
            element: <SignUp />,
        },
    ],
}]);

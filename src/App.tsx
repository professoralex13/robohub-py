import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { SignIn } from './pages/SignIn';
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
    loader: () => {
        console.log('loading');
        return new Promise((resolve) => {
            setTimeout(() => resolve({}), 1000);
        });
    },
    children: [
        {
            path: '/sign-up',
            element: <SignUp />,
        },
        {
            path: '/sign-in',
            element: <SignIn />,
        },
    ],
}]);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './App';
import { AuthenticationProvider } from './AuthenticationContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <AuthenticationProvider>
        <RouterProvider router={router} />
    </AuthenticationProvider>,
);

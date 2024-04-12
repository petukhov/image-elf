import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import MainPage from './pages/MainPage';
import MainPage2 from './pages/MainPage2';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
    },
    {
        path: '/refactor',
        element: <MainPage2 />,
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
]);

export default router;

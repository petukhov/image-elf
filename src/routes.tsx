import { createBrowserRouter } from 'react-router-dom';
import MainPageOld from './old-code/MainPage';
import ErrorPage from './pages/ErrorPage';
import MainPage from './pages/MainPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
    },
    {
        path: '/old',
        element: <MainPageOld />,
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
]);

export default router;

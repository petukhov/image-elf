import { isMobile } from 'react-device-detect';
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import MainPage from './pages/MainPage';
import TouchPage from './pages/TouchPage';

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={isMobile ? <TouchPage /> : <MainPage />}></Route>
            <Route path="*" element={<ErrorPage />}></Route>
        </>,
    ),
);

export default router;

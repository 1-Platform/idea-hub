import { HomePage } from '../pages/HomePage';
import { IdeaDetailPage } from '../pages/IdeaDetailPage';

export const routesArray = [
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/idea/:id',
        element: <IdeaDetailPage />,
    },
];

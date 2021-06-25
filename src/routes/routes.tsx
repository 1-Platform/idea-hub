import { AppLayout } from 'layouts';
import { HomePage } from 'pages/HomePage';
import { IdeaDetailPage } from 'pages/IdeaDetailPage';

export const routesArray = [
  {
    path: '/',
    element: (
      <AppLayout>
        <HomePage />,
      </AppLayout>
    ),
  },
  {
    path: '/idea/:id',
    element: (
      <AppLayout>
        <IdeaDetailPage />,
      </AppLayout>
    ),
  },
];

import { AppLayout } from 'layouts';
import { HomePage } from 'pages/HomePage';
import { IdeaDetailPage } from 'pages/IdeaDetailPage';

export const routesArray = [
  {
    path: '/',
    exact: true,
    element: (
      <AppLayout>
        <HomePage />
      </AppLayout>
    ),
  },
  {
    path: '/:id',
    element: (
      <AppLayout>
        <IdeaDetailPage />
      </AppLayout>
    ),
  },
];

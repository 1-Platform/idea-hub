import { JSXElementConstructor, ReactElement } from 'react';
import { useRoutes } from 'react-router-dom';
import { routesArray } from './routes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Router = (): ReactElement<any, string | JSXElementConstructor<any>> | null => {
  const routes = useRoutes(routesArray, process.env.PUBLIC_URL);

  return routes;
};

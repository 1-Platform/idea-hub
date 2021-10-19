import { BrowserRouter } from 'react-router-dom';

import { Router } from './routes';
import './App.scss';

import opcBase from '@one-platform/opc-base';
import '@one-platform/opc-base/dist/opc-provider';

opcBase.configure({
  apiBasePath: process.env.REACT_APP_OPCBASE_API_BASE_PATH as string,
  subscriptionsPath: process.env.REACT_APP_OPCBASE_SUBSCRIPTION_BASE_PATH as string,
  keycloakUrl: process.env.REACT_APP_OPCBASE_KEYCLOAK_URL as string,
  keycloakClientId: process.env.REACT_APP_OPCBASE_KEYCLOAK_CLIENT_ID as string,
  keycloakRealm: process.env.REACT_APP_OPCBASE_KEYCLOAK_REALM as string,
});

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <opc-provider>
        <opc-nav></opc-nav>
        <opc-menu-drawer></opc-menu-drawer>
        <opc-notification-drawer></opc-notification-drawer>
        <opc-feedback theme="blue"></opc-feedback>
      </opc-provider>
      <Router />
    </BrowserRouter>
  );
};

export default App;

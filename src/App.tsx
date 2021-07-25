import { BrowserRouter } from 'react-router-dom';

import { PouchDBProvider } from 'context';
import { Router } from './routes';
import './App.scss';

const App = (): JSX.Element => {
  return (
    <PouchDBProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </PouchDBProvider>
  );
};

export default App;

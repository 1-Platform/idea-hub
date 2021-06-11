import { BrowserRouter } from 'react-router-dom';

import { Router } from './routes';

import '@patternfly/react-core/dist/styles/base.css';

import './App.scss';

const App = (): JSX.Element => {
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    );
};

export default App;

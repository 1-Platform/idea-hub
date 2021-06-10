import { Router } from './routes';

import './App.css';
import { BrowserRouter } from 'react-router-dom';

const App = (): JSX.Element => {
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    );
};

export default App;

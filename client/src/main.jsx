import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import {ChainId,ThirdwebProvider} from '@thirdweb-dev/react';
import { StateContextProvider } from './context';

import App from './App';
import './index.css';

const root=ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ThirdwebProvider activeChain={ChainId.Mumbai} clientId='8394fbd4be72ba941d6ce077ce5892fa'>
        <Router>
            <StateContextProvider>
                <App/>
            </StateContextProvider>
            
        </Router>

    </ThirdwebProvider>
);

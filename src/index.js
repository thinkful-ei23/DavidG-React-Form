import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import store from './store';
import ComplaintForm from './components/complaint-form';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Provider store={store}>
        <ComplaintForm />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
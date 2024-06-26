/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom/client';
/* eslint-enable */

import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store'; // Import your Redux store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import {OrderList} from './order-list/index.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <OrderList />
  </React.StrictMode>
);

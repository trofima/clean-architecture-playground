import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router'
import {router} from './dependencies/router.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

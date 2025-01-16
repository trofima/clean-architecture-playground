import React from 'react';
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router'
import { createBrowserRouter } from 'react-router'
import {routes} from './routes.js'
import {appNavigator} from './dependencies/navigator.jsx'

const router = createBrowserRouter(routes);
const root = ReactDOM.createRoot(document.getElementById('root'))

appNavigator.use(router)
root.render(
  <RouterProvider router={router} />
);

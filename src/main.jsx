import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import AuthProvider from './provider/AuthProvider.jsx';
import HomeLayout from './components/HomeLayout.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute><HomeLayout /></PrivateRoute>,
    children: [
      {
        path: "/",
        element: <App />,
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)

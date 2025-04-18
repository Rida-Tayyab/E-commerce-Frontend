import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './global.scss'
import store from './store';
import { Provider } from 'react-redux';
import Home from './pages/Home/index.jsx';
import Login from './pages/loginpage/index.jsx';
import Signup from './pages/Signup/index.jsx';
import DashBoard from './pages/DashBoard/index.jsx';
import Category from './pages/Category/index.jsx';
import Cart from './pages/Cart/index.jsx';
import ItemDetails from './pages/ItemDetails/index.jsx';
import SellerDashboard from './pages/SellerDashboard/index.jsx';
import RegisterStore from './pages/RegisterStore/index.jsx';
import StoreLogin from './pages/StoreLogin/index.jsx';

const AppContext = React.createContext({});

const theme = createTheme({
    palette: {
        primary: {
            main: '#003C43',
        },
    },
    typography: {
        fontFamily: [
            'Raleway',
            'sans-serif',
        ].join(','),
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/regstore",
        element: <RegisterStore />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/Dashboard",
        element: <DashBoard/>,
    },
    {
        path: "/Category",
        element: <Category/>,
    },
    {
        path: "/Cart",
        element: <Cart/>,
    },
    {
        path:"/ItemDetails/:id",
        element: <ItemDetails/>,
    },
    
    {
        path:"/store-login",
        element: <StoreLogin/>,
    },
    {
        path:"/seller-dashboard",
        element: <SellerDashboard/>,
    }
]);

const App = () => {
    return (
        <Provider store={store}>
            <AppContext.Provider value={{}}>
                <ThemeProvider theme={theme}>
                    <RouterProvider router={router} />
                </ThemeProvider>
            </AppContext.Provider>
        </Provider>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
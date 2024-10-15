import React from "react"; 
import { useRoutes } from "react-router-dom";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardPage from "../Pages/DashboardPage";
import AboutPage from "../Pages/AboutPage";
import ProductsPage from "../Pages/ProductsPage";
import SettingsPage from "../Pages/SettingsPage";
import LoginPage from "../Users/LoginPage";
import RegisterPage from "../Users/RegisterPage";
import ForgetPassPage from '../Users/ForgetPassPage';
import ConfirmForgetPass from '../Users/ConfirmForgetPass';
import Checklists from "../Pages/Check-lists";
const Routees= () => {
    const pages = useRoutes([
        {
            path:'/',
            element: <DashboardLayout/>,

            children:[
                {
                    index: true,
                    element: <DashboardPage/>
                },
                {
                    path: 'about',
                    element: < AboutPage/>
                },
                {
                    path:'checklist',
                    element:<Checklists/>
                },
                {
                    path: 'dashboard',
                    children:[
                        {
                            path:'products',
                            element: <ProductsPage/>
                        },
                        {
                            path: 'settings',
                            element:<SettingsPage/>
                        },
                    ],
                },
            ],
           
        },
        {
            path:'login',
            element:<LoginPage/>
        },
        {
            path: 'register',
            element: <RegisterPage/>
        },
        {
            path: 'forget-password',
            element: <ForgetPassPage/>
        },
        {
            path:'reset-password',
            element: <ConfirmForgetPass/>
        },
       
    ]);
    return pages;
};

export default Routees;
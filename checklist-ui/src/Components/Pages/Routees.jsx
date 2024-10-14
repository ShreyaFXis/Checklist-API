import React from "react"; 
import { useRoutes } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import DashboardPage from "./DashboardPage";
import AboutPage from "./AboutPage";
import ProductsPage from "./ProductsPage";
import SettingsPage from "./SettingsPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ForgetPassPage from './ForgetPassPage';
import ConfirmForgetPass from './ConfirmForgetPass';
import Checklists from "./Check-lists";
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
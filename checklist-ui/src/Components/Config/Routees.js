import React from "react"; 
import DashboardLayout from "../Layouts/DashboardLayout";
import AuthLayout from "../Layouts/AuthLayout";
import DashboardPage from "../Pages/DashboardPage";
import AboutPage from "../Pages/AboutPage";
import ProductsPage from "../Pages/ProductsPage";
import SettingsPage from "../Pages/SettingsPage";
import LoginPage from "../Pages/Users/LoginPage";
import RegisterPage from "../Pages/Users/RegisterPage";
import ForgetPassPage from '../Pages/Users/ForgetPassPage';
import ConfirmForgetPass from '../Pages/Users/ConfirmForgetPass';
import Checklists from "../Pages/Checklists/Check-lists";
const Routees= [
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
                path:'checklists',
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
        path:'/',
        element:<AuthLayout/>,

        children:[
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

        ],
    },
   
];

export default Routees;
import './App.css';
import LoginPage from './Components/Pages/LoginPage';
import RegistrationPage from './Components/Pages/RegisterPage';
import ForgetPassPage from './Components/Pages/ForgetPassPage';
import ConfirmForgetPass from './Components/Pages/ConfirmForgetPass';
import DashboardLayout from './Components/Pages/DashboardLayout'; // Import DashboardLayout
import AboutPage from './Components/Pages/AboutPage'; // Import AboutPage component
import ProductsPage from './Components/Pages/ProductsPage'; // Import ProductsPage component
import SettingsPage from './Components/Pages/SettingsPage'; // Import SettingsPage component
import DashboardPage from './Components/Pages/DashboardPage'; // Import DashboardPage component
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} /> {/* Default page for the dashboard */}
            <Route path='about' element={<AboutPage />} />
            <Route path='dashboard/products' element={<ProductsPage />} />
            <Route path='dashboard/settings' element={<SettingsPage />} />
          </Route>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegistrationPage />} />
          <Route path='/forget-password' element={<ForgetPassPage />} />
          <Route path="/reset-password" element={<ConfirmForgetPass />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

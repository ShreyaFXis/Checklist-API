
import './App.css';
import LoginPage from './Components/Pages/LoginPage';
import RegistrationPage from './Components/Pages/RegisterPage';
import ForgetPassPage from './Components/Pages/ForgetPassPage';
import ConfirmForgetPass from './Components/Pages/ConfirmForgetPass';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' Component={LoginPage}/>
          <Route path='/register' Component={RegistrationPage}/>
          <Route path='/forgetpass' Component={ForgetPassPage}/>
          <Route path="/confirm-forget-password" element={<ConfirmForgetPass />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
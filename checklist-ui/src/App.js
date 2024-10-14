import './App.css';
import Routees from './Components/Pages/Routees';
import {BrowserRouter as Router, Routes, useRoutes} from 'react-router-dom';

const AppWrapper = () => {
  let element = useRoutes([
    {
      path:'*',
      element: <Routees />
    }
  ]);
  return element;
};

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;

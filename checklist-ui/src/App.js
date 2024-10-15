import './App.css';
import Routees from './Components/Config/Routees';
import {BrowserRouter as Router, useRoutes} from 'react-router-dom';

const AppWrapper = () => {
  let element = useRoutes(Routees);
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
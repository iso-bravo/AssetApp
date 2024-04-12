import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Assets from './pages/Assets';
import UsersPage from './pages/Users';
import CatalogsPage from "./pages/Catalogs";
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/assets" element={<Assets />}/>
        <Route path="/users" element={<UsersPage />}/>
        <Route path="/catalogs" element={<CatalogsPage />}/>
      </Routes>
    </Router>
  );
}

export default App;


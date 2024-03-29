import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import Assets from './pages/Assets';
import UsersPage from './pages/Users';
import CatalogsPage from "./pages/Catalogs";
import TagsPage from "./pages/Tags";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/assets" element={<Assets />}/>
        <Route path="/users" element={<UsersPage />}/>
        <Route path="/catalogs" element={<CatalogsPage />}/>
        <Route path="/tags" element={<TagsPage />}/>
      </Routes>
    </Router>
  );
}

export default App;


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import MainPage from './pages/MainPage';
import Assets from './pages/Assets';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/assets" element={<Assets />}/>
      </Routes>
    </Router>
  );
}

export default App;


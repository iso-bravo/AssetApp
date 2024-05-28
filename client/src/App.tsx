// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Assets from "./pages/Assets";
import UsersPage from "./pages/Users";
import CatalogsPage from "./pages/Catalogs";
import Home from "./pages/Home";
import { AuthProvider } from "./auth/Auth";
import AuthContext from "./auth/Auth";

const App: React.FC = () => {
  const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
    const authContext = React.useContext(AuthContext);
    return authContext?.user ? element : <Navigate to="/" />;
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route
            path="/assets"
            element={<PrivateRoute element={<Assets />} />}
          />
          <Route
            path="/users"
            element={<PrivateRoute element={<UsersPage />} />}
          />
          <Route
            path="/catalogs"
            element={<PrivateRoute element={<CatalogsPage />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

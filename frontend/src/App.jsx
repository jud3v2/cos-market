import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import AdminLayout from './layouts/admin/AdminLayout';
import LoginAdmin from './views/admin/LoginAdmin';
import AdminPanel from './views/admin/AdminPanel';
import Clients from './views/admin/Clients';
import ProtectedRoute from './components/ProtectedRoute';
import SteamLogin from './views/SteamLogin.jsx';
import SteamLoginSuccess from './views/SteamLoginSuccess.jsx';
import './App.css';
import Product from "./views/admin/Product.jsx";

function App() {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const isAdmin = JSON.parse(localStorage.getItem('user'))?.roles.includes('admin');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/panel" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}><AdminLayout><AdminPanel /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/clients" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}><AdminLayout><Clients /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}><AdminLayout><Product /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/steam-login" element={<SteamLogin />} />
        <Route path="/admin/steam-login-success" element={<SteamLoginSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;

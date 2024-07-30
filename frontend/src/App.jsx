import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import Products from './page/Products.jsx';
import AdminLayout from './layouts/admin/AdminLayout';
import LoginAdmin from './views/admin/LoginAdmin';
import AdminPanel from './views/admin/AdminPanel';
import Clients from './views/admin/Clients';
import ProtectedRoute from './components/ProtectedRoute';
import Panier from './page/Panier';
import './App.css';
import Product from "./views/admin/Product.jsx";

function App() {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const isAdmin = JSON.parse(localStorage.getItem('user'))?.roles.includes('admin');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produits" element={<Products />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/panel" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}><AdminLayout><AdminPanel /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/clients" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}><AdminLayout><Clients /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}><AdminLayout><Product /></AdminLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import Products from './page/Products.jsx';
import AdminLayout from './layouts/admin/AdminLayout';
import ClientLayout from './layouts/client/ClientLayout';
import LoginAdmin from './views/admin/LoginAdmin';
import AdminPanel from './views/admin/AdminPanel';
import Clients from './views/admin/Clients';
import ProtectedRoute from './components/ProtectedRoute';
import Product from "./views/admin/Product.jsx";
import Panier from './page/Panier';
import './App.css';
import ProductDetail from './components/ProductDetails.jsx';

function App() {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const isAdmin = JSON.parse(localStorage.getItem('user'))?.roles.includes('admin');

  return (
      <Router>
        <Routes>
        <Route path="/" element={<ClientLayout><Home /></ClientLayout>} />
          <Route path="/produits" element={<ClientLayout><Products /></ClientLayout>} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/panel" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}><AdminLayout><AdminPanel /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/clients" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}><AdminLayout><Clients /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}><AdminLayout><Product /></AdminLayout></ProtectedRoute>} />
          <Route path="/product/:id" element={<ClientLayout><ProductDetail /></ClientLayout>} />

        </Routes>
      </Router>
  );
}

export default App;
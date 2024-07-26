import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginAdmin from './views/admin/LoginAdmin';
import AdminPanel from './views/admin/AdminPanel';
import AdminLayout from './layouts/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const isAdmin = JSON.parse(localStorage.getItem('user'))?.roles.includes('admin');

  console.log(isAuthenticated);
  console.log(isAdmin);

  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin-panel" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}><AdminLayout /></ProtectedRoute>}>
          <Route path="clients" element={<AdminPanel />} />
          <Route path="products" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
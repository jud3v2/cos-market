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
import Checkout from './page/Checkout';
import ProductDetails from './components/ProductDetails';
import './App.css';
import ReactToastify from "./components/ReactToastify.jsx";
import SteamLogin from "./views/SteamLogin.jsx";
import CosAimLAb from "./page/CosAimLab.jsx";

function App() {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const isAdmin = JSON.parse(localStorage.getItem('user'))?.roles.includes('admin');

  function Layout(Page, Layout, pageProps, layoutProps) {
    return Layout ? (
        <Layout {...layoutProps}>
                <Page {...pageProps} />
                <ReactToastify />
        </Layout>
    ) : <Page {...pageProps} />;
}

        const adminProtectedRoute = (Page, layoutProps, pageProps) => {
                return <ProtectedRoute isAdmin={isAdmin} isAuthenticated={isAuthenticated} >
                        {Layout(Page, AdminLayout, pageProps, layoutProps)}
                </ProtectedRoute>
        }

  return (
      <Router>
              <Routes>
                      <Route path="/" element={Layout(Home, ClientLayout, {}, {})} />
                      <Route path="/produits" element={Layout(Products, ClientLayout, {}, {})} />
                      <Route path="/panier" element={Layout(Panier, ClientLayout,  {}, {})} />
                      <Route path="/checkout" element={Layout(Checkout, ClientLayout,  {}, {})} />
                      <Route path="/cos-aim-lab" element={Layout(CosAimLAb, ClientLayout,  {}, {})} />
                      <Route path="/admin/login" element={Layout(LoginAdmin)} />
                      <Route path="/admin/panel" element={adminProtectedRoute(AdminPanel)} />
                      <Route path="/admin/clients" element={adminProtectedRoute(Clients)} />
                      <Route path="/admin/products" element={adminProtectedRoute(Product)} />
                      <Route path="/admin/panel" element={adminProtectedRoute(AdminPanel)} />
                      <Route path="/admin/clients" element={adminProtectedRoute(Clients)} />
                      <Route path="/admin/products" element={adminProtectedRoute(Product)} />
                      <Route path="/product/:id" element={Layout(ProductDetails, ClientLayout, {}, {})} />
                      <Route path={"/steam/login"} element={Layout(SteamLogin, ClientLayout, {}, {})} />
              </Routes>
      </Router>
  );
}

export default App;
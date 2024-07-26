import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginAdmin from './views/admin/LoginAdmin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<LoginAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
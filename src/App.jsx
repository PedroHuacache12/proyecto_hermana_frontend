import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Catalogos from './pages/Catalogos';
import Analytics from './pages/Analytics';
import Usuarios from './pages/Usuarios';
import CatalogoPublico from './pages/CatalogoPublico';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/c/:slug" element={<CatalogoPublico />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<Productos />} />
            <Route path="catalogos" element={<Catalogos />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

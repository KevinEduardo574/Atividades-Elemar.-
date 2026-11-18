import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Registros from './pages/Registros'
import NovoRegistro from './pages/NovoRegistro'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/registros" element={<Registros />} />
        <Route path="/registros/novo" element={<NovoRegistro />} />
      </Route>

      <Route path="*" element={<Navigate to="/registros" replace />} />
    </Routes>
  )
}

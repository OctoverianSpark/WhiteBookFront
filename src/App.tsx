import { useEffect, useState } from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SaveProvider from './views/admin/SaveProvider.tsx'
import ProvidersTable from './views/user/ProvidersTable.tsx'
import { Toaster } from 'react-hot-toast'
import Login from './views/user/Login.tsx'
import VerifyEmail from './views/user/VerifyEmail.tsx'
import Logout from './views/user/Logout.tsx'
import ProtectedRoute from './views/admin/ProtectedRoute.tsx'
import Sidebar from './components/Sidebar.tsx'
import Index from './views/Index.tsx'
import ForgotPass from './views/user/ForgotPass.tsx'
import ResetPass from './views/user/ResetPass.tsx'
import AdminTable from './views/admin/AdminTable.tsx'

document.documentElement.setAttribute('data-theme', 'light')
const apiUrl = import.meta.env.VITE_API_URL

console.log(apiUrl)

function App () {
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'))
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <div className='app'>
      <Toaster position='top-right' />
      <BrowserRouter>
        {token && <Sidebar />}
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={<Login onLogin={setToken} />} />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route
            path='/admin/save'
            element={
              <ProtectedRoute requiredRole='admin'>
                <SaveProvider />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/update'
            element={
              <ProtectedRoute requiredRole='admin'>
                <SaveProvider />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/providers'
            element={
              <ProtectedRoute requiredRole='admin'>
                <AdminTable />
              </ProtectedRoute>
            }
          />
          <Route
            path='/providers'
            element={
              <ProtectedRoute>
                <ProvidersTable />
              </ProtectedRoute>
            }
          />
          <Route
            path='/logout'
            element={<Logout onLogout={() => setToken(null)} />}
          />
          <Route path='/forgot-pass' element={<ForgotPass />} />
          <Route path='/reset-pass/:token' element={<ResetPass />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

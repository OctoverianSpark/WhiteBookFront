// src/pages/Logout.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface logoutProps {
  onLogout: () => void
}

const Logout = ({ onLogout }: logoutProps) => {
  const navigate = useNavigate()
  useEffect(() => {
    localStorage.removeItem('token')
    onLogout() // Notifica al componente App que ya no hay sesión
    navigate('/login')
  }, [])

  return null
}

export default Logout

import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { SunMedium, Moon } from 'lucide-react'

const token = localStorage.getItem('token')
export default function Sidebar () {
  const [role, setRole] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setRole(decoded.role)
      } catch {
        localStorage.removeItem('token')
      }
    }
  }, [token])

  const getInitialTheme = () => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <aside className='sidebar'>
      <button type='button' className='theme-btn' onClick={toggleTheme}>
        {theme === 'dark' && <SunMedium />}
        {theme === 'light' && <Moon />}
      </button>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <button type='button' onClick={() => navigate('/')}>
              Inicio
            </button>
          </li>
          {role === 'common' && (
            <li>
              <button type='button' onClick={() => navigate('/providers')}>
                Ver Proveedores
              </button>
            </li>
          )}
          {role === 'admin' && (
            <>
              <li>
                <button
                  type='button'
                  onClick={() =>
                    navigate('/admin/save', { state: { mode: 'create' } })
                  }
                >
                  Agregar Proveedor
                </button>
              </li>
              <li>
                <button
                  type='button'
                  onClick={() => navigate('/admin/providers')}
                >
                  Ver Proveedores
                </button>
              </li>
            </>
          )}
          <li>
            <button type='button' onClick={() => navigate('/logout')}>
              Cerrar Sesi&oacute;n
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

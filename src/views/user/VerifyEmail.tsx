// src/pages/VerifyEmail.jsx
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/verify-email?token=${token}`)
        .then(() => {
          alert('Correo verificado con éxito')
          location.href = '/'
        })
        .catch(() => {
          alert('Error al verificar el correo')
        })
    }
  }, [token])

  return <p>Verificando tu correo...</p>
}

export default VerifyEmail

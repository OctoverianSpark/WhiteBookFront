import { useState, type FormEvent } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ForgotPassword () {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const loading = toast.loading('Cargando solicitud...')
    await axios
      .post(`${import.meta.env.VITE_API_URL}/forgot-pass`, { email })
      .then(res => {
        toast.dismiss(loading)
        toast.success('Si el correo existe, te enviamos instrucciones.')
        setSent(true)
        console.log(res)
      })
      .catch(err => {
        toast.dismiss(loading)
        toast.error('Error al enviar solicitud')
        console.log(err)
      })
  }

  return (
    <div className='forgot-password'>
      <h2>¿Olvidaste tu contraseña?</h2>
      {!sent ? (
        <form onSubmit={handleSubmit}>
          <label className='input-group'>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <span className='placeholder'>Ingresa tu correo</span>
          </label>
          <button type='submit' className='primary-btn'>
            Enviar enlace
          </button>
        </form>
      ) : (
        <p>Revisa tu correo para restablecer tu contraseña.</p>
      )}
    </div>
  )
}

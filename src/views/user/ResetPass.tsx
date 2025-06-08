import { useParams, useNavigate } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ResetPass () {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reset-pass/${token}`, {
        password
      })
      toast.success('Contraseña actualizada')
      navigate('/login')
    } catch (error) {
      toast.error('Token inválido o expirado')
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Restablece tu contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='password' className='input-group'>
          <input
            type={'password'}
            id='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <span className='placeholder'>Contraseña</span>
        </label>
        <label htmlFor='confirm-password' className='input-group'>
          <input
            type={'password'}
            id='confirm-password'
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          <span className='placeholder'>Confirmar contraseña</span>
        </label>

        <button className='primary-btn' type='submit'>
          Actualizar contraseña
        </button>
      </form>
    </div>
  )
}

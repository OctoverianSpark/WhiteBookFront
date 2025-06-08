import axios from 'axios'
import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

interface LoginProps {
  onLogin: (token: string | null) => void
}

export default function Login ({ onLogin }: LoginProps) {
  const [form, setForm] = useState('login')
  const navigate = useNavigate()

  const register = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const loading = toast.loading('Procesando informacion...')
    await axios
      .post(`${import.meta.env.VITE_API_URL}/register`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        toast.dismiss(loading)
        toast.success(
          'Usuario registrado, enviamos a tu correo un enlace de verificacion'
        )
      })
      .catch(err => {
        toast.dismiss(loading)
        toast.error(err.response.data.err)
      })
  }

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    await axios
      .post(`${import.meta.env.VITE_API_URL}/login`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        const token = res.data.token
        localStorage.setItem('token', token)
        onLogin(token)
        toast.success('Sesión iniciada')
        navigate('/')
      })
      .catch(error => toast.error(error.response.data.error))
  }

  return (
    <div className='login-container'>
      <div className='tab-bar'>
        <label htmlFor='login' className='tab-group'>
          <input
            type='radio'
            id='login'
            value={'login'}
            checked={form === 'login'}
            onClick={e => setForm(e.currentTarget.value)}
            name='tab'
          />
          <span>Iniciar sesion</span>
        </label>
        <label htmlFor='register' className='tab-group'>
          <input
            type='radio'
            id='register'
            value={'register'}
            checked={form === 'register'}
            onClick={e => setForm(e.currentTarget.value)}
            name='tab'
          />
          <span>Registrarse</span>
        </label>
      </div>

      <form
        method='post'
        className={`login-form ${form === 'login' ? 'active' : ''}`}
        onSubmit={login}
      >
        <h2>Bienvenido de nuevo</h2>
        <label htmlFor='username' className='input-group'>
          <input type='text' name='username' id='username' required />
          <span className='placeholder'>Nombre de Usuario</span>
        </label>
        <label htmlFor='password' className='input-group'>
          <input type='password' name='password' required id='password' />
          <span className='placeholder'>Contraseña</span>
        </label>

        <button type='submit' className='primary-btn'>
          Iniciar sesi&oacute;n
        </button>
        <a href='/forgot-pass'>Olvide mi contraseña</a>
      </form>
      <form
        method='post'
        className={`register-form ${form === 'register' ? 'active' : ''}`}
        onSubmit={register}
      >
        <h2>Un gusto en conocerte</h2>
        <div className='form-inputs'>
          <label htmlFor='name' className='input-group'>
            <input type='text' name='name' id='name' required />
            <span className='placeholder'>Nombre completo</span>
          </label>
          <label htmlFor='email' className='input-group'>
            <input type='email' name='email' id='email' required />
            <span className='placeholder'>Correo electronico</span>
          </label>
          <label htmlFor='username' className='input-group'>
            <input type='text' name='username' id='username' required />
            <span className='placeholder'>Nombre de Usuario</span>
          </label>
          <label htmlFor='password' className='input-group'>
            <input type='password' name='password' required id='password' />
            <span className='placeholder'>Contraseña</span>
          </label>
          <label htmlFor='password_confirm' className='input-group'>
            <input
              type='password'
              name='password_confirm'
              required
              id='password_confirm'
            />
            <span className='placeholder'>Confirma tu contraseña</span>
          </label>

          <button type='submit' className='primary-btn'>
            Unete ahora!
          </button>
        </div>
      </form>
    </div>
  )
}

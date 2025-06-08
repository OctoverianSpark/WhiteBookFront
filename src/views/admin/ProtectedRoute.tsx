import React from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

interface TokenPayload {
  exp: number
  role: string
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token')

  if (!token) return <Navigate to='/login' replace />

  try {
    const decoded = jwtDecode<TokenPayload>(token)
    const now = Date.now() / 1000

    if (decoded.exp < now) {
      localStorage.removeItem('token')
      return <Navigate to='/login' replace />
    }

    if (requiredRole && decoded.role !== requiredRole) {
      return <Navigate to='/' replace />
    }

    return children
  } catch (error) {
    console.log(error)
    localStorage.removeItem('token')
    return <Navigate to='/login' replace />
  }
}

export default ProtectedRoute

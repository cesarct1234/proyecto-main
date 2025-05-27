import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const HomePage = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState('') 

  useEffect(() => {
    const userRole = Cookies.get('role')
    setRole(userRole)
  }, [])

  const handleCargarArchivos = () => {
    navigate('/load-archive')
  }

  const handleUsuarios = () => {
    navigate('/users')
  }

  const handleActualizarDatos = () => {
    navigate('/update-user')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-[#E6EEF8] rounded-lg p-16">
        <div className="flex justify-between items-center">
          {/* Cargar Archivos - Solo Admin */}
          {role === 'admin' && (
            <div className="flex flex-col items-center">
              <div className="text-[#1E88E5] mb-4">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 10v6h6v-6h4l-7-7-7 7h4zm-1 8v2h8v-2H8z" />
                </svg>
              </div>
              <Button
                className="bg-[#1E88E5] hover:bg-blue-600 text-white rounded-full px-6"
                onClick={handleCargarArchivos}
              >
                Cargar archivos
              </Button>
            </div>
          )}

          {/* Visualizar Proyecciones - Todos */}
          <div className="flex flex-col items-center">
            <div className="text-[#1E88E5] mb-4">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <Button className="bg-[#1E88E5] hover:bg-blue-600 text-white rounded-full px-6">
              Visualizar proyecciones
            </Button>
          </div>

          {/* Gestión de Usuario o Actualizar Datos */}
          <div className="flex flex-col items-center">
            <div className="text-[#1E88E5] mb-4">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>

            {role === 'admin' ? (
              <Button
                className="bg-[#1E88E5] hover:bg-blue-600 text-white rounded-full px-6"
                onClick={handleUsuarios}
              >
                Gestión de usuario
              </Button>
            ) : (
              <Button
                className="bg-[#1E88E5] hover:bg-blue-600 text-white rounded-full px-6"
                onClick={handleActualizarDatos}
              >
                Actualizar datos de usuario
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

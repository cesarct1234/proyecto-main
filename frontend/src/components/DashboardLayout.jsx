import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import Cookies from 'js-cookie'
import { Home, LogOut } from 'lucide-react'

const DashboardLayout = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    name: '',
    role: ''
  })

  const getRoleLabel = (role) => {
    const roles = {
      'admin': 'Administrador',
      'coordinador': 'Coordinador',
      'vicerrector': 'Vicerrector'
    }
    return roles[role] || role
  }


  useEffect(() => {
    // Get user data from cookies
    const name = Cookies.get('nombre')
    const role = Cookies.get('role')

    if (!name || !role) {
      // If user data is not available, redirect to login
      navigate('/')
      return
    }

    setUserData({ name, role })
  }, [navigate])

  const handleLogout = () => {
    // Remove all cookies
    Cookies.remove('refresh_token')
    Cookies.remove('access_token')
    Cookies.remove('token')
    Cookies.remove('id')
    Cookies.remove('nombre')
    Cookies.remove('role')

    // Redirect to login
    navigate('/')
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex w-full">
        {/* User Profile Section */}
        <div className="bg-[#1E88E5] text-white w-[348px] py-6 px-4 flex items-center">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-4">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#1E88E5]"
            >
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M4 21V19C4 16.7909 5.79086 15 8 15H16C18.2091 15 20 16.7909 20 19V21"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <div>
            <p className="text-xl font-medium">{userData.name}</p>
            <p className="text-sm">{getRoleLabel(userData.role)}</p>
          </div>
        </div>

        {/* System Title Section */}
        <div className="bg-[#004A98] text-white flex-1 py-6 px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SISTEMA DE PROYECCIÓN DE CURSOS</h1>

          {/* Link con ícono grueso de Novedades */}
          <Link to="#" className="flex flex-col items-center text-white hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1E88E5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-1"
            >
              <path d="M12 2v10"></path>
              <circle cx="12" cy="18" r="1.5"></circle>
            </svg>
            <span className="text-sm font-semibold">Novedades</span>
          </Link>
        </div>
      </header>


      {/* Main Content */}
      <main className="flex-1 p-12 bg-gray-100">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#004A98] py-4 px-8 flex justify-end gap-4">
        <Button
          className="bg-[#1E88E5] hover:bg-blue-600 text-white rounded-full px-6 flex items-center gap-2"
          onClick={() => navigate('/home')}
        >
          <Home size={18} />
          Inicio
        </Button>
        <Button
          className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  )
}

export default DashboardLayout
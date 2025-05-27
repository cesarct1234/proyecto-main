import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { instanceWithToken } from '@/utils/instance'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const UpdateUserPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.new_password !== formData.confirm_password) {
      toast.error('Las contraseñas nuevas no coinciden')
      return
    }

    setLoading(true)
    try {
      await instanceWithToken.post(`/users/${Cookies.get('id')}/change_password/`, {
        old_password: formData.old_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password
      })
      toast.success('Contraseña actualizada exitosamente')
      navigate('/home')
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      const errorMessage = error.response?.data?.detail || 'Error al cambiar la contraseña'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#E6EEF8] rounded-2xl p-10 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center">
            <label className="w-1/3 text-right pr-6 font-medium text-gray-700">
              Ingrese Contraseña Actual
            </label>
            <input
              type="password"
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              className="w-2/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-right pr-6 font-medium text-gray-700">
              Ingrese Contraseña Nueva
            </label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className="w-2/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-right pr-6 font-medium text-gray-700">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-2/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-[#1E88E5] hover:bg-blue-600 text-white rounded-full text-xs px-6 py-2"
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateUserPage

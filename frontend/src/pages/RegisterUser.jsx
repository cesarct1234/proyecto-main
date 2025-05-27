import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '@/utils/instance';  // Cambiado a instance sin token
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';

const RegisterUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'coordinador',
    password: '',
    password_confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (formData.password !== formData.password_confirm) {
      setErrors({password_confirm: 'Las contraseñas no coinciden'});
      setLoading(false);
      return;
    }

    try {
      const response = await instance.post('/users/', formData);
      
      toast.success(response.data.message || 'Usuario registrado exitosamente');
      navigate('/users');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error('Por favor corrige los errores en el formulario');
      } else {
        toast.error(error.response?.data?.message || 'Error al registrar el usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#E6EEF8] rounded-lg p-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="mr-4 p-2"
            onClick={() => navigate('/users')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-2xl font-bold flex items-center">
            <UserPlus className="mr-2" size={24} />
            Registrar Nuevo Usuario
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nombre Completo
                {errors.name && <span className="text-red-500 text-sm ml-2">*{errors.name}</span>}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Ingrese nombre completo"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Correo Electrónico
                {errors.email && <span className="text-red-500 text-sm ml-2">*{errors.email}</span>}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Contraseña
                {errors.password && <span className="text-red-500 text-sm ml-2">*{errors.password}</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Ingrese contraseña"
                required
                minLength="8"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Confirmar Contraseña
                {errors.password_confirm && <span className="text-red-500 text-sm ml-2">*{errors.password_confirm}</span>}
              </label>
              <input
                type="password"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.password_confirm ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Confirme contraseña"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Rol
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="coordinador">Coordinador</option>
                <option value="vicerrector">Vicerrector</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#1E88E5] hover:bg-blue-600 text-white rounded-full px-6 py-2 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { instanceWithToken } from '@/utils/instance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, RefreshCw } from 'lucide-react';

const UserListPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await instanceWithToken.get('/users/');
      
      const verifiedUsers = response.data.map(user => ({
        ...user,
        is_active: user.is_active !== undefined ? Boolean(user.is_active) : true
      }));
      
      setUsers(verifiedUsers);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast.error('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await instanceWithToken.post(`/users/${userId}/toggle-active/`);
      
      // Actualizar el estado local con los datos del servidor
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { 
            ...user, 
            is_active: response.data.is_active 
          } : user
        )
      );
      
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      toast.error(error.response?.data?.error || 'Error al cambiar el estado del usuario');
    }
  };

  const getRoleLabel = (role) => {
    const roles = {
      'admin': 'Administrador',
      'coordinador': 'Coordinador',
      'vicerrector': 'Vicerrector'
    };
    return roles[role] || role;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-[#E6EEF8] rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-4 p-2"
              onClick={() => navigate('/users')}
            >
              <ArrowLeft size={20} />
            </Button>
            <h2 className="text-2xl font-bold">Lista de Usuarios</h2>
          </div>
          
          <Button
            className="bg-[#1E88E5] hover:bg-blue-600 text-white rounded-full px-4 py-2 flex items-center gap-2"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            Actualizar
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          className={`rounded-full p-2 ${
                            user.is_active 
                              ? 'bg-red-500 hover:bg-red-600' 
                              : 'bg-green-500 hover:bg-green-600'
                          } text-white`}
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={user.id === JSON.parse(localStorage.getItem('user'))?.id}
                        >
                          {user.is_active ? <X size={16} /> : <Check size={16} />}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListPage;
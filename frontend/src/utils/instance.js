import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
});

// Crear instancia con token
const instanceWithToken = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
});

// Añadir el token a los headers de cada solicitud
instanceWithToken.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instanceWithToken.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {

      Cookies.remove('sesion');
      Cookies.remove('usuario');
      Cookies.remove('nombre');
      Cookies.remove('role');
      Cookies.remove('id');
      Cookies.remove('token');

      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export { instance, instanceWithToken };

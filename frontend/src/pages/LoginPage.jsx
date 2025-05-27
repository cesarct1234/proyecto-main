import { useState } from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import home from "@/assets/home.png"
import logo from "@/assets/logo.png"
import { instance, instanceWithToken } from "@/utils/instance"
import Cookies from "js-cookie"
import { toast } from "sonner"

export default function LoginPage() {
    const router = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [rememberPassword, setRememberPassword] = useState(false)

    const handleLogin = async () => {
        try {
            const response = await instance.post("/token/", { email: username, password })
            const { refresh, access } = response.data
            
            // Store tokens in cookies
            const expiryDays = rememberPassword ? 30 : 1
            Cookies.set('refresh_token', refresh, { expires: expiryDays, secure: true, sameSite: 'Strict' })
            Cookies.set('access_token', access, { expires: 1, secure: true, sameSite: 'Strict' })
            Cookies.set('token', access, { expires: 1, secure: true, sameSite: 'Strict' }) // For instanceWithToken
            
            // Fetch user data
            try {
                const userResponse = await instanceWithToken.get("/me/")
                const { id, name, role } = userResponse.data
                
                // Store user data in cookies
                Cookies.set("sesion", true, {expires: expiryDays, secure: true, sameSite: 'Strict'})
                Cookies.set('id', id, { expires: expiryDays, secure: true, sameSite: 'Strict' })
                Cookies.set('nombre', name, { expires: expiryDays, secure: true, sameSite: 'Strict' })
                Cookies.set('role', role, { expires: expiryDays, secure: true, sameSite: 'Strict' })
                
                // Show success toast
                toast.success('Sesión iniciada correctamente')
                
                // Redirect to dashboard
                router("/home")
            } catch (userError) {
                console.error('Error al obtener datos del usuario:', userError)
                toast.error('Error al obtener datos del usuario')
            }
        } catch (error) {
            console.error('Error de inicio de sesión:', error)
            toast.error('Error al iniciar sesión. Verifique sus credenciales.')
        }
    }

    return (
        <div className="flex h-screen w-full">
            {/* Left Section */}
            <div className="w-1/2 bg-slate-100 p-8 flex flex-col">
                <div className="mb-12">
                    <h1 className="text-[#004A98] text-2xl font-bold text-center leading-tight">
                        CORPORACIÓN UNIVERSITARIA
                        <br />
                        AUTÓNOMA DEL CAUCA
                    </h1>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="rounded-lg overflow-hidden w-full max-w-lg shadow-md">
                        <img
                            src={home}
                            alt="Estudiantes trabajando en grupo"
                            width={600}
                            height={450}
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-1/2 bg-[#004A98] p-8 flex flex-col justify-center items-center">
                <div className="w-full max-w-md">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-120 h-80 mb-8 mx-auto"
                    />
                    <h2 className="text-white text-3xl font-bold mb-12 text-center">INICIO DE SESIÓN</h2>


                        <p className="text-white mb-6">Por favor, ingrese sus datos:</p>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Ingrese su usuario"
                                className="w-full p-3 rounded-md bg-gray-100 text-gray-800"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="Ingrese su contraseña"
                                className="w-full p-3 rounded-md bg-gray-100 text-gray-800"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <div className="flex items-center gap-2 text-white">
                                <CheckCircle
                                    className={`h-5 w-5 ${rememberPassword ? "text-yellow-400 fill-yellow-400" : "text-white"} cursor-pointer`}
                                    onClick={() => setRememberPassword(!rememberPassword)}
                                />
                                <span>Recordar contraseña</span>
                            </div>
                        </div>

                        <Button
                            onClick={() => handleLogin()}
                            className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-3 rounded-md mt-8"
                        >
                            INICIAR SESIÓN
                        </Button>


                    <div className="mt-6 text-center">
                        <a href="#" className="text-white hover:underline">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

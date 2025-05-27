import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Users } from 'lucide-react'

const UsersPage = () => {
    const navigate = useNavigate()
    
    const handleRegister = () => {
        navigate('/register-users')
    }
    
    const handleUserList = () => {
        navigate('/user-list')
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-[#E6EEF8] rounded-lg p-16">
                <div className="flex justify-between items-center">
                    {/* Register User Card */}
                    <div className="flex flex-col items-center">
                        <div className="text-[#1E88E5] mb-4">
                           <UserPlus size={100} />
                        </div>
                        <Button
                            className="bg-[#1E88E5] hover:bg-blue-600 text-white rounded-full px-6"
                            onClick={handleRegister}
                        >
                            Registrar Nuevo Usuario
                        </Button>
                    </div>

                    {/* View Users Card */}
                    <div className="flex flex-col items-center">
                        <div className="text-[#1E88E5] mb-4">
                            <Users size={100} />
                        </div>
                        <Button 
                            className="bg-[#1E88E5] hover:bg-blue-600 text-white rounded-full px-6"
                            onClick={handleUserList}
                        >
                            Modificar Estado
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersPage
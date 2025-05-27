import { Button } from '@/components/ui/button'
import React, { useRef, useState } from 'react'
import { FileSpreadsheet, Upload, Save } from 'lucide-react'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import { instanceWithToken } from '@/utils/instance'
import { useNavigate } from 'react-router-dom'

const LoadArchive = () => {
    const navigate = useNavigate()
    const [excelData, setExcelData] = useState(null)
    const [recordCount, setRecordCount] = useState(0)
    const fileInputRef = useRef(null)

    // Function to convert object keys to lowercase
    const convertKeysToLowercase = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key.toLowerCase()] = obj[key];
            return acc;
        }, {});
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (!file) return

        // Check if file is an Excel file
        const fileExtension = file.name.split('.').pop().toLowerCase()
        if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
            toast.error('Por favor, sube un archivo Excel (.xlsx o .xls)')
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = e.target.result
                const workbook = XLSX.read(data, { type: 'array' })
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]
                const rawJsonData = XLSX.utils.sheet_to_json(worksheet)
                
                // Convert all keys to lowercase
                const jsonData = rawJsonData.map(item => convertKeysToLowercase(item))

                setExcelData(jsonData)
                setRecordCount(jsonData.length)
                console.log('Archivo Excel cargado (con keys en minúsculas):', jsonData)
                toast.success(`Archivo Excel cargado con éxito. ${jsonData.length} registros encontrados.`)
            } catch (error) {
                console.error('Error al leer el archivo Excel:', error)
                toast.error('Error al leer el archivo Excel')
            }
        }
        reader.readAsArrayBuffer(file)
    }

    const handleSaveToDatabase = async () => {
        if (!excelData || excelData.length === 0) {
            toast.error('No hay datos para guardar')
            return
        }

        try {
            // Send data to the cursos/bulk_create/ endpoint
            const response = await instanceWithToken.post('/cursos/bulk_create/', { excelData })
            console.log('Respuesta del servidor:', response.data)
            toast.success('Datos guardados correctamente en la base de datos')
            navigate('/home')
        } catch (error) {
            console.error('Error al guardar los datos:', error)
            toast.error('Error al guardar los datos en la base de datos')
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current.click()
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-[#E6EEF8] rounded-lg p-12">
                {/* Cursos Section */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center">
                        <div className="mr-6">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <path d="M14 2v6h6" />
                                <path d="M12 18v-6" />
                                <path d="M8 18v-1" />
                                <path d="M16 18v-3" />
                                <path d="M9 10h1" />
                                <path d="M14 10h1" />
                                <path d="M9 14h6" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold">Cursos</h2>
                    </div>
                    <Button 
                        className="bg-[#1D6F42] hover:bg-green-700 text-white rounded-full px-6 py-2 flex items-center gap-2"
                        onClick={handleUploadClick}
                    >
                        <FileSpreadsheet size={20} />
                        Cargar Excel
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".xlsx, .xls"
                            className="hidden"
                        />
                    </Button>
                </div>

                {/* Results Section */}
                {excelData && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Resultados del archivo</h3>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Upload size={18} />
                                <span>{recordCount} registros encontrados</span>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <h4 className="font-medium mb-2">Vista previa de datos:</h4>
                            <div className="bg-gray-50 p-4 rounded border overflow-auto max-h-60">
                                <pre className="text-sm">
                                    {JSON.stringify(excelData.slice(0, 5), null, 2)}
                                    {excelData.length > 5 && '\n...'}
                                </pre>
                            </div>
                        </div>
                        
                        <div className="flex justify-end">
                            <Button 
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 flex items-center gap-2"
                                onClick={handleSaveToDatabase}
                            >
                                <Save size={18} />
                                Guardar en base de datos
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LoadArchive
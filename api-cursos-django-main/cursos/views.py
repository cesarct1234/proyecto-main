from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Curso
from .serializers import CursoSerializer

# Create your views here.

class CursoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para ver y editar instancias de Curso.
    Proporciona operaciones CRUD completas.
    """
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """
        Endpoint para crear múltiples cursos en una sola petición.
        Espera recibir un array de objetos curso dentro del campo 'excelData'.
        """
        # Verificar si los datos vienen en el formato esperado
        if 'excelData' not in request.data:
            return Response(
                {"error": "Se esperaba un campo 'excelData' con un array de cursos"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener los datos de los cursos
        cursos_data = request.data['excelData']
        
        # Verificar que cursos_data sea una lista
        if not isinstance(cursos_data, list):
            return Response(
                {"error": "El campo 'excelData' debe ser un array de objetos"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Procesar los datos en lotes de 100 registros
        BATCH_SIZE = 100
        total_cursos = len(cursos_data)
        cursos_creados = []
        
        try:
            with transaction.atomic():
                for i in range(0, total_cursos, BATCH_SIZE):
                    lote = cursos_data[i:i + BATCH_SIZE]
                    serializer = self.get_serializer(data=lote, many=True)
                    if serializer.is_valid():
                        cursos_creados.extend(serializer.save())
                    else:
                        # Si hay errores en algún lote, devolver los errores
                        return Response(
                            {
                                "error": f"Error en el lote {i//BATCH_SIZE + 1}",
                                "detalles": serializer.errors
                            }, 
                            status=status.HTTP_400_BAD_REQUEST
                        )
            
            # Todos los lotes se procesaron correctamente
            return Response(
                {
                    "mensaje": f"Se crearon {len(cursos_creados)} cursos correctamente",
                    "total_procesados": len(cursos_creados)
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {
                    "error": "Error al procesar los datos",
                    "detalles": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

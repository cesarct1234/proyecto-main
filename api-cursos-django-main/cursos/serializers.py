from rest_framework import serializers
from .models import Curso

class CursoSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Curso
    """
    class Meta:
        model = Curso
        fields = '__all__'
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion')

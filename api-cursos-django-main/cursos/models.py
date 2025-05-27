from django.db import models

# Create your models here.

class Curso(models.Model):
    """
    Modelo para almacenar información de cursos académicos.
    """
    cod_curso = models.CharField(max_length=50, verbose_name="Código del Curso")
    semestre = models.CharField(max_length=50, verbose_name="Semestre")
    nom_curso = models.CharField(max_length=100, verbose_name="Nombre del Curso")
    jornada = models.CharField(max_length=20, verbose_name="Jornada")
    grupo = models.CharField(max_length=20, verbose_name="Grupo")
    programa = models.CharField(max_length=100, verbose_name="Programa")
    cupo_max = models.IntegerField(verbose_name="Cupo Máximo")
    no_estud = models.IntegerField(default=0, verbose_name="Número de Estudiantes")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de Actualización")

    class Meta:
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.cod_curso} - {self.nom_curso} ({self.grupo})"

from django.contrib import admin
from .models import Curso

# Register your models here.
@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):
    list_display = ('cod_curso', 'nom_curso', 'semestre', 'grupo', 'jornada', 'programa', 'cupo_max', 'no_estud')
    list_filter = ('semestre', 'jornada', 'programa')
    search_fields = ('cod_curso', 'nom_curso', 'grupo')
    ordering = ('cod_curso', 'semestre')

from django.shortcuts import render
from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserUpdateSerializer, ChangePasswordSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing user instances.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            permission_classes = [AllowAny]
        elif self.action in ['update', 'partial_update', 'destroy', 'list', 'toggle_active']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on the action.
        """
        if self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer
    
    def get_queryset(self):
        """
        Filter queryset based on user role and order by active status and name.
        """
        user = self.request.user
        if user.is_staff or user.role == 'admin':
            return User.objects.all().order_by('-is_active', 'name')
        return User.objects.filter(id=user.id)
    
    def list(self, request, *args, **kwargs):
        """
        Override list to ensure is_active is included in the response.
        """
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        # Combine serializer data with actual model data
        response_data = []
        for user, user_data in zip(queryset, serializer.data):
            response_data.append({
                **user_data,
                'is_active': user.is_active  # Asegurar que el valor viene de la DB
            })
        
        return Response(response_data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request, pk=None):
        """
        Change password endpoint.
        """
        user = self.get_object()
        if user != request.user and not request.user.is_staff:
            return Response(
                {"detail": "No tienes permiso para cambiar la contraseña de este usuario."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {"old_password": ["Contraseña incorrecta."]},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response(
                {"detail": "Contraseña actualizada correctamente."},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        """
        Toggle user active status (for admins only)
        Returns complete user data for frontend synchronization
        """
        user = self.get_object()
        
        # Prevent self-deactivation
        if user == request.user:
            return Response(
                {'error': 'No puedes cambiar tu propio estado activo'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Prevent deactivating other admins unless superuser
        if (user.role == 'admin' or user.is_staff) and not request.user.is_superuser:
            return Response(
                {'error': 'Solo superusuarios pueden desactivar otros administradores'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Toggle status
        user.is_active = not user.is_active
        user.save()
        
        # Return complete serialized user data
        serializer = self.get_serializer(user)
        return Response(
            {
                'status': 'success',
                'user': serializer.data,
                'is_active': user.is_active,
                'message': f'Usuario {"activado" if user.is_active else "desactivado"} correctamente'
            },
            status=status.HTTP_200_OK
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Get information about the currently authenticated user.
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
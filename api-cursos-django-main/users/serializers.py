from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the custom user model
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    is_active = serializers.BooleanField(read_only=True)  # Campo añadido explícitamente

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'role', 'is_active', 'password', 'password_confirm')
        extra_kwargs = {
            'role': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Los campos de contraseña no coinciden."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user information
    """
    is_active = serializers.BooleanField()  # Asegurar que is_active está incluido

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'role', 'is_active')
        read_only_fields = ('id', 'email')

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"new_password": "Los campos de contraseña no coinciden."})
        return attrs
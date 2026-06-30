from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)
    executor = serializers.PrimaryKeyRelatedField(read_only=True, allow_null=True)
    executor_username = serializers.ReadOnlyField(source='executor.username')
    
    # Добавляем новое вычисляемое поле для фронтенда
    report_created_at = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = '__all__' # __all__ автоматически подтянет и report_created_at, и executor_username

    def get_report_created_at(self, obj):
        # Используем getattr, так как связь OneToOne может вернуть None, если отчета еще нет
        report = getattr(obj, 'report', None)
        if report:
            return report.created_at.isoformat() # Превращаем дату в строку для JS
        return None

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        # Пишем пароль только на запись, чтобы он не улетал обратно в ответе API
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # ЭТОТ МЕТОД САМ ВСЁ ДЕЛАЕТ ПРАВИЛЬНО:
        # Он берет пароль, хеширует его и сохраняет пользователя.
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

from .models import TaskReport

class TaskReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskReport
        fields = ['task', 'text', 'link', 'image']
        # Попробуем сделать так, чтобы task принимал ID
        extra_kwargs = {'task': {'required': True}}
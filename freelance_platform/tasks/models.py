from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, rating=25)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # Если профиль существует, сохраняем его
    if hasattr(instance, 'profile'):
        instance.profile.save()

@receiver(post_save, sender=User)
def create_or_save_user_profile(sender, instance, created, **kwargs):
    if created:
        # Автоматически создаем профиль при регистрации нового юзера
        Profile.objects.get_or_create(user=instance, defaults={'rating': 25})
    else:
        # Обновляем профиль при изменении юзера (если профиль существует)
        if hasattr(instance, 'profile'):
            instance.profile.save()

class Task(models.Model):
    STATUS_CHOICES = [
        ('open', 'Ожидает'),
        ('in_progress', 'В работе'),
        ('review', 'Сдан на проверку'),
        ('done', 'Принят заказчиком'),
    ]
    
    CATEGORY_CHOICES = [
        ('MICRO', 'Микро-задачи'),
        ('AI', 'ИИ и Видео'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='MICRO')
    revision_comment = models.TextField(blank=True, null=True) # Добавь это
    taken_at = models.DateTimeField(null=True, blank=True)
    deadline_hours = models.IntegerField(default=1)
    
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name='created_tasks', 
        on_delete=models.CASCADE
    )
    executor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name='accepted_tasks', 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL
    )

    def __str__(self):
        return self.title

class TaskReport(models.Model):
    task = models.OneToOneField(Task, on_delete=models.CASCADE, related_name='report')
    text = models.TextField()
    link = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to='reports/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Отчет для {self.task.title}"


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    rating = models.IntegerField(default=25)

    def __str__(self):
        return f"Профиль {self.user.username}"
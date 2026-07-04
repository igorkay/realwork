from rest_framework import generics, permissions
from .models import Task
from .serializers import TaskSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
import random
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics
from .models import TaskReport
from .serializers import TaskReportSerializer
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "is_staff": user.is_staff
    })

@api_view(['PATCH'])
@permission_classes([IsAdminUser]) # Доступ только для админа
def update_user_rating(request, user_id):
    new_rating = request.data.get('rating')
    user = User.objects.get(id=user_id)
    
    # Меняем рейтинг внутри связанного профиля, а не у самого юзера
    if hasattr(user, 'profile'):
        user.profile.rating = new_rating
        user.profile.save()
    else:
        # На всякий случай, если профиля вдруг нет — создаем его
        from .models import Profile
        Profile.objects.create(user=user, rating=new_rating)
        
    return Response({"message": "Рейтинг успешно обновлен в профиле!"})

@api_view(['GET'])
def get_users_list(request):
    users = User.objects.all()
    data = []
    for u in users:
        # Безопасно получаем рейтинг
        rating = 0
        if hasattr(u, 'profile'):
            rating = u.profile.rating
        data.append({"id": u.id, "username": u.username, "rating": rating})
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def skip_task_in_feed(request):
    # Здесь логика штрафа за пропуск в ленте
    change_user_rating(request.user, 'cancel_in_feed')
    return Response({"detail": "Заказ пропущен, рейтинг обновлен"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def skip_task(request):
    # Вызываем уже готовую логику штрафа
    change_user_rating(request.user, 'cancel_in_feed')
    return Response({"detail": "Штраф за пропуск начислен"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    from .models import Profile
    
    # Использовали request.user и правильное имя поля 'executor'
    completed_count = Task.objects.filter(executor=request.user, status='done').count()
    
    # Безопасно достаем профиль, где лежат баланс и рейтинг
    profile, created = Profile.objects.get_or_create(user=request.user, defaults={'rating': 25})
    
    # Проверяем, есть ли в модели Profile поле баланса, если нет — временно отдаем 0.00
    balance = getattr(profile, 'balance_usdt', 0.00)
    
    return Response({
        "username": request.user.username,
        "rating": profile.rating,         # <-- Добавили пропущенную запятую!
        "balance_usdt": balance,          # <-- Передаем баланс на фронт
        "completed_tasks": completed_count # <-- Передаем точное число выполненных задач
    })

def change_user_rating(user, action_type):
    # Пытаемся получить профиль, если нет — создаем прямо здесь
    from .models import Profile
    profile, created = Profile.objects.get_or_create(user=user, defaults={'rating': 25})
    
    if action_type == 'completed':
        profile.rating += 5
    elif action_type == 'cancel_in_feed':
        profile.rating -= 2
    elif action_type == 'quit_after_take':
        profile.rating -= 10
    
    profile.save()

def check_and_apply_auto_approval(queryset):
    """
    Проверяет задачи в статусе 'review'. Если с момента создания отчета 
    прошло больше 36 часов, автоматически закрывает задачу со статусом 'done'.
    """
    review_tasks = queryset.filter(status='review')
    for task in review_tasks:
        # Пытаемся достать отчет к этой задаче
        report = getattr(task, 'report', None)
        if report:
            approval_deadline = report.created_at + timedelta(hours=36)
            if timezone.now() > approval_deadline:
                task.status = 'done'
                task.revision_comment = None # Очищаем старые комменты, если были
                task.save()

class TaskListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        scope = self.request.query_params.get('scope', None)
        if scope == 'all':
            # Перед выдачей проверяем глобально на автоприемку
            all_my_review_tasks = Task.objects.filter(creator=self.request.user, status='review')
            check_and_apply_auto_approval(all_my_review_tasks)
            
            return Task.objects.filter(is_active=True).exclude(creator=self.request.user)
        
        # Если заказчик смотрит свои созданные задачи
        queryset = Task.objects.filter(creator=self.request.user)
        check_and_apply_auto_approval(queryset)
        return queryset

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user, status='open')

class TaskListView(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskUpdate(generics.RetrieveUpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        # Назначаем текущего пользователя исполнителем и фиксируем время
        serializer.save(
            executor=self.request.user, 
            is_active=False, 
            status='in_progress', # Устанавливаем статус сразу
            taken_at=timezone.now() # ЗАПИСЫВАЕМ ВРЕМЯ
        )

from datetime import timedelta
from django.utils import timezone

class MyCreatedTasksView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.filter(creator=self.request.user)
        check_and_apply_auto_approval(queryset)
        return queryset

class MyActiveTasksView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        active_in_progress = Task.objects.filter(
            executor=self.request.user, 
            is_active=False, 
            status='in_progress'
        )
        
        for task in active_in_progress:
            if task.taken_at:
                deadline = task.taken_at + timedelta(hours=task.deadline_hours)
                if timezone.now() > deadline:
                    # Штрафуем при просрочке
                    change_user_rating(task.executor, 'quit_after_take')
                    
                    task.status = 'open'
                    task.executor = None
                    task.is_active = True
                    task.taken_at = None
                    task.save()
        
        return Task.objects.filter(
            executor=self.request.user, 
            is_active=False,
            status__in=['in_progress', 'review']
        )

class GetRandomTask(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(is_active=True).exclude(creator=request.user)
        
        if not tasks.exists():
            # Возвращаем 200 OK, но пустой список или сообщение
            return Response({"detail": "Нет доступных задач"}, status=200) 
        
        task = random.choice(tasks)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

class TaskDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        # Только создатель может удалить свой заказ
        return Task.objects.filter(creator=self.request.user, is_active=True)

class CancelTaskView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            task = Task.objects.get(pk=pk, executor=request.user)
            # Возвращаем задачу в "свободное плавание"
            change_user_rating(request.user, 'quit_after_take')
            task.is_active = True
            task.executor = None
            task.save()
            return Response({"detail": "Заказ успешно возвращен в ленту"})
        except Task.DoesNotExist:
            return Response({"detail": "Заказ не найден или вы не исполнитель"}, status=404)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        # 1. Извлекаем email напрямую из сырых данных запроса ДО валидации сериализатора
        email_data = request.data.get('email')
        
        # 2. Запускаем стандартный процесс валидации и создания пользователя
        response = super().post(request, *args, **kwargs)
        
        # 3. Если пользователь успешно создался (код 201) и email передан — пишем в файл
        if response.status_code == 201 and email_data:
            try:
                # Получаем имя созданного пользователя из ответа бэкенда
                username = response.data.get('username', 'unknown')
                
                # Записываем в файл прямо в корне папки freelance_platform
                with open("emails.txt", "a", encoding="utf-8") as f:
                    f.write(f"{timezone.now()} | User: {username} | Email: {email_data}\n")
            except Exception as e:
                print(f"Ошибка записи email в файл: {e}")
                
        return response

class YourProtectedView(APIView):
    permission_classes = [IsAuthenticated]


class CreateReportView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        task_id = request.data.get('task')
        report = TaskReport.objects.filter(task_id=task_id).first()
        
        if report:
            serializer = TaskReportSerializer(report, data=request.data, partial=True)
        else:
            serializer = TaskReportSerializer(data=request.data)

        if serializer.is_valid():
            saved_report = serializer.save()
            
            # Обновляем отчет: сбрасываем дату создания на СЕЙЧАС, 
            # если исполнитель загружает отчет ПОВТОРНО (после доработки)
            saved_report.created_at = timezone.now()
            saved_report.save()

            task = saved_report.task
            task.status = 'review'
            task.save()
            return Response({"detail": "Отчет успешно сохранен"})
        
        return Response(serializer.errors, status=400)

class TaskReportDetailView(APIView):
    def get(self, request, task_id):
        # Получаем отчет по конкретной задаче
        report = TaskReport.objects.filter(task_id=task_id).first()
        if not report:
            return Response({"error": "Отчет не найден"}, status=404)
        serializer = TaskReportSerializer(report)
        return Response(serializer.data)

class TaskStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
            new_status = request.data.get('status')
            comment = request.data.get('comment')
            
            if new_status:
                if new_status == 'in_progress':
                    task.taken_at = timezone.now()
                    task.deadline_hours = 10
                
                # ЛОГИКА РЕЙТИНГА ДЛЯ ЗАВЕРШЕНИЯ
                if new_status == 'done' and task.executor:
                    change_user_rating(task.executor, 'completed')
                
                task.status = new_status
            
            if comment:
                task.revision_comment = comment
            
            task.save()
            return Response({"detail": "Статус обновлен"})
        except Exception as e:
            return Response({"detail": str(e)}, status=400)

# =====================================================================
# НА ВСЯКИЙ СЛУЧАЙ: возвращаем и этот класс, если он где-то вызывался
# =====================================================================
class MyActiveTasksListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        # Просто отдает все неактивные задачи, где юзер - исполнитель
        return Task.objects.filter(executor=self.request.user, is_active=False)

@@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_invoice(request):
    try:
        # В DRF данные извлекаются через request.data
        amount = request.data.get('amount')
        
        if not amount:
            return Response({'error': 'Amount is required'}, status=400)

        url = "https://api.cryptocloud.plus/v1/invoice/create"
        headers = {
            "Authorization": "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1dWlkIjoiTVRBNE1qQTUiLCJ0eXBlIjoicHJvamVjdCIsInYiOiIzODhiZmUxODU4NmIxY2IwNWVhMGNmNDkwODMxZjZhN2M2ODVjMThiZjA5ZDJjMTZhYjVmYjhlZjcwMjdhMTA0IiwiZXhwIjo4ODE4Mjk5OTE4NH0.HQVxpmSZYnHdU4bVxunYLl900YwLbXM3BAlplTbRcbM",
            "Content-Type": "application/json"
        }
        
        user_id = request.user.id
        
        payload = {
            "shop_id": "oQ6SU20ybRVb4VoX",
            "amount": float(amount),
            "currency": "USDT",  # Возвращаем USDT, раз CryptoCloud его одобрил
            "order_id": f"pay_{int(user_id)}_{int(amount)}",
            "callback_url": "https://realwork.pro/api/payments/webhook/"
        }

        response = requests.post(url, json=payload, headers=headers)
        res_data = response.json()

        # Логируем для отладки
        print("=== CRYPTOCLOUD SUCCESSFUL LOG ===")
        print(res_data)

        if res_data.get('status') == 'success':
            # Забираем ссылку прямо из pay_url, без ['result']['link']
            return Response({'pay_url': res_data.get('pay_url')})
        else:
            return Response({'error': res_data.get('message', 'CryptoCloud error'), 'details': res_data}, status=400)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@csrf_exempt
def crypto_webhook(request):
    if request.method == 'POST':
        # CryptoCloud присылает данные в формате x-www-form-urlencoded или JSON
        data = request.POST if request.POST else json.loads(request.body)
        
        status = data.get('status')
        order_id = data.get('order_id')  # Наш сгенерированный order_id

        if status == 'success' and order_id:
            # Тут будет логика начисления баланса пользователю.
            # Мы можем распарсить order_id (например, pay_USERID_AMOUNT)
            try:
                parts = order_id.split('_')
                if len(parts) >= 3:
                    user_id = int(parts[1])
                    amount = float(parts[2])
                    
                    # Здесь должен быть твой код обновления баланса в базе данных, например:
                    # user = User.objects.get(id=user_id)
                    # user.balance += amount
                    # user.save()
                    pass
            except Exception as e:
                print(f"Error updating balance in webhook: {e}")

        return JsonResponse({'status': 'ok'})
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
from django.urls import path
from . import views
from .views import (
    update_user_rating, 
    get_users_list, 
    get_me, 
    TaskListCreate, 
    TaskUpdate, 
    GetRandomTask, 
    MyActiveTasksView, 
    MyCreatedTasksView, 
    CancelTaskView, 
    TaskDeleteView, 
    CreateReportView, 
    TaskReportDetailView, 
    TaskStatusUpdateView,
    skip_task,
    get_current_user
)

urlpatterns = [
    path('tasks/', TaskListCreate.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskUpdate.as_view(), name='task-update'), # Для патча (взятия заказа)
    path('tasks/random/', GetRandomTask.as_view(), name='random-task'), # Для получения случайного заказа
    path('tasks/my-active/', MyActiveTasksView.as_view(), name='my-active-tasks'),
    path('tasks/my-created/', MyCreatedTasksView.as_view(), name='my-created-tasks'),
    path('tasks/<int:pk>/cancel/', CancelTaskView.as_view(), name='cancel-task'),
    path('tasks/<int:pk>/delete/', TaskDeleteView.as_view(), name='task-delete'),
    path('tasks/report/', CreateReportView.as_view(), name='create-report'),
    path('tasks/<int:task_id>/report/', TaskReportDetailView.as_view(), name='task-report'),
    path('tasks/<int:pk>/status/', TaskStatusUpdateView.as_view(), name='task-status-update'),
    path('admin/update-rating/<int:user_id>/', update_user_rating, name='update-rating'),
    path('admin/users/', get_users_list, name='get-users'),
    path('me/', get_me, name='get-me'),
    path('tasks/skip/', skip_task, name='skip-task'),
    path('users/me/', get_current_user, name='get-current-user'),
]

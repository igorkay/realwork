#!/bin/bash

# 1. Собираем и пушим изменения с Макбука в GitHub
echo "🚀 Пушим код в GitHub..."
git add .
git commit -m "auto-deploy: payment integration updates"
git push

# 2. Обновляем и перезапускаем БЭКЕНД (Django) на сервере
echo "🐍 Обновляем бэкенд Django..."
ssh root@realwork.pro "cd /var/www/realwork/freelance_platform && git pull && pkill -f manage.py || true && nohup ./venv/bin/python3 manage.py runserver 0.0.0.0:8000 > django.log 2>&1 &"

# 3. Подключаемся к серверу и обновляем билд ФРОНТЕНДА (React)
echo "🌐 Подключаемся к серверу и обновляем билд фронтенда..."
ssh root@realwork.pro "cd /var/www/realwork/frontend && git pull && DISABLE_ESLINT_PLUGIN=true npm run build"

# 4. Мягко перезапускаем Nginx для применения всех обновлений
echo "⚙️ Перезапускаем Nginx..."
ssh root@realwork.pro "sudo systemctl restart nginx"

echo "🎉 Полный деплой успешно завершен! Проверяй сайт."
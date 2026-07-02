#!/bin/bash

# 1. Собираем и пушим изменения с Макбука в GitHub
echo "🚀 Пушим код в GitHub..."
git add .
git commit -m "auto-deploy: updates"
git push

# 2. Подключаемся к серверу по SSH и выполняем там команды обновления и сборки
echo "🌐 Подключаемся к серверу и обновляем билд..."
ssh root@realwork.pro "cd /var/www/realwork/frontend && git pull && npm run build"

echo "🎉 Деплой успешно завершен! Проверяй сайт."
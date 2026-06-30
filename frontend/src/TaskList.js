import React, { useEffect, useState, useRef } from 'react';
import api from './api';

function TaskList() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isShiftActive, setIsShiftActive] = useState(false); // Состояние смены
  const [timeLeft, setTimeLeft] = useState(25); // Таймер на 25 секунд

  const timerRef = useRef(null);

  const fetchRandomTask = () => {
    setLoading(true);
    setTimeLeft(25);
    api.get('tasks/random/')
      .then(res => {
        if (res.data.detail) {
          setTask(null);
        } else {
          setTask(res.data);
        }
      })
      .catch(() => setTask(null))
      .finally(() => setLoading(false));
  };

  const handleSkip = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!task) return;
    try {
      await api.post('tasks/skip/'); 
      fetchRandomTask();
    } catch (err) {
      console.error("Ошибка при пропуске:", err);
      fetchRandomTask(); 
    }
  };

  // Функция для ухода на паузу (выхода со смены)
  const handlePause = () => {
    if (timerRef.current) clearInterval(timerRef.current); // Останавливаем таймер
    setTask(null); // Очищаем текущую задачу, чтобы она не висела
    setIsShiftActive(false); // Возвращаем начальный экран с кнопкой "Приступить"
  };

  useEffect(() => {
    if (isShiftActive && task && !loading) {
      setTimeLeft(25);
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSkip();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [task, isShiftActive, loading]);

  const handleStartShift = () => {
    setIsShiftActive(true);
    fetchRandomTask();
  };

  const handleAccept = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!task) return;
    try {
      const res = await api.get('tasks/my-active/');
      if (res.data.length >= 3) {
        alert("Лимит достигнут! У вас уже есть 3 активные задачи.");
        fetchRandomTask();
        return;
      }
      await api.patch(`tasks/${task.id}/`, { status: 'in_progress', is_active: false });
      alert("Задача успешно взята!");
      fetchRandomTask();
    } catch (err) {
      alert("Не удалось взять заказ.");
    }
  };

  // 1. ЭКРАН: Новый премиальный режим ожидания / Пауза
  if (!isShiftActive) {
    return (
      <div className="w-full max-w-xl mx-auto mt-4 px-4 font-sans text-slate-900">
        <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[40px] p-10 text-center shadow-[0_15px_50px_rgba(15,23,42,0.02)]">
          
          {/* Subtle фоновые геометрические элементы */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />

          {/* Центральный блок с динамичной 3D-Isometric композицией */}
          <div className="relative flex justify-center mb-8">
            {/* Фоновое свечение для иконок */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-blue-50 rounded-full blur-xl scale-75 opacity-70" />
            
            {/* Композиция элементов */}
            <div className="relative flex items-center justify-center w-28 h-28 bg-gradient-to-tr from-slate-50 to-white rounded-3xl border border-slate-100 shadow-md">
              <span className="text-5xl transform -rotate-12 animate-bounce [animation-duration:3s]">🚀</span>
              <span className="absolute -top-2 -right-2 text-2xl filter drop-shadow">⚡</span>
              <span className="absolute -bottom-1 -left-2 text-2xl filter drop-shadow opacity-80">👀</span>
            </div>
          </div>

          {/* Блок текста */}
          <div className="max-w-md mx-auto mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-4">
              Готовы к новым <br />
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                заказам?
              </span>
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">
              После старта система выдаст случайный заказ. У вас будет <span className="font-bold text-slate-700">25 секунд</span> на выбор, иначе — автопропуск и <span className="text-red-500 font-bold">-2 балла</span> рейтинга.
            </p>
          </div>

          {/* Кнопка «Приступить к поиску» */}
          <div className="relative inline-block w-full max-w-sm group">
            {/* Эффект размытого свечения (Glow) при наведении */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />
            
            <button
              onClick={handleStartShift}
              className="relative w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 tracking-wide text-base"
            >
              <span>Приступить к поиску</span>
              <svg 
                className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {/* Нижняя плашка */}
          <div className="mt-8 pt-6 border-t border-slate-50/80 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">🛡️ Безопасная сделка</span>
            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
            <span className="flex items-center gap-1.5">💸 Выплаты без задержек</span>
          </div>

        </div>
      </div>
    );
  }

  // 2. ЭКРАН: Загрузка
  if (loading) return <div className="text-center p-10 animate-pulse text-slate-400 font-medium mt-10">Поиск свежих заказов...</div>;

  // 3. ЭКРАН: Отображение задачи
  return (
    <div className="w-full max-w-xl mx-auto p-0 mt-4"> 
      {task ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all relative overflow-hidden">
          
          {/* Индиго-линия таймера */}
          <div 
            className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 25) * 100}%` }}
          />

          <div className="flex justify-between items-center">
             <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full 
               ${task.category === 'AI' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
               {task.category === 'AI' ? 'ИИ и Видео' : 'Микро-задача'}
             </span>

             <div className={`flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 rounded-xl ${timeLeft <= 5 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-700'}`}>
               ⏱️ {timeLeft} сек
             </div>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-5 tracking-tight leading-snug">{task.title}</h2>
          
          <div className="mt-5 p-5 bg-slate-50/60 rounded-2xl border border-slate-100/80">
            <p className="text-slate-600 text-sm leading-relaxed">{task.description}</p>
          </div>

          <div className="mt-6 flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="text-left">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Вознаграждение</p>
                <span className="text-2xl font-black text-slate-900">{task.price} ₽</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Комиссия сервиса 0%</span>
          </div>
          
          {/* КНОПКИ УПРАВЛЕНИЯ */}
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex gap-4">
              <button 
                onClick={handleSkip}
                className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition active:scale-[0.98]"
              >
                Пропустить
              </button>
              <button 
                onClick={handleAccept} 
                className="flex-[2] px-6 py-4 bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition transform active:scale-[0.98]"
              >
                Взять заказ
              </button>
            </div>

            {/* КНОПКА ПАУЗЫ */}
            <button 
              onClick={handlePause}
              className="w-full py-3 text-slate-400 hover:text-slate-600 transition text-xs font-medium flex items-center justify-center gap-1.5 mt-2"
            >
              ⏸️ Поставить поиск на паузу
            </button>
          </div>

        </div>
      ) : (
        // Блок "На сегодня задач больше нет"
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
          <p className="text-slate-500 mb-6 text-sm font-medium">На сегодня доступных задач больше нет.</p>
          <div className="flex flex-col gap-2 max-w-xs mx-auto">
            <button onClick={fetchRandomTask} className="bg-indigo-50 text-indigo-600 font-semibold py-3 rounded-xl hover:bg-indigo-100 transition text-sm active:scale-[0.98]">
              🔄 Обновить ленту
            </button>
            <button onClick={handlePause} className="text-slate-400 hover:text-slate-600 transition text-xs font-medium mt-2">
              Вернуться на главный экран
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
import React, { useEffect, useState, useRef } from 'react';
import api from './api';

function UserBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({ 
    username: 'Пользователь', 
    rating: 5.0,
    balance_usdt: 0.00, // Поле для баланса в USDT
    completed_tasks: 0   // Поле для количества выполненных задач
  });
  
  // Состояние загрузки, чтобы заблокировать кнопку во время запроса к API
  const [isPaying, setIsPaying] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    // Запрос к эндпоинту текущего юзера
    api.get('users/me/') 
      .then(res => setUserData(res.data))
      .catch(err => console.error("Не удалось загрузить данные профиля"));
  }, []);

  // Закрытие меню при клике в любое другое место экрана
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Функция обработки клика по кнопке «Пополнить баланс»
  const handleTopUp = async () => {
    const amount = prompt("Введите сумму пополнения в USDT (например, 10):", "10");
    
    // Если пользователь нажал "Отмена" или ввёл пустую строку
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      if (amount !== null) alert("Пожалуйста, введите корректную сумму.");
      return;
    }

    setIsPaying(true);

    try {
      // Стучимся на созданный нами Django эндпоинт
      const response = await api.post('payments/create/', {
        amount: parseFloat(amount)
        // Убрали currency: 'USD', так как бэкенд сам жестко задает USDT_TRC20
      });

      // НАШЕ ИСПРАВЛЕНИЕ: Бэк отдает объект, где сразу лежит ключ pay_url
      if (response.data && response.data.pay_url) {
        // Редиректим пользователя на валидную страницу оплаты CryptoCloud
        window.location.href = response.data.pay_url;
      } else {
        // Если вдруг бэк прислал ошибку в формате DRF
        alert("Ошибка платежной системы: " + (response.data.error || "Не удалось создать счет"));
        setIsPaying(false);
      }
    } catch (err) {
      console.error("Ошибка при создании инвойса:", err);
      
      // Вытаскиваем точную ошибку из ответа бэка, если она там есть
      const errorMsg = err.response?.data?.error || "Не удалось связаться с сервером оплаты. Попробуйте позже.";
      alert(errorMsg);
      setIsPaying(false);
    }
  };

  const firstLetter = userData.username ? userData.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Главный контейнер-кнопка */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3.5 bg-slate-900 text-white pl-3 pr-5 py-2.5 rounded-full border border-slate-800 shadow-[0_4px_20px_rgba(15,23,42,0.15)] hover:bg-slate-850 hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] group cursor-pointer focus:outline-none"
      >
        {/* Аватарка с индикатором онлайна */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-sm text-white tracking-wider shadow-inner border border-white/10 group-hover:scale-105 transition-transform duration-300">
            {firstLetter}
          </div>
          <span className="absolute bottom-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
          </span>
        </div>

        {/* Текст */}
        <div className="text-left font-sans">
          <p className="font-bold text-sm text-slate-100 group-hover:text-white transition-colors tracking-tight leading-tight mb-0.5">
            {userData.username}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-amber-400 text-xs">★</span>
            <span className="text-[11px] text-slate-400 font-bold tracking-wide">
              {Number(userData.rating).toFixed(1)}
            </span>
          </div>
        </div>

        {/* Стрелочка с анимацией вращения при открытии */}
        <svg 
          className={`w-3.5 h-3.5 text-slate-500 group-hover:text-slate-400 transition-transform duration-300 ml-1.5 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* ВЫПАДАЮЩЕЕ ПРЕМИУМ МЕНЮ */}
      {isOpen && (
        <div className="absolute left-0 mt-3 w-72 bg-white border border-slate-100 rounded-[28px] shadow-[0_20px_50px_rgba(15,23,42,0.08)] p-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200 origin-top-left">
          
          {/* Секция 1: Финансы (Пролог эквайринга) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-inner relative overflow-hidden mb-4">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-indigo-50/10 rounded-full blur-xl" />
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Текущий баланс</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tight">{Number(userData.balance_usdt).toFixed(2)}</span>
              <span className="text-xs font-bold text-indigo-400">USDT</span>
            </div>
            
            {/* Кнопка пополнения баланса со статусом загрузки */}
            <button 
              onClick={handleTopUp}
              disabled={isPaying}
              className={`mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/20 ${isPaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isPaying ? '⏳ Создание счета...' : '💎 Пополнить баланс'}
            </button>
          </div>

          {/* Секция 2: Статистика исполнителя / заказчика */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Рейтинг</span>
              <span className="text-sm font-black text-slate-800 flex items-center justify-center gap-1">
                ⭐ {Number(userData.rating).toFixed(1)}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Заказы</span>
              <span className="text-sm font-black text-slate-800">
                🚀 {userData.completed_tasks} шт
              </span>
            </div>
          </div>

          <hr className="border-slate-100 my-3" />

          {/* Секция 3: Навигационные ссылки */}
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 transition flex items-center gap-2.5">
              ⚙️ Настройки аккаунта
            </button>
            <button className="w-full text-left px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 transition flex items-center gap-2.5">
              🛡️ Безопасность и ключи
            </button>
            
            <hr className="border-slate-100 my-2" />
            
            {/* Кнопка Выход */}
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}
              className="w-full text-left px-3 py-2.5 bg-rose-50/40 hover:bg-rose-50 rounded-xl text-sm font-bold text-rose-600 transition flex items-center gap-2.5"
            >
              🚪 Выйти из системы
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserBadge;
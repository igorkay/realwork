import React, { useState, useEffect } from 'react';
import api from './api';

function LoginForm({ setUser, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    html.style.setProperty('margin', '0', 'important');
    html.style.setProperty('padding', '0', 'important');
    html.style.setProperty('background-color', '#090d16', 'important');
    
    body.style.setProperty('margin', '0', 'important');
    body.style.setProperty('padding', '0', 'important');
    body.style.setProperty('background-color', '#090d16', 'important');

    return () => {
      html.style.backgroundColor = '';
      body.style.backgroundColor = '';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('token/', { username, password });
      localStorage.setItem('token', res.data.access);
      
      const userRes = await api.get('users/me/');
      localStorage.setItem('user', JSON.stringify(userRes.data));
      setUser(userRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#090d16',
        display: 'flex',
        overflow: 'hidden',
        zIndex: 9999
      }}
      className="text-white"
    >
      {/* ЛЕВАЯ ЧАСТЬ: МАРКЕТИНГОВЫЙ БЛОК */}
      <div 
        className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 lg:p-16 bg-cover bg-center h-full"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.95)), url('http://googleusercontent.com/image_collection/image_retrieval/498531985610772507_0')` 
        }}
      >
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>
        
        <div className="flex items-center space-x-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="font-bold text-xl tracking-wider text-white">R</span>
          </div>
          <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Realwork<span className="text-indigo-400">.pro</span>
          </span>
        </div>

        <div className="my-auto max-w-lg z-10 py-2">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4">
            Делегируйте задачи <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              без риска и переплат
            </span>
          </h1>
          <p className="text-gray-300 text-sm lg:text-base mb-6 leading-relaxed">
            Инновационная экосистема с честным распределением дохода. Мы убрали лишних посредников, чтобы вы работали напрямую и безопасно.
          </p>

          {/* НАШИ 3 ПРЕИМУЩЕСТВА СНОВА ТУТ */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <i className="fa-solid fa-shield-halved text-base"></i>
              </div>
              <div>
                <h3 className="font-bold text-sm lg:text-base text-white">Безопасные сделки & Крипта</h3>
                <p className="text-gray-400 text-xs">Встроенный Escrow-гарант защищает ваши средства. Расчеты в USDT и DASH для мгновенных транзакций.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                <i className="fa-solid fa-percent text-base"></i>
              </div>
              <div>
                <h3 className="font-bold text-sm lg:text-base text-white">Максимум заработка, minimum комиссий</h3>
                <p className="text-gray-400 text-xs">Самые низкие комиссии на рынке. Никаких скрытых удержаний и грабительских процентов.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 shrink-0">
                <i className="fa-solid fa-fire text-base"></i>
              </div>
              <div>
                <h3 className="font-bold text-sm lg:text-base text-white">Спасение для ваших дедлайнов</h3>
                <p className="text-gray-400 text-xs">Идеально для фрилансеров, которые не успевают в срок. Найдите субподрядчика за пару кликов.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-gray-500 text-xs z-10">
          © 2026 Realwork.pro. Экосистема для работы.
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ: ФОРМА ВХОДА */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-[#090d16] h-full overflow-y-auto">
        <div className="w-full max-w-sm bg-[#111827]/60 p-6 rounded-2xl border border-gray-800 backdrop-blur-md shadow-2xl space-y-4">
          
          <div className="text-center md:text-left flex items-center space-x-3 md:space-x-0 md:block">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl text-lg md:mb-2 border border-indigo-500/20 shrink-0">
              🔐
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Войти в аккаунт</h2>
              <p className="text-gray-400 text-xs mt-0.5">Добро пожаловать обратно</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Логин</label>
              <input
                type="text"
                required
                placeholder="Ваш login"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#1f2937]/50 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-2 px-3 text-white placeholder-gray-500 outline-none transition duration-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Пароль</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1f2937]/50 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-2 px-3 text-white placeholder-gray-500 outline-none transition duration-200 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-bold transition duration-200 shadow-lg shadow-indigo-600/20 text-sm mt-1"
            >
              {loading ? 'Авторизация...' : 'Войти в панель'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition duration-200 hover:underline cursor-pointer py-1"
              >
                Еще нет аккаунта? Создать новый
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
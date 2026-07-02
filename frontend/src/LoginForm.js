import React, { useState, useEffect } from 'react';
import api from './api';

function LoginForm({ setUser, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#090d16';
    return () => {
      document.body.style.backgroundColor = '';
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
    <div className="flex min-h-screen w-full bg-[#090d16] text-white overflow-x-hidden">
      {/* ЛЕВАЯ ЧАСТЬ: МАРКЕТИНГОВЫЙ БЛОК */}
      <div 
        className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 lg:p-16 bg-cover bg-center min-h-screen"
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

        <div className="my-auto max-w-lg z-10 py-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Делегируйте задачи <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              без риска и переплат
            </span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Инновационная экосистема с честным распределением дохода. Мы убрали лишних посредников, чтобы вы работали напрямую и безопасно.
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <i className="fa-solid fa-shield-halved text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Безопасные сделки & Крипта</h3>
                <p className="text-gray-400 text-sm">Встроенный Escrow-гарант защищает ваши средства. Полная поддержка расчетов в USDT и DASH для мгновенных транзакций без географических ограничений.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                <i className="fa-solid fa-percent text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Максимум заработка, минимум комиссий</h3>
                <p className="text-gray-400 text-sm">Самые низкие комиссии на рынке. Больше никаких скрытых удержаний и грабительских процентов — фиксированные и прозрачные условия на ввод и вывод.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 shrink-0">
                <i className="fa-solid fa-fire text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Спасение для ваших дедлайнов</h3>
                <p className="text-gray-400 text-sm">Идеально подходит для фрилансеров и наемных сотрудников, которые перегружены работой. Найдите надежного субподрядчика за пару кликов и сдайте проект точно в срок.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-gray-500 text-xs z-10">
          © 2026 Realwork.pro. Профессиональная экосистема для работы.
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ: ФОРМА ВХОДА */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-[#090d16] min-h-screen">
        <div className="w-full max-w-md space-y-6 bg-[#111827]/40 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-2xl">
          
          <div className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl text-xl mb-3 border border-indigo-500/20">
              🔐
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Войти в аккаунт</h2>
            <p className="text-gray-400 mt-1.5 text-sm">Добро пожаловать обратно</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">Логин</label>
              <input
                type="text"
                required
                placeholder="Ваш логин"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#1f2937]/50 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-white placeholder-gray-500 outline-none transition duration-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">Пароль</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1f2937]/50 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-white placeholder-gray-500 outline-none transition duration-200 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-bold transition duration-200 shadow-lg shadow-indigo-600/20 text-sm"
            >
              {loading ? 'Авторизация...' : 'Войти в панель'}
            </button>

            {onSwitchToRegister && (
              <div className="text-center pt-3 border-t border-gray-800/60 mt-4">
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-700 hover:border-indigo-500 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition duration-200"
                >
                  Создать новый аккаунт
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
import React, { useState } from 'react';
import api from './api';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('register/', { username, password });
      setSuccess(true);
    } catch (err) {
      alert('Ошибка при регистрации. Возможно, логин занят.');
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-50 flex items-center justify-center overflow-y-auto">
      <div className="w-full h-full lg:h-[90vh] lg:max-w-6xl lg:m-4 bg-white lg:rounded-3xl lg:shadow-[0_20px_50px_rgba(0,0,0,0.05)] grid lg:grid-cols-2 overflow-hidden">
        
        {/* ЛЕВАЯ КОЛОНКА: Маркетинговый блок (скрывается на мобилках) */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white relative overflow-hidden">
          {/* Декоративное свечение на фоне */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-30"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-20"></div>
          
          {/* Логотип / Название */}
          <div className="relative z-10 flex items-center space-x-2">
            <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
              REALWORK<span className="text-indigo-400">.PRO</span>
            </span>
          </div>

          {/* Главный оффер */}
          <div className="relative z-10 my-auto max-w-md">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-200">
              Платформа безопасных сделок нового поколения
            </h1>
            <p className="text-indigo-100/80 text-base mb-8">
              Регистрируйтесь, чтобы безопасно размещать заказы или выполнять задачи с гарантированной оплатой по всему миру.
            </p>

            {/* Буллиты преимуществ */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1 flex items-center justify-center w-5 h-5 bg-white/10 rounded-full text-xs text-indigo-300">✓</div>
                <div>
                  <h4 className="font-semibold text-white">Мгновенный расчет по СБП</h4>
                  <p className="text-xs text-indigo-200/70">Быстрое пополнение баланса и вывод средств без задержек.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-1 flex items-center justify-center w-5 h-5 bg-white/10 rounded-full text-xs text-indigo-300">✓</div>
                <div>
                  <h4 className="font-semibold text-white">Конфиденциальность с криптой</h4>
                  <p className="text-xs text-indigo-200/70">Минимальные комиссии и полная независимость через Dash и USDT.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-1 flex items-center justify-center w-5 h-5 bg-white/10 rounded-full text-xs text-indigo-300">✓</div>
                <div>
                  <h4 className="font-semibold text-white">Защита каждой сделки</h4>
                  <p className="text-xs text-indigo-200/70">Средства резервируются системой до полного подтверждения работы.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Футер левого блока */}
          <div className="relative z-10 text-xs text-indigo-200/50">
            © 2026 Realwork.pro. Все права защищены.
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: Контентная (Форма регистрации или Успех) */}
        <div className="flex items-center justify-center p-6 md:p-12 bg-white">
          <div className="w-full max-w-md">
            
            {success ? (
              /* ЭКРАН УСПЕХА */
              <div className="text-center animate-fade-in">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Регистрация успешна!</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Теперь вы можете переключиться на экран входа и авторизоваться в панели управления.
                </p>
                <button 
                  onClick={() => window.location.reload()} // Или твой переход на Login
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transitionduration-200"
                >
                  Перейти ко входу
                </button>
              </div>
            ) : (
              /* САМА ФОРМА */
              <div>
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl text-xl mb-3 lg:hidden">
                    ✨
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Создать аккаунт</h2>
                  <p className="text-sm text-slate-500 mt-1">Заполните данные для мгновенного старта</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Придумайте логин</label>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={e => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition duration-200"
                      placeholder="Новый логин"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Надежный пароль</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition duration-200"
                      placeholder="••••••••"
                      required 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] mt-2"
                  >
                    Создать аккаунт
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
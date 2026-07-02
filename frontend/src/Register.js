import React, { useState, useEffect } from 'react';
import api from './api';

function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Ошибка регистрации');
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
      {/* ЛЕВАЯ ЧАСТЬ */}
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
            Создайте аккаунт <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              в пару кликов
            </span>
          </h1>
        </div>
        <div className="text-gray-500 text-xs z-10">© 2026 Realwork.pro. Экосистема для работы.</div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-[#090d16] h-full overflow-y-auto">
        <div className="w-full max-w-sm bg-[#111827]/60 p-6 rounded-2xl border border-gray-800 backdrop-blur-md shadow-2xl space-y-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight">Регистрация</h2>
            <p className="text-gray-400 text-xs mt-0.5">Внесите данные учетной записи</p>
          </div>

          {success ? (
            <div className="text-center py-4 space-y-3">
              <div className="text-xl">🎉</div>
              <p className="text-emerald-400 font-bold text-sm">Успешно зарегистрировано!</p>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="w-full py-2 bg-indigo-600 rounded-xl text-sm font-bold"
              >
                Войти в аккаунт
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">{error}</div>}
              
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Логин</label>
                <input type="text" name="username" required value={formData.username} onChange={handleChange} className="w-full bg-[#1f2937]/50 border border-gray-700 rounded-xl py-2 px-3 text-white text-sm outline-none" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-[#1f2937]/50 border border-gray-700 rounded-xl py-2 px-3 text-white text-sm outline-none" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Пароль</label>
                <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full bg-[#1f2937]/50 border border-gray-700 rounded-xl py-2 px-3 text-white text-sm outline-none" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Подтверждение</label>
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full bg-[#1f2937]/50 border border-gray-700 rounded-xl py-2 px-3 text-white text-sm outline-none" />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm mt-2">
                Зарегистрироваться
              </button>

              <div className="text-center pt-1">
                <button type="button" onClick={onSwitchToLogin} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition duration-200 hover:underline">
                  Уже есть аккаунт? Войти
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
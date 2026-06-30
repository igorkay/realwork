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

  if (success) {
    return (
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Регистрация успешна!</h3>
        <p className="text-sm text-slate-500 mb-6">Теперь вы можете переключиться на экран входа и авторизоваться.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl text-2xl mb-4">
          ✨
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Регистрация</h2>
        <p className="text-sm text-slate-500 mt-1">Создайте аккаунт для старта работы</p>
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
  );
}

export default Register;
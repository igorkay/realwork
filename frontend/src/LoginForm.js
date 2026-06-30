import React, { useState } from 'react';
import api from './api';

function LoginForm({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('token/', { username, password });
      localStorage.setItem('token', res.data.access);
      
      const userRes = await api.get('users/me/');
      localStorage.setItem('user', JSON.stringify(userRes.data));
      setUser(userRes.data);
    } catch (err) {
      alert('Неверный логин или пароль');
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl text-2xl mb-4">
          🔐
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Войти в аккаунт</h2>
        <p className="text-sm text-slate-500 mt-1">Добро пожаловать обратно</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Логин</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition duration-200"
            placeholder="Ваш логин"
            required 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Пароль</label>
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
          Войти в панель
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
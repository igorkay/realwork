import React, { useState, useEffect } from 'react';
import api from './api';

function AdminPanel({ user }) { // Принимаем user
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('admin/users/')
      .then(res => setUsers(res.data))
      .catch(err => console.log("Ошибка сервера:", err.response)); // <-- СЮДА
  }, []);

  useEffect(() => {
    console.log("AdminPanel: useEffect запущен, user =", user);
    if (user && user.is_staff) {
      api.get('admin/users/')
        .then(res => {
          console.log("Данные от сервера:", res.data);
          setUsers(res.data);
        })
        .catch(err => console.error("Ошибка:", err));
    } else {
      console.log("Условие if (user && user.is_staff) не выполнилось!");
    }
  }, [user]); // Добавили зависимость от user

  const changeRating = async (userId, currentRating, delta) => {
    const newRating = currentRating + delta;
    try {
      await api.patch(`admin/update-rating/${userId}/`, { rating: newRating });
      // Обновляем состояние
      setUsers(users.map(u => u.id === userId ? {...u, rating: newRating} : u));
    } catch (err) { alert("Ошибка обновления рейтинга"); }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Управление рейтингом</h1>
      {users.map(u => (
        <div key={u.id} className="flex justify-between items-center p-4 bg-white border rounded-xl mb-2">
          <span>{u.username}</span>
          <div className="flex items-center gap-4">
            <button onClick={() => changeRating(u.id, u.rating, -1)} className="px-3 py-1 bg-slate-100 rounded">-</button>
            <span className="font-bold w-8 text-center">{u.rating}</span>
            <button onClick={() => changeRating(u.id, u.rating, 1)} className="px-3 py-1 bg-slate-100 rounded">+</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;
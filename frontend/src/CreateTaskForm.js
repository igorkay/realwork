import React, { useState } from 'react';
import api from './api';

function CreateTaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('MICRO');
  const [deadlineHours, setDeadlineHours] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('tasks/', {
        title,
        description,
        price: parseFloat(price),
        category,
        deadline_hours: parseInt(deadlineHours)
      });
      alert('Заказ успешно опубликован!');
      setTitle('');
      setDescription('');
      setPrice('');
      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      alert('Ошибка при создании заказа');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Название задачи</label>
        <input 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
          placeholder="Например: Анимировать фото с помощью ИИ"
          required 
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Подробное техническое задание</label>
        <textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)}
          rows="4"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition resize-none"
          placeholder="Опишите, что именно нужно сделать исполнителю..."
          required 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Бюджет (₽)</label>
          <input 
            type="number" 
            value={price} 
            onChange={e => setPrice(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
            placeholder="500"
            required 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Категория</label>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition appearance-none"
          >
            <option value="MICRO">Микро-задачи</option>
            <option value="AI">ИИ и Видео</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Дедлайн (часов)</label>
          <input 
            type="number" 
            value={deadlineHours} 
            onChange={e => setDeadlineHours(e.target.value)}
            min="1"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
            required 
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] mt-4"
      >
        🚀 Опубликовать заказ на бирже
      </button>
    </form>
  );
}

export default CreateTaskForm;
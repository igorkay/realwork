Отличный исходник. Как мы и диагностировали по скриншоту, внутри MyTasks.js зашит полноценный заголовок со своим собственным стилем:

JavaScript


<h2 className="text-2xl font-bold mb-6 tracking-tight text-slate-900 flex items-center gap-2.5">
  <span className="w-2.5 h-7 bg-indigo-600 rounded-full"></span>
  Мои задания в работе
</h2>
Плюс ко всему, карточки TaskCard и модальное окно сдачи отчета внутри этого компонента используют жестко прописанные белые фоны (bg-white), светлые рамки и темный текст (text-slate-900), которые теперь сильно режут глаза и выбиваются из нашей новой стильной полутемной гаммы.

Что я сделал в коде ниже:
Убрал лишний заголовок: Полностью вырезал дублирующий заголовок <h2> из MyTasks, чтобы блоки контента встали ровно на свои места и больше ничего ни на что не нализало.

Адаптировал карточки под темную тему: Карточки TaskCard теперь рендерятся в красивом матовом полутемном стиле (bg-[#1a2642]/40), тексты заголовков стали белыми, а описания — мягко-серыми.

Обновил аккордеоны (AccordionHeader): Заменил светлые подложки на глубокие полупрозрачные тона, которые идеально контрастируют на фоне #0d1527.

Перекрасил модальное окно сдачи: Теперь форма отправки результатов не бьет по глазам белым листом, а выглядит как премиальный темный попап с аккуратной неоновой тенью.

Вот финальный, чистый и адаптированный код для frontend/src/MyTasks.js:

Фрагмент кода


import React, { useEffect, useState } from 'react';
import api from './api';

// Отдельный компонент для одной задачи с таймером в темной теме
function TaskCard({ task, onCancel, onSelect }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      let distance = 0;

      if (task.status === 'in_progress' && task.taken_at) {
        const startTime = new Date(task.taken_at).getTime();
        const deadline = startTime + (task.deadline_hours * 60 * 60 * 1000);
        distance = deadline - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft("Время вышло!");
        } else {
          formatAndSetTime(distance);
        }
      } else if (task.status === 'review' && (task.report_created_at || task.report?.created_at)) {
        const reportTime = new Date(task.report_created_at || task.report.created_at).getTime();
        const autoApproveDeadline = reportTime + (36 * 60 * 60 * 1000);
        distance = autoApproveDeadline - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft("Автопринято системой!");
        } else {
          formatAndSetTime(distance);
        }
      }
    }, 1000);

    const formatAndSetTime = (ms) => {
      const h = Math.floor(ms / (1000 * 60 * 60));
      const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((ms % (1000 * 60)) / 1000);
      setTimeLeft(`${h}ч ${m}м ${s}с`);
    };

    return () => clearInterval(timer);
  }, [task]);

  return (
    <div className="group p-6 bg-[#1a2642]/40 border border-slate-800/60 rounded-3xl shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
      
      {/* Декоративный левый маркер статуса */}
      <div className={`absolute left-0 top-0 bottom-0 w-[4px] 
        ${task.status === 'review' ? 'bg-amber-500' : 'bg-indigo-500'}`} 
      />

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pl-1">
        <div className="space-y-1">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md
            ${task.category === 'AI' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
            {task.category === 'AI' ? 'ИИ и Видео' : 'Микро-задача'}
          </span>
          <h3 className="font-bold text-xl text-white tracking-tight leading-snug group-hover:text-indigo-400 transition-colors pt-1">
            {task.title}
          </h3>
        </div>

        {/* ТЕМНО-СЕРЫЙ таймер дедлайна */}
        <div className="flex flex-col items-start sm:items-end flex-shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block mb-1">
            {task.status === 'review' ? '🔒 Автоприемка через' : '⏱️ Дедлайн'}
          </span>
          <div className="font-mono text-sm font-bold bg-slate-900 text-slate-100 px-3 py-1.5 rounded-xl border border-slate-800 shadow-inner tracking-wide">
            {timeLeft || "расчет..."}
          </div>
        </div>
      </div>

      {/* Описание */}
      <p className="text-sm text-slate-300 mt-4 bg-[#11192e]/50 p-4 rounded-2xl border border-slate-800/40 leading-relaxed pl-1">
        {task.description}
      </p>
      
      {/* Блок доработки от заказчика */}
      {task.status === 'in_progress' && task.revision_comment && (
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl pl-1">
          <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
            ⚠️ Комментарий заказчика по доработке:
          </p>
          <p className="text-amber-300 text-sm leading-relaxed">{task.revision_comment}</p>
        </div>
      )}
      
      {/* Нижняя панель действий */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between sm:items-center gap-4 pl-1">
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1">
          
          {task.status === 'in_progress' ? (
            <>
              <button 
                onClick={() => onSelect(task)} 
                className="flex-1 sm:flex-none text-sm bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/10 active:scale-[0.98]"
              >
                📤 Открыть / Сдать работу
              </button>
              
              <button 
                onClick={() => onCancel(task.id)} 
                className="text-sm bg-rose-500/10 text-rose-400 px-4 py-3 rounded-xl font-semibold border border-rose-500/20 hover:bg-rose-500/20 hover:text-rose-300 transition active:scale-[0.98]"
              >
                Отказаться
              </button>
            </>
          ) : (
            <div className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-xl flex items-center gap-2 w-full sm:w-auto">
              ⏳ Отчет отправлен на проверку заказчику
            </div>
          )}
        </div>

        <div className="flex items-center sm:justify-end gap-4 text-right flex-shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Оплата</span>
            <span className="text-lg font-black text-emerald-400">{task.price} ₽</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Основной компонент
function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [reportData, setReportData] = useState({ text: '', link: '', image: null });
  
  const [isOpenReview, setIsOpenReview] = useState(true);
  const [isOpenActive, setIsOpenActive] = useState(true);

  const loadTasks = () => {
    api.get('tasks/my-active/')
      .then(res => setTasks(res.data))
      .catch(err => console.error("Ошибка загрузки", err));
  };

  useEffect(() => { loadTasks(); }, []);

  const handleCancel = async (taskId) => {
    if (window.confirm("Вы уверены, что хотите отказаться от выполнения этого заказа? Это снизит ваш текущий рейтинг.")) {
      try {
        await api.patch(`tasks/${taskId}/cancel/`);
        alert("Вы успешно отказались от задачи.");
        loadTasks();
      } catch (err) { alert("Ошибка при отмене заказа."); }
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('task', selectedTask.id);
    formData.append('text', reportData.text);
    formData.append('link', reportData.link);
    if (reportData.image) formData.append('image', reportData.image);

    try {
      await api.post('tasks/report/', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      alert("Работа успешно сдана на проверку заказчику!");
      setSelectedTask(null);
      loadTasks(); 
    } catch (err) { alert("Ошибка при отправке"); }
  };

  const reviewTasks = tasks.filter(t => t.status === 'review');
  const activeTasks = tasks.filter(t => t.status === 'in_progress');

  const AccordionHeader = ({ title, count, isOpen, onClick, bgStyle, textStyle }) => (
    <button 
      onClick={onClick}
      className={`flex justify-between items-center w-full py-4 px-5 rounded-2xl mb-3 font-semibold transition-all duration-200 shadow-md border ${bgStyle} ${textStyle}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="uppercase tracking-widest font-bold text-xs">{title}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-900/40 text-white shadow-inner border border-white/5">
          {count}
        </span>
      </div>
      <span className={`text-xs transition-transform duration-300 transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
    </button>
  );

  return (
    <div className="w-full max-w-2xl mx-auto font-sans text-slate-200">
      {/* ИСПРАВЛЕНО: Убран дублирующий заголовок h2, так как обёртка уже есть в App.js */}

      {/* Блок На проверке */}
      {reviewTasks.length > 0 && (
        <div className="mb-5">
          <AccordionHeader 
            title="Ожидают проверки заказчиком" 
            count={reviewTasks.length} 
            isOpen={isOpenReview} 
            onClick={() => setIsOpenReview(!isOpenReview)} 
            bgStyle="bg-amber-500/10 border-amber-500/20"
            textStyle="text-amber-400 hover:bg-amber-500/20"
          />
          <div className={`space-y-4 transition-all duration-300 ease-in-out overflow-hidden ${isOpenReview ? 'max-h-[1500px] opacity-100 mt-2 mb-4' : 'max-h-0 opacity-0'}`}>
            {reviewTasks.map(task => (
              <TaskCard key={task.id} task={task} onCancel={handleCancel} onSelect={setSelectedTask} />
            ))}
          </div>
        </div>
      )}

      {/* Блок В работе */}
      <div className="mb-5">
        <AccordionHeader 
          title="Выполняются прямо сейчас" 
          count={activeTasks.length} 
          isOpen={isOpenActive} 
          onClick={() => setIsOpenActive(!isOpenActive)} 
          bgStyle="bg-indigo-500/10 border-indigo-500/20"
          textStyle="text-indigo-400 hover:bg-indigo-500/20"
        />
        <div className={`space-y-4 transition-all duration-300 ease-in-out overflow-hidden ${isOpenActive ? 'max-h-[2000px] opacity-100 mt-2 mb-4' : 'max-h-0 opacity-0'}`}>
          {activeTasks.length > 0 ? activeTasks.map(task => (
            <TaskCard key={task.id} task={task} onCancel={handleCancel} onSelect={setSelectedTask} />
          )) : <p className="text-xs text-slate-400 italic pl-2 py-2">У вас пока нет active задач на исполнении.</p>}
        </div>
      </div>

      {/* ТЕМНОЕ МОДАЛЬНОЕ ОКНО СДАЧИ ОТЧЕТА */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <form 
            onSubmit={handleReportSubmit} 
            className="bg-[#111827] p-8 rounded-[32px] w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-slate-800 animate-in zoom-in-95 duration-200 text-white"
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">✨</span>
              <h2 className="font-black text-2xl text-white tracking-tight">Сдача проекта</h2>
            </div>
            <p className="text-xs text-slate-400 font-medium pl-9">
              Отправка результатов по задаче: <span className="font-bold text-slate-300">{selectedTask.title}</span>
            </p>
            
            <hr className="border-slate-800 my-5" />

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">
                Текстовый отчёт
              </label>
              <textarea 
                rows="4" 
                required
                className="w-full border border-slate-700 p-4 rounded-xl text-sm placeholder:text-slate-500 placeholder:text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-[#1f2937]/40 text-white transition-all resize-none" 
                placeholder="Опишите выполненную работу, вставьте текстовые результаты или ключевые данные..." 
                onChange={(e) => setReportData({...reportData, text: e.target.value})} 
              />
            </div>

            <div className="space-y-2 mt-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">
                Ссылка на файлы
              </label>
              <input 
                className="w-full h-14 border border-slate-700 px-4 rounded-xl text-sm placeholder:text-slate-500 placeholder:text-[13px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-[#1f2937]/40 text-white transition-all" 
                placeholder="https://drive.google.com/share-your-work" 
                onChange={(e) => setReportData({...reportData, link: e.target.value})} 
              />
            </div>

            <div className="space-y-2 mt-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">
                Скриншот результатов (опционально)
              </label>
              <div className="w-full h-14 border border-slate-700 px-4 rounded-xl flex items-center bg-[#1f2937]/40 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <input 
                  type="file" 
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 transition-colors cursor-pointer" 
                  onChange={(e) => setReportData({...reportData, image: e.target.files[0]})} 
                />
              </div>
            </div>

            <hr className="border-slate-800 my-6" />

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                type="button" 
                onClick={() => setSelectedTask(null)} 
                className="py-4 px-5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-colors text-sm order-2 sm:order-1 active:scale-[0.99]"
              >
                Отмена
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:opacity-95 transition-all text-sm order-1 sm:order-2 shadow-lg shadow-emerald-950/20 active:scale-[0.99] flex items-center justify-center gap-2 tracking-wide"
              >
                <span>Отправить отчёт</span>
                <svg className="w-4 h-4 transform rotate-45 -mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default MyTasks;
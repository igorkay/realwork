import React, { useEffect, useState } from 'react';
import api from './api';

// Карточка таски для заказчика
function CreatedTaskCard({ task, onOpenReport, onCancelTask }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (task.status === 'review' && (task.report_created_at || task.report?.created_at)) {
      const timer = setInterval(() => {
        const reportTime = new Date(task.report_created_at || task.report.created_at).getTime();
        const autoApproveDeadline = reportTime + (36 * 60 * 60 * 1000);
        const now = new Date().getTime();
        const distance = autoApproveDeadline - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft("Время вышло! Принято автоматически");
        } else {
          const h = Math.floor(distance / (1000 * 60 * 60));
          const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${h}ч ${m}м ${s}с`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [task]);

  const getStatusStyles = (status) => {
    switch(status) {
      case 'open': 
        return { label: 'Поиск исполнителя', className: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'in_progress': 
        return { label: 'В работе', className: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
      case 'review': 
        return { label: 'На проверке', className: 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' };
      case 'done': 
        return { label: 'Выполнено', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      default: 
        return { label: status, className: 'bg-slate-100 text-slate-500 border-slate-200' };
    }
  };

  const statusInfo = getStatusStyles(task.status);

  return (
    <div className="group p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(15,23,42,0.015)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.04)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-[4px] transition-colors
        ${task.status === 'review' ? 'bg-amber-500' : 
          task.status === 'in_progress' ? 'bg-indigo-500' :
          task.status === 'done' ? 'bg-emerald-500' : 'bg-blue-400'}`} 
      />

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pl-2">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm
            ${task.category === 'AI' ? 'bg-purple-50 border border-purple-100/50' : 'bg-blue-50 border border-blue-100/50'}`}>
            {task.category === 'AI' ? '🤖' : '📝'}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">{task.title}</h3>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{task.price} ₽</span>
              <span className="text-xs text-slate-400 font-medium">бюджет</span>
            </div>
          </div>
        </div>
        
        <span className={`text-[11px] px-3.5 py-1.5 rounded-full uppercase font-bold tracking-wider border whitespace-nowrap self-start sm:self-center ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>
      
      <div className="mt-5 ml-2">
        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100/80">{task.description}</p>
      </div>
      
      {task.status === 'open' && (
        <div className="mt-5 ml-2">
          <button 
            onClick={() => onCancelTask(task.id)}
            className="w-full text-xs font-bold py-3.5 text-red-500 bg-red-50/40 hover:bg-red-50 rounded-xl transition border border-red-100/50 active:scale-[0.99]"
          >
            🚫 Отменить и удалить заказ
          </button>
        </div>
      )}

      {task.status === 'review' && (
        <div className="mt-5 ml-2">
          <div className="text-xs font-mono font-bold text-amber-700 bg-amber-50/80 p-3.5 rounded-xl mb-3 border border-amber-100/60 flex items-center gap-2">
            ⏱️ Автоприемка системы через: <span className="font-black text-amber-600">{timeLeft || "расчет..."}</span>
          </div>
          <button 
            onClick={() => onOpenReport(task.id)}
            className="w-full bg-amber-500 text-white py-3.5 rounded-xl font-semibold hover:bg-amber-600 transition-all shadow-md shadow-amber-100 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            📩 Проверить присланную работу
          </button>
        </div>
      )}

      {task.status === 'done' && (
        <div className="mt-5 ml-2">
          <button 
            onClick={() => onOpenReport(task.id)}
            className="w-full bg-slate-100 text-slate-700 py-3.5 rounded-xl font-semibold hover:bg-slate-200 transition-all border border-slate-200/60 active:scale-[0.99] flex items-center justify-center gap-2 text-xs"
          >
            📋 Посмотреть сданный отчёт и файлы
          </button>
        </div>
      )}

      <div className="mt-5 pt-4 ml-2 border-t border-slate-100/80 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs font-medium text-slate-400">
        <span className="flex items-center gap-1.5">
          📁 Категория: <span className="text-slate-700 font-semibold">{task.category === 'AI' ? 'ИИ и Видео' : 'Микро-задачи'}</span>
        </span>
        {task.executor_username ? (
          <div className="flex items-center gap-1">
            <span>Исполнитель:</span>
            <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg">@{task.executor_username}</span>
          </div>
        ) : (
          <span className="italic text-slate-400 flex items-center gap-1">⏳ Ожидает отклика</span>
        )}
      </div>
    </div>
  );
}

// Основной компонент
function MyCreatedTasks() {
  const [tasks, setTasks] = useState([]);
  const [report, setReport] = useState(null);
  const [comment, setComment] = useState("");
  
  const [isOpenOpen, setIsOpenOpen] = useState(true);
  const [isOpenReview, setIsOpenReview] = useState(true);
  const [isOpenActive, setIsOpenActive] = useState(true);
  const [isOpenDone, setIsOpenDone] = useState(false);

  const loadMyCreatedTasks = () => {
    api.get('tasks/my-created/')
      .then(res => setTasks(res.data))
      .catch(err => console.error("Ошибка загрузки", err));
  };

  useEffect(() => { loadMyCreatedTasks(); }, []);

  const openReport = async (taskId) => {
    try {
      const res = await api.get(`tasks/${taskId}/report/`);
      setReport({ ...res.data, taskId });
      setComment("");
    } catch (err) { alert("Не удалось загрузить отчет"); }
  };

  const handleTaskStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`tasks/${taskId}/status/`, { status: newStatus, comment: comment });
      setReport(null);
      loadMyCreatedTasks();
    } catch (err) { alert("Ошибка при обновлении"); }
  };

  const handleCancelTask = async (taskId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот заказ? Деньги вернутся на баланс.")) {
      try {
        await api.delete(`tasks/${taskId}/delete/`);
        loadMyCreatedTasks();
      } catch (err) {
        alert("Не удалось отменить заказ. Возможно, его уже кто-то взял.");
      }
    }
  };

  const openTasks = tasks.filter(t => t.status === 'open');
  const reviewTasks = tasks.filter(t => t.status === 'review');
  const activeTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const AccordionHeader = ({ title, count, isOpen, onClick, bgStyle, textStyle }) => (
    <button 
      onClick={onClick} 
      className={`flex justify-between items-center w-full py-4 px-5 rounded-2xl mb-3 font-semibold transition-all duration-200 shadow-sm border border-slate-100/40 ${bgStyle} ${textStyle}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="uppercase tracking-widest font-bold text-xs">{title}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold shadow-inner ${count > 0 ? 'bg-white/80' : 'bg-white/40'}`}>
          {count}
        </span>
      </div>
      <span className={`text-xs transition-transform duration-300 transform ${isOpen ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </button>
  );

  return (
    /* ИСПРАВЛЕНО: Чистый контейнер без фиксированной высоты и скрытых overflow */
    <div className="w-full font-sans text-slate-900">
      
      {/* 1. СЕКЦИЯ: Поиск исполнителя */}
      <div className="mb-5">
        <AccordionHeader 
          title="Ожидают исполнителя" 
          count={openTasks.length} 
          isOpen={isOpenOpen} 
          onClick={() => setIsOpenOpen(!isOpenOpen)} 
          bgStyle="bg-slate-100/80 hover:bg-slate-200/50" 
          textStyle="text-slate-700" 
        />
        {/* ИСПРАВЛЕНО: Заменили max-h на чистое React-условие для исключения гигантских пустых пространств */}
        {isOpenOpen && (
          <div className="space-y-4 mt-2 mb-4 animate-in fade-in duration-300">
            {openTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic pl-2">Нет заказов в поиске</p>
            ) : (
              openTasks.map(t => <CreatedTaskCard key={t.id} task={t} onCancelTask={handleCancelTask} />)
            )}
          </div>
        )}
      </div>

      {/* 2. СЕКЦИЯ: На проверке */}
      <div className="mb-5">
        <AccordionHeader 
          title="На проверке" 
          count={reviewTasks.length} 
          isOpen={isOpenReview} 
          onClick={() => setIsOpenReview(!isOpenReview)} 
          bgStyle="bg-amber-50 text-amber-800 hover:bg-amber-100/60" 
        />
        {isOpenReview && (
          <div className="space-y-4 mt-2 mb-4 animate-in fade-in duration-300">
            {reviewTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic pl-2">Нет отчетов на проверку</p>
            ) : (
              reviewTasks.map(t => <CreatedTaskCard key={t.id} task={t} onOpenReport={openReport} />)
            )}
          </div>
        )}
      </div>

      {/* 3. СЕКЦИЯ: В работе */}
      <div className="mb-5">
        <AccordionHeader 
          title="В работе у исполнителей" 
          count={activeTasks.length} 
          isOpen={isOpenActive} 
          onClick={() => setIsOpenActive(!isOpenActive)} 
          bgStyle="bg-indigo-50 text-indigo-800 hover:bg-indigo-100/60" 
        />
        {isOpenActive && (
          <div className="space-y-4 mt-2 mb-4 animate-in fade-in duration-300">
            {activeTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic pl-2">Нет активных задач в работе</p>
            ) : (
              activeTasks.map(t => <CreatedTaskCard key={t.id} task={t} onOpenReport={openReport} />)
            )}
          </div>
        )}
      </div>

      {/* 4. СЕКЦИЯ: Завершенные */}
      <div className="mb-5">
        <AccordionHeader 
          title="Завершенные" 
          count={doneTasks.length} 
          isOpen={isOpenDone} 
          onClick={() => setIsOpenDone(!isOpenDone)} 
          bgStyle="bg-emerald-50 text-emerald-800 hover:bg-emerald-100/60" 
        />
        {isOpenDone && (
          <div className="space-y-4 mt-2 mb-4 animate-in fade-in duration-300">
            {doneTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic pl-2">Список завершенных заказов пуст</p>
            ) : (
              doneTasks.map(t => <CreatedTaskCard key={t.id} task={t} onOpenReport={openReport} />)
            )}
          </div>
        )}
      </div>

      {/* Модальное окно отчета */}
      {report && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-[32px] max-w-lg w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-xl mb-1 text-slate-900 tracking-tight">Отчет исполнителя</h3>
            <p className="text-xs text-slate-400 mb-4">Внимательно проверьте результаты выполнения задачи</p>
            
            <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-700 border border-slate-100/80 leading-relaxed max-h-40 overflow-y-auto mb-4">
              {report.text || <span className="italic text-slate-400">Текстовое описание отсутствует</span>}
            </div>

            {report.link && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Предоставленная ссылка:</label>
                <a 
                  href={report.link.startsWith('http') ? report.link : `https://${report.link}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-semibold underline break-all bg-indigo-50/50 px-3 py-2 rounded-xl border border-indigo-100/40 w-full"
                >
                  🔗 {report.link}
                </a>
              </div>
            )}

            {report.image && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Прикрепленный скриншот:</label>
                <div className="rounded-2xl overflow-hidden border border-slate-100 max-h-48 bg-slate-50 flex items-center justify-center">
                  <img 
                    src={report.image.startsWith('http') ? report.image : `http://127.0.0.1:8000${report.image}`} 
                    alt="Скриншот выполненной работы" 
                    className="object-contain w-full h-full max-h-48 hover:scale-105 transition duration-300 cursor-zoom-in"
                    onClick={(e) => window.open(e.target.src, '_blank')}
                  />
                </div>
              </div>
            )}
            
            {tasks.find(t => t.id === report.taskId)?.status !== 'done' ? (
              <>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Направить комментарий (при доработке):</label>
                <textarea 
                  className="w-full p-3.5 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition resize-none" 
                  rows="3" 
                  placeholder="Опишите, что именно исполнителю нужно исправить или переделать..." 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)} 
                />
                
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button onClick={() => setReport(null)} className="py-3.5 px-5 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition text-sm order-3 sm:order-1 active:scale-[0.99]">Закрыть</button>
                  <button onClick={() => handleTaskStatus(report.taskId, 'in_progress')} className="flex-1 bg-amber-500 text-white py-3.5 rounded-xl font-semibold hover:bg-amber-600 transition text-sm order-2 shadow-lg shadow-amber-100 active:scale-[0.99]">На доработку</button>
                  <button onClick={() => handleTaskStatus(report.taskId, 'done')} className="flex-1 bg-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-600 transition text-sm order-1 sm:order-3 shadow-lg shadow-emerald-100 active:scale-[0.99]">Принять работу</button>
                </div>
              </>
            ) : (
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setReport(null)} 
                  className="w-full py-3.5 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition text-sm active:scale-[0.99]"
                >
                  Закрыть архивный отчёт
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCreatedTasks;
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import Register from './Register';
import TaskList from './TaskList';
import CreateTaskForm from './CreateTaskForm';
import MyTasks from './MyTasks';
import MyCreatedTasks from './MyCreatedTasks';
import UserMenu from './UserMenu';
import AdminPanel from './AdminPanel';
import UserBadge from './UserBadge';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('executor');
  const [isRegistering, setIsRegistering] = useState(false);

  const isAdmin = user && user.username === 'admin_i';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans text-slate-900">
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
      
      {/* НАВИГАЦИЯ С КНОПКОЙ ВЫХОДА */}
      <nav className="relative z-20 p-4 flex justify-between items-center px-6">
        <div className="flex items-center gap-4">
          {user && <UserBadge />}
          {user && <UserMenu />}
        </div>
        {user && (
          <button onClick={handleLogout} className="text-sm bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition">
            Выйти
          </button>
        )}
      </nav>
      
      <div className="relative z-10 p-4">
        {!user ? (
          <div>
            {isRegistering ? (
              <Register onSwitchToLogin={() => setIsRegistering(false)} />
            ) : (
              <LoginForm 
                setUser={setUser} 
                onSwitchToRegister={() => setIsRegistering(true)} 
              />
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto py-10 pb-40">
            <h1 className="text-3xl font-bold text-center mb-8 tracking-tight">Панель управления</h1>

            {/* СЕГМЕНТНЫЙ ПЕРЕКЛЮЧАТЕЛЬ */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative flex p-1 bg-slate-200/80 backdrop-blur-sm rounded-xl w-full max-w-xs shadow-inner border border-slate-300/40">
                <div className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out transform ${role === 'customer' ? 'translate-x-full' : 'translate-x-0'}`} />
                <button onClick={() => setRole('executor')} className={`relative z-10 flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors duration-200 text-center ${role === 'executor' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Исполнитель</button>
                <button onClick={() => setRole('customer')} className={`relative z-10 flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors duration-200 text-center ${role === 'customer' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Заказчик</button>
              </div>
            </div>

            {/* КОНТЕНТ */}
            {role === 'executor' ? (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/30">
                  <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
                    <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
                    Доступные задания
                  </h2>
                  <TaskList />
                </div>
                <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/30">
                  <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
                    <span className="w-2 h-6 bg-orange-500 rounded-full mr-3"></span>
                    Мои задания в работе
                  </h2>
                  <MyTasks />
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/30">
                  <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
                    <span className="w-2 h-6 bg-green-500 rounded-full mr-3"></span>
                    Создать новый заказ
                  </h2>
                  <CreateTaskForm onTaskCreated={() => window.location.reload()} />
                </div>

                {/* ИСПРАВЛЕНО: Завернули MyCreatedTasks в красивую карточку-подложку корректно, без дублирования стилей и заголовков */}
                <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-lg shadow-slate-200/30">
                  <MyCreatedTasks />
                </div>
              </div>
            )}

            {isAdmin && (
              <div className="mt-20 border-t border-slate-200 pt-10">
                <h2 className="text-center font-bold text-slate-400 mb-6 uppercase tracking-widest text-sm">Панель администратора</h2>
                <AdminPanel user={user} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
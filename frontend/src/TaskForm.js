import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskForm() {
    console.log("Компонент TaskForm отрендерился!");
    const [title, setTitle] = useState('');
    const [tasks, setTasks] = useState([]);
    
    // Состояние для формы отчета
    const [reportTask, setReportTask] = useState(null); // Какую задачу сдаем
    const [reportData, setReportData] = useState({ text: '', link: '', image: null });

    const fetchTasks = async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/tasks/');
        console.log("Мои задачи:", response.data); // ЭТО ВАЖНО
        setTasks(response.data);
    };

    useEffect(() => { fetchTasks(); }, []);

    // Отправка отчета на бэкенд
    const submitReport = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('task', reportTask.id);
        formData.append('text', reportData.text);
        formData.append('link', reportData.link);
        if (reportData.image) formData.append('image', reportData.image);

        await axios.post('http://127.0.0.1:8000/api/tasks/report/', formData);
        setReportTask(null); // Закрыть форму
        fetchTasks(); // Обновить список
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Задачи</h1>
            
            {/* Список задач */}
            <ul className="space-y-4">
                {tasks.map(task => (
                    <li key={task.id} className="p-4 bg-gray-50 rounded-md border flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{task.title}</p>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{task.status}</span>
                        </div>
                        {task.status === 'in_progress' && (
                            <button 
                                onClick={() => setReportTask(task)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                                Сдать работу
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {/* Модальное окно с формой сдачи */}
            {reportTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <form onSubmit={submitReport} className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
                        <h2 className="text-lg font-bold">Сдача задачи: {reportTask.title}</h2>
                        <textarea className="w-full border p-2" placeholder="Отчет..." onChange={(e) => setReportData({...reportData, text: e.target.value})} />
                        <input className="w-full border p-2" placeholder="Ссылка..." onChange={(e) => setReportData({...reportData, link: e.target.value})} />
                        <input type="file" onChange={(e) => setReportData({...reportData, image: e.target.files[0]})} />
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded">Отправить</button>
                            <button type="button" onClick={() => setReportTask(null)} className="flex-1 bg-gray-300 py-2 rounded">Отмена</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default TaskForm;
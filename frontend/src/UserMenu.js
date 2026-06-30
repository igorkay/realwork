import React, { useState, useEffect, useRef } from 'react';

function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
  
    return (
      // Добавили fixed, bottom-6, right-6 и z-50
      <div className="fixed bottom-6 right-6 z-50" ref={menuRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 transition-transform hover:scale-110 active:scale-95 shadow-xl rounded-full overflow-hidden border-2 border-white"
        >
          <img 
            src="https://raw.githubusercontent.com/igorkay/git.lesson/master/unnamed%20(1).jpg" 
            alt="Menu" 
            className="w-full h-full object-cover"
          />
        </button>
  
        {/* Меню теперь открывается ВВЕРХ, так как кнопка внизу */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
            <div className="p-2">
              <button className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl text-sm font-medium text-gray-700 transition-colors">
                ⚙️ Настройки профиля
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl text-sm font-medium text-gray-700 transition-colors">
                💳 Платежная система
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-xl text-sm font-medium text-red-600 transition-colors">
                📩 Связь с поддержкой
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

export default UserMenu;
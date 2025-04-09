import { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdCheckmarkCircle, IoMdClose, IoMdWarning } from 'react-icons/io';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (message, type = 'success', duration = 5000) => {
    const id = Date.now();
    
    setNotifications(prev => [...prev, { id, message, type }]);
    
    if (duration) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      
      <div className="fixed bottom-5 right-5 z-50">
        <AnimatePresence>
          {notifications.map(({ id, message, type }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`mb-3 p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md ${
                type === 'success' ? 'bg-green-100 text-green-800' : 
                type === 'error' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}
            >
              <div className="flex-shrink-0">
                {type === 'success' ? (
                  <IoMdCheckmarkCircle className="w-6 h-6" />
                ) : (
                  <IoMdWarning className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">{message}</div>
              <button 
                onClick={() => removeNotification(id)}
                className="flex-shrink-0 text-gray-500 hover:text-gray-700"
              >
                <IoMdClose className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
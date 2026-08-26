import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from '../components/ui/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(({ message, type = 'info', duration = 3500, actionText = null, onAction = null }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, message, type, duration, actionText, onAction };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const success = useCallback((message, opts = {}) => show({ message, type: 'success', ...opts }), [show]);
  const error = useCallback((message, opts = {}) => show({ message, type: 'error', ...opts }), [show]);
  const info = useCallback((message, opts = {}) => show({ message, type: 'info', ...opts }), [show]);

  const value = {
    show,
    success,
    error,
    info,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

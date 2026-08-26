import React from 'react';
import './Toast.css';

const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-item--${toast.type} animate-slide-up`}
          role="alert"
        >
          <div className="toast-item__icon">
            {toast.type === 'success' && (
              <span className="material-symbols-outlined">check_circle</span>
            )}
            {toast.type === 'error' && (
              <span className="material-symbols-outlined">error</span>
            )}
            {toast.type === 'info' && (
              <span className="material-symbols-outlined">info</span>
            )}
          </div>

          <div className="toast-item__message">{toast.message}</div>

          {toast.actionText && toast.onAction && (
            <button
              className="toast-item__action-btn"
              onClick={() => {
                toast.onAction();
                onDismiss(toast.id);
              }}
            >
              {toast.actionText}
            </button>
          )}

          <button
            className="toast-item__close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

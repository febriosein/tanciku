import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useToast } from '../context/ToastContext';
import './Onboarding.css';

const Onboarding = ({ onComplete }) => {
  const { dispatch } = useTransactions();
  const toast = useToast();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Nama tidak boleh kosong!');
      return;
    }
    setIsSubmitting(true);
    dispatch({ type: 'SET_PROFILE', payload: { name: trimmed } });

    // Sedikit delay agar terasa smooth sebelum transisi
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div className="onboarding-screen">
      {/* Background decorative blobs */}
      <div className="onboarding-blob onboarding-blob--1" />
      <div className="onboarding-blob onboarding-blob--2" />

      <div className="onboarding-card animate-fade-in">
        {/* Logo / Icon */}
        <div className="onboarding-logo-wrapper">
          <img
            src="/apple-touch-icon.png"
            alt="Tanciku Logo"
            className="onboarding-logo"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Heading */}
        <div className="onboarding-hero">
          <h1 className="onboarding-title">Selamat Datang di Tanciku! 👋</h1>
          <p className="onboarding-subtitle">
            Aplikasi pencatatan keuangan pribadi yang simpel, cepat, dan tersimpan langsung di perangkat Anda.
          </p>
        </div>

        {/* Fitur kilat */}
        <div className="onboarding-features">
          <div className="onboarding-feature-item">
            <span className="material-symbols-outlined onboarding-feature-icon">lock</span>
            <span>100% Offline & Privat</span>
          </div>
          <div className="onboarding-feature-item">
            <span className="material-symbols-outlined onboarding-feature-icon">account_balance_wallet</span>
            <span>Kelola banyak dompet</span>
          </div>
          <div className="onboarding-feature-item">
            <span className="material-symbols-outlined onboarding-feature-icon">bar_chart</span>
            <span>Laporan & statistik otomatis</span>
          </div>
        </div>

        <div className="onboarding-divider" />

        {/* Form Nama */}
        <form onSubmit={handleSubmit} className="onboarding-form">
          <label className="onboarding-label" htmlFor="onboarding-name">
            Siapa nama panggilan Anda?
          </label>
          <div className="onboarding-input-wrapper">
            <span className="material-symbols-outlined onboarding-input-icon">person</span>
            <input
              id="onboarding-name"
              type="text"
              className="onboarding-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi, Sari, Ahmad..."
              maxLength={30}
              autoFocus
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className={`onboarding-btn ${isSubmitting ? 'onboarding-btn--loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined onboarding-btn-icon spinning">autorenew</span>
                <span>Memulai...</span>
              </>
            ) : (
              <>
                <span>Mulai Mencatat</span>
                <span className="material-symbols-outlined onboarding-btn-icon">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <p className="onboarding-hint">
          Nama Anda tersimpan lokal di perangkat ini dan bisa diubah kapan saja di Pengaturan.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;

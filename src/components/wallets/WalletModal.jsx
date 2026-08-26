import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useToast } from '../../context/ToastContext';
import { WALLET_ICONS, WALLET_COLORS } from '../../utils/wallets';
import Modal from '../ui/Modal';
import './WalletModal.css';

const INITIAL_WALLET_FORM = {
  label: '',
  initialBalance: '',
  icon: 'account_balance',
  color: '#6366F1',
};

const WalletModal = ({ isOpen, onClose, wallet = null }) => {
  const { dispatch } = useTransactions();
  const toast = useToast();
  const isEditing = !!wallet;

  const [form, setForm] = useState(INITIAL_WALLET_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (wallet) {
      setForm({
        id: wallet.id,
        label: wallet.label || '',
        initialBalance: wallet.initialBalance !== undefined && wallet.initialBalance !== null ? String(wallet.initialBalance) : '',
        icon: wallet.icon || 'account_balance',
        color: wallet.color || '#6366F1',
      });
    } else {
      setForm(INITIAL_WALLET_FORM);
    }
    setError('');
  }, [wallet, isOpen]);

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setForm((f) => ({ ...f, initialBalance: raw }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.label.trim()) {
      setError('Nama dompet tidak boleh kosong');
      return;
    }

    const payload = {
      ...form,
      label: form.label.trim(),
      initialBalance: Number(form.initialBalance || 0),
    };

    if (isEditing) {
      dispatch({ type: 'UPDATE_WALLET', payload });
      toast.success(`Dompet "${payload.label}" berhasil diperbarui!`);
    } else {
      dispatch({ type: 'ADD_WALLET', payload });
      toast.success(`Dompet "${payload.label}" berhasil ditambahkan!`);
    }

    onClose();
  };

  const formatDisplayAmount = (val) => {
    if (!val) return '';
    return Number(val).toLocaleString('id-ID');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Dompet / Rekening' : 'Tambah Dompet Baru'}
    >
      <form onSubmit={handleSubmit} className="wallet-form">
        {/* Wallet Name */}
        <div className="wallet-form__field">
          <label htmlFor="wallet-name" className="wallet-form__label">
            Nama Dompet / Rekening
          </label>
          <input
            id="wallet-name"
            type="text"
            className="wallet-form__input"
            placeholder="Contoh: Bank Jago, Seabank, Bibit"
            value={form.label}
            onChange={(e) => {
              setForm((f) => ({ ...f, label: e.target.value }));
              if (error) setError('');
            }}
            maxLength={30}
            autoFocus
          />
          {error && <p className="wallet-form__error">{error}</p>}
        </div>

        {/* Initial Balance */}
        <div className="wallet-form__field">
          <label htmlFor="wallet-balance" className="wallet-form__label">
            Saldo Awal <span className="wallet-form__sublabel">(Opsional)</span>
          </label>
          <div className="wallet-form__amount-wrapper">
            <span className="wallet-form__currency">Rp</span>
            <input
              id="wallet-balance"
              type="text"
              inputMode="numeric"
              className="wallet-form__input wallet-form__amount-input"
              placeholder="0"
              value={formatDisplayAmount(form.initialBalance)}
              onChange={handleAmountChange}
            />
          </div>
          <p className="wallet-form__hint">
            Saldo awal akan dihitung otomatis sebagai saldo dasar akun Anda.
          </p>
        </div>

        {/* Icon Picker */}
        <div className="wallet-form__field">
          <label className="wallet-form__label">Pilih Ikon</label>
          <div className="wallet-form__icons-grid">
            {WALLET_ICONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`wallet-icon-btn ${form.icon === item.id ? 'wallet-icon-btn--active' : ''}`}
                onClick={() => setForm((f) => ({ ...f, icon: item.id }))}
                title={item.label}
              >
                <span className="material-symbols-outlined">{item.id}</span>
                <span className="wallet-icon-btn__label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div className="wallet-form__field">
          <label className="wallet-form__label">Pilih Warna Identitas</label>
          <div className="wallet-form__colors-grid">
            {WALLET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`wallet-color-btn ${form.color === color ? 'wallet-color-btn--active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setForm((f) => ({ ...f, color }))}
                aria-label={`Pilih warna ${color}`}
              >
                {form.color === color && (
                  <span className="material-symbols-outlined check-icon">check</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Card */}
        <div className="wallet-form__preview-box">
          <span className="wallet-form__preview-title">Preview Tampilan:</span>
          <div className="wallet-mini-card" style={{ maxWidth: '240px' }}>
            <div className="wallet-mini-card__top">
              <div
                className="wallet-mini-card__icon"
                style={{ backgroundColor: `${form.color}18`, color: form.color }}
              >
                <span className="material-symbols-outlined">{form.icon}</span>
              </div>
              <span className="wallet-mini-card__name">{form.label || 'Nama Dompet'}</span>
            </div>
            <div className="wallet-mini-card__balance">
              Rp {formatDisplayAmount(form.initialBalance) || '0'}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="wallet-form__footer">
          <button type="button" className="wallet-btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="wallet-btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {isEditing ? 'save' : 'add'}
            </span>
            <span>{isEditing ? 'Simpan Perubahan' : 'Tambah Dompet'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WalletModal;

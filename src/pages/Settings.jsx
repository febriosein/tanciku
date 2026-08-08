import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { useTransactions } from '../context/TransactionContext';
import Button from '../components/ui/Button';
import './Settings.css';

const Settings = () => {
  const { transactions, dispatch } = useTransactions();
  const [userName, setUserName] = useState('Pengguna Tanciku');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tanciku_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setMessage('Backup data berhasil diunduh!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          dispatch({ type: 'SET_TRANSACTIONS', payload: imported });
          setMessage('Data transaksi berhasil diimport!');
          setTimeout(() => setMessage(''), 3000);
        } else {
          alert('Format file JSON tidak valid!');
        }
      } catch (err) {
        alert('Gagal membaca file JSON!');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    dispatch({ type: 'RESET_TRANSACTIONS' });
    setShowResetConfirm(false);
    setMessage('Data transaksi direset ke data sampel!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <>
      <Header title="Setelan" subtitle="Pengaturan profil dan manajemen data" />

      <div className="settings-page">
        {message && (
          <div className="settings-alert animate-fade-in">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{message}</span>
          </div>
        )}

        {/* Profil Section */}
        <div className="card-soft settings-card">
          <div className="settings-card__header">
            <span className="material-symbols-outlined settings-icon">person</span>
            <div>
              <h3 className="settings-title">Profil Pengguna</h3>
              <p className="settings-desc">Atur identitas aplikasi Anda</p>
            </div>
          </div>
          <div className="settings-card__body">
            <div className="settings-field">
              <label htmlFor="user-name">Nama Profil</label>
              <input
                id="user-name"
                type="text"
                className="settings-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="settings-field">
              <label>Mata Uang Utama</label>
              <input
                type="text"
                className="settings-input"
                value="Rupiah (IDR - Rp)"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="card-soft settings-card">
          <div className="settings-card__header">
            <span className="material-symbols-outlined settings-icon">database</span>
            <div>
              <h3 className="settings-title">Manajemen Data</h3>
              <p className="settings-desc">Cadangkan atau impor data transaksi Anda</p>
            </div>
          </div>
          <div className="settings-card__body settings-card__body--grid">
            <div className="settings-action-box">
              <h4>Export Backup Data</h4>
              <p>Unduh semua data transaksi dalam format file JSON.</p>
              <Button variant="secondary" onClick={handleExportJSON}>
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export JSON</span>
              </Button>
            </div>

            <div className="settings-action-box">
              <h4>Import Backup Data</h4>
              <p>Pulihkan data transaksi dari file backup JSON.</p>
              <label className="import-file-btn">
                <span className="material-symbols-outlined text-sm">upload</span>
                <span>Pilih File JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div className="settings-card__footer">
            {!showResetConfirm ? (
              <button
                className="reset-btn"
                onClick={() => setShowResetConfirm(true)}
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Reset ke Data Sampel</span>
              </button>
            ) : (
              <div className="reset-confirm-box">
                <span>Yakin ingin mereset seluruh data ke data sampel awal?</span>
                <div className="reset-confirm-btns">
                  <button className="confirm-btn confirm-btn--cancel" onClick={() => setShowResetConfirm(false)}>
                    Batal
                  </button>
                  <button className="confirm-btn confirm-btn--delete" onClick={handleResetData}>
                    Ya, Reset Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="card-soft settings-card">
          <div className="settings-card__header">
            <span className="material-symbols-outlined settings-icon">info</span>
            <div>
              <h3 className="settings-title">Tentang Aplikasi</h3>
              <p className="settings-desc">Tanciku — Catatan Keuangan Simpel & Efisien</p>
            </div>
          </div>
          <div className="settings-card__body">
            <div className="settings-info-row">
              <span>Versi Aplikasi</span>
              <span className="font-semibold">v1.0.0</span>
            </div>
            <div className="settings-info-row">
              <span>Penyimpanan</span>
              <span className="font-semibold">Lokal Browser (localStorage)</span>
            </div>
            <div className="settings-info-row">
              <span>Total Transaksi Tersimpan</span>
              <span className="font-semibold">{transactions.length} transaksi</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;

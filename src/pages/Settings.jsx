import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import WalletModal from '../components/wallets/WalletModal';
import { formatCurrency } from '../utils/formatCurrency';
import './Settings.css';

const Settings = () => {
  const { transactions, wallets, walletBalances, totalBalance, profile, dispatch } = useTransactions();
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [userName, setUserName] = useState(profile?.name || 'Renno');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Wallet Modal state
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [selectedWalletToEdit, setSelectedWalletToEdit] = useState(null);
  const [walletToDelete, setWalletToDelete] = useState(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error('Nama profil tidak boleh kosong');
      return;
    }
    dispatch({ type: 'SET_PROFILE', payload: { name: userName.trim() } });
    toast.success('Profil berhasil disimpan!');
  };

  const handleOpenAddWallet = () => {
    setSelectedWalletToEdit(null);
    setWalletModalOpen(true);
  };

  const handleOpenEditWallet = (wallet) => {
    setSelectedWalletToEdit(wallet);
    setWalletModalOpen(true);
  };

  const handleConfirmDeleteWallet = () => {
    if (!walletToDelete) return;
    dispatch({ type: 'DELETE_WALLET', payload: walletToDelete.id });
    toast.info(`Dompet "${walletToDelete.label}" telah dihapus. Transaksi dialihkan ke dompet utama.`);
    setWalletToDelete(null);
  };

  const handleExportJSON = () => {
    const backupData = {
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      profile,
      wallets,
      transactions,
    };
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tanciku_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Backup data JSON berhasil diunduh!');
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
          toast.success('Data transaksi berhasil diimpor!');
        } else if (imported && Array.isArray(imported.transactions)) {
          dispatch({ type: 'SET_TRANSACTIONS', payload: imported.transactions });
          if (imported.wallets && Array.isArray(imported.wallets)) {
            dispatch({ type: 'SET_WALLETS', payload: imported.wallets });
          }
          if (imported.profile) {
            dispatch({ type: 'SET_PROFILE', payload: imported.profile });
            setUserName(imported.profile.name || 'Renno');
          }
          toast.success('Data transaksi, dompet, dan profil berhasil dipulihkan!');
        } else {
          toast.error('Format file JSON tidak valid!');
        }
      } catch {
        toast.error('Gagal membaca file JSON!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    dispatch({ type: 'RESET_TRANSACTIONS' });
    setShowResetConfirm(false);
    toast.info('Data transaksi dan dompet direset ke data bawaan!');
  };

  return (
    <>
      <Header title="Setelan" subtitle="Pengaturan profil, dompet, tema, dan manajemen data" />

      <div className="settings-page">
        {/* Profil Section */}
        <div className="card-soft settings-card">
          <div className="settings-card__header">
            <span className="material-symbols-outlined settings-icon">person</span>
            <div>
              <h3 className="settings-title">Profil Pengguna</h3>
              <p className="settings-desc">Atur identitas aplikasi Anda</p>
            </div>
          </div>
          <form onSubmit={handleSaveProfile} className="settings-card__body">
            <div className="settings-field">
              <label htmlFor="user-name">Nama Profil</label>
              <div className="settings-field-row">
                <input
                  id="user-name"
                  type="text"
                  className="settings-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  maxLength={30}
                />
                <Button type="submit" variant="primary" size="sm">
                  Simpan
                </Button>
              </div>
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
          </form>
        </div>

        {/* Wallets & Accounts Management Section */}
        <div className="card-soft settings-card">
          <div className="settings-card__header settings-card__header--between">
            <div className="settings-card__header-left">
              <span className="material-symbols-outlined settings-icon">account_balance_wallet</span>
              <div>
                <h3 className="settings-title">Kelola Dompet & Rekening</h3>
                <p className="settings-desc">Tambah, edit nama/warna/saldo awal, atau hapus dompet Anda</p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddWallet}
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Tambah Dompet</span>
            </Button>
          </div>

          <div className="settings-card__body">
            {/* Total Balance Combined Banner */}
            <div className="wallets-total-summary-banner">
              <div className="wallets-total-summary-banner__left">
                <span className="wallets-total-summary-banner__label">Total Saldo Seluruh Dompet (Gabungan)</span>
                <span className="wallets-total-summary-banner__val">{formatCurrency(totalBalance)}</span>
              </div>
              <span className="wallets-total-summary-banner__badge">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>account_balance_wallet</span>
                <span>{wallets.length} Dompet Aktif</span>
              </span>
            </div>

            <div className="wallets-settings-list">
              {wallets.map((w) => {
                const bal = walletBalances[w.id] || 0;
                const isInitialSet = Number(w.initialBalance || 0) > 0;

                return (
                  <div key={w.id} className="wallet-setting-item">
                    <div className="wallet-setting-item__left">
                      <div
                        className="wallet-setting-item__icon"
                        style={{ backgroundColor: `${w.color}20`, color: w.color }}
                      >
                        <span className="material-symbols-outlined">{w.icon}</span>
                      </div>
                      <div className="wallet-setting-item__info">
                        <div className="wallet-setting-item__name-row">
                          <span className="wallet-setting-item__name">{w.label}</span>
                          {w.isDefault && (
                            <span className="badge badge--default">Utama</span>
                          )}
                        </div>
                        <div className="wallet-setting-item__sub">
                          {isInitialSet ? `Saldo Awal: ${formatCurrency(w.initialBalance)}` : 'Saldo Awal: Rp 0'}
                        </div>
                      </div>
                    </div>

                    <div className="wallet-setting-item__right">
                      <div className="wallet-setting-item__bal">
                        <span className="wallet-setting-item__bal-label">Saldo Saat Ini</span>
                        <span className={`wallet-setting-item__bal-val ${bal < 0 ? 'text-expense' : ''}`}>
                          {formatCurrency(bal)}
                        </span>
                      </div>

                      <div className="wallet-setting-item__actions">
                        <button
                          type="button"
                          className="wallet-item-action-btn"
                          onClick={() => handleOpenEditWallet(w)}
                          title="Edit Dompet"
                          aria-label="Edit Dompet"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                        </button>
                        <button
                          type="button"
                          className="wallet-item-action-btn wallet-item-action-btn--danger"
                          onClick={() => setWalletToDelete(w)}
                          title="Hapus Dompet"
                          aria-label="Hapus Dompet"
                          disabled={wallets.length <= 1}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Appearance & Theme Section */}
        <div className="card-soft settings-card">
          <div className="settings-card__header">
            <span className="material-symbols-outlined settings-icon">palette</span>
            <div>
              <h3 className="settings-title">Tampilan & Tema</h3>
              <p className="settings-desc">Pilih mode tampilan yang nyaman untuk mata Anda</p>
            </div>
          </div>
          <div className="settings-card__body">
            <div className="theme-options-grid">
              <button
                type="button"
                className={`theme-option-btn ${theme === 'light' ? 'theme-option-btn--active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <div className="theme-option-preview theme-preview--light">
                  <div className="preview-bar" />
                  <div className="preview-card" />
                </div>
                <div className="theme-option-label">
                  <span className="material-symbols-outlined">light_mode</span>
                  <span>Mode Terang</span>
                </div>
              </button>

              <button
                type="button"
                className={`theme-option-btn ${theme === 'dark' ? 'theme-option-btn--active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <div className="theme-option-preview theme-preview--dark">
                  <div className="preview-bar" />
                  <div className="preview-card" />
                </div>
                <div className="theme-option-label">
                  <span className="material-symbols-outlined">dark_mode</span>
                  <span>Mode Gelap</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="card-soft settings-card">
          <div className="settings-card__header">
            <span className="material-symbols-outlined settings-icon">database</span>
            <div>
              <h3 className="settings-title">Manajemen Data</h3>
              <p className="settings-desc">Cadangkan atau impor data transaksi & dompet Anda</p>
            </div>
          </div>
          <div className="settings-card__body settings-card__body--grid">
            <div className="settings-action-box">
              <h4>Export Backup Data</h4>
              <p>Unduh semua data transaksi, dompet, dan profil dalam format file JSON.</p>
              <Button variant="secondary" onClick={handleExportJSON}>
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export JSON</span>
              </Button>
            </div>

            <div className="settings-action-box">
              <h4>Import Backup Data</h4>
              <p>Pulihkan data transaksi dan dompet dari file backup JSON sebelumnya.</p>
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
                type="button"
                className="reset-btn"
                onClick={() => setShowResetConfirm(true)}
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Reset ke Data Sampel</span>
              </button>
            ) : (
              <div className="reset-confirm-box animate-fade-in">
                <span>Yakin ingin mereset seluruh data ke data sampel awal?</span>
                <div className="reset-confirm-btns">
                  <button
                    type="button"
                    className="confirm-btn confirm-btn--cancel"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="confirm-btn confirm-btn--delete"
                    onClick={handleResetData}
                  >
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
              <p className="settings-desc">Tanciku — Catatan Keuangan Simpel, Modern & Efisien</p>
            </div>
          </div>
          <div className="settings-card__body">
            <div className="settings-info-row">
              <span>Versi Aplikasi</span>
              <span className="font-semibold">v1.2.0 (Custom Wallets Edition)</span>
            </div>
            <div className="settings-info-row">
              <span>Total Dompet Aktif</span>
              <span className="font-semibold">{wallets.length} Dompet / Akun</span>
            </div>
            <div className="settings-info-row">
              <span>Penyimpanan</span>
              <span className="font-semibold">Lokal Browser (localStorage Aman & Offline)</span>
            </div>
            <div className="settings-info-row">
              <span>Total Transaksi Tersimpan</span>
              <span className="font-semibold">{transactions.length} transaksi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Add / Edit Modal */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        wallet={selectedWalletToEdit}
      />

      {/* Delete Wallet Confirmation Dialog */}
      {walletToDelete && (
        <div className="modal-overlay animate-fade-in">
          <div className="delete-wallet-modal animate-scale-in">
            <div className="delete-wallet-modal__icon">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <h3 className="delete-wallet-modal__title">Hapus Dompet "{walletToDelete.label}"?</h3>
            <p className="delete-wallet-modal__desc">
              Dompet ini akan dihapus. Semua transaksi yang menggunakan dompet ini akan dialihkan secara otomatis ke dompet utama agar riwayat keuangan Anda tetap utuh.
            </p>
            <div className="delete-wallet-modal__actions">
              <button
                type="button"
                className="confirm-btn confirm-btn--cancel"
                onClick={() => setWalletToDelete(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="confirm-btn confirm-btn--delete"
                onClick={handleConfirmDeleteWallet}
              >
                Ya, Hapus Dompet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;

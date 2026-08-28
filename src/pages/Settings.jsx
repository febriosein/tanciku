import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import WalletModal from '../components/wallets/WalletModal';
import InstallGuideModal from '../components/pwa/InstallGuideModal';
import { formatCurrency } from '../utils/formatCurrency';
import { exportPDF } from '../utils/exportPDF';
import './Settings.css';

const Settings = () => {
  const { transactions, wallets, walletBalances, totalBalance, summary, profile, dispatch } = useTransactions();
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [userName, setUserName] = useState(profile?.name || 'Renno');
  const [isEditingName, setIsEditingName] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Wallet Modal state
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [selectedWalletToEdit, setSelectedWalletToEdit] = useState(null);
  const [walletToDelete, setWalletToDelete] = useState(null);

  // PWA Install Modal state
  const [installModalOpen, setInstallModalOpen] = useState(false);

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    if (!userName.trim()) {
      toast.error('Nama profil tidak boleh kosong');
      return;
    }
    dispatch({ type: 'SET_PROFILE', payload: { name: userName.trim() } });
    setIsEditingName(false);
    toast.success('Nama profil berhasil disimpan!');
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
      version: '1.3.0',
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

  const handleExportPDF = () => {
    try {
      exportPDF(transactions, summary, 'Laporan Lengkap Seluruh Waktu', profile, wallets);
      toast.success('Laporan PDF berhasil diunduh!');
    } catch {
      toast.error('Gagal membuat dokumen PDF!');
    }
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
    toast.info('Data transaksi dan dompet direset ke data sampel bawaan!');
  };

  const userInitial = (userName || 'R').charAt(0).toUpperCase();

  return (
    <>
      <Header title="Pengaturan" subtitle="Kelola preferensi akun, dompet, tampilan, dan cadangan data" />

      <div className="settings-container">
        {/* Top Grid: Profile & Preferences */}
        <div className="settings-grid-two">
          {/* Profile Card */}
          <div className="settings-panel">
            <div className="settings-panel__header">
              <div className="settings-panel__title-group">
                <div className="settings-panel__icon">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <h3 className="settings-panel__title">Profil Pengguna</h3>
                  <p className="settings-panel__subtitle">Nama panggilan & identitas akun</p>
                </div>
              </div>
            </div>

            <div className="settings-panel__body">
              <div className="profile-hero-card">
                <div className="profile-hero-avatar">{userInitial}</div>
                <div className="profile-hero-details">
                  {!isEditingName ? (
                    <div className="profile-name-display">
                      <div className="profile-name-row">
                        <span className="profile-name-text">{userName}</span>
                        <button
                          type="button"
                          className="profile-edit-btn"
                          onClick={() => setIsEditingName(true)}
                          title="Ubah Nama"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </div>
                      <span className="profile-currency-badge">
                        <span className="material-symbols-outlined">payments</span>
                        Rupiah Indonesia (IDR - Rp)
                      </span>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveProfile} className="profile-name-form">
                      <input
                        type="text"
                        className="profile-name-input"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Nama Anda"
                        maxLength={30}
                        autoFocus
                      />
                      <div className="profile-form-actions">
                        <button
                          type="button"
                          className="profile-btn-cancel"
                          onClick={() => {
                            setUserName(profile?.name || 'Renno');
                            setIsEditingName(false);
                          }}
                        >
                          Batal
                        </button>
                        <button type="submit" className="profile-btn-save">
                          Simpan
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Theme & Appearance Card */}
          <div className="settings-panel">
            <div className="settings-panel__header">
              <div className="settings-panel__title-group">
                <div className="settings-panel__icon">
                  <span className="material-symbols-outlined">palette</span>
                </div>
                <div>
                  <h3 className="settings-panel__title">Tema Tampilan</h3>
                  <p className="settings-panel__subtitle">Pilih mode warna visual aplikasi</p>
                </div>
              </div>
            </div>

            <div className="settings-panel__body">
              <div className="theme-switcher-grid">
                <button
                  type="button"
                  className={`theme-card-btn ${theme === 'light' ? 'theme-card-btn--active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <div className="theme-card-preview theme-preview--light">
                    <div className="theme-preview-dot" />
                    <div className="theme-preview-line" />
                  </div>
                  <div className="theme-card-label">
                    <span className="material-symbols-outlined">light_mode</span>
                    <span>Mode Terang</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`theme-card-btn ${theme === 'dark' ? 'theme-card-btn--active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <div className="theme-card-preview theme-preview--dark">
                    <div className="theme-preview-dot" />
                    <div className="theme-preview-line" />
                  </div>
                  <div className="theme-card-label">
                    <span className="material-symbols-outlined">dark_mode</span>
                    <span>Mode Gelap</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PWA Mobile App Card */}
        <div className="settings-panel pwa-hero-panel">
          <div className="pwa-hero-content">
            <img src="/apple-touch-icon.png" alt="Tanciku Logo" className="pwa-hero-logo" />
            <div className="pwa-hero-text">
              <div className="pwa-badge">
                <span className="material-symbols-outlined">install_mobile</span>
                <span>Web App Layar Utama</span>
              </div>
              <h3 className="pwa-hero-title">Pasang Tanciku di Layar Utama HP</h3>
              <p className="pwa-hero-desc">
                Buka instan tanpa address bar, offline-ready, dan hemat memori di Android & iPhone.
              </p>
            </div>
            <button
              type="button"
              className="pwa-hero-action-btn"
              onClick={() => setInstallModalOpen(true)}
            >
              <span className="material-symbols-outlined">add_to_home_screen</span>
              <span>Panduan Pasang</span>
            </button>
          </div>
        </div>

        {/* Full-Width Wallets Hub */}
        <div className="settings-panel">
          <div className="settings-panel__header settings-panel__header--spread">
            <div className="settings-panel__title-group">
              <div className="settings-panel__icon">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <div>
                <h3 className="settings-panel__title">Kelola Dompet & Rekening</h3>
                <p className="settings-panel__subtitle">Daftar akun, saldo awal, dan saldo berjalan</p>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAddWallet}
              className="wallet-add-header-btn"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Tambah Dompet</span>
            </Button>
          </div>

          <div className="settings-panel__body">
            {/* Total Balance Combined Banner */}
            <div className="wallets-total-banner">
              <div className="wallets-total-banner__details">
                <span className="wallets-total-banner__caption">Total Saldo Gabungan (Semua Dompet)</span>
                <span className="wallets-total-banner__amount">{formatCurrency(totalBalance)}</span>
              </div>
              <div className="wallets-total-banner__pill">
                <span className="material-symbols-outlined">wallet</span>
                <span>{wallets.length} Dompet Aktif</span>
              </div>
            </div>

            {/* Wallets List */}
            <div className="wallets-stack">
              {wallets.map((w) => {
                const bal = walletBalances[w.id] || 0;
                const isInitialSet = Number(w.initialBalance || 0) > 0;

                return (
                  <div key={w.id} className="wallet-row-item">
                    <div className="wallet-row-item__main">
                      <div
                        className="wallet-row-item__icon-wrapper"
                        style={{ backgroundColor: `${w.color}18`, color: w.color }}
                      >
                        <span className="material-symbols-outlined">{w.icon}</span>
                      </div>

                      <div className="wallet-row-item__meta">
                        <div className="wallet-row-item__title-line">
                          <span className="wallet-row-item__name">{w.label}</span>
                          {w.isDefault && <span className="wallet-chip-default">Utama</span>}
                        </div>
                        <span className="wallet-row-item__subtext">
                          {isInitialSet ? `Saldo Awal: ${formatCurrency(w.initialBalance)}` : 'Saldo Awal: Rp 0'}
                        </span>
                      </div>
                    </div>

                    <div className="wallet-row-item__side">
                      <div className="wallet-row-item__balance-group">
                        <span className="wallet-balance-sublabel">Saldo Saat Ini</span>
                        <span className={`wallet-balance-value ${bal < 0 ? 'text-expense' : ''}`}>
                          {formatCurrency(bal)}
                        </span>
                      </div>

                      <div className="wallet-row-item__actions">
                        <button
                          type="button"
                          className="wallet-action-icon-btn"
                          onClick={() => handleOpenEditWallet(w)}
                          title={`Edit dompet ${w.label}`}
                          aria-label="Edit Dompet"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          type="button"
                          className="wallet-action-icon-btn wallet-action-icon-btn--delete"
                          onClick={() => setWalletToDelete(w)}
                          title={`Hapus dompet ${w.label}`}
                          aria-label="Hapus Dompet"
                          disabled={wallets.length <= 1}
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Grid: Data Management & App Info */}
        <div className="settings-grid-two">
          {/* Data Management Card */}
          <div className="settings-panel">
            <div className="settings-panel__header">
              <div className="settings-panel__title-group">
                <div className="settings-panel__icon">
                  <span className="material-symbols-outlined">database</span>
                </div>
                <div>
                  <h3 className="settings-panel__title">Manajemen & Cadangan Data</h3>
                  <p className="settings-panel__subtitle">Ekspor, impor, atau pulihkan data JSON</p>
                </div>
              </div>
            </div>

            <div className="settings-panel__body">
              <div className="data-actions-grid">
                <div className="data-action-card">
                  <div className="data-action-card__icon-box">
                    <span className="material-symbols-outlined">download</span>
                  </div>
                  <div className="data-action-card__info">
                    <h4>Ekspor Cadangan</h4>
                    <p>Unduh seluruh data transaksi & dompet ke file JSON.</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleExportJSON} className="data-action-card__btn">
                    Ekspor JSON
                  </Button>
                </div>

                <div className="data-action-card">
                  <div className="data-action-card__icon-box">
                    <span className="material-symbols-outlined">upload</span>
                  </div>
                  <div className="data-action-card__info">
                    <h4>Impor Cadangan</h4>
                    <p>Pulihkan data dari file backup JSON sebelumnya.</p>
                  </div>
                  <label className="data-action-card__upload-btn">
                    <span>Pilih File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                <div className="data-action-card">
                  <div className="data-action-card__icon-box" style={{ color: 'var(--color-expense)' }}>
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                  </div>
                  <div className="data-action-card__info">
                    <h4>Laporan PDF</h4>
                    <p>Cetak laporan keuangan resmi & siap cetak.</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleExportPDF} className="data-action-card__btn">
                    Cetak PDF
                  </Button>
                </div>
              </div>

              <div className="danger-zone-divider" />

              <div className="danger-zone-wrapper">
                {!showResetConfirm ? (
                  <button
                    type="button"
                    className="danger-reset-trigger-btn"
                    onClick={() => setShowResetConfirm(true)}
                  >
                    <span className="material-symbols-outlined">restart_alt</span>
                    <span>Reset ke Data Sampel Awal</span>
                  </button>
                ) : (
                  <div className="danger-confirm-card animate-fade-in">
                    <div className="danger-confirm-card__text">
                      <span className="material-symbols-outlined text-expense">warning</span>
                      <span>Kembalikan seluruh data transaksi ke sampel awal?</span>
                    </div>
                    <div className="danger-confirm-card__btns">
                      <button
                        type="button"
                        className="danger-btn-cancel"
                        onClick={() => setShowResetConfirm(false)}
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        className="danger-btn-proceed"
                        onClick={handleResetData}
                      >
                        Ya, Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* App Info Card */}
          <div className="settings-panel">
            <div className="settings-panel__header">
              <div className="settings-panel__title-group">
                <div className="settings-panel__icon">
                  <span className="material-symbols-outlined">info</span>
                </div>
                <div>
                  <h3 className="settings-panel__title">Tentang Tanciku</h3>
                  <p className="settings-panel__subtitle">Informasi sistem dan penyimpanan</p>
                </div>
              </div>
            </div>

            <div className="settings-panel__body">
              <div className="app-info-list">
                <div className="app-info-item">
                  <span className="app-info-item__label">Versi Aplikasi</span>
                  <span className="app-info-item__value font-bold">v1.3.0 (PWA Mobile)</span>
                </div>
                <div className="app-info-item">
                  <span className="app-info-item__label">Tipe Aplikasi</span>
                  <span className="app-info-item__value">Progressive Web App (PWA)</span>
                </div>
                <div className="app-info-item">
                  <span className="app-info-item__label">Total Dompet</span>
                  <span className="app-info-item__value">{wallets.length} Dompet Aktif</span>
                </div>
                <div className="app-info-item">
                  <span className="app-info-item__label">Total Catatan</span>
                  <span className="app-info-item__value">{transactions.length} Transaksi</span>
                </div>
                <div className="app-info-item">
                  <span className="app-info-item__label">Penyimpanan</span>
                  <span className="app-info-item__value">Lokal Browser (100% Offline)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        wallet={selectedWalletToEdit}
      />

      {/* PWA Install Modal */}
      <InstallGuideModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />

      {/* Delete Wallet Confirmation Dialog */}
      {walletToDelete && (
        <div className="modal-overlay modal-overlay--center animate-fade-in">
          <div className="delete-wallet-dialog animate-scale-in">
            <div className="delete-wallet-dialog__icon">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <h3 className="delete-wallet-dialog__title">Hapus Dompet "{walletToDelete.label}"?</h3>
            <p className="delete-wallet-dialog__desc">
              Dompet ini akan dihapus. Semua transaksi yang menggunakan dompet ini akan dialihkan secara otomatis ke dompet utama agar riwayat keuangan Anda tetap utuh.
            </p>
            <div className="delete-wallet-dialog__actions">
              <button
                type="button"
                className="delete-dialog-btn delete-dialog-btn--cancel"
                onClick={() => setWalletToDelete(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="delete-dialog-btn delete-dialog-btn--danger"
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

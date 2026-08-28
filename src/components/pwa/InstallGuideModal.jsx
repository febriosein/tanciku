import React, { useState } from 'react';
import Modal from '../ui/Modal';
import './InstallGuideModal.css';

const InstallGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('android');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pasang Tanciku di Layar Utama (PWA)"
    >
      <div className="install-guide">
        {/* App Preview Card */}
        <div className="install-preview-hero">
          <img
            src="/apple-touch-icon.png"
            alt="Tanciku App Logo"
            className="install-preview-logo"
          />
          <div className="install-preview-info">
            <h4 className="install-preview-title">Tanciku — Catatan Keuangan</h4>
            <p className="install-preview-desc">
              Akses cepat tanpa address bar, offline-ready & ringan seperti aplikasi Play Store / App Store.
            </p>
          </div>
        </div>

        {/* Platform Toggle Tabs */}
        <div className="install-tabs">
          <button
            type="button"
            className={`install-tab-btn ${activeTab === 'android' ? 'install-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('android')}
          >
            <span className="material-symbols-outlined">android</span>
            <span>Android (Chrome)</span>
          </button>
          <button
            type="button"
            className={`install-tab-btn ${activeTab === 'ios' ? 'install-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('ios')}
          >
            <span className="material-symbols-outlined">phone_iphone</span>
            <span>iPhone / iPad (Safari)</span>
          </button>
        </div>

        {/* Instructions Body */}
        <div className="install-steps-wrapper">
          {activeTab === 'android' ? (
            <div className="install-steps">
              <div className="install-step-item">
                <div className="install-step-num">1</div>
                <div className="install-step-content">
                  <p className="install-step-title">Buka Menu Browser</p>
                  <p className="install-step-text">
                    Di Google Chrome atau Samsung Internet, ketuk ikon titik tiga (<strong>⋮</strong>) di pojok kanan atas layar.
                  </p>
                </div>
              </div>

              <div className="install-step-item">
                <div className="install-step-num">2</div>
                <div className="install-step-content">
                  <p className="install-step-title">Pilih "Tambahkan ke Layar Utama"</p>
                  <p className="install-step-text">
                    Cari dan pilih opsi <strong>"Tambahkan ke Layar Utama"</strong> (<em>Add to Home Screen</em>) atau <strong>"Instal Aplikasi"</strong>.
                  </p>
                </div>
              </div>

              <div className="install-step-item">
                <div className="install-step-num">3</div>
                <div className="install-step-content">
                  <p className="install-step-title">Konfirmasi & Selesai</p>
                  <p className="install-step-text">
                    Ketuk <strong>"Instal / Tambah"</strong>. Logo resmi Tanciku akan langsung muncul di beranda HP Anda!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="install-steps">
              <div className="install-step-item">
                <div className="install-step-num">1</div>
                <div className="install-step-content">
                  <p className="install-step-title">Buka di Browser Safari</p>
                  <p className="install-step-text">
                    Pastikan web Tanciku dibuka menggunakan browser bawaan <strong>Safari</strong> di iPhone Anda.
                  </p>
                </div>
              </div>

              <div className="install-step-item">
                <div className="install-step-num">2</div>
                <div className="install-step-content">
                  <p className="install-step-title">Tekan Tombol Bagikan (Share)</p>
                  <p className="install-step-text">
                    Ketuk ikon <strong>Bagikan</strong> (ikon kotak dengan panah ke atas <span className="share-icon-symbol">⎋</span>) di bilah navigasi bawah.
                  </p>
                </div>
              </div>

              <div className="install-step-item">
                <div className="install-step-num">3</div>
                <div className="install-step-content">
                  <p className="install-step-title">Pilih "Tambah ke Layar Utama"</p>
                  <p className="install-step-text">
                    Gulir menu ke bawah lalu ketuk <strong>"Tambah ke Layar Utama"</strong> (<em>Add to Home Screen</em> ➕).
                  </p>
                </div>
              </div>

              <div className="install-step-item">
                <div className="install-step-num">4</div>
                <div className="install-step-content">
                  <p className="install-step-title">Klik "Tambah" di Pojok Kanan Atas</p>
                  <p className="install-step-text">
                    Ikon logo Tanciku akan terpasang di Home Screen iPhone Anda dan siap dibuka dalam mode fullscreen tanpa address bar.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="install-guide-footer">
          <button type="button" className="install-guide-close-btn" onClick={onClose}>
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InstallGuideModal;

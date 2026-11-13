import React, { useEffect, useRef } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useToast } from '../../context/ToastContext';
import { getCategoryById } from '../../utils/categories';
import { getWalletById } from '../../utils/wallets';
import { parseISODate } from '../../utils/formatDate';
import './TransactionDetailModal.css';

const TransactionDetailModal = ({
  isOpen,
  onClose,
  transaction,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const { wallets } = useTransactions();
  const toast = useToast();
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const category = getCategoryById(transaction.category);
  const wallet = getWalletById(transaction.wallet || 'cash', wallets);
  const isIncome = transaction.type === 'income';

  // Format full date (e.g., "Kamis, 24 September 2026")
  const parsedDate = parseISODate(transaction.date);
  const formattedFullDate = parsedDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Reference number format: #TRX-YYYYMMDD-XXXX
  const dateNum = String(transaction.date || '').replace(/-/g, '');
  const idSuffix = String(transaction.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || '8A2F';
  const referenceNumber = `#TRX-${dateNum}-${idSuffix}`;

  const formattedAmount = `${isIncome ? '+' : '-'}Rp ${transaction.amount.toLocaleString('id-ID')}`;

  const handleCopyRef = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referenceNumber);
      toast.success('Nomor referensi berhasil disalin!');
    }
  };

  const handleShareReceipt = async () => {
    const receiptText = `*BUKTI TRANSAKSI - TANCIKU*
================================
Status        : Berhasil
Nominal       : ${formattedAmount}
Jenis         : ${isIncome ? 'Pemasukan' : 'Pengeluaran'}
Kategori      : ${category.label}
Sumber Dana   : ${wallet.label}
Tanggal       : ${formattedFullDate}
Catatan       : ${transaction.note || '-'}
No. Referensi : ${referenceNumber}
================================
Dicatat dengan Tanciku Financial Suite`;

    if (navigator.share && window.innerWidth <= 768) {
      try {
        await navigator.share({
          title: 'Bukti Transaksi Tanciku',
          text: receiptText,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        if (err.name === 'AbortError') return;
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(receiptText);
      toast.success('Rincian struk transaksi disalin ke clipboard!');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      className="receipt-modal-overlay animate-fade-in"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="receipt-modal-card animate-scale-in">
        {/* Modal Top Bar */}
        <div className="receipt-modal-topbar">
          <span className="receipt-modal-title">Bukti Transaksi</span>
          <button
            type="button"
            className="receipt-modal-close-btn"
            onClick={onClose}
            aria-label="Tutup Detail Transaksi"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Receipt Container */}
        <div className="receipt-paper">
          {/* Status Header */}
          <div className="receipt-status-section">
            <div className={`receipt-status-badge ${isIncome ? 'receipt-status-badge--income' : 'receipt-status-badge--expense'}`}>
              <span className="material-symbols-outlined">check_circle</span>
              <span>Transaksi Berhasil</span>
            </div>

            <div className={`receipt-amount ${isIncome ? 'receipt-amount--income' : 'receipt-amount--expense'}`}>
              {formattedAmount}
            </div>

            <div className="receipt-category-pill">
              <span className="receipt-category-icon">{category.icon}</span>
              <span className="receipt-category-name">{category.label}</span>
            </div>
          </div>

          {/* Notched Dashed Divider */}
          <div className="receipt-divider-notch-wrapper">
            <div className="receipt-notch receipt-notch--left" />
            <div className="receipt-dashed-line" />
            <div className="receipt-notch receipt-notch--right" />
          </div>

          {/* Details Table */}
          <div className="receipt-details-list">
            <div className="receipt-detail-row">
              <span className="receipt-label">Tanggal Transaksi</span>
              <span className="receipt-value">{formattedFullDate}</span>
            </div>

            <div className="receipt-detail-row">
              <span className="receipt-label">Jenis Transaksi</span>
              <span className={`receipt-type-pill ${isIncome ? 'receipt-type-pill--income' : 'receipt-type-pill--expense'}`}>
                {isIncome ? 'Pemasukan' : 'Pengeluaran'}
              </span>
            </div>

            <div className="receipt-detail-row">
              <span className="receipt-label">Sumber Dompet</span>
              <div className="receipt-wallet-pill">
                <span className="material-symbols-outlined" style={{ color: wallet.color }}>
                  {wallet.icon}
                </span>
                <span>{wallet.label}</span>
              </div>
            </div>

            <div className="receipt-detail-row">
              <span className="receipt-label">Kategori</span>
              <span className="receipt-value">{category.label}</span>
            </div>

            <div className="receipt-detail-row">
              <span className="receipt-label">Catatan / Memo</span>
              <span className="receipt-value receipt-value--note">
                {transaction.note ? transaction.note : <span className="receipt-value--empty">Tidak ada catatan</span>}
              </span>
            </div>

            <div className="receipt-detail-row receipt-detail-row--ref">
              <span className="receipt-label">No. Referensi</span>
              <div className="receipt-ref-container">
                <span className="receipt-ref-text">{referenceNumber}</span>
                <button
                  type="button"
                  className="receipt-copy-btn"
                  onClick={handleCopyRef}
                  title="Salin Nomor Referensi"
                  aria-label="Salin Nomor Referensi"
                >
                  <span className="material-symbols-outlined">content_copy</span>
                  <span>Salin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Notched Divider */}
          <div className="receipt-divider-notch-wrapper">
            <div className="receipt-notch receipt-notch--left" />
            <div className="receipt-dashed-line" />
            <div className="receipt-notch receipt-notch--right" />
          </div>

          {/* Action Buttons */}
          <div className="receipt-actions">
            <button
              type="button"
              className="receipt-action-btn receipt-action-btn--primary"
              onClick={handleShareReceipt}
            >
              <span className="material-symbols-outlined">share</span>
              <span>Bagikan / Salin Struk</span>
            </button>

            <div className="receipt-actions-subgrid">
              <button
                type="button"
                className="receipt-sub-btn"
                onClick={() => {
                  onClose();
                  if (onDuplicate) onDuplicate(transaction);
                }}
              >
                <span className="material-symbols-outlined">content_copy</span>
                <span>Duplikat</span>
              </button>

              <button
                type="button"
                className="receipt-sub-btn"
                onClick={() => {
                  onClose();
                  if (onEdit) onEdit(transaction);
                }}
              >
                <span className="material-symbols-outlined">edit</span>
                <span>Edit</span>
              </button>

              <button
                type="button"
                className="receipt-sub-btn receipt-sub-btn--danger"
                onClick={() => {
                  onClose();
                  if (onDelete) onDelete(transaction);
                }}
              >
                <span className="material-symbols-outlined">delete</span>
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;

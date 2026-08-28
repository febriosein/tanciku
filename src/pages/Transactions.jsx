import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import Header from '../components/layout/Header';
import FilterBar from '../components/transactions/FilterBar';
import TransactionList from '../components/transactions/TransactionList';
import TransactionModal from '../components/transactions/TransactionModal';
import { useTransactions } from '../context/TransactionContext';
import { useToast } from '../context/ToastContext';
import { getCategoryById } from '../utils/categories';
import { exportCSV } from '../utils/exportCSV';
import { exportPDF } from '../utils/exportPDF';
import { formatCurrency, formatCompact } from '../utils/formatCurrency';
import { formatMonthLabel, formatDateShort } from '../utils/formatDate';
import './Transactions.css';

const Transactions = () => {
  const { filteredTransactions, summary, filter, wallets, profile, dispatch } = useTransactions();
  const toast = useToast();

  // Selection & Bulk Actions State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showBulkWalletModal, setShowBulkWalletModal] = useState(false);
  const [targetWalletId, setTargetWalletId] = useState('');

  // Quick Duplicate Modal State
  const [duplicateTarget, setDuplicateTarget] = useState(null);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);

  // Dynamic filter description
  let filterDesc = '';
  if (filter.mode === '7days') {
    filterDesc = '7 Hari Terakhir';
  } else if (filter.mode === '30days') {
    filterDesc = '30 Hari Terakhir';
  } else if (filter.mode === 'year') {
    filterDesc = `Tahun ${filter.year}`;
  } else if (filter.mode === 'custom') {
    filterDesc = `${formatDateShort(filter.startDate)} - ${formatDateShort(filter.endDate)}`;
  } else if (filter.mode === 'all') {
    filterDesc = 'Semua Waktu';
  } else {
    filterDesc = formatMonthLabel(filter.year, filter.month);
  }

  // Mini Insights Calculations
  const expenses = filteredTransactions.filter((t) => t.type === 'expense');
  const largestExpense = expenses.length > 0
    ? [...expenses].sort((a, b) => b.amount - a.amount)[0]
    : null;
  const largestExpenseCategory = largestExpense ? getCategoryById(largestExpense.category) : null;

  const uniqueDaysCount = new Set(filteredTransactions.map((t) => t.date)).size || 1;
  const dailyAverageExpense = expenses.reduce((sum, t) => sum + t.amount, 0) / uniqueDaysCount;

  const categoryFrequency = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});
  const topCategoryEntry = Object.entries(categoryFrequency).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topCategoryEntry ? getCategoryById(topCategoryEntry[0]) : null;

  // Selection Handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTransactions.map((t) => t.id));
    }
  };

  const handleExitSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  // Bulk Actions
  const handleConfirmBulkDelete = () => {
    const count = selectedIds.length;
    dispatch({ type: 'DELETE_MULTIPLE_TRANSACTIONS', payload: selectedIds });
    toast.info(`${count} transaksi terpilih telah dihapus.`);
    setSelectedIds([]);
    setIsSelectionMode(false);
    setShowBulkDeleteConfirm(false);
  };

  const handleConfirmBulkWalletChange = () => {
    if (!targetWalletId) {
      toast.error('Pilih dompet tujuan terlebih dahulu');
      return;
    }
    const count = selectedIds.length;
    const targetWallet = wallets.find((w) => w.id === targetWalletId);
    dispatch({
      type: 'CHANGE_MULTIPLE_WALLET',
      payload: { ids: selectedIds, wallet: targetWalletId },
    });
    toast.success(`${count} transaksi dipindahkan ke dompet "${targetWallet?.label || targetWalletId}".`);
    setSelectedIds([]);
    setIsSelectionMode(false);
    setShowBulkWalletModal(false);
  };

  // Quick Duplicate Handler
  const handleDuplicate = (transaction) => {
    setDuplicateTarget(transaction);
    setIsDuplicateOpen(true);
  };

  const handleExportCSV = () => {
    exportCSV(filteredTransactions, wallets);
    toast.success('Data CSV berhasil diunduh!');
  };

  const handleExportPDF = () => {
    try {
      exportPDF(filteredTransactions, summary, filterDesc, profile, wallets);
      toast.success('Laporan PDF berhasil diunduh!');
    } catch {
      toast.error('Gagal membuat dokumen PDF!');
    }
  };

  const handleSortChange = (e) => {
    dispatch({ type: 'SET_FILTER', payload: { sortBy: e.target.value } });
  };

  return (
    <>
      <Header
        title="Daftar Transaksi"
        subtitle={`${filterDesc} · ${filteredTransactions.length} catatan transaksi ditemukan`}
      />

      <div className="transactions-container">
        {/* Filter Bar Component */}
        <FilterBar showTypeFilter={true} showWalletFilter={true} />

        {/* 3-Metric Summary Bento Cards */}
        <div className="transactions-metrics-grid">
          <div className="trans-metric-card">
            <div className="trans-metric-card__header">
              <span className="trans-metric-card__dot dot--income" />
              <span className="trans-metric-card__label">Total Pemasukan</span>
            </div>
            <span className="trans-metric-card__value text-income">
              {formatCurrency(summary.income)}
            </span>
          </div>

          <div className="trans-metric-card">
            <div className="trans-metric-card__header">
              <span className="trans-metric-card__dot dot--expense" />
              <span className="trans-metric-card__label">Total Pengeluaran</span>
            </div>
            <span className="trans-metric-card__value text-expense">
              {formatCurrency(summary.expense)}
            </span>
          </div>

          <div className="trans-metric-card">
            <div className="trans-metric-card__header">
              <span className={`trans-metric-card__dot ${summary.balance >= 0 ? 'dot--income' : 'dot--expense'}`} />
              <span className="trans-metric-card__label">Selisih Periode</span>
            </div>
            <span className={`trans-metric-card__value ${summary.balance >= 0 ? 'text-income' : 'text-expense'}`}>
              {formatCurrency(summary.balance)}
            </span>
          </div>
        </div>

        {/* Mini Financial Insights Bar */}
        {filteredTransactions.length > 0 && (
          <div className="trans-insights-bar">
            {largestExpense && (
              <div className="trans-insight-item">
                <span className="material-symbols-outlined trans-insight-icon text-expense">local_fire_department</span>
                <div className="trans-insight-text">
                  <span className="trans-insight-label">Pengeluaran Terbesar</span>
                  <span className="trans-insight-val">
                    {largestExpenseCategory?.label}: <strong>{formatCurrency(largestExpense.amount)}</strong>
                  </span>
                </div>
              </div>
            )}

            <div className="trans-insight-item">
              <span className="material-symbols-outlined trans-insight-icon text-primary">calendar_today</span>
              <div className="trans-insight-text">
                <span className="trans-insight-label">Rata-rata Harian</span>
                <span className="trans-insight-val">
                  <strong>{formatCompact(dailyAverageExpense)}</strong> / hari
                </span>
              </div>
            </div>

            {topCategory && (
              <div className="trans-insight-item">
                <span className="material-symbols-outlined trans-insight-icon" style={{ color: topCategory.color }}>
                  category
                </span>
                <div className="trans-insight-text">
                  <span className="trans-insight-label">Kategori Terbanyak</span>
                  <span className="trans-insight-val">
                    <strong>{topCategory.label}</strong> ({topCategoryEntry[1]}x)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Controls & Transaction List Card */}
        <div className="transactions-main-card">
          <div className="transactions-main-card__header">
            <div className="transactions-main-card__top-row">
              <div className="transactions-main-card__title-group">
                <h3 className="transactions-main-card__title">Riwayat Catatan</h3>
                <span className="transactions-main-card__badge">
                  {filteredTransactions.length} Transaksi
                </span>
              </div>

              {/* Toggle Selection Mode Button */}
              <button
                type="button"
                className={`trans-action-pill-btn ${isSelectionMode ? 'trans-action-pill-btn--active-select' : ''}`}
                onClick={() => {
                  if (isSelectionMode) {
                    handleExitSelection();
                  } else {
                    setIsSelectionMode(true);
                  }
                }}
                title={isSelectionMode ? 'Batal Mode Pilih' : 'Pilih Banyak Transaksi'}
              >
                <span className="material-symbols-outlined text-sm">
                  {isSelectionMode ? 'close' : 'checklist'}
                </span>
                <span>{isSelectionMode ? 'Selesai' : 'Pilih'}</span>
              </button>
            </div>

            <div className="transactions-main-card__controls-row">
              {/* Sorting Dropdown */}
              <div className="trans-sort-pill">
                <span className="material-symbols-outlined trans-sort-icon">sort</span>
                <select
                  className="trans-sort-select"
                  value={filter.sortBy || 'date-desc'}
                  onChange={handleSortChange}
                  aria-label="Urutkan Transaksi"
                  title="Urutkan Transaksi"
                >
                  <option value="date-desc">Terbaru</option>
                  <option value="date-asc">Terlama</option>
                  <option value="amount-desc">Nominal Terbesar</option>
                  <option value="amount-asc">Nominal Terkecil</option>
                </select>
              </div>

              {/* Export PDF Button */}
              <button
                type="button"
                className="trans-action-pill-btn trans-action-pill-btn--pdf"
                onClick={handleExportPDF}
                title="Cetak dan Unduh Laporan PDF"
                id="btn-export-pdf"
              >
                <FileText size={14} />
                <span>PDF</span>
              </button>

              {/* Export CSV Button */}
              <button
                type="button"
                className="trans-action-pill-btn trans-action-pill-btn--csv"
                onClick={handleExportCSV}
                title="Unduh Data CSV (Excel)"
                id="btn-export-csv"
              >
                <Download size={14} />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* Selection Subheader Bar */}
          {isSelectionMode && (
            <div className="selection-subheader animate-fade-in">
              <label className="selection-select-all-label">
                <input
                  type="checkbox"
                  className="transaction-checkbox"
                  checked={selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0}
                  onChange={handleSelectAll}
                />
                <span>Pilih Semua ({filteredTransactions.length})</span>
              </label>

              <span className="selection-counter-badge">
                {selectedIds.length} Transaksi Terpilih
              </span>
            </div>
          )}

          <div className="transactions-main-card__body">
            <TransactionList
              isSelectionMode={isSelectionMode}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onDuplicate={handleDuplicate}
            />
          </div>
        </div>

        {/* Floating Bulk Actions Bar */}
        {isSelectionMode && selectedIds.length > 0 && (
          <div className="floating-bulk-bar animate-slide-up">
            <div className="floating-bulk-bar__info">
              <span className="floating-bulk-bar__count">{selectedIds.length}</span>
              <span>transaksi dipilih</span>
            </div>

            <div className="floating-bulk-bar__actions">
              <button
                type="button"
                className="floating-bulk-btn floating-bulk-btn--wallet"
                onClick={() => {
                  setTargetWalletId(wallets[0]?.id || 'cash');
                  setShowBulkWalletModal(true);
                }}
              >
                <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                <span>Pindah Dompet</span>
              </button>

              <button
                type="button"
                className="floating-bulk-btn floating-bulk-btn--delete"
                onClick={() => setShowBulkDeleteConfirm(true)}
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                <span>Hapus ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Duplicate Modal */}
      <TransactionModal
        isOpen={isDuplicateOpen}
        onClose={() => {
          setIsDuplicateOpen(false);
          setDuplicateTarget(null);
        }}
        transaction={duplicateTarget}
        isDuplicate={true}
      />

      {/* Bulk Delete Confirmation Dialog */}
      {showBulkDeleteConfirm && (
        <div className="modal-overlay modal-overlay--center animate-fade-in">
          <div className="bulk-confirm-modal animate-scale-in">
            <div className="bulk-confirm-modal__icon">
              <span className="material-symbols-outlined">delete_sweep</span>
            </div>
            <h3 className="bulk-confirm-modal__title">
              Hapus {selectedIds.length} Transaksi Sekaligus?
            </h3>
            <p className="bulk-confirm-modal__desc">
              Semua transaksi yang dipilih akan dihapus secara permanen dan saldo dompet terkait akan dihitung ulang secara otomatis.
            </p>
            <div className="bulk-confirm-modal__actions">
              <button
                type="button"
                className="confirm-btn confirm-btn--cancel"
                onClick={() => setShowBulkDeleteConfirm(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="confirm-btn confirm-btn--delete"
                onClick={handleConfirmBulkDelete}
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Wallet Change Modal */}
      {showBulkWalletModal && (
        <div className="modal-overlay modal-overlay--center animate-fade-in">
          <div className="bulk-confirm-modal animate-scale-in">
            <div className="bulk-confirm-modal__icon bulk-confirm-modal__icon--wallet">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <h3 className="bulk-confirm-modal__title">
              Pindahkan {selectedIds.length} Transaksi
            </h3>
            <p className="bulk-confirm-modal__desc">
              Pilih dompet tujuan untuk memindahkan seluruh transaksi yang dipilih:
            </p>

            <div className="bulk-wallet-select-wrapper">
              <select
                className="bulk-wallet-select"
                value={targetWalletId}
                onChange={(e) => setTargetWalletId(e.target.value)}
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bulk-confirm-modal__actions">
              <button
                type="button"
                className="confirm-btn confirm-btn--cancel"
                onClick={() => setShowBulkWalletModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="confirm-btn confirm-btn--save"
                onClick={handleConfirmBulkWalletChange}
              >
                Pindahkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Transactions;

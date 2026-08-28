import React from 'react';
import { Download, FileText } from 'lucide-react';
import Header from '../components/layout/Header';
import FilterBar from '../components/transactions/FilterBar';
import TransactionList from '../components/transactions/TransactionList';
import { useTransactions } from '../context/TransactionContext';
import { useToast } from '../context/ToastContext';
import { exportCSV } from '../utils/exportCSV';
import { exportPDF } from '../utils/exportPDF';
import { formatCurrency } from '../utils/formatCurrency';
import { formatMonthLabel, formatDateShort } from '../utils/formatDate';
import './Transactions.css';

const Transactions = () => {
  const { filteredTransactions, summary, filter, wallets, profile, dispatch } = useTransactions();
  const toast = useToast();

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

        {/* Action Controls & Transaction List Card */}
        <div className="transactions-main-card">
          <div className="transactions-main-card__header">
            <div className="transactions-main-card__title-group">
              <h3 className="transactions-main-card__title">Riwayat Catatan</h3>
              <span className="transactions-main-card__badge">
                {filteredTransactions.length} Transaksi
              </span>
            </div>

            <div className="transactions-main-card__actions">
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
                <FileText size={15} />
                <span>Export PDF</span>
              </button>

              {/* Export CSV Button */}
              <button
                type="button"
                className="trans-action-pill-btn trans-action-pill-btn--csv"
                onClick={handleExportCSV}
                title="Unduh Data CSV (Excel)"
                id="btn-export-csv"
              >
                <Download size={15} />
                <span>CSV</span>
              </button>
            </div>
          </div>

          <div className="transactions-main-card__body">
            <TransactionList />
          </div>
        </div>
      </div>
    </>
  );
};

export default Transactions;

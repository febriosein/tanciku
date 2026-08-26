import React from 'react';
import { Download } from 'lucide-react';
import Header from '../components/layout/Header';
import FilterBar from '../components/transactions/FilterBar';
import TransactionList from '../components/transactions/TransactionList';
import Button from '../components/ui/Button';
import { useTransactions } from '../context/TransactionContext';
import { exportCSV } from '../utils/exportCSV';
import { formatCurrency } from '../utils/formatCurrency';
import { formatMonthLabel, formatDateShort } from '../utils/formatDate';
import './Transactions.css';

const Transactions = () => {
  const { filteredTransactions, summary, filter, wallets, dispatch } = useTransactions();

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

  const handleExport = () => {
    exportCSV(filteredTransactions, wallets);
  };

  const handleSortChange = (e) => {
    dispatch({ type: 'SET_FILTER', payload: { sortBy: e.target.value } });
  };

  return (
    <>
      <Header
        title="Transaksi"
        subtitle={`${filterDesc} · ${filteredTransactions.length} transaksi ditemukan`}
      />

      <div className="transactions-page">
        <FilterBar showTypeFilter={true} showWalletFilter={true} />

        {/* Summary & Sorting Row */}
        <div className="transactions-summary">
          <div className="transactions-summary__stats">
            <div className="transactions-summary__item">
              <span className="transactions-summary__label">Pemasukan</span>
              <span className="transactions-summary__value income">{formatCurrency(summary.income)}</span>
            </div>
            <div className="transactions-summary__divider" />
            <div className="transactions-summary__item">
              <span className="transactions-summary__label">Pengeluaran</span>
              <span className="transactions-summary__value expense">{formatCurrency(summary.expense)}</span>
            </div>
            <div className="transactions-summary__divider" />
            <div className="transactions-summary__item">
              <span className="transactions-summary__label">Selisih</span>
              <span className={`transactions-summary__value ${summary.balance >= 0 ? 'income' : 'expense'}`}>
                {formatCurrency(summary.balance)}
              </span>
            </div>
          </div>

          <div className="transactions-summary__actions">
            {/* Sorting Dropdown */}
            <div className="transactions-sort-wrapper">
              <span className="material-symbols-outlined sort-icon">sort</span>
              <select
                className="transactions-sort-select"
                value={filter.sortBy || 'date-desc'}
                onChange={handleSortChange}
                aria-label="Urutkan Transaksi"
              >
                <option value="date-desc">Terbaru</option>
                <option value="date-asc">Terlama</option>
                <option value="amount-desc">Nominal Terbesar</option>
                <option value="amount-asc">Nominal Terkecil</option>
              </select>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExport}
              id="btn-export-csv"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="glass-card transactions-card">
          <TransactionList />
        </div>
      </div>
    </>
  );
};

export default Transactions;

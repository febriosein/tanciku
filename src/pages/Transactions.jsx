import React from 'react';
import { Download } from 'lucide-react';
import Header from '../components/layout/Header';
import FilterBar from '../components/transactions/FilterBar';
import TransactionList from '../components/transactions/TransactionList';
import Button from '../components/ui/Button';
import { useTransactions } from '../context/TransactionContext';
import { exportCSV } from '../utils/exportCSV';
import { formatCurrency } from '../utils/formatCurrency';
import { formatMonthLabel } from '../utils/formatDate';
import './Transactions.css';

const Transactions = () => {
  const { filteredTransactions, summary, filter } = useTransactions();
  const monthLabel = formatMonthLabel(filter.year, filter.month);

  const handleExport = () => {
    exportCSV(filteredTransactions);
  };

  return (
    <>
      <Header
        title="Transaksi"
        subtitle={`${monthLabel} · ${filteredTransactions.length} transaksi`}
      />

      <div className="transactions-page">
        <FilterBar showTypeFilter={true} />

        {/* Summary Row */}
        <div className="transactions-summary">
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
          <div className="transactions-summary__export">
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

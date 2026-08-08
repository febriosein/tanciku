import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import TransactionItem from './TransactionItem';
import EmptyState from '../ui/EmptyState';
import './TransactionList.css';

const TransactionList = ({ limit }) => {
  const { filteredTransactions } = useTransactions();

  const sorted = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const displayed = limit ? sorted.slice(0, limit) : sorted;

  if (displayed.length === 0) {
    return (
      <EmptyState
        title="Tidak ada transaksi"
        description="Coba ubah filter atau tambahkan transaksi baru."
      />
    );
  }

  // Group by date
  const groups = displayed.reduce((acc, t) => {
    const date = t.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {});

  return (
    <div className="transaction-list">
      {Object.entries(groups).map(([date, items]) => (
        <div key={date} className="transaction-group">
          <p className="transaction-group__date">
            {new Date(date).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
          <div className="transaction-group__items">
            {items.map((t) => (
              <TransactionItem key={t.id} transaction={t} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;

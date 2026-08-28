import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { todayISO, daysAgoISO, parseISODate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import TransactionItem from './TransactionItem';
import EmptyState from '../ui/EmptyState';
import './TransactionList.css';

const TransactionList = ({
  limit,
  isSelectionMode = false,
  selectedIds = [],
  onToggleSelect,
  onDuplicate,
}) => {
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

  const today = todayISO();
  const yesterday = daysAgoISO(1);

  return (
    <div className="transaction-list">
      {Object.entries(groups).map(([date, items]) => {
        const d = parseISODate(date);
        let dayPrefix = '';
        if (date === today) {
          dayPrefix = 'Hari Ini · ';
        } else if (date === yesterday) {
          dayPrefix = 'Kemarin · ';
        }

        const dateFormatted = d.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        });

        // Day Totals
        const dayExpense = items
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        const dayIncome = items
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        return (
          <div key={date} className="transaction-group">
            <div className="transaction-group__header">
              <span className="transaction-group__date">
                <strong>{dayPrefix}</strong>{dateFormatted}
              </span>

              <div className="transaction-group__subtotals">
                {dayIncome > 0 && (
                  <span className="day-subtotal day-subtotal--income">
                    +{formatCurrency(dayIncome)}
                  </span>
                )}
                {dayExpense > 0 && (
                  <span className="day-subtotal day-subtotal--expense">
                    -{formatCurrency(dayExpense)}
                  </span>
                )}
              </div>
            </div>

            <div className="transaction-group__items">
              {items.map((t) => (
                <TransactionItem
                  key={t.id}
                  transaction={t}
                  isSelectionMode={isSelectionMode}
                  isSelected={selectedIds.includes(t.id)}
                  onToggleSelect={onToggleSelect}
                  onDuplicate={onDuplicate}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;

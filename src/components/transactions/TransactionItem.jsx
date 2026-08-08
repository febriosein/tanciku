import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { formatDate } from '../../utils/formatDate';
import { getCategoryById } from '../../utils/categories';
import TransactionModal from './TransactionModal';
import './TransactionItem.css';

const TransactionItem = ({ transaction }) => {
  const { dispatch } = useTransactions();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const category = getCategoryById(transaction.category);
  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: transaction.id });
    setShowConfirm(false);
  };

  const dateStr = formatDate(transaction.date);
  const subtitle = transaction.note
    ? `${transaction.note} • ${dateStr}`
    : dateStr;

  return (
    <>
      <div className="transaction-item">
        <div className="transaction-item__left">
          <div
            className="transaction-item__icon-box"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <span>{category.icon}</span>
          </div>
          <div className="transaction-item__info">
            <div className="transaction-item__title">{category.label}</div>
            <div className="transaction-item__sub">{subtitle}</div>
          </div>
        </div>

        <div className="transaction-item__right">
          <div className={`transaction-item__amount ${isIncome ? 'income' : 'expense'}`}>
            {isIncome ? '+Rp ' : '-Rp '}
            {transaction.amount.toLocaleString('id-ID')}
          </div>

          <div className="transaction-item__actions">
            <button
              className="action-btn"
              onClick={() => setIsEditing(true)}
              title="Edit"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button
              className="action-btn action-btn--danger"
              onClick={() => setShowConfirm(true)}
              title="Hapus"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        </div>

        {showConfirm && (
          <div className="delete-confirm">
            <span>Hapus transaksi ini?</span>
            <div className="delete-confirm__btns">
              <button className="confirm-btn confirm-btn--cancel" onClick={() => setShowConfirm(false)}>
                Batal
              </button>
              <button className="confirm-btn confirm-btn--delete" onClick={handleDelete}>
                Hapus
              </button>
            </div>
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        transaction={transaction}
      />
    </>
  );
};

export default TransactionItem;

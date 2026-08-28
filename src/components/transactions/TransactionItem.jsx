import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useToast } from '../../context/ToastContext';
import { getCategoryById } from '../../utils/categories';
import { getWalletById } from '../../utils/wallets';
import TransactionModal from './TransactionModal';
import './TransactionItem.css';

const TransactionItem = ({
  transaction,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelect,
  onDuplicate,
}) => {
  const { wallets, dispatch } = useTransactions();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const category = getCategoryById(transaction.category);
  const wallet = getWalletById(transaction.wallet || 'cash', wallets);
  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    const deletedCopy = { ...transaction };
    dispatch({ type: 'DELETE_TRANSACTION', payload: transaction.id });
    setShowConfirm(false);

    toast.show({
      message: 'Transaksi berhasil dihapus',
      type: 'info',
      duration: 5000,
      actionText: 'Urungkan',
      onAction: () => {
        dispatch({ type: 'RESTORE_TRANSACTION', payload: deletedCopy });
        toast.success('Transaksi berhasil dipulihkan!');
      },
    });
  };

  const handleItemClick = (e) => {
    if (isSelectionMode && onToggleSelect) {
      e.stopPropagation();
      onToggleSelect(transaction.id);
    }
  };

  return (
    <>
      <div
        className={`transaction-item ${isSelectionMode ? 'transaction-item--selectable' : ''} ${isSelected ? 'transaction-item--selected' : ''}`}
        onClick={handleItemClick}
      >
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="transaction-item__checkbox-wrapper" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              className="transaction-checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect && onToggleSelect(transaction.id)}
              aria-label={`Pilih transaksi ${category.label}`}
            />
          </div>
        )}

        {/* Category Icon */}
        <div
          className="transaction-item__icon-box"
          style={{ backgroundColor: `${category.color}18`, color: category.color }}
        >
          <span>{category.icon}</span>
        </div>

        {/* Center Main Info: Title + Subrow (Wallet & Note) */}
        <div className="transaction-item__info">
          <div className="transaction-item__title">{category.label}</div>
          <div className="transaction-item__subrow">
            <span className="transaction-item__wallet-badge" style={{ '--w-color': wallet.color }}>
              <span className="material-symbols-outlined">{wallet.icon}</span>
              <span>{wallet.label}</span>
            </span>
            {transaction.note && (
              <span className="transaction-item__note">{transaction.note}</span>
            )}
          </div>
        </div>

        {/* Right Info: Amount on Top, Action Buttons on Bottom */}
        <div className="transaction-item__right">
          <span className={`transaction-item__amount ${isIncome ? 'income' : 'expense'}`}>
            {isIncome ? '+Rp ' : '-Rp '}
            {transaction.amount.toLocaleString('id-ID')}
          </span>

          {!isSelectionMode && (
            <div className="transaction-item__actions">
              {/* Quick Duplicate */}
              <button
                type="button"
                className="action-btn action-btn--dup"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDuplicate) {
                    onDuplicate(transaction);
                  }
                }}
                title="Duplikat Transaksi"
                aria-label="Duplikat Transaksi"
              >
                <span className="material-symbols-outlined">content_copy</span>
              </button>

              {/* Edit */}
              <button
                type="button"
                className="action-btn action-btn--edit"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                title="Edit Transaksi"
                aria-label="Edit Transaksi"
              >
                <span className="material-symbols-outlined">edit</span>
              </button>

              {/* Delete */}
              <button
                type="button"
                className="action-btn action-btn--danger"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
                title="Hapus Transaksi"
                aria-label="Hapus Transaksi"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          )}
        </div>

        {showConfirm && (
          <div className="delete-confirm animate-fade-in" onClick={(e) => e.stopPropagation()}>
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

import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/formatCurrency';
import './TotalBalanceCard.css';

const TotalBalanceCard = () => {
  const { totalBalance, wallets } = useTransactions();
  const [hideBalance, setHideBalance] = useState(() => {
    try {
      return localStorage.getItem('tanciku_hide_balance') === 'true';
    } catch {
      return false;
    }
  });

  const toggleHideBalance = () => {
    setHideBalance((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('tanciku_hide_balance', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  return (
    <div className="total-balance-card">
      <div className="total-balance-card__bg-glow" aria-hidden="true" />

      <div className="total-balance-card__content">
        <div className="total-balance-card__header">
          <div className="total-balance-card__label-group">
            <div className="total-balance-card__icon-box">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <span className="total-balance-card__label">Total Saldo</span>
          </div>

          <button
            type="button"
            className="total-balance-card__eye-btn"
            onClick={toggleHideBalance}
            title={hideBalance ? 'Tampilkan Nominal Saldo' : 'Sembunyikan Nominal Saldo'}
            aria-label="Toggle Privacy"
          >
            <span className="material-symbols-outlined">
              {hideBalance ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>

        <div className="total-balance-card__amount-row">
          <div className="total-balance-card__amount">
            {hideBalance ? 'Rp ••••••••••' : formatCurrency(totalBalance)}
          </div>
        </div>

        <div className="total-balance-card__footer">
          <span className="total-balance-card__subinfo">
            Tergabung dari <strong>{wallets.length} dompet & rekening</strong> aktif
          </span>
        </div>
      </div>
    </div>
  );
};

export default TotalBalanceCard;

import React, { useEffect, useRef } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import './SummaryCard.css';

const SummaryCard = ({ type, amount }) => {
  const countRef = useRef(null);

  useEffect(() => {
    if (countRef.current) {
      countRef.current.textContent = formatCurrency(amount);
    }
  }, [amount]);

  if (type === 'balance') {
    return (
      <article className="stat-card stat-card--balance">
        <div className="stat-card__top">
          <div className="stat-card__header">
            <div className="stat-card__icon-box stat-card__icon-box--balance">
              <svg className="stat-card__svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="stat-card__label">Selisih Periode Ini</span>
          </div>
          <div className="stat-card__deco-circle stat-card__deco-circle--neutral" />
        </div>
        <div className="stat-card__bottom">
          <p className="stat-card__value stat-card__value--slate" ref={countRef}>
            {formatCurrency(amount)}
          </p>
        </div>
      </article>
    );
  }

  if (type === 'income') {
    return (
      <article className="stat-card stat-card--income">
        <div className="stat-card__top">
          <div className="stat-card__header">
            <div className="stat-card__icon-box stat-card__icon-box--income">
              <svg className="stat-card__svg" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="stat-card__label">Total Pemasukan</span>
          </div>
          <div className="stat-card__deco-circle stat-card__deco-circle--mint" />
        </div>
        <div className="stat-card__bottom">
          <p className="stat-card__value stat-card__value--emerald" ref={countRef}>
            {formatCurrency(amount)}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="stat-card stat-card--expense">
      <div className="stat-card__top">
        <div className="stat-card__header">
          <div className="stat-card__icon-box stat-card__icon-box--expense">
            <svg className="stat-card__svg" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="stat-card__label">Total Pengeluaran</span>
        </div>
        <div className="stat-card__deco-circle stat-card__deco-circle--rose" />
      </div>
      <div className="stat-card__bottom">
        <p className="stat-card__value stat-card__value--rose" ref={countRef}>
          {formatCurrency(amount)}
        </p>
      </div>
    </article>
  );
};

export default SummaryCard;

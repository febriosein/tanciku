import React, { useEffect, useRef } from 'react';
import { formatCompact } from '../../utils/formatCurrency';
import './SummaryCard.css';

const CARD_CONFIGS = {
  balance: {
    label: 'Saldo Bulan Ini',
    icon: 'account_balance_wallet',
    type: 'balance',
  },
  income: {
    label: 'Total Pemasukan',
    icon: 'trending_up',
    type: 'income',
  },
  expense: {
    label: 'Total Pengeluaran',
    icon: 'trending_down',
    type: 'expense',
  },
};

const useCountUp = (target, duration = 700) => {
  const ref = useRef(null);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const end = target;
    if (start === end && ref.current) {
      ref.current.textContent = formatCompact(end);
      return;
    }
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      if (ref.current) ref.current.textContent = formatCompact(current);
      if (progress < 1) requestAnimationFrame(tick);
      else prev.current = end;
    };

    requestAnimationFrame(tick);
  }, [target, duration]);

  return ref;
};

const SummaryCard = ({ type, amount }) => {
  const config = CARD_CONFIGS[type];
  const countRef = useCountUp(amount);

  return (
    <div className={`summary-card summary-card--${config.type}`}>
      <div className="summary-card__glow-circle" aria-hidden="true" />
      <div className="summary-card__header">
        <div className="summary-card__icon-box">
          <span className="material-symbols-outlined">{config.icon}</span>
        </div>
        <span className="summary-card__label">{config.label}</span>
      </div>
      <div className="summary-card__value" ref={countRef}>
        {formatCompact(amount)}
      </div>
    </div>
  );
};

export default SummaryCard;

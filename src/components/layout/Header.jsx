import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { getGreeting } from '../../utils/formatDate';
import TransactionModal from '../transactions/TransactionModal';
import './Header.css';

const Header = ({ title, subtitle, showGreeting = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profile } = useTransactions();

  const greeting = getGreeting();
  const userName = profile?.name ? profile.name : 'Pengguna';

  return (
    <>
      <div className="page-header">
        <div className="page-header__titles">
          {showGreeting ? (
            <div className="page-header__greeting-row">
              <h1 className="page-header__title">
                {greeting}, {userName}
              </h1>
              <span className="page-header__wave-emoji">👋</span>
            </div>
          ) : (
            <h1 className="page-header__title">{title}</h1>
          )}
          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>

        <div className="page-header__actions">
          <button
            type="button"
            className="page-header__add-btn"
            onClick={() => setIsModalOpen(true)}
            id="btn-add-transaction"
          >
            <svg className="page-header__add-svg" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Tambah</span>
          </button>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Header;

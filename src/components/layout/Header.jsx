import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../context/TransactionContext';
import { getGreeting } from '../../utils/formatDate';
import TransactionModal from '../transactions/TransactionModal';
import './Header.css';

const Header = ({ title, subtitle, showGreeting = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { profile } = useTransactions();

  const displayTitle = showGreeting
    ? `${getGreeting()}, ${profile?.name || 'Pengguna'} 👋`
    : title;

  return (
    <>
      <div className="page-header">
        <div className="page-header__titles">
          <h2 className="page-header__title">{displayTitle}</h2>
          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>

        <div className="page-header__actions">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            aria-label="Toggle Theme"
          >
            <span className="material-symbols-outlined">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Add Transaction Button */}
          <button
            className="page-header__add-btn"
            onClick={() => setIsModalOpen(true)}
            id="btn-add-transaction"
          >
            <span className="material-symbols-outlined">add</span>
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

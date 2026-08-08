import React, { useState } from 'react';
import TransactionModal from '../transactions/TransactionModal';
import './Header.css';

const Header = ({ title, subtitle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="page-header">
        <div className="page-header__titles">
          <h2 className="page-header__title">{title}</h2>
          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
        <button
          className="page-header__add-btn"
          onClick={() => setIsModalOpen(true)}
          id="btn-add-transaction"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Tambah</span>
        </button>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Header;

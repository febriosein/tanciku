import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import Header from '../components/layout/Header';
import TotalBalanceCard from '../components/dashboard/TotalBalanceCard';
import SummaryCard from '../components/dashboard/SummaryCard';
import DonutChart from '../components/dashboard/DonutChart';
import LineChart from '../components/dashboard/LineChart';
import TransactionList from '../components/transactions/TransactionList';
import FilterBar from '../components/transactions/FilterBar';
import WalletModal from '../components/wallets/WalletModal';
import { formatCurrency } from '../utils/formatCurrency';
import { formatMonthLabel, formatDateShort } from '../utils/formatDate';
import './Dashboard.css';

// SVG Icon renderer based on wallet ID / icon type
const WalletCardIcon = ({ wallet }) => {
  const iconId = wallet.id || '';
  if (iconId === 'cash') {
    return (
      <svg className="wallet-card-svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect height="12" rx="2" width="18" x="3" y="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }
  if (iconId === 'bca' || iconId === 'mandiri') {
    return (
      <svg className="wallet-card-svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5m-15 10.5V10.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (iconId === 'gopay') {
    return (
      <svg className="wallet-card-svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" fill="currentColor" r="3" />
      </svg>
    );
  }
  if (iconId === 'ovo') {
    return (
      <svg className="wallet-card-svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect height="14" rx="3" width="18" x="3" y="5" />
        <circle cx="14" cy="12" r="2" />
      </svg>
    );
  }
  if (iconId === 'dana') {
    return (
      <svg className="wallet-card-svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (iconId === 'shopeepay') {
    return (
      <svg className="wallet-card-svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.19-.578-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (iconId === 'other_wallet') {
    return (
      <svg className="wallet-card-svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{wallet.icon || 'account_balance_wallet'}</span>;
};

// Background colors for wallet icon boxes from the template
const getWalletBoxStyle = (id, defaultColor) => {
  if (id === 'cash') return { backgroundColor: '#ecfdf5', color: '#059669' };
  if (id === 'bca') return { backgroundColor: '#f0f9ff', color: '#0284c7' };
  if (id === 'mandiri') return { backgroundColor: '#eff6ff', color: '#1d4ed8' };
  if (id === 'gopay') return { backgroundColor: '#f0fdfa', color: '#0d9488' };
  if (id === 'ovo') return { backgroundColor: '#faf5ff', color: '#9333ea' };
  if (id === 'dana') return { backgroundColor: '#f0f9ff', color: '#0ea5e9' };
  if (id === 'shopeepay') return { backgroundColor: '#fff7ed', color: '#ea580c' };
  if (id === 'other_wallet') return { backgroundColor: '#f1f5f9', color: '#475569' };
  return { backgroundColor: `${defaultColor}15`, color: defaultColor };
};

const Dashboard = () => {
  const { summary, filter, wallets, dispatch } = useTransactions();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [selectedWalletToEdit, setSelectedWalletToEdit] = useState(null);

  // Dynamic filter label
  let subtitleLabel = '';
  if (filter.mode === '7days') {
    subtitleLabel = 'Ringkasan 7 Hari Terakhir';
  } else if (filter.mode === '30days') {
    subtitleLabel = 'Ringkasan 30 Hari Terakhir';
  } else if (filter.mode === 'year') {
    subtitleLabel = `Ringkasan Tahun ${filter.year}`;
  } else if (filter.mode === 'custom') {
    subtitleLabel = `Rentang: ${formatDateShort(filter.startDate)} - ${formatDateShort(filter.endDate)}`;
  } else if (filter.mode === 'all') {
    subtitleLabel = 'Ringkasan Semua Waktu';
  } else {
    subtitleLabel = `Bulan ${formatMonthLabel(filter.year, filter.month)}`;
  }

  const handleWalletClick = (walletId) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { wallet: filter.wallet === walletId ? 'all' : walletId },
    });
  };

  const handleOpenAddWallet = () => {
    setSelectedWalletToEdit(null);
    setWalletModalOpen(true);
  };

  const handleOpenEditWallet = (e, wallet) => {
    e.stopPropagation();
    setSelectedWalletToEdit(wallet);
    setWalletModalOpen(true);
  };

  return (
    <>
      <Header
        showGreeting={true}
        subtitle={subtitleLabel}
      />

      <div className="dashboard-suite">
        {/* Total Saldo Hero Card */}
        <TotalBalanceCard />

        {/* Filter Bar */}
        <FilterBar showTypeFilter={false} showWalletFilter={true} />

        {/* Quick Stats Bento */}
        <div className="dashboard-suite__summary">
          <SummaryCard type="balance" amount={summary.balance} />
          <SummaryCard type="income" amount={summary.income} />
          <SummaryCard type="expense" amount={summary.expense} />
        </div>

        {/* Wallets Breakdown Section */}
        <section className="dashboard-suite__wallets-section" data-purpose="wallets-grid-section">
          <div className="dashboard-suite__wallets-header">
            <div>
              <h2 className="dashboard-suite__section-title">Rincian Saldo Per Dompet</h2>
              <p className="dashboard-suite__section-sub">
                Klik kartu untuk filter transaksi · Tekan ikon pensil untuk mengedit
              </p>
            </div>
            <button
              type="button"
              className="dashboard-suite__wallet-add-btn"
              onClick={handleOpenAddWallet}
            >
              <svg className="dashboard-suite__btn-plus-svg" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Tambah Dompet</span>
            </button>
          </div>

          <div className="dashboard-suite__wallets-grid">
            {wallets.map((w) => {
              const bal = w.balance || 0;
              const isSelected = filter?.wallet === w.id;
              const boxStyle = getWalletBoxStyle(w.id, w.color);

              return (
                <div
                  key={w.id}
                  className={`dashboard-wallet-card ${isSelected ? 'dashboard-wallet-card--selected' : ''}`}
                  onClick={() => handleWalletClick(w.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleWalletClick(w.id)}
                  title={`Filter transaksi ${w.label}`}
                >
                  <div className="dashboard-wallet-card__top">
                    <div className="dashboard-wallet-card__icon-box" style={boxStyle}>
                      <WalletCardIcon wallet={w} />
                    </div>
                    <span className="dashboard-wallet-card__name">{w.label}</span>
                    <button
                      type="button"
                      className="dashboard-wallet-card__edit-btn"
                      onClick={(e) => handleOpenEditWallet(e, w)}
                      title={`Edit dompet ${w.label}`}
                      aria-label="Edit Dompet"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>edit</span>
                    </button>
                  </div>
                  <p className={`dashboard-wallet-card__balance ${bal < 0 ? 'text-expense' : ''}`}>
                    {formatCurrency(bal)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Charts Row */}
        <section className="dashboard-suite__charts" data-purpose="charts-analytics">
          {/* 6-Month Trend Chart */}
          <div className="dashboard-chart-card">
            <div className="dashboard-chart-card__header">
              <h3 className="dashboard-chart-card__title">Tren 6 Bulan Terakhir</h3>
              <div className="dashboard-chart-card__legend">
                <span className="dashboard-legend-item">
                  <span className="dashboard-legend-dot dashboard-legend-dot--income" />
                  Pemasukan
                </span>
                <span className="dashboard-legend-item">
                  <span className="dashboard-legend-dot dashboard-legend-dot--expense" />
                  Pengeluaran
                </span>
              </div>
            </div>
            <LineChart />
          </div>

          {/* Expense Distribution */}
          <div className="dashboard-chart-card">
            <div className="dashboard-chart-card__header">
              <h3 className="dashboard-chart-card__title">Distribusi Pengeluaran</h3>
            </div>
            <DonutChart />
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="dashboard-suite__recent-card" data-purpose="recent-transactions-card">
          <div className="dashboard-suite__recent-header">
            <h3 className="dashboard-suite__recent-title">Transaksi Terbaru</h3>
            <Link to="/transactions" className="dashboard-suite__view-all-link">
              <span>Lihat Semua</span>
              <svg className="dashboard-suite__arrow-svg" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <TransactionList limit={5} />
        </section>
      </div>

      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        wallet={selectedWalletToEdit}
      />
    </>
  );
};

export default Dashboard;

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

const Dashboard = () => {
  const { summary, filter, wallets, walletBalances, dispatch } = useTransactions();
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

      <div className="dashboard">
        {/* Hero Card: Total Saldo Semua Dompet Gabungan */}
        <TotalBalanceCard />

        {/* Filter Bar */}
        <FilterBar showTypeFilter={false} showWalletFilter={true} />

        {/* Summary Cards Bento (Period Cashflow) */}
        <div className="dashboard__summary">
          <SummaryCard type="balance" amount={summary.balance} />
          <SummaryCard type="income" amount={summary.income} />
          <SummaryCard type="expense" amount={summary.expense} />
        </div>

        {/* Wallets / Accounts Grid */}
        <div className="dashboard__wallets-section">
          <div className="dashboard__wallets-header">
            <div>
              <h3 className="section-title">Rincian Saldo Per Dompet</h3>
              <span className="section-sub">Klik kartu untuk filter transaksi · Tekan ikon pensil untuk mengedit</span>
            </div>
            <button
              type="button"
              className="wallet-add-btn"
              onClick={handleOpenAddWallet}
            >
              <span className="material-symbols-outlined">add</span>
              <span>Tambah Dompet</span>
            </button>
          </div>

          <div className="dashboard__wallets-grid">
            {wallets.map((w) => {
              const bal = walletBalances[w.id] || 0;
              const isSelected = filter.wallet === w.id;
              return (
                <div
                  key={w.id}
                  className={`wallet-mini-card ${isSelected ? 'wallet-mini-card--selected' : ''}`}
                  onClick={() => handleWalletClick(w.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleWalletClick(w.id)}
                  title={`Filter transaksi ${w.label}`}
                >
                  <div className="wallet-mini-card__top">
                    <div
                      className="wallet-mini-card__icon"
                      style={{ backgroundColor: `${w.color}18`, color: w.color }}
                    >
                      <span className="material-symbols-outlined">{w.icon}</span>
                    </div>
                    <span className="wallet-mini-card__name">{w.label}</span>
                    <button
                      type="button"
                      className="wallet-mini-card__edit-btn"
                      onClick={(e) => handleOpenEditWallet(e, w)}
                      title={`Edit dompet ${w.label}`}
                      aria-label="Edit Dompet"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                    </button>
                  </div>
                  <div className={`wallet-mini-card__balance ${bal < 0 ? 'text-expense' : ''}`}>
                    {formatCurrency(bal)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts Row */}
        <div className="dashboard__charts">
          <div className="card-soft chart-card chart-card--line">
            <div className="chart-card__header">
              <h3 className="chart-card__title">Tren 6 Bulan Terakhir</h3>
              <div className="chart-card__legend-pills">
                <span className="legend-pill legend-pill--income">
                  <span className="legend-dot legend-dot--income" /> Pemasukan
                </span>
                <span className="legend-pill legend-pill--expense">
                  <span className="legend-dot legend-dot--expense" /> Pengeluaran
                </span>
              </div>
            </div>
            <LineChart />
          </div>

          <div className="card-soft chart-card chart-card--donut">
            <div className="chart-card__header">
              <h3 className="chart-card__title">Distribusi Pengeluaran</h3>
            </div>
            <DonutChart />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card-soft dashboard__recent">
          <div className="dashboard__recent-header">
            <h3 className="chart-card__title">Transaksi Terbaru</h3>
            <Link to="/transactions" className="view-all-pill">
              Lihat Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <TransactionList limit={5} />
        </div>
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

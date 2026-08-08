import React from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import Header from '../components/layout/Header';
import SummaryCard from '../components/dashboard/SummaryCard';
import DonutChart from '../components/dashboard/DonutChart';
import LineChart from '../components/dashboard/LineChart';
import TransactionList from '../components/transactions/TransactionList';
import FilterBar from '../components/transactions/FilterBar';
import { formatMonthLabel } from '../utils/formatDate';
import './Dashboard.css';

const Dashboard = () => {
  const { summary, filter } = useTransactions();
  const monthLabel = formatMonthLabel(filter.year, filter.month);

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={monthLabel}
      />

      <div className="dashboard">
        {/* Filter Bar */}
        <FilterBar showTypeFilter={false} />

        {/* Summary Cards Bento */}
        <div className="dashboard__summary">
          <SummaryCard type="balance" amount={summary.balance} />
          <SummaryCard type="income" amount={summary.income} />
          <SummaryCard type="expense" amount={summary.expense} />
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
    </>
  );
};

export default Dashboard;

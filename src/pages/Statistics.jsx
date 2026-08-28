import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTransactions } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/layout/Header';
import { getCategoryById } from '../utils/categories';
import { formatCurrency, formatCompact } from '../utils/formatCurrency';
import { formatMonthShort } from '../utils/formatDate';
import './Statistics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Statistics = () => {
  const { transactions } = useTransactions();
  const { isDark } = useTheme();
  const [activeBreakdownTab, setActiveBreakdownTab] = useState('expense');

  // --- Last 6 months bar chart ---
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { year: d.getFullYear(), month: d.getMonth(), label: formatMonthShort(d.getFullYear(), d.getMonth()) };
  });

  const incomeData = months.map(({ year, month }) =>
    transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month && t.type === 'income';
    }).reduce((s, t) => s + t.amount, 0)
  );
  const expenseData = months.map(({ year, month }) =>
    transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month && t.type === 'expense';
    }).reduce((s, t) => s + t.amount, 0)
  );

  const barData = {
    labels: months.map((m) => m.label),
    datasets: [
      {
        label: 'Pemasukan',
        data: incomeData,
        backgroundColor: 'rgba(16,185,129,0.85)',
        borderColor: '#10b981',
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        label: 'Pengeluaran',
        data: expenseData,
        backgroundColor: 'rgba(239,68,68,0.85)',
        borderColor: '#ef4444',
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: isDark ? '#f3effc' : '#464555',
          font: { family: 'Plus Jakarta Sans', size: 12, weight: '700' },
          usePointStyle: true,
          pointStyle: 'circle',
          pointStyleWidth: 8,
          padding: 16,
          boxHeight: 8,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#171622' : '#1E293B',
        borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#94A3B8',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#88849e' : '#777587', font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } },
        border: { display: false },
      },
      y: {
        grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
        ticks: { color: isDark ? '#88849e' : '#777587', font: { family: 'Plus Jakarta Sans', size: 10, weight: '600' }, callback: (v) => formatCompact(v) },
        border: { display: false },
      },
    },
  };

  // --- Category breakdown (current year) ---
  const currentYear = now.getFullYear();
  const yearExpenses = transactions.filter(
    (t) => t.type === 'expense' && new Date(t.date).getFullYear() === currentYear
  );
  const yearIncome = transactions.filter(
    (t) => t.type === 'income' && new Date(t.date).getFullYear() === currentYear
  );

  const expenseByCat = yearExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const incomeByCat = yearIncome.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const totalExpense = Object.values(expenseByCat).reduce((s, v) => s + v, 0);
  const totalIncome = Object.values(incomeByCat).reduce((s, v) => s + v, 0);

  const sortedExpense = Object.entries(expenseByCat).sort((a, b) => b[1] - a[1]);
  const sortedIncome = Object.entries(incomeByCat).sort((a, b) => b[1] - a[1]);

  // --- Annual summary ---
  const annualIncome = yearIncome.reduce((s, t) => s + t.amount, 0);
  const annualExpense = yearExpenses.reduce((s, t) => s + t.amount, 0);
  const netSavings = annualIncome - annualExpense;
  const savingsRate = annualIncome > 0 ? Math.max(0, (netSavings / annualIncome) * 100) : 0;
  const monthsWithData = new Set([...yearIncome, ...yearExpenses].map((t) => new Date(t.date).getMonth())).size || 1;

  return (
    <>
      <Header title="Statistik & Analisis" subtitle={`Laporan kinerja finansial tahun ${currentYear}`} />

      <div className="statistics-container">
        {/* Annual Overview Bento Cards */}
        <div className="stats-bento-grid">
          {/* Income Overview */}
          <div className="stats-hero-card">
            <div className="stats-hero-card__header">
              <div className="stats-hero-icon-box icon-box--income">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <span className="stats-hero-label">Total Pemasukan {currentYear}</span>
            </div>
            <div className="stats-hero-value text-income">{formatCurrency(annualIncome)}</div>
            <div className="stats-hero-footer">
              <span>Rata-rata: <strong>{formatCompact(annualIncome / monthsWithData)}</strong> / bln</span>
            </div>
          </div>

          {/* Expense Overview */}
          <div className="stats-hero-card">
            <div className="stats-hero-card__header">
              <div className="stats-hero-icon-box icon-box--expense">
                <span className="material-symbols-outlined">trending_down</span>
              </div>
              <span className="stats-hero-label">Total Pengeluaran {currentYear}</span>
            </div>
            <div className="stats-hero-value text-expense">{formatCurrency(annualExpense)}</div>
            <div className="stats-hero-footer">
              <span>Rata-rata: <strong>{formatCompact(annualExpense / monthsWithData)}</strong> / bln</span>
            </div>
          </div>

          {/* Savings Overview */}
          <div className="stats-hero-card">
            <div className="stats-hero-card__header">
              <div className="stats-hero-icon-box icon-box--savings">
                <span className="material-symbols-outlined">savings</span>
              </div>
              <span className="stats-hero-label">Tabungan Bersih {currentYear}</span>
            </div>
            <div className={`stats-hero-value ${netSavings >= 0 ? 'text-income' : 'text-expense'}`}>
              {formatCurrency(netSavings)}
            </div>
            <div className="stats-hero-footer">
              <span className="savings-rate-pill">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>Tingkat Tabungan: <strong>{savingsRate.toFixed(0)}%</strong></span>
              </span>
            </div>
          </div>
        </div>

        {/* Bar Chart Section */}
        <div className="stats-card">
          <div className="stats-card__header">
            <div className="stats-card__title-group">
              <span className="material-symbols-outlined stats-section-icon">bar_chart</span>
              <div>
                <h3 className="stats-card__title">Tren Arus Kas 6 Bulan Terakhir</h3>
                <p className="stats-card__desc">Perbandingan pemasukan dan pengeluaran per bulan</p>
              </div>
            </div>
          </div>

          <div className="stats-card__body">
            <div className="stats-chart-wrapper">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Category Breakdown Section */}
        <div className="stats-card">
          <div className="stats-card__header stats-card__header--between">
            <div className="stats-card__title-group">
              <span className="material-symbols-outlined stats-section-icon">donut_small</span>
              <div>
                <h3 className="stats-card__title">Distribusi Kategori {currentYear}</h3>
                <p className="stats-card__desc">Rincian pengeluaran dan pemasukan berdasarkan pos anggaran</p>
              </div>
            </div>

            {/* Mobile Tab Toggle */}
            <div className="breakdown-tab-toggle">
              <button
                type="button"
                className={`breakdown-tab-btn ${activeBreakdownTab === 'expense' ? 'breakdown-tab-btn--active-expense' : ''}`}
                onClick={() => setActiveBreakdownTab('expense')}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                className={`breakdown-tab-btn ${activeBreakdownTab === 'income' ? 'breakdown-tab-btn--active-income' : ''}`}
                onClick={() => setActiveBreakdownTab('income')}
              >
                Pemasukan
              </button>
            </div>
          </div>

          <div className="stats-card__body">
            <div className="breakdown-grid-dual">
              {/* Expense Column */}
              <div className={`breakdown-column ${activeBreakdownTab === 'income' ? 'breakdown-column--hide-mobile' : ''}`}>
                <div className="breakdown-column__header">
                  <span className="breakdown-column__dot dot--expense" />
                  <h4>Pengeluaran ({sortedExpense.length} Kategori)</h4>
                  <span className="breakdown-column__total text-expense">{formatCurrency(totalExpense)}</span>
                </div>

                {sortedExpense.length === 0 ? (
                  <p className="breakdown-empty">Belum ada data pengeluaran di tahun {currentYear}</p>
                ) : (
                  <div className="breakdown-items-list">
                    {sortedExpense.map(([id, value]) => {
                      const cat = getCategoryById(id);
                      const pct = totalExpense > 0 ? (value / totalExpense) * 100 : 0;
                      return (
                        <div key={id} className="breakdown-row-item">
                          <div className="breakdown-row-item__top">
                            <div className="breakdown-row-item__left">
                              <span className="breakdown-cat-icon">{cat.icon}</span>
                              <span className="breakdown-cat-label">{cat.label}</span>
                            </div>
                            <div className="breakdown-row-item__right">
                              <span className="breakdown-cat-amount text-expense">{formatCurrency(value)}</span>
                              <span className="breakdown-cat-pct">({pct.toFixed(1)}%)</span>
                            </div>
                          </div>
                          <div className="breakdown-progress-track">
                            <div
                              className="breakdown-progress-fill"
                              style={{ width: `${pct}%`, backgroundColor: cat.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Income Column */}
              <div className={`breakdown-column ${activeBreakdownTab === 'expense' ? 'breakdown-column--hide-mobile' : ''}`}>
                <div className="breakdown-column__header">
                  <span className="breakdown-column__dot dot--income" />
                  <h4>Pemasukan ({sortedIncome.length} Kategori)</h4>
                  <span className="breakdown-column__total text-income">{formatCurrency(totalIncome)}</span>
                </div>

                {sortedIncome.length === 0 ? (
                  <p className="breakdown-empty">Belum ada data pemasukan di tahun {currentYear}</p>
                ) : (
                  <div className="breakdown-items-list">
                    {sortedIncome.map(([id, value]) => {
                      const cat = getCategoryById(id);
                      const pct = totalIncome > 0 ? (value / totalIncome) * 100 : 0;
                      return (
                        <div key={id} className="breakdown-row-item">
                          <div className="breakdown-row-item__top">
                            <div className="breakdown-row-item__left">
                              <span className="breakdown-cat-icon">{cat.icon}</span>
                              <span className="breakdown-cat-label">{cat.label}</span>
                            </div>
                            <div className="breakdown-row-item__right">
                              <span className="breakdown-cat-amount text-income">{formatCurrency(value)}</span>
                              <span className="breakdown-cat-pct">({pct.toFixed(1)}%)</span>
                            </div>
                          </div>
                          <div className="breakdown-progress-track">
                            <div
                              className="breakdown-progress-fill"
                              style={{ width: `${pct}%`, backgroundColor: cat.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;

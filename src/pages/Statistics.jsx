import React from 'react';
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
        backgroundColor: 'rgba(16,185,129,0.75)',
        borderColor: '#10b981',
        borderWidth: 1.5,
        borderRadius: 6,
      },
      {
        label: 'Pengeluaran',
        data: expenseData,
        backgroundColor: 'rgba(239,68,68,0.75)',
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
          font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
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
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${formatCompact(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#88849e' : '#777587', font: { family: 'Plus Jakarta Sans', size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
        ticks: { color: isDark ? '#88849e' : '#777587', font: { family: 'Plus Jakarta Sans', size: 10 }, callback: (v) => formatCompact(v) },
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
  const monthsWithData = new Set([...yearIncome, ...yearExpenses].map((t) => new Date(t.date).getMonth())).size || 1;

  return (
    <>
      <Header title="Statistik" subtitle={`Analisis keuangan tahun ${currentYear}`} />

      <div className="statistics-page">
        {/* Annual Overview */}
        <div className="stats-overview stagger-children">
          <div className="glass-card stats-overview__card">
            <p className="stats-label">Total Pemasukan {currentYear}</p>
            <p className="stats-value income">{formatCurrency(annualIncome)}</p>
            <p className="stats-sub">Rata-rata {formatCompact(annualIncome / monthsWithData)}/bln</p>
          </div>
          <div className="glass-card stats-overview__card">
            <p className="stats-label">Total Pengeluaran {currentYear}</p>
            <p className="stats-value expense">{formatCurrency(annualExpense)}</p>
            <p className="stats-sub">Rata-rata {formatCompact(annualExpense / monthsWithData)}/bln</p>
          </div>
          <div className="glass-card stats-overview__card">
            <p className="stats-label">Tabungan {currentYear}</p>
            <p className={`stats-value ${annualIncome - annualExpense >= 0 ? 'income' : 'expense'}`}>
              {formatCurrency(annualIncome - annualExpense)}
            </p>
            <p className="stats-sub">
              {totalIncome > 0 ? `${((1 - totalExpense / totalIncome) * 100).toFixed(0)}% dari pemasukan` : '-'}
            </p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card chart-card">
          <h2 className="chart-card__title">Perbandingan Bulanan</h2>
          <div style={{ height: '260px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="stats-breakdown">
          {/* Expense */}
          <div className="glass-card breakdown-card">
            <h2 className="chart-card__title">Pengeluaran per Kategori</h2>
            {sortedExpense.length === 0 ? (
              <p className="breakdown-empty">Belum ada data</p>
            ) : (
              <div className="breakdown-list">
                {sortedExpense.map(([id, value]) => {
                  const cat = getCategoryById(id);
                  const pct = totalExpense > 0 ? (value / totalExpense) * 100 : 0;
                  return (
                    <div key={id} className="breakdown-item">
                      <div className="breakdown-item__header">
                        <span className="breakdown-item__cat">{cat.icon} {cat.label}</span>
                        <span className="breakdown-item__amount expense">{formatCurrency(value)}</span>
                      </div>
                      <div className="breakdown-bar">
                        <div
                          className="breakdown-bar__fill"
                          style={{ width: `${pct}%`, background: cat.color }}
                        />
                      </div>
                      <span className="breakdown-item__pct">{pct.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Income */}
          <div className="glass-card breakdown-card">
            <h2 className="chart-card__title">Pemasukan per Kategori</h2>
            {sortedIncome.length === 0 ? (
              <p className="breakdown-empty">Belum ada data</p>
            ) : (
              <div className="breakdown-list">
                {sortedIncome.map(([id, value]) => {
                  const cat = getCategoryById(id);
                  const pct = totalIncome > 0 ? (value / totalIncome) * 100 : 0;
                  return (
                    <div key={id} className="breakdown-item">
                      <div className="breakdown-item__header">
                        <span className="breakdown-item__cat">{cat.icon} {cat.label}</span>
                        <span className="breakdown-item__amount income">{formatCurrency(value)}</span>
                      </div>
                      <div className="breakdown-bar">
                        <div
                          className="breakdown-bar__fill"
                          style={{ width: `${pct}%`, background: cat.color }}
                        />
                      </div>
                      <span className="breakdown-item__pct">{pct.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;

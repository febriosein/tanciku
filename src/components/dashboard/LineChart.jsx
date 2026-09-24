import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTransactions } from '../../context/TransactionContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCompact } from '../../utils/formatCurrency';
import { formatMonthShort } from '../../utils/formatDate';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const LineChart = () => {
  const { transactions } = useTransactions();
  const { isDark } = useTheme();

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

  const chartData = {
    labels: months.map((m) => m.label),
    datasets: [
      {
        label: 'Pemasukan',
        data: incomeData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10b981',
        pointBorderWidth: 2.5,
        pointRadius: 4.5,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.35,
      },
      {
        label: 'Pengeluaran',
        data: expenseData,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#f59e0b',
        pointBorderWidth: 2.5,
        pointRadius: 4.5,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#0a1d15' : '#0f172a',
        borderColor: isDark ? 'rgba(52, 211, 153, 0.3)' : 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#94a3b8',
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
        ticks: { color: isDark ? '#94a3b8' : '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } },
        border: { display: false },
      },
      y: {
        grid: { color: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9' },
        ticks: {
          color: isDark ? '#94a3b8' : '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 10 },
          callback: (v) => formatCompact(v),
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="line-chart-wrapper" style={{ position: 'relative', width: '100%', height: '220px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;

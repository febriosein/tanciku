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
import { formatCompact } from '../../utils/formatCurrency';
import { formatMonthShort } from '../../utils/formatDate';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const LineChart = () => {
  const { transactions } = useTransactions();

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
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79,70,229,0.08)',
        borderWidth: 2,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#4F46E5',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Pengeluaran',
        data: expenseData,
        borderColor: '#F97316',
        backgroundColor: 'rgba(249,115,22,0.08)',
        borderWidth: 2,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#F97316',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: false, // Hidden because custom header legend pills are rendered in Dashboard
      },
      tooltip: {
        backgroundColor: '#1E293B',
        borderColor: 'rgba(255,255,255,0.08)',
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
        ticks: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: {
          color: '#94A3B8',
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

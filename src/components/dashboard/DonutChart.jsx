import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTransactions } from '../../context/TransactionContext';
import { useTheme } from '../../context/ThemeContext';
import { getCategoryById } from '../../utils/categories';
import { formatCurrency } from '../../utils/formatCurrency';
import './DonutChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const DONUT_COLORS = [
  '#F97316', '#EC4899', '#3B82F6', '#10B981',
  '#EAB308', '#8B5CF6', '#06B6D4', '#94A3B8',
];

const DonutChart = () => {
  const { filteredTransactions } = useTransactions();
  const { isDark } = useTheme();

  const expenses = filteredTransactions.filter((t) => t.type === 'expense');

  const categoryTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((s, [, v]) => s + v, 0);

  if (sorted.length === 0) {
    return (
      <div className="chart-empty">
        <p>Belum ada data pengeluaran</p>
      </div>
    );
  }

  const labels = sorted.map(([id]) => getCategoryById(id).label);
  const data = sorted.map(([, v]) => v);
  const colors = sorted.map((_, i) => DONUT_COLORS[i % DONUT_COLORS.length]);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: isDark ? '#171622' : '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    cutout: '72%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#171622' : '#1E293B',
        borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#94A3B8',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${formatCurrency(ctx.raw)} (${((ctx.raw / total) * 100).toFixed(1)}%)`,
        },
      },
    },
  };

  return (
    <div className="donut-chart">
      <div className="donut-chart__canvas-container">
        <div className="donut-chart__canvas-wrapper">
          <Doughnut data={chartData} options={options} />
          <div className="donut-chart__center">
            <p className="donut-chart__center-label">TOTAL</p>
            <p className="donut-chart__center-value">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="donut-chart__legend">
        {sorted.slice(0, 5).map(([id, value], i) => {
          const cat = getCategoryById(id);
          const pct = ((value / total) * 100).toFixed(0);
          const color = DONUT_COLORS[i % DONUT_COLORS.length];
          return (
            <div key={id} className="legend-item">
              <div className="legend-item__left">
                <div className="legend-item__dot" style={{ background: color }} />
                <span className="legend-item__label">{cat.label}</span>
              </div>
              <span className="legend-item__pct">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonutChart;

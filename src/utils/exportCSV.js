import { getWalletById } from './wallets';
import { getCategoryById } from './categories';

export const exportCSV = (transactions, wallets = null) => {
  const headers = ['Tanggal', 'Jenis', 'Kategori', 'Dompet/Metode', 'Jumlah', 'Catatan'];
  const rows = transactions.map((t) => [
    t.date,
    t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    getCategoryById(t.category).label,
    getWalletById(t.wallet || 'cash', wallets).label,
    t.amount,
    t.note || '',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tanciku_transaksi_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

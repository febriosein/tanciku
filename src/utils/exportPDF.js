import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getCategoryById } from './categories';
import { formatDate } from './formatDate';
import { formatCurrency } from './formatCurrency';

/**
 * Generates and downloads a clean, professional financial statement in PDF format.
 *
 * @param {Array} transactions - Array of filtered transactions
 * @param {Object} summary - Summary object containing { income, expense, balance }
 * @param {string} filterDesc - Human readable filter description (e.g. "Agustus 2026")
 * @param {Object} profile - User profile { name: string }
 * @param {Array} wallets - Array of user wallet accounts
 */
export const exportPDF = (transactions, summary, filterDesc, profile, wallets) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // 1. Header Banner
  doc.setFillColor(53, 37, 205); // Tanciku Brand Navy Indigo
  doc.roundedRect(margin, margin, pageWidth - margin * 2, 22, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TANCIKU — LAPORAN CATATAN KEUANGAN', margin + 6, margin + 9);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const userName = profile?.name || 'Pengguna';
  const period = filterDesc || 'Semua Waktu';
  doc.text(`Pengguna: ${userName}   |   Periode: ${period}   |   Dicetak: ${dateStr} WIB`, margin + 6, margin + 16);

  // 2. Summary Metrics Boxes
  const summaryY = margin + 26;
  const colWidth = (pageWidth - margin * 2 - 8) / 3;

  // Box 1: Pemasukan
  doc.setFillColor(240, 253, 244); // soft green
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, summaryY, colWidth, 18, 2, 2, 'FD');
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PEMASUKAN', margin + 4, summaryY + 5.5);
  doc.setFontSize(10.5);
  doc.text(formatCurrency(summary.income || 0), margin + 4, summaryY + 13);

  // Box 2: Pengeluaran
  doc.setFillColor(254, 242, 242); // soft red
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin + colWidth + 4, summaryY, colWidth, 18, 2, 2, 'FD');
  doc.setTextColor(153, 27, 27);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PENGELUARAN', margin + colWidth + 8, summaryY + 5.5);
  doc.setFontSize(10.5);
  doc.text(formatCurrency(summary.expense || 0), margin + colWidth + 8, summaryY + 13);

  // Box 3: Selisih Bersih (Net Flow)
  const net = (summary.income || 0) - (summary.expense || 0);
  doc.setFillColor(248, 250, 252); // soft slate
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + colWidth * 2 + 8, summaryY, colWidth, 18, 2, 2, 'FD');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('SELISIH BERSIH (NET)', margin + colWidth * 2 + 12, summaryY + 5.5);
  doc.setFontSize(10.5);
  if (net >= 0) {
    doc.setTextColor(22, 101, 52);
  } else {
    doc.setTextColor(153, 27, 27);
  }
  doc.text(formatCurrency(net), margin + colWidth * 2 + 12, summaryY + 13);

  // 3. Transactions Table
  const walletMap = {};
  if (Array.isArray(wallets)) {
    wallets.forEach((w) => {
      walletMap[w.id] = w.label;
    });
  }

  const tableRows = transactions.map((t, idx) => {
    const cat = getCategoryById(t.category);
    const walletName = walletMap[t.wallet] || (t.wallet ? t.wallet.toUpperCase() : 'Utama');
    const isIncome = t.type === 'income';
    const amountStr = `${isIncome ? '+ ' : '- '}${formatCurrency(t.amount)}`;

    return [
      idx + 1,
      formatDate(t.date),
      isIncome ? 'Pemasukan' : 'Pengeluaran',
      cat?.label || t.category || '-',
      walletName,
      t.note || '-',
      amountStr,
    ];
  });

  autoTable(doc, {
    startY: summaryY + 22,
    head: [['No', 'Tanggal', 'Jenis', 'Kategori', 'Dompet / Rekening', 'Catatan', 'Nominal']],
    body: tableRows.length > 0 ? tableRows : [['-', '-', '-', '-', '-', 'Tidak ada data transaksi', '-']],
    theme: 'grid',
    headStyles: {
      fillColor: [53, 37, 205],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
    },
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2.5,
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 23 },
      2: { cellWidth: 22 },
      3: { cellWidth: 26 },
      4: { cellWidth: 26 },
      5: { cellWidth: 'auto' },
      6: { halign: 'right', cellWidth: 32, fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 6) {
        const raw = String(data.cell.raw || '');
        if (raw.startsWith('+')) {
          data.cell.styles.textColor = [16, 185, 129]; // green
        } else if (raw.startsWith('-')) {
          data.cell.styles.textColor = [239, 68, 68]; // red
        }
      }
    },
    didDrawPage: (data) => {
      // Footer page numbering
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      const pageStr = `Halaman ${data.pageNumber} dari ${doc.internal.getNumberOfPages()}`;
      doc.text(
        `Tanciku — Catatan Keuangan Modern  |  ${pageStr}`,
        pageWidth / 2,
        pageHeight - 7,
        { align: 'center' }
      );
    },
    margin: { left: margin, right: margin, bottom: 14 },
  });

  // 4. Download PDF
  const filenameDate = new Date().toISOString().split('T')[0];
  const filename = `tanciku_laporan_${filenameDate}.pdf`;
  doc.save(filename);
};

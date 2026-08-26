// Parse YYYY-MM-DD string into local Date object safely without UTC timezone shift
export const parseISODate = (dateStr) => {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;
  const parts = String(dateStr).split('T')[0].split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month - 1, day);
    }
  }
  return new Date(dateStr);
};

// Format date to Indonesian locale
export const formatDate = (dateStr) => {
  const date = parseISODate(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Format date short (e.g. "8 Agu")
export const formatDateShort = (dateStr) => {
  const date = parseISODate(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
};

// Format month label (e.g. "Agustus 2026")
export const formatMonthLabel = (year, month) => {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
};

// Format short month (e.g. "Agu")
export const formatMonthShort = (year, month) => {
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('id-ID', { month: 'short' });
};

// Get today's date as YYYY-MM-DD in local time
export const todayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get N days ago ISO string
export const daysAgoISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get year and month from ISO date string
export const getYearMonth = (dateStr) => {
  const d = parseISODate(dateStr);
  return { year: d.getFullYear(), month: d.getMonth() };
};

// Dynamic friendly greeting based on time of day
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return 'Selamat Pagi';
  if (hour >= 11 && hour < 15) return 'Selamat Siang';
  if (hour >= 15 && hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
};

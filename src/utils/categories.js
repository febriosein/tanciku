export const CATEGORIES = {
  expense: [
    { id: 'food', label: 'Makanan & Minuman', icon: '🍔', color: '#f97316' },
    { id: 'transport', label: 'Transportasi', icon: '🚗', color: '#3b82f6' },
    { id: 'shopping', label: 'Belanja', icon: '🛍️', color: '#ec4899' },
    { id: 'bills', label: 'Tagihan & Utilitas', icon: '📄', color: '#eab308' },
    { id: 'health', label: 'Kesehatan', icon: '🏥', color: '#22c55e' },
    { id: 'entertainment', label: 'Hiburan', icon: '🎮', color: '#a855f7' },
    { id: 'education', label: 'Pendidikan', icon: '📚', color: '#06b6d4' },
    { id: 'other_expense', label: 'Lainnya', icon: '📦', color: '#94a3b8' },
  ],
  income: [
    { id: 'salary', label: 'Gaji', icon: '💼', color: '#10b981' },
    { id: 'freelance', label: 'Freelance', icon: '💻', color: '#6366f1' },
    { id: 'investment', label: 'Investasi', icon: '📈', color: '#f59e0b' },
    { id: 'gift', label: 'Hadiah / Transfer', icon: '🎁', color: '#ec4899' },
    { id: 'other_income', label: 'Lainnya', icon: '✨', color: '#94a3b8' },
  ],
};

export const ALL_CATEGORIES = [...CATEGORIES.expense, ...CATEGORIES.income];

export const getCategoryById = (id) => {
  return ALL_CATEGORIES.find((c) => c.id === id) || {
    id: 'other_expense',
    label: 'Lainnya',
    icon: '📦',
    color: '#94a3b8',
  };
};

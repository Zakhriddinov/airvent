const colors = [
  { value: 'default', label: 'Standart', icon: '🌟' },
  { value: 'draft', label: 'Qoralama', icon: '📝' },
  { value: 'pending', label: 'Kutilmoqda', color: 'magenta', icon: '⏳' },
  { value: 'cancelled', label: 'Bekor qilingan', color: 'volcano', icon: '❌' },
  { value: 'sent', label: 'Yuborilgan', color: 'gold', icon: '✉️' },
  { value: 'refunded', label: 'Qaytarilgan', color: 'purple', icon: '💰' },
  { value: 'on hold', label: 'Ushlab qolingan', color: 'blue', icon: '🛑' },

  { value: 'accepted', label: 'Qabul qilingan', color: 'green', icon: '✅' },
  { value: 'declined', label: 'Rad etdi', color: 'volcano', icon: '❎' },
  { value: 'rejected', label: 'Rad etilgan', color: 'red', icon: '🚫' },
  { value: 'expired', label: 'Muddati tugagan', color: 'orange', icon: '⏰' },

  { value: 'success', label: 'success', color: 'green', icon: '✨' },
  { value: 'failed', label: 'failed', color: 'red', icon: '❌' },
  { value: 'error', label: 'error', color: 'volcano', icon: '⚠️' },

  { value: 'cash', label: 'naqd', color: 'green', icon: '✨' },
  { value: 'transfers', label: 'transferlar', color: 'blue', icon: '❌' },
  { value: 'click', label: 'click', color: 'orange', icon: '❌' },

  { value: 'arrived', label: 'arrived', color: 'blue', icon: '🚚' },

  { value: 'unpaid', label: "To'lanmagan", color: 'volcano', icon: '💵' },
  { value: 'paid', label: "To'langan", color: 'green', icon: '💳' },
  { value: 'partially', label: "Qisman to'langan", color: 'purple', icon: '💰' },
  { value: 'overdue', label: "Muddati o'tgan", color: 'red', icon: '💰' },

  { value: 'processing', label: 'processing', color: 'geekblue', icon: '⌛' },
  { value: 'packing', label: 'packing', color: 'orange', icon: '📦' },
  { value: 'shipped', label: 'shipped', color: 'purple', icon: '✈️' },

  { value: 'not started', label: 'not started', icon: '🚫' },
  { value: 'in progress', label: 'in progress', color: 'geekblue', icon: '🔄' },
  { value: 'delayed', label: 'delayed', color: 'orange', icon: '⏰' },
  { value: 'completed', label: 'completed', color: 'green', icon: '✅' },
  { value: 'delivered', label: 'delivered', color: 'magenta', icon: '📦' },
  { value: 'returned', label: 'returned', color: 'red', icon: '🔙' },

  { value: 'new', label: 'new', color: 'blue', icon: '🚀' },
  { value: 'premium', label: 'premium', color: 'gold', icon: '🏆' },
  { value: 'free', label: 'free', color: 'green', icon: '💡' },
];

const statusTagColorList = (tags = []) => {
  const list = [];

  tags.map((x) => {
    const element = colors.find((obj) => obj?.value?.toLowerCase() === x?.toLowerCase());
    if (element) list.push(element);
    else list.push({ value: x, label: x });
  });
  return list;
};

const tagColor = (status) => {
  const element = colors.find((obj) => obj?.value?.toLowerCase() === status?.toLowerCase());
  if (element) return element;
  else return { value: status, label: status };
};

export { statusTagColorList, tagColor };

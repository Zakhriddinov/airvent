export const fields = {
  code: {
    required: true,
    label: 'Kod',
  },
  name: {
    required: true,
    label: 'Nomi',
  },
  currency: {
    required: true,
    label: 'Valyuta',
    type: 'currencySelect',
    disableForTable: true,
  },
  debtStart: {
    label: 'Oy boshiga qarz (Xaqqimiz)',
    disableForForm: true,
    disableForUpdate: true,
    type: 'currency',
  },
  turnover: { label: 'Aylanmasi', disableForForm: true, disableForUpdate: true, type: 'currency' },
  cash: { label: 'Naqd', disableForForm: true, disableForUpdate: true, type: 'currency' },
  transfers: {
    label: 'Transferlar',
    disableForForm: true,
    disableForUpdate: true,
    type: 'currency',
  },
  debtEnd: {
    label: 'Oy oxiriga qarz (Xaqqimiz)',
    disableForForm: true,
    disableForUpdate: true,
    type: 'currency',
  },
  enabled: {
    type: 'boolean',
    required: true,
    label: 'Holat',
  },
};

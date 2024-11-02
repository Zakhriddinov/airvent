// import color from '@/utilities/color';
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
  turnover: { label: 'Aylanmasi', disableForForm: true, disableForUpdate: true, type: 'currency' },
  cash: { label: 'Naqd', disableForForm: true, disableForUpdate: true, type: 'currency' },
  click: { label: 'Click', disableForForm: true, disableForUpdate: true, type: 'currency' },
  transfers: {
    label: 'Transferlar',
    disableForForm: true,
    disableForUpdate: true,
    type: 'currency',
  },
  debt: {
    label: 'Mijoz qarzi',
    disableForForm: true,
    disableForUpdate: true,
    type: 'currency',
    style: {
      color: 'red',
    },
  },
  phone: {
    label: 'Telefon raqam',
    disableForTable: true,
  },
  enabled: {
    type: 'boolean',
    required: true,
    label: 'Holat',
  },
};

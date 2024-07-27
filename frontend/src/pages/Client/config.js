// import color from '@/utilities/color';
export const fields = {
  firstname: {
    label: 'Ism',
    required: true,
  },
  lastname: {
    label: 'Familiya',
  },
  phone: {
    label: 'Telefon raqam',
  },
  phone: {
    type: 'phone',
    label: 'Telefon raqam',
  },
  //   color: {
  //     type: 'color',
  //     options: [...color],
  //     required: true,
  //     label: 'Rang',
  //   },
  address: {
    type: 'textarea',
    label: 'Manzil',
  },
  enabled: {
    type: 'boolean',
    label: 'Holat',
  },
};

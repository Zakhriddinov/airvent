import color from '@/utilities/color';
export const fields = {
  code: {
    required: true,
    label: 'Kod',
  },
  name: {
    required: true,
    label: 'Nomi',
  },
  color: {
    type: 'color',
    options: [...color],
    required: true,
    label: 'Rang',
  },
  description: {
    type: 'textarea',
    label: 'Tavsif',
  },
  enabled: {
    type: 'boolean',
    required: true,
    label: 'Holat',
  },
};

import color from '@/utilities/color';
export const fields = {
  name: {
    label: 'Nomi',
    required: true
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

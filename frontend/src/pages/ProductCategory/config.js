export const fields = {
  code: {
    required: true,
    label: 'Kod',
  },
  name: {
    required: true,
    label: 'Nomi',
  },
  description: {
    type: 'textarea',
    required: true,
    label: 'Tavsif',
  },
  enabled: {
    type: 'boolean',
    required: true,
    label: 'Holat',
  },
};

import {
  DashboardOutlined,
  UserOutlined,
  TagsOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  ShopOutlined,
} from '@ant-design/icons';

import DashboardPage from '@/pages/Dashboard';
import ProductCategory from '@/pages/ProductCategory';
import Product from '@/pages/Product';
import Position from '@/pages/Position';
import Employee from '@/pages/Employee';
import { EmployeeAttendance } from '@/pages/EmployeeAttendance';
import Supplier from '@/pages/Supplier';
import SupplierInvoice from '@/pages/SupplierInvoice';
import InvoiceCreate from '@/pages/SupplierInvoice/InvoiceCreate';
import SuppplierPayment from '@/pages/SupplierPayment';
import SupplierPaymentUpdate from '@/pages/SupplierPayment/SupplierPaymentUpdate';
import SupplierPaymentRead from '@/pages/SupplierPayment/SupplierPaymentRead';
import InvoiceRecordPayment from '@/pages/SupplierInvoice/InvoiceRecordPayment';
import InvoiceUpdate from '@/pages/SupplierInvoice/InvoiceUpdate';
import Taxes from '@/pages/Taxes';
import Client from '@/pages/Client';
import ClientInvoice from '@/pages/ClientInvoice';
import ClientInvoiceCreate from '@/pages/ClientInvoice/InvoiceCreate';
import ClientInvoiceRecordPayment from '@/pages/ClientInvoice/InvoiceRecordPayment';
import ClientPayment from '@/pages/ClientPayment'
import ClientInvoiceUpdate from '@/pages/ClientInvoice/InvoiceUpdate'
import InvoiceRead from '@/pages/SupplierInvoice/InvoiceRead';
import ClientInvoiceRead from '@/pages/ClientInvoice/InvoiceRead';


export const sidebar = [
  {
    id: 1,
    element: DashboardPage,
    title: 'Boshqaruv paneli',
    path: '/',
    isPrivate: true,
    role: ['admin'],
    icon: DashboardOutlined,
    hidden: false,
    items: [],
  },
  {
    id: 2,
    title: 'Ombor',
    path: '/product',
    isPrivate: true,
    role: ['admin'],
    icon: TagsOutlined,
    hidden: false,
    items: [
      {
        id: '2-1',
        parentId: 2,
        label: 'Mahsulotlar',
        isPrivate: true,
        path: '/product',
        role: ['admin'],
        element: Product,
      },
      {
        id: '2-2',
        parentId: 2,
        element: ProductCategory,
        label: 'Kategoriyalar',
        path: '/product/category',
        isPrivate: true,
        role: ['admin'],
      },
    ],
  },
  {
    id: 9,
    title: 'Yetkazib beruvchi',
    path: '/supplier',
    isPrivate: true,
    role: ['admin'],
    icon: ShopOutlined,
    hidden: false,
    items: [
      {
        id: '9-1',
        parentId: 9,
        element: Supplier,
        label: 'Kompaniyalar',
        isPrivate: true,
        path: '/supplier/list',
        role: ['admin'],
      },
      {
        id: '9-2',
        parentId: 9,
        element: SupplierInvoice,
        label: 'Hisob-fakturalar',
        path: '/supplier/invoice',
        isPrivate: true,
        role: ['admin'],
      },
      {
        id: '9-3',
        parentId: 9,
        element: SuppplierPayment,
        label: "To'lovlar",
        path: '/supplier/payment',
        isPrivate: true,
        role: ['admin'],
      },
    ],
  },
  {
    id: 10,
    element: InvoiceCreate,
    label: 'Create',
    path: '/supplier/invoice/create',
    isPrivate: true,
    hidden: true,
    role: ['admin'],
  },
  {
    id: 13,
    element: InvoiceUpdate,
    label: 'Create',
    path: '/supplier/invoice/update/:id',
    isPrivate: true,
    hidden: true,
    role: ['admin'],
  },
  {
    id: 16,
    element: InvoiceRead,
    label: 'Read',
    path: '/supplier/invoice/read/:id',
    isPrivate: true,
    hidden: true,
    role: ['admin'],
  },
  {
    id: 11,
    element: SupplierPaymentUpdate,
    label: 'Update',
    path: '/supplierpayment/update/:id',
    isPrivate: true,
    hidden: true,
    role: ['admin'],
  },
  {
    id: 11,
    element: SupplierPaymentRead,
    label: 'Read',
    path: '/supplierpayment/read/:id',
    isPrivate: true,
    hidden: true,
    role: ['admin'],
  },
  {
    id: 12,
    element: InvoiceRecordPayment,
    label: 'Pay',
    path: '/invoice/pay/:id',
    isPrivate: true,
    hidden: true,
    role: ['admin'],
  },
  {
    id: 14,
    title: 'Mijoz',
    path: '/client',
    isPrivate: true,
    role: ['admin'],
    icon: CustomerServiceOutlined,
    hidden: false,
    items: [
      {
        id: '14-1',
        parentId: 14,
        element: Client,
        label: "Mijozlar ro'yxati",
        isPrivate: true,
        path: '/client/list',
        role: ['admin'],
      },
      {
        id: '14-2',
        parentId: 14,
        element: ClientInvoice,
        label: 'Hisob-fakturalar',
        isPrivate: true,
        path: '/client/invoice',
        role: ['admin'],
      },
      {
        id: '14-3',
        parentId: 14,
        element: ClientPayment,
        label: "To'lovlar",
        isPrivate: true,
        path: '/client/payment',
        role: ['admin'],
      },
    ],
  },
  {
    id: 15,
    element: ClientInvoiceCreate,
    label: 'Create',
    path: '/clientinvoice/create',
    isPrivate: true,
    hidden: true,
    role: ['admin'],
  },
  {
    id: 16,
    element: ClientInvoiceRecordPayment,
    label: 'Pay',
    path: '/clientinvoice/pay/:id',
    isPrivate: true,
    hidden: true,
    role: ['admin'],
  },
  {
    id: 17,
    element: ClientInvoiceUpdate,
    label: 'Create',
    path: '/clientinvoice/update/:id',
    isPrivate: true,
    hidden: true,
    role: ['admin'],
  },
  {
    id: 18,
    element: ClientInvoiceRead,
    label: 'Read',
    path: '/clientinvoice/read/:id',
    isPrivate: true,
    hidden: true,
    role: ['admin'],
  },
  {
    id: 3,
    title: 'Xodimlar',
    path: '/employee',
    isPrivate: true,
    role: ['admin'],
    icon: UserOutlined,
    hidden: false,
    items: [
      {
        id: '3-1',
        parentId: 3,
        element: Employee,
        label: "Xodimlar ro'yxati",
        path: '/employee',
        isPrivate: true,
        role: ['admin'],
      },
      {
        id: '3-2',
        parentId: 3,
        element: Position,
        label: 'Lavozim',
        path: '/employee/position',
        isPrivate: true,
        role: ['admin'],
      },
      {
        id: '3-3',
        parentId: 3,
        element: EmployeeAttendance,
        label: 'Davomat',
        path: '/employee/attendance',
        isPrivate: true,
        role: ['admin'],
      },
    ],
  },
  {
    id: 13,
    title: 'Sozlamalar',
    path: null,
    isPrivate: true,
    role: ['admin'],
    icon: SettingOutlined,
    hidden: false,
    items: [
      {
        id: '13-1',
        parentId: 13,
        element: Taxes,
        label: 'Soliqlar',
        path: '/taxes',
        isPrivate: true,
        role: ['admin'],
      },
    ],
  },
];

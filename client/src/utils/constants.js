// Order status options
export const ORDER_STATUSES = {
  SUBMITTED: 'submitted',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUSES.SUBMITTED]: 'Submitted',
  [ORDER_STATUSES.IN_PROGRESS]: 'In Progress',
  [ORDER_STATUSES.COMPLETED]: 'Completed',
  [ORDER_STATUSES.CANCELLED]: 'Cancelled',
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUSES.SUBMITTED]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUSES.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUSES.COMPLETED]: 'bg-green-100 text-green-800',
  [ORDER_STATUSES.CANCELLED]: 'bg-gray-100 text-gray-800',
};

// Checkout status options
export const CHECKOUT_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DENIED: 'denied',
  RETURNED: 'returned',
};

export const CHECKOUT_STATUS_LABELS = {
  [CHECKOUT_STATUSES.PENDING]: 'Pending',
  [CHECKOUT_STATUSES.APPROVED]: 'Approved',
  [CHECKOUT_STATUSES.DENIED]: 'Denied',
  [CHECKOUT_STATUSES.RETURNED]: 'Returned',
};

export const CHECKOUT_STATUS_COLORS = {
  [CHECKOUT_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800',
  [CHECKOUT_STATUSES.APPROVED]: 'bg-green-100 text-green-800',
  [CHECKOUT_STATUSES.DENIED]: 'bg-red-100 text-red-800',
  [CHECKOUT_STATUSES.RETURNED]: 'bg-gray-100 text-gray-800',
};

// Equipment status options
export const EQUIPMENT_STATUSES = {
  AVAILABLE: 'available',
  CHECKED_OUT: 'checked_out',
  MAINTENANCE: 'maintenance',
  RETIRED: 'retired',
};

export const EQUIPMENT_STATUS_LABELS = {
  [EQUIPMENT_STATUSES.AVAILABLE]: 'Available',
  [EQUIPMENT_STATUSES.CHECKED_OUT]: 'Checked Out',
  [EQUIPMENT_STATUSES.MAINTENANCE]: 'Maintenance',
  [EQUIPMENT_STATUSES.RETIRED]: 'Retired',
};

export const EQUIPMENT_STATUS_COLORS = {
  [EQUIPMENT_STATUSES.AVAILABLE]: 'bg-green-100 text-green-800',
  [EQUIPMENT_STATUSES.CHECKED_OUT]: 'bg-blue-100 text-blue-800',
  [EQUIPMENT_STATUSES.MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
  [EQUIPMENT_STATUSES.RETIRED]: 'bg-gray-100 text-gray-800',
};

// Service categories
export const SERVICE_CATEGORIES = [
  '3D Printing',
  'Laser Cutting',
  'Electronics',
  'Support',
  'General Tools',
];

// Service types
export const SERVICE_TYPES = {
  MATERIAL: 'material',
  SERVICE: 'service',
};

// Price types
export const PRICE_TYPES = {
  FIXED: 'fixed',
  PER_UNIT: 'per_unit',
};
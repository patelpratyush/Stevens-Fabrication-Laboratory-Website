import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  CHECKOUT_STATUS_LABELS,
  CHECKOUT_STATUS_COLORS,
  EQUIPMENT_STATUS_LABELS,
  EQUIPMENT_STATUS_COLORS,
} from '@/utils/constants';

export default function StatusBadge({ type, status }) {
  let label, colorClass;

  switch (type) {
    case 'order':
      label = ORDER_STATUS_LABELS[status] || status;
      colorClass = ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
      break;
    case 'checkout':
      label = CHECKOUT_STATUS_LABELS[status] || status;
      colorClass = CHECKOUT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
      break;
    case 'equipment':
      label = EQUIPMENT_STATUS_LABELS[status] || status;
      colorClass = EQUIPMENT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
      break;
    default:
      label = status;
      colorClass = 'bg-gray-100 text-gray-800';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}
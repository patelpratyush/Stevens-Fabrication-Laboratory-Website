export default function StatusBadge({ status, type = 'order' }) {
  const getStyles = () => {
    if (type === 'order') {
      const orderStyles = {
        submitted: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-yellow-100 text-yellow-800',
        ready: 'bg-green-100 text-green-800',
        completed: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800',
      };
      return orderStyles[status] || 'bg-gray-100 text-gray-800';
    }

    if (type === 'equipment') {
      const equipmentStyles = {
        available: 'bg-green-100 text-green-800',
        checked_out: 'bg-blue-100 text-blue-800',
        maintenance: 'bg-yellow-100 text-yellow-800',
        offline: 'bg-red-100 text-red-800',
      };
      return equipmentStyles[status] || 'bg-gray-100 text-gray-800';
    }

    if (type === 'checkout') {
      const checkoutStyles = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        denied: 'bg-red-100 text-red-800',
        returned: 'bg-gray-100 text-gray-800',
      };
      return checkoutStyles[status] || 'bg-gray-100 text-gray-800';
    }

    return 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status) => {
    if (!status) return '';
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span
      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStyles()}`}
    >
      {formatStatus(status)}
    </span>
  );
}

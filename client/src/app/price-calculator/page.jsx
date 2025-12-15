'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useServices } from '@/hooks/useServices';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';

export default function PriceCalculatorPage() {
  const { services, loading } = useServices();
  const router = useRouter();

  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [savedItems, setSavedItems] = useState([]);

  // Filter services by category
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  // Calculate price when service or quantity changes
  useEffect(() => {
    if (selectedService && quantity > 0) {
      const price = selectedService.pricePerUnit * quantity;
      setCalculatedPrice(price);
    } else {
      setCalculatedPrice(0);
    }
  }, [selectedService, quantity]);

  function handleServiceSelect(service) {
    setSelectedService(service);
    setQuantity(1);
  }

  function handleQuantityChange(value) {
    const newQuantity = Math.max(1, parseInt(value) || 1);
    setQuantity(newQuantity);
  }

  function handleAddToEstimate() {
    if (!selectedService) return;

    const newItem = {
      id: Date.now(),
      serviceName: selectedService.name,
      category: selectedService.category,
      pricePerUnit: selectedService.pricePerUnit,
      unitLabel: selectedService.unitLabel,
      quantity: quantity,
      total: calculatedPrice,
    };

    setSavedItems([...savedItems, newItem]);

    // Reset selection
    setSelectedService(null);
    setQuantity(1);
  }

  function handleRemoveItem(id) {
    setSavedItems(savedItems.filter(item => item.id !== id));
  }

  function handleClearAll() {
    setSavedItems([]);
  }

  const grandTotal = savedItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Price Calculator</h1>
      <p className="text-gray-600 mb-8">
        Estimate the cost of your project by selecting services and quantities
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Select Services</h2>

            {loading ? (
              <LoadingSpinner text="Loading services..." />
            ) : services.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No services available</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-stevens-maroon mb-3">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryServices.map((service) => (
                        <button
                          key={service._id}
                          onClick={() => handleServiceSelect(service)}
                          className={`text-left border-2 rounded-lg p-4 transition ${
                            selectedService?._id === service._id
                              ? 'border-stevens-maroon bg-red-50'
                              : 'border-gray-200 hover:border-stevens-maroon'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{service.name}</h4>
                            <div className="text-right">
                              <p className="font-semibold text-stevens-maroon text-sm">
                                {formatCurrency(service.pricePerUnit)}
                              </p>
                              <p className="text-xs text-gray-500">per {service.unitLabel}</p>
                            </div>
                          </div>
                          {service.description && (
                            <p className="text-xs text-gray-600">{service.description}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calculator */}
          {selectedService && (
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Calculate Price</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Service
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-900">{selectedService.name}</p>
                    <p className="text-sm text-gray-600">{selectedService.category}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity ({selectedService.unitLabel})
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-32 px-4 py-2 border-2 border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:border-stevens-maroon"
                      min="1"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium text-gray-700">Estimated Cost:</span>
                    <span className="text-3xl font-bold text-stevens-maroon">
                      {formatCurrency(calculatedPrice)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <p>
                      {formatCurrency(selectedService.pricePerUnit)} × {quantity} {selectedService.unitLabel}
                      {quantity > 1 ? 's' : ''} = {formatCurrency(calculatedPrice)}
                    </p>
                  </div>

                  <button
                    onClick={handleAddToEstimate}
                    className="w-full px-6 py-3 bg-stevens-maroon text-white rounded-lg hover:bg-red-800 font-semibold transition"
                  >
                    Add to Estimate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Estimate Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Estimate</h2>
              {savedItems.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              )}
            </div>

            {savedItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-500 text-sm">
                  Add services to see your estimate
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {savedItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.serviceName}</p>
                          <p className="text-xs text-gray-600">{item.category}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 text-lg"
                        >
                          ×
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {formatCurrency(item.pricePerUnit)} × {item.quantity} {item.unitLabel}
                        {item.quantity > 1 ? 's' : ''}
                      </div>
                      <div className="text-right text-sm font-semibold text-stevens-maroon">
                        {formatCurrency(item.total)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Estimate:</span>
                    <span className="text-2xl font-bold text-stevens-maroon">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/orders')}
                    className="w-full px-6 py-3 bg-stevens-maroon text-white rounded-lg hover:bg-red-800 font-semibold transition"
                  >
                    Create Order
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    This is an estimate. Final price will be calculated when you submit your order.
                  </p>
                </div>
              </>
            )}

            {/* Price Notes */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Pricing Notes
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Prices shown are base rates</li>
                <li>• Additional fees may apply for complex designs</li>
                <li>• Rush orders incur a 25% surcharge</li>
                <li>• Contact staff for bulk discounts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 How to Use the Price Calculator
        </h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Select a service from the categories above</li>
          <li>Enter the quantity you need</li>
          <li>Click "Add to Estimate" to save it</li>
          <li>Repeat for multiple services</li>
          <li>Review your total estimate on the right</li>
          <li>Click "Create Order" when ready to proceed</li>
        </ol>
      </div>
    </section>
  );
}

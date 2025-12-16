'use client';

import { useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { useMyOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { StudentOnly } from '@/components/shared/ProtectedRoute';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function OrdersPage() {

    return (
    <StudentOnly staffRedirect="/staff/orders">
      <OrdersContent />
    </StudentOnly>
  );
}
function OrdersContent() {
  const { services, loading: servicesLoading } = useServices();
  const { orders, loading: ordersLoading, refetch: refetchOrders } = useMyOrders();
  const { user } = useAuth();

  // Cart state
  const [cart, setCart] = useState([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Add item to cart
  function handleAddToCart(service) {
    const existingItem = cart.find(item => item.serviceId === service._id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.serviceId === service._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        serviceId: service._id,
        serviceName: service.name,
        pricePerUnit: service.pricePerUnit || service.basePrice || 0,
        unitLabel: service.unitLabel || 'unit',
        quantity: 1,
      }]);
    }
  }

  // Remove item from cart
  function handleRemoveFromCart(serviceId) {
    setCart(cart.filter(item => item.serviceId !== serviceId));
  }

  // Update quantity
  function handleUpdateQuantity(serviceId, newQuantity) {
    if (newQuantity < 1) {
      handleRemoveFromCart(serviceId);
      return;
    }

    setCart(cart.map(item =>
      item.serviceId === serviceId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  }

  // Handle file selection
  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files || []);
    console.log('📎 Files selected:', selectedFiles);
    setFiles(selectedFiles);
  }

  // Calculate total
  const totalPrice = cart.reduce((sum, item) => {
    return sum + (item.pricePerUnit * item.quantity);
  }, 0);

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  // Upload files to Firebase Storage
  async function uploadFiles(files) {
    console.log('Starting file upload...', { fileCount: files.length, user: user?.uid });
    
    if (!files || files.length === 0) {
      console.log('No files to upload');
      return [];
    }

    if (!user || !user.uid) {
      console.error('No user UID available');
      throw new Error('User not authenticated');
    }

    const uploadPromises = files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const filePath = `orders/${user.uid}/${fileName}`;
        
        console.log(`📤 Uploading file ${index + 1}/${files.length}:`, { fileName, filePath, size: file.size });
        
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log(`Upload progress for ${file.name}: ${progress}%`);
            setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
          },
          (error) => {
            console.error(`Upload error for ${file.name}:`, error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log(`Upload complete for ${file.name}:`, downloadURL);
              
              resolve({
                url: downloadURL,
                name: file.name,
                size: file.size,
                type: file.type,
              });
            } catch (error) {
              console.error(`Error getting download URL for ${file.name}:`, error);
              reject(error);
            }
          }
        );
      });
    });

    const results = await Promise.all(uploadPromises);
    console.log('All files uploaded successfully:', results);
    return results;
  }

  // Submit order
  async function handleSubmitOrder() {
    console.log('🚀 Starting order submission...');
    
    if (cart.length === 0) {
      setSubmitError('Please add at least one item to your cart');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError('');
      setUploadProgress({});

      // Upload files to Firebase Storage
      console.log('Uploading files...', files);
      const uploadedFiles = await uploadFiles(files);
      console.log('Files uploaded:', uploadedFiles);

      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          quantity: item.quantity,
          unitPrice: item.pricePerUnit,
          lineTotal: item.pricePerUnit * item.quantity,
        })),
        files: uploadedFiles,
        notes: orderNotes,
      };

      console.log('Submitting order:', orderData);

      // Submit order
      const token = await user.getIdToken();
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Order submission failed:', data);
        throw new Error(data.error || 'Failed to submit order');
      }

      const result = await response.json();
      console.log('Order submitted successfully:', result);

      // Success!
      setSubmitSuccess(`Order ${result.order.orderNumber} submitted successfully!`);
      setCart([]);
      setOrderNotes('');
      setFiles([]);
      setUploadProgress({});
      await refetchOrders();

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitSuccess(''), 5000);

    } catch (error) {
      console.error('❌ Order submission error:', error);
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Create an Order</h1>
      <p className="text-gray-600 mb-8">
        Browse services, estimate costs, and submit your order with design files
      </p>

      {/* Success/Error Messages */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">{submitSuccess}</p>
        </div>
      )}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Available Services</h2>

            {servicesLoading ? (
              <LoadingSpinner text="Loading services..." />
            ) : services.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No services available</p>
            ) : (
              <div className="space-y-6">
                {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-stevens-maroon mb-3">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoryServices.map((service) => (
                        <div
                          key={service._id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-stevens-maroon transition"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{service.name}</h4>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-stevens-maroon text-sm">
                                {formatCurrency(service.pricePerUnit || service.basePrice || 0)}
                              </p>
                              <p className="text-xs text-gray-500">per {service.unitLabel || 'unit'}</p>
                            </div>
                          </div>
                          {service.description && (
                            <p className="text-xs text-gray-600 mb-3">{service.description}</p>
                          )}
                          <button
                            onClick={() => handleAddToCart(service)}
                            className="w-full px-4 py-2 bg-stevens-maroon text-white rounded hover:bg-red-800 text-sm font-medium transition"
                          >
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Orders</h2>

            {ordersLoading ? (
              <LoadingSpinner text="Loading orders..." />
            ) : orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <StatusBadge type="order" status={order.status} />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {order.items?.length || 0} item(s)
                      </span>
                      <span className="font-semibold text-stevens-maroon">
                        {formatCurrency(order.totalPrice || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart & Checkout */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

            {cart.length > 0 && (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div
                      key={item.serviceId}
                      className="border border-gray-200 rounded p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-sm">{item.serviceName}</p>
                        <button
                          onClick={() => handleRemoveFromCart(item.serviceId)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.serviceId, item.quantity - 1)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.serviceId, parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                          min="1"
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.serviceId, item.quantity + 1)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
                        >
                          +
                        </button>
                        <span className="text-xs text-gray-500">{item.unitLabel}</span>
                      </div>
                      <div className="text-right text-sm font-semibold text-stevens-maroon">
                        {formatCurrency(item.pricePerUnit * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* File Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Design Files
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.stl,.svg,.ai,.dxf,.png,.jpg,.jpeg"
                    className="w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-stevens-maroon file:text-white
                      hover:file:bg-red-800
                      file:cursor-pointer cursor-pointer"
                  />
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 truncate">{file.name}</span>
                          {uploadProgress[file.name] !== undefined && (
                            <span className="text-stevens-maroon ml-2">
                              {uploadProgress[file.name]}%
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Order Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Any special instructions or requirements..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                  />
                </div>

                {/* Total */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-stevens-maroon">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitOrder}
                  disabled={submitting || cart.length === 0}
                  className="w-full px-6 py-3 bg-stevens-maroon text-white rounded-lg hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition"
                >
                  {submitting ? 'Submitting...' : 'Submit Order'}
                </button>

                {/* Debug Info */}
                <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                  <p className="font-semibold mb-1">Debug Info:</p>
                  <p>Files selected: {files.length}</p>
                  <p>User UID: {user?.uid || 'Not available'}</p>
                  <p>Storage available: {storage ? 'Yes' : 'No'}</p>
                </div>
              </>
            )}

            {cart.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🛒</div>
                <p className="text-gray-500 text-sm mb-4">
                  Your cart is empty
                </p>
                <p className="text-xs text-gray-400">
                  Add services from the left to estimate costs and create your order
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
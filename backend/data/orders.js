import { ObjectId } from 'mongodb';
import { orders, services } from '../config/mongoCollections.js';

export async function getAllOrders() {
  const ordersCollection = await orders();
  return await ordersCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getOrdersByUser(firebaseUid) {
  const ordersCollection = await orders();
  return await ordersCollection
    .find({ firebaseUid })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getOrderById(orderId) {
  const ordersCollection = await orders();
  return await ordersCollection.findOne({ _id: new ObjectId(orderId) });
}

export async function createOrder(firebaseUid, userId, orderData) {
  const { items, files, notes } = orderData;
  const servicesCollection = await services();
  const ordersCollection = await orders();

  // Calculate price
  let totalPrice = 0;
  for (const item of items) {
    const service = await servicesCollection.findOne({
      _id: new ObjectId(item.serviceId)
    });
    if (service) {
      const lineTotal = (service.pricePerUnit || 0) * (item.quantity || 1);
      item.unitPrice = lineTotal / item.quantity;
      item.lineTotal = lineTotal;
      totalPrice += lineTotal;
    }
  }

  // Generate order number
  const orderCount = await ordersCollection.countDocuments();
  const orderNumber = `FAB-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, '0')}`;

  const order = {
    orderNumber,
    firebaseUid,
    userId,
    items,
    files: files || [],
    totalPrice,
    status: 'submitted',
    notes: notes || '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await ordersCollection.insertOne(order);
  return order;
}

export async function updateOrder(orderId, updates) {
  const ordersCollection = await orders();
  
  delete updates._id;
  delete updates.createdAt;
  delete updates.orderNumber;
  
  updates.updatedAt = new Date();
  
  return await ordersCollection.findOneAndUpdate(
    { _id: new ObjectId(orderId) },
    { $set: updates },
    { returnDocument: 'after' }
  );
}

export async function deleteOrder(orderId) {
  const ordersCollection = await orders();
  return await ordersCollection.deleteOne({ _id: new ObjectId(orderId) });
}
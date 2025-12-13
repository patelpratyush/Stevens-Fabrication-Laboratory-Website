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

  // Generate timestamp-based order number
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  // Generate 4-character random suffix (uppercase alphanumeric)
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();

  const orderNumber = `FAB-${year}${month}${day}-${hours}${minutes}-${randomSuffix}`;

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

  const result = await ordersCollection.insertOne(order);


  if (!result.acknowledged || !result.insertedId) {
    throw new Error("Order insertion failed");
  }

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
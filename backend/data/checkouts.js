import { ObjectId } from 'mongodb';
import { checkouts, equipment } from '../config/mongoCollections.js';

export async function getAllCheckouts() {
  const checkoutsCollection = await checkouts();
  return await checkoutsCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getPendingCheckouts() {
  const checkoutsCollection = await checkouts();
  return await checkoutsCollection
    .find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getApprovedCheckouts() {
  const checkoutsCollection = await checkouts();
  return await checkoutsCollection
    .find({ status: 'approved' })
    .sort({ checkoutDate: -1 })
    .toArray();
}

export async function getCheckoutsByUser(firebaseUid) {
  const checkoutsCollection = await checkouts();
  return await checkoutsCollection
    .find({ firebaseUid })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getCheckoutById(checkoutId) {
  const checkoutsCollection = await checkouts();
  return await checkoutsCollection.findOne({ _id: new ObjectId(checkoutId) });
}

// Student creates checkout request (pending status)
export async function createCheckoutRequest(checkoutData) {
  const { equipmentId, firebaseUid, dueDate, notes } = checkoutData;
  
  const checkoutsCollection = await checkouts();
  const equipmentCollection = await equipment();

  // Check if equipment exists and is available
  const equipmentItem = await equipmentCollection.findOne({
    _id: new ObjectId(equipmentId)
  });

  if (!equipmentItem) {
    throw new Error('Equipment not found');
  }

  if (equipmentItem.status !== 'available') {
    throw new Error('Equipment is not available for checkout requests');
  }

  const checkout = {
    equipmentId: new ObjectId(equipmentId),
    firebaseUid: firebaseUid,
    requestDate: new Date(),
    dueDate: new Date(dueDate),
    checkoutDate: null,
    returnedDate: null,
    status: 'pending', // pending, approved, denied, returned
    notes: notes || '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await checkoutsCollection.insertOne(checkout);
  return checkout;
}

// Staff approves checkout request
export async function approveCheckout(checkoutId) {
  const checkoutsCollection = await checkouts();
  const equipmentCollection = await equipment();

  const checkout = await checkoutsCollection.findOne({
    _id: new ObjectId(checkoutId)
  });

  if (!checkout) {
    throw new Error('Checkout not found');
  }

  if (checkout.status !== 'pending') {
    throw new Error('Only pending checkouts can be approved');
  }

  // Check if equipment is still available
  const equipmentItem = await equipmentCollection.findOne({
    _id: checkout.equipmentId
  });

  if (!equipmentItem) {
    throw new Error('Equipment not found');
  }

  if (equipmentItem.status !== 'available') {
    // Equipment is no longer available - auto-deny this checkout
    await checkoutsCollection.updateOne(
      { _id: new ObjectId(checkoutId) },
      { 
        $set: { 
          status: 'denied',
          denialReason: `Equipment is now ${equipmentItem.status}`,
          updatedAt: new Date() 
        } 
      }
    );
    throw new Error(`Equipment is no longer available (status: ${equipmentItem.status})`);
  }

  // Check if there are other pending checkouts for this equipment that were requested earlier
  const earlierPendingCheckouts = await checkoutsCollection.find({
    equipmentId: checkout.equipmentId,
    status: 'pending',
    createdAt: { $lt: checkout.createdAt },
    _id: { $ne: checkout._id }
  }).toArray();

  if (earlierPendingCheckouts.length > 0) {
    throw new Error('There are earlier pending requests for this equipment. Please review those first.');
  }

  // Update checkout status to approved and set checkout date
  const result = await checkoutsCollection.findOneAndUpdate(
    { _id: new ObjectId(checkoutId) },
    { 
      $set: { 
        status: 'approved',
        checkoutDate: new Date(),
        updatedAt: new Date() 
      } 
    },
    { returnDocument: 'after' }
  );

  // Update equipment status to checked_out
  await equipmentCollection.updateOne(
    { _id: checkout.equipmentId },
    {
      $set: {
        status: 'checked_out',
        updatedAt: new Date()
      }
    }
  );

  // Auto-deny all other pending checkouts for this equipment
  await checkoutsCollection.updateMany(
    {
      equipmentId: checkout.equipmentId,
      status: 'pending',
      _id: { $ne: checkout._id }
    },
    {
      $set: {
        status: 'denied',
        denialReason: 'Equipment was checked out to another student',
        updatedAt: new Date()
      }
    }
  );

  return result;
}

// Staff denies checkout request
export async function denyCheckout(checkoutId, denialReason) {
  const checkoutsCollection = await checkouts();

  const checkout = await checkoutsCollection.findOne({
    _id: new ObjectId(checkoutId)
  });

  if (!checkout) {
    throw new Error('Checkout not found');
  }

  if (checkout.status !== 'pending') {
    throw new Error('Only pending checkouts can be denied');
  }

  const result = await checkoutsCollection.findOneAndUpdate(
    { _id: new ObjectId(checkoutId) },
    { 
      $set: { 
        status: 'denied',
        denialReason: denialReason || '',
        updatedAt: new Date() 
      } 
    },
    { returnDocument: 'after' }
  );

  return result;
}

export async function updateCheckout(checkoutId, updates) {
  const checkoutsCollection = await checkouts();
  const equipmentCollection = await equipment();

  // Remove fields that shouldn't be updated directly
  delete updates._id;
  delete updates.createdAt;
  delete updates.equipmentId;
  delete updates.status; // Status should be changed through approve/deny/return functions

  updates.updatedAt = new Date();

  // Convert date strings to Date objects
  if (updates.dueDate) {
    updates.dueDate = new Date(updates.dueDate);
  }

  const checkout = await checkoutsCollection.findOne({
    _id: new ObjectId(checkoutId)
  });

  if (!checkout) {
    throw new Error('Checkout not found');
  }

  const result = await checkoutsCollection.findOneAndUpdate(
    { _id: new ObjectId(checkoutId) },
    { $set: updates },
    { returnDocument: 'after' }
  );

  return result;
}

// Mark checkout as returned
export async function returnCheckout(checkoutId) {
  const checkoutsCollection = await checkouts();
  const equipmentCollection = await equipment();

  const checkout = await checkoutsCollection.findOne({
    _id: new ObjectId(checkoutId)
  });

  if (!checkout) {
    throw new Error('Checkout not found');
  }

  if (checkout.status !== 'approved') {
    throw new Error('Only approved checkouts can be returned');
  }

  const result = await checkoutsCollection.findOneAndUpdate(
    { _id: new ObjectId(checkoutId) },
    { 
      $set: { 
        status: 'returned',
        returnedDate: new Date(),
        updatedAt: new Date() 
      } 
    },
    { returnDocument: 'after' }
  );

  // Update equipment status back to available
  await equipmentCollection.updateOne(
    { _id: checkout.equipmentId },
    {
      $set: {
        status: 'available',
        updatedAt: new Date()
      }
    }
  );

  return result;
}

export async function deleteCheckout(checkoutId) {
  const checkoutsCollection = await checkouts();
  return await checkoutsCollection.deleteOne({ _id: new ObjectId(checkoutId) });
}
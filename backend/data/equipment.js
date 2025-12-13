import { ObjectId } from "mongodb";
import { equipment, checkouts } from "../config/mongoCollections.js";

export async function getAllActiveEquipment() {
  const equipmentCollection = await equipment();
  return await equipmentCollection.find({ active: true }).toArray();
}

export async function getAllEquipment() {
  const equipmentCollection = await equipment();
  return await equipmentCollection.find({}).toArray();
}

export async function getEquipmentById(equipmentId) {
  const equipmentCollection = await equipment();
  return await equipmentCollection.findOne({ _id: new ObjectId(equipmentId) });
}

export async function createEquipment(equipmentData) {
  const equipmentCollection = await equipment();

  const equipmentItem = {
    ...equipmentData,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await equipmentCollection.insertOne(equipmentItem);
  equipmentItem._id = result.insertedId;

  return equipmentItem;
}

// Auto-deny pending checkouts for equipment
async function autoDenyPendingCheckouts(equipmentId, reason) {
  const checkoutsCollection = await checkouts();

  const pendingCheckouts = await checkoutsCollection
    .find({
      equipmentId: new ObjectId(equipmentId),
      status: "pending",
    })
    .toArray();

  if (pendingCheckouts.length > 0) {
    await checkoutsCollection.updateMany(
      {
        equipmentId: new ObjectId(equipmentId),
        status: "pending",
      },
      {
        $set: {
          status: "denied",
          denialReason: reason,
          updatedAt: new Date(),
        },
      }
    );
  }

  return pendingCheckouts.length;
}

export async function updateEquipment(equipmentId, updates) {
  const equipmentCollection = await equipment();

  delete updates._id;
  delete updates.createdAt;

  updates.updatedAt = new Date();

  // If equipment is being set to unavailable status, auto-deny pending checkouts
  if (
    updates.status &&
    ["maintenance", "retired", "checked_out"].includes(updates.status)
  ) {
    const denialReasons = {
      maintenance: "Equipment is now under maintenance",
      retired: "Equipment has been retired from service",
      checked_out: "Equipment was checked out to another student",
    };

    await autoDenyPendingCheckouts(equipmentId, denialReasons[updates.status]);
  }

  return await equipmentCollection.findOneAndUpdate(
    { _id: new ObjectId(equipmentId) },
    { $set: updates },
    { returnDocument: "after" }
  );
}

export async function updateEquipmentStatus(equipmentId, status) {
  const equipmentCollection = await equipment();

  // Auto-deny pending checkouts if status is not available
  if (["maintenance", "retired", "checked_out"].includes(status)) {
    const denialReasons = {
      maintenance: "Equipment is now under maintenance",
      retired: "Equipment has been retired from service",
      checked_out: "Equipment was checked out to another student",
    };

    await autoDenyPendingCheckouts(equipmentId, denialReasons[status]);
  }

  return await equipmentCollection.findOneAndUpdate(
    { _id: new ObjectId(equipmentId) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );
}

export async function deleteEquipment(equipmentId) {
  const equipmentCollection = await equipment();

  // Auto-deny any pending checkouts
  await autoDenyPendingCheckouts(
    equipmentId,
    "Equipment has been removed from inventory"
  );

  return await equipmentCollection.updateOne(
    { _id: new ObjectId(equipmentId) },
    { $set: { active: false, updatedAt: new Date() } }
  );
}

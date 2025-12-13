import { ObjectId } from 'mongodb';
import { equipment } from '../config/mongoCollections.js';

export async function getAllActiveEquipment() {
  const equipmentCollection = await equipment();
  return await equipmentCollection
    .find({ active: true })
    .toArray();
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
    updatedAt: new Date()
  };

  const result = await equipmentCollection.insertOne(equipmentItem);
  equipmentItem._id = result.insertedId;
  
  return equipmentItem;
}

export async function updateEquipment(equipmentId, updates) {
  const equipmentCollection = await equipment();

  delete updates._id;
  delete updates.createdAt;

  updates.updatedAt = new Date();

  return await equipmentCollection.findOneAndUpdate(
    { _id: new ObjectId(equipmentId) },
    { $set: updates },
    { returnDocument: 'after' }
  );
}

export async function updateEquipmentStatus(equipmentId, status) {
  const equipmentCollection = await equipment();
  
  return await equipmentCollection.findOneAndUpdate(
    { _id: new ObjectId(equipmentId) },
    { 
      $set: { 
        status,
        updatedAt: new Date() 
      } 
    },
    { returnDocument: 'after' }
  );
}

export async function deleteEquipment(equipmentId) {
  const equipmentCollection = await equipment();
  return await equipmentCollection.updateOne(
    { _id: new ObjectId(equipmentId) },
    { $set: { active: false, updatedAt: new Date() } }
  );
}
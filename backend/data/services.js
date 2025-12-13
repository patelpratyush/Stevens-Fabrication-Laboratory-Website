import { ObjectId } from 'mongodb';
import { services } from '../config/mongoCollections.js';

export async function getAllActiveServices() {
  const servicesCollection = await services();
  return await servicesCollection
    .find({ active: true })
    .toArray();
}

export async function getAllServices() {
  const servicesCollection = await services();
  return await servicesCollection.find({}).toArray();
}

export async function getServiceById(serviceId) {
  const servicesCollection = await services();
  return await servicesCollection.findOne({ _id: new ObjectId(serviceId) });
}

export async function createService(serviceData) {
  const {
    name,
    category,
    type,
    status,
    description,
    priceType,
    basePrice,
    pricePerUnit,
    unitLabel,
    laserMetadata
  } = serviceData;

  const servicesCollection = await services();

  const service = {
    name,
    category,
    type,
    status: status || 'available',
    description,
    priceType,
    basePrice: basePrice || 0,
    pricePerUnit: pricePerUnit || 0,
    unitLabel,
    laserMetadata: laserMetadata || {},
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await servicesCollection.insertOne(service);
  service._id = result.insertedId;
  
  return service;
}

export async function updateService(serviceId, updates) {
  const servicesCollection = await services();

  delete updates._id;
  delete updates.createdAt;

  updates.updatedAt = new Date();

  return await servicesCollection.findOneAndUpdate(
    { _id: new ObjectId(serviceId) },
    { $set: updates },
    { returnDocument: 'after' }
  );
}

export async function deleteService(serviceId) {
  const servicesCollection = await services();
  return await servicesCollection.updateOne(
    { _id: new ObjectId(serviceId) },
    { $set: { active: false, updatedAt: new Date() } }
  );
}
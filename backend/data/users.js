import { users } from '../config/mongoCollections.js';

export async function getUserByFirebaseUid(firebaseUid) {
  const usersCollection = await users();
  return await usersCollection.findOne({ firebaseUid });
}

export async function createUser(userData) {
  const usersCollection = await users();
  const user = {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  await usersCollection.insertOne(user);
  return user;
}

export async function updateUser(firebaseUid, updates) {
  const usersCollection = await users();
  delete updates._id;
  delete updates.createdAt;
  delete updates.firebaseUid;
  
  updates.updatedAt = new Date();
  
  return await usersCollection.findOneAndUpdate(
    { firebaseUid },
    { $set: updates },
    { returnDocument: 'after' }
  );
}

export async function getAllUsers() {
  const usersCollection = await users();
  return await usersCollection.find({}).toArray();
}
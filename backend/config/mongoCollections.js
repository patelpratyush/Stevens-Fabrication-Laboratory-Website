import { getDB } from './mongoConnection.js';

const getCollectionFn = (collectionName) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = getDB();
      _col = db.collection(collectionName);
    }
    return _col;
  };
};

export const users = getCollectionFn('users');
export const services = getCollectionFn('services');
export const orders = getCollectionFn('orders');
export const equipment = getCollectionFn('equipment');
export const checkouts = getCollectionFn('checkouts');
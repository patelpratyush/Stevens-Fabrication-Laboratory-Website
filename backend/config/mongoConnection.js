import { MongoClient } from "mongodb";
import { settings } from "./settings.js";

let _connection = undefined;
let _db = undefined;

export const connectToMongo = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(settings.mongodb.uri);
    _db = _connection.db(settings.mongodb.dbName);
    console.log("✓ MongoDB connected");
  }
  return _db;
};

export const getDB = () => {
  if (!_db) {
    throw new Error("Database not connected. Call connectToMongo first.");
  }
  return _db;
};

export const closeConnection = async () => {
  if (_connection) {
    await _connection.close();
    _connection = undefined;
    _db = undefined;
    console.log("✓ MongoDB disconnected");
  }
};

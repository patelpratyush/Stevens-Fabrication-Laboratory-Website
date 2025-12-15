import { connectToMongo, closeConnection } from '../config/mongoConnection.js';
import { equipment } from '../config/mongoCollections.js';

(async () => {
  try {
    await connectToMongo();
    const equipmentCollection = await equipment();
    const items = await equipmentCollection.find({}).limit(5).toArray();
    const count = await equipmentCollection.countDocuments();

    console.log('Equipment count:', count);
    console.log('\nSample equipment:');
    items.forEach(item => {
      console.log(`- ${item.name}: imageUrl=${item.imageUrl || 'NOT SET'}, thumbUrl=${item.thumbUrl || 'NOT SET'}`);
    });

    await closeConnection();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();

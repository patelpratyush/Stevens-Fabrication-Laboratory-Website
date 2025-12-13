import { processEquipmentImage } from '../utils/imageProcessor.js';
import { equipment } from '../config/mongoCollections.js';
import { connectToMongo, closeMongoConnection } from '../config/mongoConnection.js';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Download image from URL to buffer
 */
async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    });
  });
}

/**
 * Process all equipment images from the database
 */
async function processAllEquipmentImages() {
  try {
    console.log('🔧 Processing Equipment Images...\n');

    await connectToMongo();
    const equipmentCollection = await equipment();

    // Find all equipment with images
    const equipmentList = await equipmentCollection
      .find({ imageUrl: { $exists: true, $ne: '' } })
      .toArray();

    console.log(`Found ${equipmentList.length} equipment items with images\n`);

    let processed = 0;
    let errors = 0;

    for (const item of equipmentList) {
      try {
        console.log(`Processing: ${item.name}...`);

        let imageBuffer;

        // Check if imageUrl is a URL or local path
        if (item.imageUrl.startsWith('http')) {
          console.log(`  Downloading from: ${item.imageUrl}`);
          imageBuffer = await downloadImage(item.imageUrl);
        } else {
          // Local file path
          console.log(`  Reading local file: ${item.imageUrl}`);
          imageBuffer = await fs.readFile(item.imageUrl);
        }

        // Generate a safe filename from equipment name
        const safeFileName = item.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        // Process the image
        const result = await processEquipmentImage(imageBuffer, safeFileName);

        // Update the equipment document with new paths
        await equipmentCollection.updateOne(
          { _id: item._id },
          {
            $set: {
              imageUrl: result.original,
              thumbUrl: result.thumbnail,
              updatedAt: new Date()
            }
          }
        );

        console.log(`  ✓ Saved optimized image and thumbnail\n`);
        processed++;

      } catch (error) {
        console.error(`  ✗ Error processing ${item.name}:`, error.message, '\n');
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  Processed: ${processed}`);
    console.log(`  Errors: ${errors}`);
    console.log(`  Total: ${equipmentList.length}`);

  } catch (error) {
    console.error('Failed to process equipment images:', error);
    process.exit(1);
  } finally {
    await closeMongoConnection();
  }
}

/**
 * Process a single equipment item by ID
 */
async function processSingleEquipment(equipmentId) {
  try {
    await connectToMongo();
    const equipmentCollection = await equipment();

    const item = await equipmentCollection.findOne({ _id: new ObjectId(equipmentId) });

    if (!item) {
      console.error('Equipment not found');
      process.exit(1);
    }

    if (!item.imageUrl) {
      console.error('Equipment has no image URL');
      process.exit(1);
    }

    console.log(`Processing: ${item.name}...`);

    const imageBuffer = item.imageUrl.startsWith('http')
      ? await downloadImage(item.imageUrl)
      : await fs.readFile(item.imageUrl);

    const safeFileName = item.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const result = await processEquipmentImage(imageBuffer, safeFileName);

    await equipmentCollection.updateOne(
      { _id: item._id },
      {
        $set: {
          imageUrl: result.original,
          thumbUrl: result.thumbnail,
          updatedAt: new Date()
        }
      }
    );

    console.log('✓ Image processed successfully');
    console.log(`  Original: ${result.original}`);
    console.log(`  Thumbnail: ${result.thumbnail}`);

  } catch (error) {
    console.error('Failed to process equipment image:', error);
    process.exit(1);
  } finally {
    await closeMongoConnection();
  }
}

// Run the script
const args = process.argv.slice(2);

if (args.length > 0) {
  // Process single equipment by ID
  processSingleEquipment(args[0]);
} else {
  // Process all equipment
  processAllEquipmentImages();
}

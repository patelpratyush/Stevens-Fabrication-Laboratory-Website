import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Process an equipment image - creates optimized version and thumbnail
 * @param {Buffer|string} inputImage - Image buffer or path to image file
 * @param {string} outputName - Base name for output files (without extension)
 * @returns {Promise<{original: string, thumbnail: string}>} - Paths to processed images
 */
export async function processEquipmentImage(inputImage, outputName) {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(__dirname, '../../uploads/equipment');
    await fs.mkdir(uploadsDir, { recursive: true });

    const basePath = join(uploadsDir, outputName);

    // Load the image
    const image = sharp(inputImage);
    const metadata = await image.metadata();

    // Generate optimized full-size image (max 1200px width, high quality)
    const optimizedPath = `${basePath}_optimized.jpg`;
    await image
      .resize(1200, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 90 })
      .toFile(optimizedPath);

    // Generate thumbnail (300px width)
    const thumbnailPath = `${basePath}_thumb.jpg`;
    await sharp(inputImage)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    console.log(`✓ Processed image: ${outputName}`);
    console.log(`  Original: ${metadata.width}x${metadata.height}`);
    console.log(`  Optimized: ${optimizedPath}`);
    console.log(`  Thumbnail: ${thumbnailPath}`);

    return {
      original: optimizedPath,
      thumbnail: thumbnailPath
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

/**
 * Process multiple equipment images in batch
 * @param {Array<{buffer: Buffer, name: string}>} images - Array of image objects
 * @returns {Promise<Array<{original: string, thumbnail: string}>>}
 */
export async function processBatchImages(images) {
  const results = [];

  for (const image of images) {
    const result = await processEquipmentImage(image.buffer, image.name);
    results.push(result);
  }

  return results;
}

/**
 * Generate thumbnail from existing image URL/path
 * Useful for equipment images already uploaded to Firebase Storage
 * @param {string} imageUrl - URL or path to existing image
 * @param {string} outputName - Name for thumbnail file
 * @returns {Promise<string>} - Path to thumbnail
 */
export async function generateThumbnail(imageUrl, outputName) {
  try {
    const uploadsDir = join(__dirname, '../../uploads/equipment/thumbs');
    await fs.mkdir(uploadsDir, { recursive: true });

    const thumbnailPath = join(uploadsDir, `${outputName}_thumb.jpg`);

    // If imageUrl is a Firebase URL, you'd need to fetch it first
    // For now, assuming it's a local path
    await sharp(imageUrl)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    console.log(`✓ Generated thumbnail: ${thumbnailPath}`);
    return thumbnailPath;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw new Error(`Thumbnail generation failed: ${error.message}`);
  }
}

/**
 * Optimize image for web display
 * @param {Buffer|string} inputImage - Image buffer or path
 * @param {Object} options - Resize/quality options
 * @returns {Promise<Buffer>} - Optimized image buffer
 */
export async function optimizeImage(inputImage, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 85,
    format = 'jpeg'
  } = options;

  try {
    let pipeline = sharp(inputImage).resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    });

    if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality });
    } else if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    }

    return await pipeline.toBuffer();
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw new Error(`Image optimization failed: ${error.message}`);
  }
}

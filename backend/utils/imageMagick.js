import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Process equipment image using ImageMagick CLI
 * @param {string} inputPath - Path to input image file
 * @param {string} outputName - Base name for output files
 * @returns {Promise<{original: string, thumbnail: string}>}
 */
export async function processImageWithMagick(inputPath, outputName) {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(__dirname, '../../uploads/equipment');
    await fs.mkdir(uploadsDir, { recursive: true });

    const optimizedPath = join(uploadsDir, `${outputName}_optimized.jpg`);
    const thumbnailPath = join(uploadsDir, `${outputName}_thumb.jpg`);

    // ImageMagick command for optimized image (1200px max width)
    const optimizeCmd = `convert "${inputPath}" -resize 1200x1200\\> -quality 90 "${optimizedPath}"`;

    // ImageMagick command for thumbnail (300x300 crop)
    const thumbCmd = `convert "${inputPath}" -resize 300x300^ -gravity center -extent 300x300 -quality 80 "${thumbnailPath}"`;

    console.log(`✓ Using ImageMagick CLI to process: ${outputName}`);

    // Execute ImageMagick commands
    await execAsync(optimizeCmd);
    console.log(`  ✓ Optimized image created: ${optimizedPath}`);

    await execAsync(thumbCmd);
    console.log(`  ✓ Thumbnail created: ${thumbnailPath}`);

    return {
      original: optimizedPath,
      thumbnail: thumbnailPath
    };
  } catch (error) {
    // Check if ImageMagick is installed
    if (error.message.includes('convert: not found') || error.message.includes('command not found')) {
      throw new Error(
        'ImageMagick is not installed. Install with: brew install imagemagick (macOS) or sudo apt-get install imagemagick (Linux)'
      );
    }
    throw new Error(`ImageMagick processing failed: ${error.message}`);
  }
}

/**
 * Check if ImageMagick is installed
 * @returns {Promise<boolean>}
 */
export async function checkImageMagick() {
  try {
    const { stdout } = await execAsync('convert -version');
    const version = stdout.split('\n')[0];
    console.log(`✓ ImageMagick found: ${version}`);
    return true;
  } catch (error) {
    console.warn('⚠ ImageMagick not installed');
    return false;
  }
}

/**
 * Batch process multiple images with ImageMagick
 * @param {Array<{path: string, name: string}>} images
 * @returns {Promise<Array<{original: string, thumbnail: string}>>}
 */
export async function batchProcessImages(images) {
  const results = [];

  for (const image of images) {
    try {
      const result = await processImageWithMagick(image.path, image.name);
      results.push(result);
    } catch (error) {
      console.error(`Failed to process ${image.name}:`, error.message);
      results.push({ error: error.message });
    }
  }

  return results;
}

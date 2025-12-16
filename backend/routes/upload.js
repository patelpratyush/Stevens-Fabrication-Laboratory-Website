import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { admin } from '../config/firebaseConnection.js';
import { authenticate, requireStaff } from '../middleware/auth.js';

const router = express.Router();
const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer to use memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

// Check if ImageMagick is available
async function checkImageMagick() {
  try {
    await execAsync('convert -version');
    return true;
  } catch (error) {
    return false;
  }
}

// Process image with ImageMagick CLI
async function processImageWithMagick(inputPath, baseName) {
  const tempDir = join(__dirname, '../uploads/temp');
  const optimizedPath = join(tempDir, `${baseName}_optimized.jpg`);
  const thumbnailPath = join(tempDir, `${baseName}_thumb.jpg`);

  // Create optimized image (max 1200px width, maintain aspect ratio, 85% quality)
  await execAsync(
    `convert "${inputPath}" -resize 1200x1200\\> -quality 85 -strip "${optimizedPath}"`
  );

  // Create thumbnail (300x300, cropped to center)
  await execAsync(
    `convert "${inputPath}" -resize 300x300^ -gravity center -extent 300x300 -quality 80 -strip "${thumbnailPath}"`
  );

  return {
    original: optimizedPath,
    thumbnail: thumbnailPath,
  };
}

// Process image with Sharp (fallback)
async function processWithSharp(buffer, baseName) {
  const sharp = (await import('sharp')).default;
  const tempDir = join(__dirname, '../uploads/temp');
  await fs.mkdir(tempDir, { recursive: true });

  const optimizedPath = join(tempDir, `${baseName}_optimized.jpg`);
  const thumbnailPath = join(tempDir, `${baseName}_thumb.jpg`);

  // Create optimized image
  await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(optimizedPath);

  // Create thumbnail
  await sharp(buffer)
    .resize(300, 300, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toFile(thumbnailPath);

  return {
    original: optimizedPath,
    thumbnail: thumbnailPath,
  };
}

/**
 * POST /api/upload/equipment-image
 * Upload and process equipment image with ImageMagick
 */
router.post(
  '/equipment-image',
  authenticate,
  requireStaff,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      // Generate safe filename
      const timestamp = Date.now();
      const ext = req.file.originalname.split('.').pop();
      const safeFileName = `${timestamp}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const baseFileName = safeFileName.replace(`.${ext}`, '');

      // Check if ImageMagick is available
      const hasImageMagick = await checkImageMagick();

      let processedImages;

      if (hasImageMagick) {
        // Use ImageMagick CLI for processing
        console.log('✓ Using ImageMagick for image processing');

        // Save buffer to temp file
        const tempDir = join(__dirname, '../uploads/temp');
        await fs.mkdir(tempDir, { recursive: true });
        const tempPath = join(tempDir, safeFileName);
        await fs.writeFile(tempPath, req.file.buffer);

        // Process with ImageMagick
        processedImages = await processImageWithMagick(tempPath, baseFileName);

        // Clean up temp file
        await fs.unlink(tempPath).catch(() => {});
      } else {
        // Fallback to Sharp (Node.js library)
        console.log('⚠ ImageMagick not found, using Sharp for processing');
        processedImages = await processWithSharp(req.file.buffer, baseFileName);
      }

      // Upload both images to Firebase Storage
      const bucket = admin.storage().bucket();

      // Upload optimized image
      const optimizedBuffer = await fs.readFile(processedImages.original);
      const optimizedFile = bucket.file(`equipment/${baseFileName}_optimized.jpg`);
      await optimizedFile.save(optimizedBuffer, {
        metadata: {
          contentType: 'image/jpeg',
        },
      });
      await optimizedFile.makePublic();
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${optimizedFile.name}`;

      // Upload thumbnail
      const thumbnailBuffer = await fs.readFile(processedImages.thumbnail);
      const thumbnailFile = bucket.file(`equipment/${baseFileName}_thumb.jpg`);
      await thumbnailFile.save(thumbnailBuffer, {
        metadata: {
          contentType: 'image/jpeg',
        },
      });
      await thumbnailFile.makePublic();
      const thumbUrl = `https://storage.googleapis.com/${bucket.name}/${thumbnailFile.name}`;

      // Clean up processed files
      await fs.unlink(processedImages.original).catch(() => {});
      await fs.unlink(processedImages.thumbnail).catch(() => {});

      console.log('✓ Equipment image processed and uploaded');
      console.log('  Image URL:', imageUrl);
      console.log('  Thumb URL:', thumbUrl);

      res.json({
        imageUrl,
        thumbUrl,
      });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({
        error: error.message || 'Failed to process image',
      });
    }
  }
);

export default router;

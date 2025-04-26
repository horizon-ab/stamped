import express, { Request, Response } from 'express';
import multer from 'multer';
import exifr from 'exifr';
import { uploadImage } from '../../apis/google-drive';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

interface ExtractedMetadata {
  timeTaken: string | 'Not Available' | 'Not Found' | 'Extraction Error';
  location: { latitude: number; longitude: number } | 'Not Available' | 'Not Found' | 'Extraction Error';
}

router.post('/upload-photo', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  const extractedMetadata: ExtractedMetadata = {
    timeTaken: 'Not Found',
    location: 'Not Found'
  };

  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded.' });
      return;
    }

    console.log(`Processing file: ${req.file.originalname}, Size: ${req.file.size} bytes`);

    try {
      const output = await exifr.parse(req.file.buffer);

      if (output) {
        const dateTime = output.DateTimeOriginal || output.CreateDate || null;
        extractedMetadata.timeTaken = dateTime ? dateTime.toISOString() : 'Not Available';

        const latitude = output.latitude !== undefined ? output.latitude : null;
        const longitude = output.longitude !== undefined ? output.longitude : null;

        if (latitude !== null && longitude !== null) {
          extractedMetadata.location = { latitude, longitude };
        } else {
          extractedMetadata.location = 'Not Available';
        }
        console.log('Successfully extracted metadata:', extractedMetadata);
      } else {
        console.log(`No parseable metadata found in ${req.file.originalname}.`);
      }
    } catch (metaError: any) {
      console.warn(`Warning: Could not extract metadata for ${req.file.originalname}:`, metaError.message || metaError);
      extractedMetadata.timeTaken = 'Extraction Error';
      extractedMetadata.location = 'Extraction Error';
    }

    console.log(`Uploading ${req.file.originalname} to Google Drive...`);
    await uploadImage(req.file.buffer, req.file.originalname);
    console.log(`Successfully uploaded ${req.file.originalname}.`);

    res.status(200).json({
      message: 'Photo uploaded successfully!',
      fileName: req.file.originalname,
      metadata: extractedMetadata
    });

  } catch (error: any) {
    console.error(`Error during photo upload process for ${req.file?.originalname || 'unknown file'}:`, error);
    res.status(500).json({
        message: 'Failed to upload photo.',
        error: error.message || 'Unknown error',
        metadataStatus: extractedMetadata
    });
  }
});

export default router;
import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import exifr from 'exifr';
import { createStamp, getStamps, getStampsByLocationName, getStampsByPoiName, getStampsByUserName } from '../../queries/stamp';
import { getUserByName } from '../../queries/user';
import { getPointOfInterestByName } from '../../queries/point_of_interest';
import { getLocationByPoiName } from '../../queries/location';
import { getChallengeByPoiName } from '../../queries/challenge';
import { verifyChallenge, generateStampName } from '../../apis/gemini';
import { uploadImage } from '../../apis/google-drive';

const router: Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req: Request, res: Response) => {
    const stamps = await getStamps();
    res.json(stamps);
});

// this endpoint prob most important, returns all stamps for a user which in itself has image links
router.get('/getByUser/:name', async (req: Request, res: Response) => {
    const { name } = req.params; // get the name from the request parameters

    try {
        const stamps = await getStampsByUserName(name);
        if (!stamps || stamps.length === 0) {
            res.status(404).json({ message: 'No stamps found for this user.' });
        } else {
            res.status(200).json(stamps);
        }
    } catch (error) {
        console.error('Error fetching stamps by user:', error);
        res.status(500).json({ error: error });
    }
});

router.get('/getByLocation/:location', async (req: Request, res: Response) => {
    const { location } = req.params; // get the location from the request parameters
    
    try {
        const stamps = await getStampsByLocationName(location);
        if (!stamps || stamps.length === 0) {
            res.status(404).json({ message: 'No stamps found for this location.' });
        } else {
            res.status(200).json(stamps);
        }
    } catch (error) {
        console.error('Error fetching stamps by location:', error);
        res.status(500).json({ error: error });
    }
});

router.get('/getByPOI/:poi', async (req: Request, res: Response) => {
    const { poi } = req.params; 
    
    try {
        const stamps = await getStampsByPoiName(poi);
        if (!stamps || stamps.length === 0) {
            res.status(404).json({ message: 'No stamps found for this POI.' });
        } else {
            res.status(200).json(stamps);
        }
    } catch (error) {
        console.error('Error fetching stamps by POI:', error);
        res.status(500).json({ error: error });
    }
});






interface ExtractedMetadata {
    location: { latitude: string; longitude: string } | 'Not Available' | 'Not Found' | 'Extraction Error';
}

async function extractMetadata(fileBuffer: Buffer, fileName: string): Promise<ExtractedMetadata> {
    const extractedMetadata: ExtractedMetadata = {
      location: 'Not Found'
    };
  
    try {
      const output = await exifr.parse(fileBuffer);
  
      if (output) {
        const latitude = output.latitude !== undefined ? output.latitude : null;
        const longitude = output.longitude !== undefined ? output.longitude : null;
  
        if (latitude !== null && longitude !== null) {
          extractedMetadata.location = { latitude, longitude };
        } else {
          extractedMetadata.location = 'Not Available';
        }
  
        console.log('Successfully extracted metadata:', extractedMetadata);
      } else {
        console.log(`No parseable metadata found in ${fileName}.`);
      }
    } catch (metaError: any) {
      console.warn(`Warning: Could not extract metadata for ${fileName}:`, metaError.message || metaError);
      extractedMetadata.location = 'Extraction Error';
    }
  
    return extractedMetadata;
  }

router.post('/submitStamp', upload.single('image'), async (req: Request, res: Response) => {
    const extractedMetadata: ExtractedMetadata = { // leaves more to be added
        location: 'Not Found'
    };
    
    const { userName, poiName } = req.body;

    const poi = await getPointOfInterestByName(poiName);
    if (!poi) { res.status(404).json({ message: 'POI not found.' }); return; }
    
    const user = await getUserByName(userName);
    if (!user) { res.status(404).json({ message: 'User not found.' }); return; }

    const location = await getLocationByPoiName(poiName);
    if (!location) { res.status(404).json({ message: 'Location not found.' }); return; }

    const challenge = await getChallengeByPoiName(poiName);
    if (!challenge) { res.status(404).json({ message: 'Challenge not found.' }); return; }


    try {
        if (!req.file) {
          res.status(400).json({ message: 'No file uploaded.' });
          return;
        }

        console.log(`Processing file: ${req.file.originalname}, Size: ${req.file.size} bytes`);
        const metadata = await extractMetadata(req.file.buffer, req.file.originalname);
        extractedMetadata.location = metadata.location;
        console.log(`Extracted metadata: ${JSON.stringify(extractedMetadata)}`);

        if (typeof extractedMetadata.location === 'object' && extractedMetadata.location !== null) {
            const { latitude, longitude } = extractedMetadata.location;
            if (Math.sqrt(Math.pow(Number(latitude) - poi.latitude, 2) + Math.pow(Number(longitude) - poi.longitude, 2)) >= 0.001) { // TODO: fine tune number here
                res.status(406).json({ message: 'Coordinates do not match POI.' });
                return;
            }
        } else {
            res.status(404).json({ message: 'Invalid location metadata.' });
            return;
        }

        
        if (!(await verifyChallenge(req.file.buffer.toString("base64"), challenge.description))) { // for now always true (so expression always false) for now
            res.status(408).json({ message: 'Challenge verification failed.' });
            return;
        }

        // upload image to google drive
        console.log(`Uploading ${req.file.originalname} to Google Drive...`);
        const url = await uploadImage(req.file.buffer, req.file.originalname);
        console.log(`Successfully uploaded ${req.file.originalname}.`);

        const stampName = await generateStampName(req.file.buffer.toString("base64"), poiName, challenge.name);

        const result = await createStamp(
            userName,
            challenge.name,
            location[0].name,
            poiName,
            stampName,
            url
        )
            
        console.log(`Successfully created stamp: ${JSON.stringify(result)}`);
        res.status(200).json({
            message: 'Stamp created successfully!',
            fileName: req.file.originalname,
            metadata: extractedMetadata,
            url: url,
            result: result
        });
    } catch (error: any) {
        console.error(`Error during photo upload process for ${req.file?.originalname || 'unknown file'}:`, error);
        res.status(500).json({
            message: 'Failed to upload photo.',
            error: error.message || 'Unknown error',
        });
    }
    
});

export default router;


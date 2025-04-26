const { google } = require('googleapis');
const path = require('path');
const { Readable } = require('stream');
const mime = require('mime-types'); // Import mime-types library

// 1. Authenticate
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'stamped-458002-22af2e382a01.json'), // your service account JSON
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

// 2. Upload Image Function
export async function uploadImage(fileBuffer: Buffer, originalName: string) {
  const mimeType = mime.lookup(originalName) || 'application/octet-stream'; // Dynamically determine MIME type

  const fileMetadata = {
    name: originalName, // Use the original file name
    parents: ['1WcX-1BNWnvm3RvZTxQQMdLtFSHDYp8Fw'], // ID of the folder you shared
  };

  const media = {
    mimeType: mimeType, // Use the dynamically determined MIME type
    body: Readable.from(fileBuffer), // Create a readable stream from the buffer
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log('Uploaded File ID:', response.data.id);
    return response.data.id; // Return the file ID for further use
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}


const { google } = require('googleapis');
const path = require('path');
const { Readable } = require('stream');
const mime = require('mime-types');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '..', '..', 'stamped-458002-22af2e382a01.json'), // service account file, note in gitignore so get from Don
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export async function uploadImage(fileBuffer: Buffer, originalName: string) {
  const mimeType = mime.lookup(originalName) || 'application/octet-stream'; 

  const fileMetadata = {
    name: originalName, 
    parents: ['1WcX-1BNWnvm3RvZTxQQMdLtFSHDYp8Fw'], 
  };

  const media = {
    mimeType: mimeType, 
    body: Readable.from(fileBuffer),
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    console.log('Uploaded File ID:', response.data.id);
    console.log('Public URL:', `https://drive.google.com/thumbnail?sz=w640&id=${response.data.id}`);
    return `https://drive.google.com/thumbnail?sz=w640&id=${response.data.id}`; 
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
}


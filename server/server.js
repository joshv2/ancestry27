import express from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path'; // Import `path` module

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

// Set up the S3 client
const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});


// Middleware to check if an API key is needed (optional)
// const validateApiKey = (req, res, next) => {
//   const apiKey = req.header('x-api-key'); // Look for the API key in the request header
//   console.log(apiKey);
//   // If you need to validate the API key (optional)
//   if (!apiKey || apiKey !== process.env.API_KEY) {
//     return res.status(403).json({ error: 'Forbidden: Invalid API key' });
//   }

//   next(); // Proceed to the next middleware if the key is valid
// };

// // Apply the API key middleware (if needed, but in your case, it may not be needed)
// app.use(validateApiKey);


// Enable CORS for all routes or specify allowed origins
// const corsOptions = {
//   origin: 'http://localhost', // Allow frontend from localhost:3000
//   methods: ['GET', 'POST'], // Allow GET and POST methods (adjust if necessary)
//   allowedHeaders: ['Content-Type', 'Authorization'], // Optional, if you are using Authorization headers
// };
// app.use(cors(corsOptions)); // Apply CORS middleware
app.use(cors());

// const corsOptions = {
//   origin: 'http://localhost:3000', // Replace with the actual URL of your frontend
//   methods: ['GET'],
// };

// app.use(cors(corsOptions));
// app.use('/download-csv');

// Endpoint to handle CSV download
app.get('/download-csv', async (req, res) => {
  try {
    const bucketName = 'jlp-ancestry';
    const key = 'demo/jlp_combined_demo_jlp.csv';

    const params = { Bucket: bucketName, Key: key };
    const command = new GetObjectCommand(params);

    // Generate signed URL
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    // Fetch the CSV from S3 using the signed URL
    const s3Response = await fetch(signedUrl);
    console.log("S3 response status:", s3Response.status);

    if (!s3Response.ok) {
      throw new Error('Failed to fetch CSV from S3');
    }

    // Set headers for the response
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');

    // Read the body from the response as a stream and manually write chunks to the response
    const reader = s3Response.body.getReader();
    const pump = async () => {
      const { done, value } = await reader.read();
      if (done) {
        res.end();
        return;
      }
      res.write(value);
      pump(); // Recursively read and write chunks
    };

    // Start pumping the stream data to the response
    pump();

  } catch (err) {
    console.error('Error streaming CSV:', err);
    res.status(500).send('Error streaming CSV');
  }
});
// API endpoint for downloading CSV
// app.get('/download-csv', async (req, res) => {
//   try {
//     const bucketName = 'jlp-ancestry';
//     const key = 'demo/jlp_combined_demo_jlp.csv';

//     const params = {
//       Bucket: bucketName,
//       Key: key,
//     };

//     const data = await s3.send(new GetObjectCommand(params));
//     const streamToString = (stream) =>
//       new Promise((resolve, reject) => {
//         const chunks = [];
//         stream.on('data', (chunk) => chunks.push(chunk));
//         stream.on('error', reject);
//         stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
//       });

//     const csvContent = await streamToString(data.Body);
//     res.header('Content-Type', 'text/csv');
//     res.send(csvContent); // Send CSV as text/csv
//   } catch (err) {
//     console.error('Error downloading CSV from S3:', err);
//     res.status(500).send('Error downloading CSV');
//   }
// });


// Serve the React app for any other route
// app.get('*', (req, res) => {
//   res.sendFile(resolve(__dirname, 'frontend', 'build', 'index.html'));
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

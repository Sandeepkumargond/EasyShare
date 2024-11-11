import { IncomingForm } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { connectMongoDB } from '@/lib/mongodb';
import File from '@/models/File';
import nextConnect from 'next-connect';

export const config = { api: { bodyParser: false } };

const handler = nextConnect();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use formidable for file parsing
handler.use((req, res, next) => {
  const form = new IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'File parsing error' });
      return;
    }
    req.body = fields;
    req.files = files;
    next();
  });
});

// Handle file upload and saving info to MongoDB
handler.post(async (req, res) => {
  try {
    await connectMongoDB();
    const uploadedFile = req.files.file;

    if (!uploadedFile)
      return res.status(400).json({ error: 'No file uploaded' });

    // Upload the file to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(uploadedFile[0].filepath, {
      folder: 'uploads', // You can set the Cloudinary folder
    });

    // Save file details to MongoDB
    const newFile = new File({
      name: uploadedFile[0].originalFilename,
      size: uploadedFile[0].size,
      uploadDate: new Date(),
      uniqueLink: cloudinaryResult.secure_url, // Cloudinary URL
    });

    await newFile.save();

    res.status(200).json({ fileUrl: cloudinaryResult.secure_url });
  } catch (error) {
    console.error('Error saving file information:', error);
    res.status(500).json({ error: 'Error saving file information' });
  }
});

export default handler;

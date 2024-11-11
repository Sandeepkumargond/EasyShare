// lib/storage.js
import fs from 'fs-extra';
import path from 'path';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import File from '@/models/File';

const databasePath = path.join(process.cwd(), 'Database');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Check if the file type is valid
const isValidFileType = (fileType) => {
  return ['image/jpeg', 'image/png', 'application/pdf'].includes(fileType);
};

// Ensure date-based folder exists, save the file, and return metadata
export const saveFile = async (file, userId) => {
  if (!isValidFileType(file.mimetype)) {
    throw new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the 5 MB limit.');
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  const folderPath = path.join(databasePath, today);
  await fs.ensureDir(folderPath);

  const uniqueFileName = `${uuidv4()}-${file.originalFilename}`;
  const filePath = path.join(folderPath, uniqueFileName);

  await fs.move(file.filepath, filePath);

  const fileMetadata = new File({
    originalName: file.originalFilename,
    uniqueName: uniqueFileName,
    path: filePath,
    user: userId,
    uploadDate: new Date(),
  });
  await fileMetadata.save();

  return fileMetadata;
};

export const getUserFiles = async (userId) => {
  return await File.find({ user: userId }).sort({ uploadDate: -1 });
};

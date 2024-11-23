'use server'

import { connectMongoDB } from "./mongodb";
const { default: File } = require("@/models/File");

export const fetchFiles = async (userId) => {
  try {
    await connectMongoDB();
    const files = await File.find({userId}).sort({ createdAt: -1 });
    return JSON.stringify(files);
  } catch (error) {
    return {
      error: error.message || "Something went wrong in fetching the files"
    };
  }
}

export const saveToDatabase = async (file, userId) => {
  try {
    if (!file || !file.secure_url || !userId) {
      throw new Error("Missing required file or user details");
    }

    const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
    const fileExtension = file.secure_url.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error("Invalid file type. Only PDFs, JPG, and PNG files are allowed.");
    }

    await connectMongoDB();
    const uploadedFile = new File({
      name: file.name,
      size: file.size,
      type: file.type,
      secure_url: file.secure_url,
      uniqueLink: file.secure_url, 
      userId,
    });

    await uploadedFile.save();
    return {
      success: "File saved to DB",
      file: uploadedFile,
    };
  } catch (error) {
    return {
      error: error.message || "Something went wrong in saving the file",
    };
  }
};

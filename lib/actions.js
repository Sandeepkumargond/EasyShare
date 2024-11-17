'use server'

import { connectMongoDB } from "./mongodb";

const { default: File } = require("@/models/File")


export const fetchFiles = async () => {
    try {
        //userId fatch 
        await connectMongoDB();
        const files = await File.find({});
        // console.log(files);
        return JSON.stringify(files)
    } catch (error) {
        return {
            error : error.message || "Something went wrong in fetching the files"
        }
    }
}

export const saveToDatabase = async (file) => {
    console.log(file);
    try {
        if(!file || !file.secure_url) {
            throw new Error("File not found");
        }
        //userid fatch
        await connectMongoDB();
        console.log("connected to dbbbb");
        const uploadedFile = new File({
            name : file.original_filename,
            size : file.bytes,
            uniqueLink : file.secure_url,
            // userId : 
        })

        await uploadedFile.save();
        return {
            success : "File saved to DB",
            file : uploadedFile
        }

    } catch (error) {
        return {
            error : error.message || "something went wrong in saving the file"
        }
    }
}
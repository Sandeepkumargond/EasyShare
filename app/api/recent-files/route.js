import { connectMongoDB } from '@/lib/mongodb';
import File from '@/models/File';
import { NextResponse } from 'next/server'; // Import NextResponse for the response

// Named export for the GET method
export async function GET(request) {
  try {
    // Connect to the MongoDB database
    await connectMongoDB();

    // Fetch the most recent files from the database
    const files = await File.find().sort({ uploadDate: -1 }).limit(5);

    // Map the files to include their names and unique links
    const fileUrls = files.map((file) => ({
      name: file.name,
      url: file.uniqueLink,
    }));

    // Return the files as a JSON response
    return NextResponse.json({ recentFiles: fileUrls }, { status: 200 });
  } catch (error) {
    // Log the error and return a 500 status code
    console.error('Error fetching recent files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent files' },
      { status: 500 }
    );
    
  }
}

import { connectMongoDB } from "@/lib/mongodb";
import File from "@/models/File";

export async function GET(req) {
  try {
    await connectMongoDB();

    // Fetch all files from the database
    const files = await File.find();

    // Return files as JSON
    return new Response(
      JSON.stringify({ files }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch files" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

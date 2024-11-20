import { connectMongoDB } from "@/lib/mongodb";
import File from "@/models/File";

export async function DELETE(req, { params }) {
  const { id } = params; // Get the file ID from the URL

  try {
    await connectMongoDB();
    const deletedFile = await File.findByIdAndDelete(id); // Delete the file by ID

    if (!deletedFile) {
      return new Response(
        JSON.stringify({ error: "File not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: "File deleted successfully", file: deletedFile }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete file" }),
      { status: 500 }
    );
  }
}
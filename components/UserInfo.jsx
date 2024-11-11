"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentFiles, setRecentFiles] = useState([]);

  const fetchRecentFiles = async () => {
    try {
      const res = await fetch("/api/recent-files");

      // Ensure the response is OK
      if (!res.ok) {
        throw new Error("Failed to fetch recent files");
      }

      const data = await res.json();

      // Ensure that the 'recentFiles' key is returned from the API
      if (data.recentFiles) {
        setRecentFiles(data.recentFiles);
      } else {
        setError("No files found");
      }
    } catch (err) {
      console.error("Error fetching recent files:", err);
      setError("An error occurred while fetching recent files");
    }
  };

  // useEffect(() => {
  //   fetchRecentFiles();
  // }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("File size should not exceed 5MB");
    } else {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      
      const textResponse = await res.text(); 
      console.log("Response:", textResponse);

      if (!res.ok) {
        throw new Error(`Failed to upload file: ${textResponse}`);
      }

      const data = JSON.parse(textResponse); 
      console.log("Data:", data);
    } catch (err) {
      console.error("Error during file upload:", err);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">EasyShare</h1>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </nav>

      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <h2 className="text-3xl font-semibold mb-6">Upload a File</h2>

        <form
          onSubmit={handleFileUpload}
          className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-4"
        >
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className="bg-gray-700 text-white p-2 rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white py-2 px-4 rounded-md ${
              loading ? "opacity-50" : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {fileUrl && (
            <div className="mt-4">
              <p>File uploaded successfully!</p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                View/Download
              </a>
            </div>
          )}
        </form>

        <div className="mt-8 w-full max-w-md">
          <h3 className="text-xl font-medium mb-4">Recent Files</h3>

         
          {recentFiles.length === 0 ? (
            <p className="text-gray-400">No recent files available.</p>
          ) : (
            <ul>
              {recentFiles.map((file, index) => (
                <li key={index} className="mt-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          )}

         
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

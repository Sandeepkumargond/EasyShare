"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { CldUploadWidget } from "next-cloudinary";
import { saveToDatabase, fetchFiles } from "@/lib/actions";
import AllFiles from "./AllFiles";

export default function UserInfo() {
  const { data: session } = useSession();
  const [file, setFile] = useState({});
  const [error, setError] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentFiles, setRecentFiles] = useState([]);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [allFiles, setAllFiles] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchAllFiles = async () => {
    try {
      console.log("here");
      
      setLoading(true);
      const files = await fetchFiles();
      
      setAllFiles(JSON.parse(files));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching all files:", err);
      setError("Failed to fetch all files");
      setLoading(false);
    }
  };

  // Fetch files when component mounts
  useEffect(() => {
    fetchAllFiles();
  }, []);

  const handleViewAllFiles = async () => {
    setShowAllFiles(true);
    if (allFiles.length === 0) {
      await fetchAllFiles();
    }
  };

  const handleSubmit = async () => {
    if (!fileUrl) {
      alert("Please upload a file first");
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");
      const filedata = {
        name: file.name,
        secure_url: fileUrl,
        size: file.size,
        type: file.type,
      };

      const result = await saveToDatabase(filedata);
      console.log("Save result:", result);

      // if (!result.success) {
      //   throw new Error(result.error || 'Failed to save file');
      // }

      const filesResult = await fetchFiles();
      if (filesResult.success) {
        setAllFiles(filesResult.files);
      }

      setFile({});
      setFileUrl("");

      alert("File uploaded successfully!");

      setShowAllFiles(true);
    } catch (err) {
      console.error("Error saving file:", err);
      setError(err.message || "Failed to save file");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">EasyShare</h1>
        <h2
          onClick={handleViewAllFiles}
          className="cursor-pointer hover:text-blue-400 transition-colors"
        >
          All Files
        </h2>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </nav>

      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        {showAllFiles ? (
          <div className="w-full max-w-4xl">
            <h2 className="text-3xl font-semibold mb-6">All Files</h2>
            {loading ? (
              <div className="text-center">Loading files...</div>
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg">
                {allFiles && allFiles.length > 0 ? (
                  <AllFiles files={JSON.stringify(allFiles)} />
                ) : (
                  <p className="text-center text-gray-400">No files found</p>
                )}
              </div>
            )}
            <button
              onClick={() => setShowAllFiles(false)}
              className="mt-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md"
            >
              Back to Upload
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-semibold mb-6">Upload a File</h2>

            <CldUploadWidget
              uploadPreset="easyshare"
              onSuccess={(result, { widget }) => {
                const fileInfo = result?.info;
                console.log("Upload result:", fileInfo);
                setFile({
                  name: fileInfo.original_filename,
                  size: fileInfo.bytes,
                  type: fileInfo.format,
                  secure_url: fileInfo.secure_url,
                });
                setFileUrl(fileInfo.secure_url);
              }}
              onQueuesEnd={(result, { widget }) => {
                widget.close();
              }}
            >
              {({ open }) => {
                return (
                  <button
                    onClick={() => open()}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
                    disabled={submitLoading}
                  >
                    Upload an Image
                  </button>
                );
              }}
            </CldUploadWidget>

            <button
              onClick={handleSubmit}
              disabled={submitLoading || !fileUrl}
              className={`mt-4 px-4 py-2 rounded-md ${
                submitLoading || !fileUrl
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {submitLoading ? "Saving..." : "Submit"}
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {fileUrl && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-green-400 mb-2">
                  File uploaded successfully!
                </p>
                <div className="flex flex-col gap-2">
                  <p>
                    <strong>Name:</strong> {file.name}
                  </p>
                  <p>
                    <strong>Size:</strong> {Math.round(file.size / 1024)} KB
                  </p>
                  <p>
                    <strong>Type:</strong> {file.type}
                  </p>
                  <p>
                    <strong>URL:</strong>
                    {file.secure_url}{" "}
                  </p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    View/Download File
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

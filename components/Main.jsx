"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { CldUploadWidget } from "next-cloudinary";
import { saveToDatabase, fetchFiles } from "@/lib/actions";
import AllFiles from "./AllFiles";
import { SlHome } from "react-icons/sl";
import { FaSearch } from "react-icons/fa"; // Import the search icon

export default function UserInfo() {
  const { data: session, status } = useSession();  // Added status for checking session loading
  const [file, setFile] = useState({});
  const [error, setError] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [allFiles, setAllFiles] = useState([]);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const [showIcon, setShowIcon] = useState(false); // Search icon visibility state

  const fetchAllFiles = async () => {
    try {
      if (!session) {
        console.error("Session is undefined");
        return;
      }
      setShowIcon(true); // Show search icon
      setLoading(true);
      const files = await fetchFiles(session.user.id);
      setAllFiles(JSON.parse(files));
    } catch (err) {
      console.error("Error fetching all files:", err);
    } finally {
      setLoading(false);
      setShowIcon(false); // Hide search icon
    }
  };

  useEffect(() => {
    if (status === "authenticated") {  // Only fetch files when the session is authenticated
      fetchAllFiles();
    }
  }, [status]);  // Add status as a dependency to trigger re-fetch when session is authenticated

  const handleViewAllFiles = async () => {
    setShowAllFiles(true);
    if (allFiles.length === 0) {
      await fetchAllFiles();
    }
  };

  const handleSubmit = async () => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB");
      return;
    } else if (!fileUrl) {
      alert("Please upload a file first");
      return;
    }
  
    try {
      setShowIcon(true); // Show loading icon
      setSubmitLoading(true);
      setError("");
  
      // Save file data
      const filedata = {
        name: file.name,
        secure_url: fileUrl,
        size: file.size,
        type: file.type,
      };
  
      await saveToDatabase(filedata, session?.user.id);
  
      // Fetch updated files after saving
      await fetchAllFiles();
  
      // Clear file input and URL
      setFile({});
      setFileUrl("");
  
      alert("File uploaded successfully!");
  
      // Redirect to "All Files" view
      setShowAllFiles(true);
    } catch (err) {
      console.error("Error saving file:", err);
      setError(err.message || "Failed to save file");
    } finally {
      setSubmitLoading(false);
      setShowIcon(false); // Hide loading icon
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(file.secure_url).then(() => {
      setCopyButtonText("Copied!");
      setTimeout(() => setCopyButtonText("Copy"), 2000);
    });
  };

  if (status === "loading") {
    // Show a loading spinner while session is being fetched
    return (
      <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center relative">
        <div className="absolute inset-0 bg-gray-900 opacity-50 backdrop-blur-sm" /> {/* Blurred background */}
        <div className="flex justify-center items-center mt-6 z-10">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    // Handle unauthenticated state
    return <div>You are not authenticated. Please log in.</div>;
  }

  return (
    <div className={`bg-gray-900 min-h-screen text-white ${loading ? "" : ""}`}>
      <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {session?.user?.name ? `Welcome, ${session.user.name}` : "EasyShare"}
        </h1>
        <h2
          onClick={handleViewAllFiles}
          className="cursor-pointer hover:bg-white hover:text-black transition-colors rounded-md p-3 bg-blue-500"
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
          <div className="w-full max-w-4xl mx-auto">
            <button
              onClick={() => setShowAllFiles(false)}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-4 rounded-md"
            >
              <SlHome />
            </button>
            <h2 className="text-3xl font-semibold mb-6">All Files</h2>
            {loading ? (
              <div className="text-center">Loading files...</div>
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg">
                {allFiles && allFiles.length > 0 ? (
                  <AllFiles files={allFiles} />
                ) : (
                  <p className="text-center text-gray-400">No files found</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-semibold mb-6">Upload a File</h2>

            <CldUploadWidget
              uploadPreset="easyshare"
              resourceType="raw"
              onSuccess={(result, { widget }) => {
                const fileInfo = result?.info;
                console.log("Upload result:", fileInfo);
                // Check for the secure_url property
                if (fileInfo?.secure_url) {
                  setFile({
                    name: fileInfo.original_filename,
                    size: fileInfo.bytes,
                    type: fileInfo.format,
                    secure_url: fileInfo.secure_url,
                  });
                  setFileUrl(fileInfo.secure_url);
                } else {
                  console.error("File upload failed: No secure_url returned.");
                }
              }}
              
              onQueuesEnd={(result, { widget }) => {
                widget.close();
              }}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
                >
                  Upload a File
                </button>
              )}
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
              <div className="mt-4 p-4 bg-gray-800 rounded-lg max-w-3xl">
                <p className="text-green-400 mb-2">File uploaded successfully!</p>
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
                  <p className="flex flex-col sm:flex-row items-center gap-2">
                    <strong>URL:</strong>
                    <span className="truncate max-w-full sm:max-w-md">
                      {file.secure_url}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      {copyButtonText}
                    </button>
                  </p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm sm:text-base"
                  >
                    Open File
                  </a>
                </div>
              </div>
            )}
          </>
        )}

        {showIcon && (
          <div className="absolute inset-0 flex justify-center items-center z-20 backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

const AllFiles = ({ files }) => {
  const [allFiles, setAllFiles] = useState(files);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error("Error fetching files:", error.message);
      return [];
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      alert(result.success || "File deleted successfully");

      const updatedFiles = await fetchFiles();
      setAllFiles(updatedFiles);
    } catch (error) {
      console.error("Error deleting file:", error.message);
      alert(error.message || "Failed to delete the file");
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div className="p-4">
      <ul className="md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allFiles.length > 0 ? (
          allFiles.map((file) => (
            <li key={file._id}>
              <div className="p-4 bg-gray-900 rounded-md shadow-md">
                <p className="text-sm md:text-base">
                  <strong>Name:</strong> {file.name}
                </p>
                <p className="text-sm md:text-base">
                  <strong>Size:</strong> {Math.round(file.size / 1024)} KB
                </p>
                <p className="text-sm md:text-base">
                  <strong>Type:</strong> {file.type}
                </p>
                <p className="flex items-center gap-2 text-sm md:text-base">
                  <strong>URL:</strong>
                  <span className="truncate">{file.secure_url}</span>
                  <button
                    onClick={() => handleCopy(file.secure_url)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs"
                  >
                    Copy
                  </button>
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Delete
                    
                  </button>
                  <a
                    href={file.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline text-sm"
                  >
                    Download/View
                  </a>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">
            No files available
          </p>
        )}
      </ul>
    </div>
  );
};

export default AllFiles;

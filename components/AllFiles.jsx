import { useState } from 'react';

const AllFiles = ({ files }) => {
  const [allFiles, setAllFiles] = useState(files); // Store files in state

  // Function to handle deleting a file
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
      // Make the DELETE request to the correct API route
      const response = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text(); // Capture unexpected responses
        throw new Error(errorText);
      }

      // Parse the JSON response if the request was successful
      const result = await response.json();
      alert(result.success || "File deleted successfully");

      // Re-fetch the files after deletion
      const updatedFiles = await fetchFiles(); // Call the function to fetch updated files
      setAllFiles(updatedFiles); // Update the state with the latest files
    } catch (error) {
      console.error("Error deleting file:", error);
      alert(error.message || "An error occurred while deleting the file.");
    }
  };

  // Function to handle copying the file URL to the clipboard
  const handleCopy = (e) => {
    const text = e.target.previousElementSibling.innerText;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Function to fetch all files (assuming you have an API to fetch them)
  const fetchFiles = async () => {
    const response = await fetch("/api/files");
    const data = await response.json();
    return data.files || []; // Ensure files are returned in a consistent format
  };

  return (
    <div>
      <ul>
        {allFiles.length > 0 ? (
          allFiles.map((file) => (
            <li key={file._id}>
              <div className="p-4 bg-gray-800 rounded-md">
                <p><strong>Name:</strong> {file.name}</p>
                <p><strong>Size:</strong> {Math.round(file.size / 1024)} KB</p>
                <p><strong>Type:</strong> {file.type}</p>
                <p className="flex items-center gap-2">
                  <strong>URL:</strong>
                  <span>{file.secure_url}</span>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Copy URL
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </p>
                <p>
                  <a
                    href={file.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Download/View File
                  </a>
                </p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-400">No files available</p>
        )}
      </ul>
    </div>
  );
};

export default AllFiles;

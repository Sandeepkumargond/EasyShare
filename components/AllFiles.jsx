import { useEffect, useState } from 'react';

const AllFiles = ({files}) => {
  const allFiles = JSON.parse(files);

  return (
    <div>
      <h2>All Uploaded Files</h2>
      <ul>
        {allFiles.length > 0 ? (
          allFiles.map(file => (
            <li key={file._id}>
              <a href={file.uniqueLink} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            </li>
          ))
        ) : (
          <p>No files available.</p>
        )}
      </ul>
    </div>
  );
};

export default AllFiles;

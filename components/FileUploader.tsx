import React, { useState, useCallback, useMemo } from 'react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  // FIX: Use functional update for setSelectedFiles to avoid stale state in the callback.
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = event.target.files ? Array.from(event.target.files) : [];
      if (newFiles.length > 0) {
        setSelectedFiles(prevFiles => {
          const allFiles = [...prevFiles, ...newFiles];
          onFilesSelected(allFiles);
          return allFiles;
        });

        const newUrls = newFiles.map(file => URL.createObjectURL(file));
        setObjectUrls(prevUrls => [...prevUrls, ...newUrls]);
      }
    },
    [onFilesSelected]
  );
  
  // FIX: Wrap removeFile in useCallback to prevent stale closures in memoized filePreviews.
  const removeFile = useCallback((indexToRemove: number) => {
      const newFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
      const newUrls = objectUrls.filter((_, index) => index !== indexToRemove);
      
      URL.revokeObjectURL(objectUrls[indexToRemove]);

      setSelectedFiles(newFiles);
      setObjectUrls(newUrls);
      onFilesSelected(newFiles);
  }, [objectUrls, onFilesSelected, selectedFiles]);
  
  // FIX: Add removeFile to the dependency array of useMemo.
  const filePreviews = useMemo(() => (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {selectedFiles.map((file, index) => (
        <div key={index} className="relative group aspect-w-1 aspect-h-1 bg-gray-700 rounded-lg overflow-hidden shadow-md">
          <img src={objectUrls[index]} alt={file.name} className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={() => removeFile(index)}
              className="absolute top-1 right-1 h-6 w-6 bg-red-600 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove file"
            >
              &times;
            </button>
            <p className="text-white text-xs text-center p-1 truncate absolute bottom-0 left-0 right-0 bg-black bg-opacity-60">{file.name}</p>
          </div>
        </div>
      ))}
    </div>
  ), [selectedFiles, objectUrls, removeFile]);


  return (
    <div>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-medium border-dashed rounded-md bg-gray-900/50 hover:border-brand-accent transition-colors">
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-neutral-medium" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-neutral-light">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-brand-accent hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-brand-primary p-1">
              <span>Upload files</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-neutral-medium">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
      {filePreviews}
    </div>
  );
};

export default FileUploader;
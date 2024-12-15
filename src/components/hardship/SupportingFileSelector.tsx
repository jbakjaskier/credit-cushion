"use client"

import React, { useRef, useState } from "react";
import {
  PhotoIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

type FileSelectorState = {
    uploadStatus: "initial";
} | {
    uploadStatus: "selected";
    selectedFile: File;
} | {
    uploadStatus: "uploading";
    selectedFile: File;
} | {
    uploadStatus: "uploaded";
    selectedFile: File;
} | {
    uploadStatus: "error";
}

export default function SupportingFileSelector() {

    const [fileStatus, setFileStatus] = useState<FileSelectorState>({
        uploadStatus: "initial"
    });
    
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target?.files;

    if (fileList) {
        const file = fileList[0];
      // Validate file type and size
      if (file.type === "application/pdf" && file.size <= 10 * 1024 * 1024) {
        setFileStatus({
            uploadStatus: "selected",
            selectedFile: file
        })
        
      } else {
        setFileStatus({
            uploadStatus: "error"
        })
        
        //@ts-ignore
        event.target.value = null; // Clear the file input
      }
    }
  };

  const handleFileRemove = () => {

    setFileStatus({
        uploadStatus: "initial"
    })
    
    // Reset the file input
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleUpload = async (selectedFile: File) => {
    if (fileStatus.uploadStatus === "initial" || fileStatus.uploadStatus === "error") return;

    setFileStatus({
        uploadStatus: "uploading",
        selectedFile: selectedFile
    })
    
    try {
      // Simulated upload process
      // Replace this with your actual upload logic
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setFileStatus({
        uploadStatus: "uploaded",
        selectedFile: selectedFile
      })
      
    } catch (error) {
        setFileStatus({
            uploadStatus: "error"
        })
    }
  };

  // Render different views based on upload status
  const renderContent = () => {
    switch (fileStatus.uploadStatus) {
      case "initial":
        return (
          <div className="text-center">
            <PhotoIcon
              className="mx-auto h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="supporting-documents"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="supporting-documents"
                  name="supporting-documents"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
              <p className="pl-1">to support your case</p>
            </div>
            <p className="text-xs leading-5 text-center text-gray-600">
              Make sure it's in PDF format and below 10MB
            </p>
          </div>
        );

      case "selected":
        return (
          <div className="text-center">
            <div className="flex justify-center items-center space-x-4">
              <DocumentIcon className="h-10 w-10 text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {fileStatus.selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(fileStatus.selectedFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleFileRemove}
                  className="text-red-500 hover:text-red-700"
                  title="Remove file"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={async () => handleUpload(fileStatus.selectedFile)}
                  className="text-green-500 hover:text-green-700"
                  title="Upload file"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );

      case "uploading":
        return (
          <div className="text-center">
            <div className="animate-pulse flex justify-center items-center space-x-4">
              <DocumentIcon className="h-10 w-10 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Uploading {fileStatus.selectedFile.name}...
                </p>
                <div className="w-full bg-gray-200 h-1 mt-2">
                  <div
                    className="bg-indigo-600 h-1 animate-pulse"
                    style={{ width: "50%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );

      case "uploaded":
        return (
          <div className="text-center">
            <CheckCircleIcon
              className="mx-auto h-12 w-12 text-green-500"
              aria-hidden="true"
            />
            <p className="mt-2 text-sm font-medium text-gray-700">
              {fileStatus.selectedFile.name} uploaded successfully
            </p>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="text-red-500">
              <XMarkIcon className="mx-auto h-12 w-12" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium text-red-600">
                File upload failed
              </p>
              <p className="text-xs text-gray-500">
                Ensure the file is a PDF and under 10MB
              </p>
              <button
                onClick={handleFileRemove}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
              >
                Try again
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
      {renderContent()}
    </div>
  );
}

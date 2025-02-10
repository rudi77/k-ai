'use client'

import React, { useCallback, useState } from 'react'
import { Upload, File, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setUploadStatus('processing')
      // TODO: Implement file upload and processing
      setTimeout(() => setUploadStatus('completed'), 2000) // Temporary simulation
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
  })

  const removeFile = () => {
    setFile(null)
    setUploadStatus('idle')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Upload Invoice</h1>
      </div>
      
      <div
        {...getRootProps()}
        className={`relative flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white p-12 text-center transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        {!file ? (
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Upload className="h-8 w-8 text-gray-600" />
            </div>
            <p className="mb-2 text-lg font-medium text-gray-900">
              Drop your invoice here, or{' '}
              <span className="text-blue-600">browse</span>
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF and PNG files
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <File className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(file.size / 1024)} KB
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
                className="rounded-full p-1 hover:bg-gray-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="text-center">
              {uploadStatus === 'processing' && (
                <p className="text-sm font-medium text-blue-600">Processing invoice...</p>
              )}
              {uploadStatus === 'completed' && (
                <p className="text-sm font-medium text-green-600">
                  Invoice processed successfully!
                </p>
              )}
              {uploadStatus === 'failed' && (
                <p className="text-sm font-medium text-red-600">
                  Failed to process invoice. Please try again.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
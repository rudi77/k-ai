'use client'

import React, { useCallback, useState } from 'react'
import { Upload, File, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const router = useRouter()

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploadStatus('processing')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to upload invoice')
      }

      const data = await response.json()
      setUploadStatus('completed')
      
      // Redirect to the invoice detail page after successful upload
      setTimeout(() => {
        router.push(`/invoice/${data.id}`)
      }, 1500)
    } catch (error) {
      console.error('Upload error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to upload invoice')
      setUploadStatus('failed')
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      setErrorMessage('')
      await uploadFile(selectedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB max file size
  })

  const removeFile = () => {
    setFile(null)
    setUploadStatus('idle')
    setErrorMessage('')
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
              Supports PDF and PNG files (max 10MB)
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
                disabled={uploadStatus === 'processing'}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="text-center">
              {uploadStatus === 'processing' && (
                <div>
                  <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-1 animate-progress bg-blue-600"></div>
                  </div>
                  <p className="text-sm font-medium text-blue-600">Processing invoice...</p>
                </div>
              )}
              {uploadStatus === 'completed' && (
                <p className="text-sm font-medium text-green-600">
                  Invoice processed successfully! Redirecting...
                </p>
              )}
              {uploadStatus === 'failed' && (
                <div>
                  <p className="text-sm font-medium text-red-600">
                    {errorMessage || 'Failed to process invoice. Please try again.'}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (file) uploadFile(file)
                    }}
                    className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Retry Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
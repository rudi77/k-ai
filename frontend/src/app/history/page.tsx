'use client'

import React, { useEffect, useState } from 'react'
import { File, Calendar, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface InvoiceSummary {
  id: string
  file_name: string
  upload_date: string
  status: string
  extracted_data: {
    total_amount: number | null
    vendor: string | null
    date: string | null
    invoice_number: string | null
  } | null
}

export default function HistoryPage() {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not available'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return 'Invalid date'
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'Not available'
    try {
      return `$${amount.toFixed(2)}`
    } catch (e) {
      return 'Invalid amount'
    }
  }

  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return 'bg-gray-100 text-gray-700'
    
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'processing':
        return 'bg-blue-100 text-blue-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const fetchInvoices = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/list`,
        {
          credentials: 'include',
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.detail || `Failed to fetch invoices: ${response.status}`
        )
      }

      const data = await response.json()
      setInvoices(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching invoices:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => {
            setLoading(true)
            fetchInvoices()
          }}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-2">
        <div className="text-gray-500">No invoices found</div>
        <Link
          href="/upload"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Upload your first invoice
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Invoice History</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {invoices.map((invoice) => (
          <Link
            key={invoice.id}
            href={`/invoice/${invoice.id}`}
            className="group rounded-lg border bg-white p-6 transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <File className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {invoice.file_name}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                {formatDate(invoice.upload_date)}
              </div>
              
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="font-medium">Invoice #:</span>{' '}
                  <span className="text-gray-600">
                    {invoice.extracted_data?.invoice_number || 'Not available'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Vendor:</span>{' '}
                  <span className="text-gray-600">
                    {invoice.extracted_data?.vendor || 'Not available'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Total:</span>{' '}
                  <span className="text-gray-600">
                    {formatCurrency(invoice.extracted_data?.total_amount)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Date:</span>{' '}
                  <span className="text-gray-600">
                    {formatDate(invoice.extracted_data?.date)}
                  </span>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {invoice.status 
                      ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)
                      : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 
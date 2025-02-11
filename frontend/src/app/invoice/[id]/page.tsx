'use client'

import React, { useEffect, useState } from 'react'
import { File, Download, RefreshCw } from 'lucide-react'

// Update interfaces to match backend schema
interface LineItem {
  description: string
  quantity: number
  unit_price: number  // Changed from string to number
  total: number       // Changed from string to number
}

interface ExtractedData {
  invoice_number: string  // Changed from camelCase to snake_case
  date: string
  total_amount: number   // Changed from 'total' string to 'total_amount' number
  vendor: string
  line_items: LineItem[] // Changed from camelCase to snake_case
}

interface Invoice {
  id: string
  file_name: string     // Changed from camelCase to snake_case
  upload_date: string   // Changed from camelCase to snake_case
  status: string
  file_url: string      // Changed from camelCase to snake_case
  extracted_data: ExtractedData  // Changed from camelCase to snake_case
}

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInvoiceData()
  }, [params.id])

  const fetchInvoiceData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/${params.id}`,
        {
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch invoice data')
      }

      const data = await response.json()
      setInvoice(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoice data')
    } finally {
      setLoading(false)
    }
  }

  const handleReprocess = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/${params.id}/reprocess`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to reprocess invoice')
      }

      // Refresh the invoice data after reprocessing
      await fetchInvoiceData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reprocess invoice')
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
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-gray-500">Invoice not found</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
        <div className="flex space-x-3">
          <button className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </button>
          <button className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reprocess
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Original Invoice Preview */}
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 flex items-center text-lg font-medium text-gray-900">
            <File className="mr-2 h-5 w-5" />
            Original Invoice
          </h3>
          <div className="aspect-[3/4] rounded-lg border bg-gray-100">
            {/* Replace with actual PDF viewer component */}
            <div className="flex h-full items-center justify-center text-gray-500">
              PDF Viewer
            </div>
          </div>
        </div>

        {/* Extracted Data */}
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Extracted Information
          </h3>
          
          <div className="space-y-6">
            {/* Summary Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                <p className="text-sm text-gray-900">
                  {invoice.extracted_data.invoice_number}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-sm text-gray-900">
                  {invoice.extracted_data.date}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Vendor</p>
                <p className="text-sm text-gray-900">
                  {invoice.extracted_data.vendor}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-sm text-gray-900">
                  ${invoice.extracted_data.total_amount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-900">
                Line Items
              </h4>
              <div className="rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.extracted_data.line_items.map((item, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                          ${item.unit_price.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
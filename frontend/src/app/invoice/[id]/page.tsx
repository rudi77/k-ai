'use client'

import React, { useEffect, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'

interface LineItem {
  description: string
  quantity: number
  unit_price: number
  total: number
}

interface ExtractedData {
  invoice_number: string
  date: string
  total_amount: number
  vendor: string
  line_items: LineItem[]
}

interface Invoice {
  id: string
  file_name: string
  upload_date: string
  status: string
  file_url: string
  extracted_data: ExtractedData
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
      console.error('Error fetching data:', err)
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

      await fetchInvoiceData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reprocess invoice')
    }
  }

  const handleDownload = async () => {
    if (!invoice) return
    
    try {
      const pdfUrl = `${process.env.NEXT_PUBLIC_API_URL}/invoices/${params.id}/pdf`
      const response = await fetch(pdfUrl, {
        credentials: 'include',
      })
      
      if (!response.ok) throw new Error('Failed to download file')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = invoice.file_name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download file')
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
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </button>
          <button
            onClick={handleReprocess}
            className="inline-flex items-center rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reprocess
          </button>
        </div>
      </div>

      {/* Extracted Data */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-6 text-lg font-medium text-gray-900">
          Extracted Information
        </h3>
        
        <div className="space-y-8">
          {/* Summary Information */}
          <div className="grid grid-cols-2 gap-y-6">
            <div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                <p className="text-sm text-gray-900">
                  {invoice.extracted_data.invoice_number}
                </p>
              </div>
            </div>
            <div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-sm text-gray-900">
                  {invoice.extracted_data.date}
                </p>
              </div>
            </div>
            <div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Vendor</p>
                <p className="text-sm text-gray-900">
                  {invoice.extracted_data.vendor}
                </p>
              </div>
            </div>
            <div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-sm text-gray-900">
                  ${invoice.extracted_data.total_amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-gray-900">
              Line Items
            </h4>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Qty
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Unit Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {invoice.extracted_data.line_items.map((item, index) => (
                    <tr key={index}>
                      <td className="whitespace-pre-line px-6 py-4 text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
                        ${item.unit_price.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">
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
  )
} 
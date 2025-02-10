'use client'

import React from 'react'
import { File, Download, RefreshCw } from 'lucide-react'

// Mock data - replace with actual data fetching
const mockInvoiceData = {
  id: '1',
  fileName: 'invoice-001.pdf',
  uploadDate: '2024-02-10',
  status: 'completed',
  fileUrl: 'https://example.com/invoice.pdf',
  extractedData: {
    total: '$1,234.56',
    date: '2024-02-01',
    vendor: 'Acme Corp',
    invoiceNumber: 'INV-001',
    lineItems: [
      {
        description: 'Product A',
        quantity: 2,
        unitPrice: '$500.00',
        total: '$1,000.00',
      },
      {
        description: 'Product B',
        quantity: 1,
        unitPrice: '$234.56',
        total: '$234.56',
      },
    ],
  },
}

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string }
}) {
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
                  {mockInvoiceData.extractedData.invoiceNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-sm text-gray-900">
                  {mockInvoiceData.extractedData.date}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Vendor</p>
                <p className="text-sm text-gray-900">
                  {mockInvoiceData.extractedData.vendor}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-sm text-gray-900">
                  {mockInvoiceData.extractedData.total}
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
                    {mockInvoiceData.extractedData.lineItems.map(
                      (item, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                            {item.description}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                            {item.unitPrice}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                            {item.total}
                          </td>
                        </tr>
                      )
                    )}
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
'use client'

import React from 'react'
import { File, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Mock data - replace with actual data from your backend
const mockInvoices = [
  {
    id: '1',
    fileName: 'invoice-001.pdf',
    uploadDate: '2024-02-10',
    status: 'completed',
    summary: {
      total: '$1,234.56',
      vendor: 'Acme Corp',
      date: '2024-02-01',
    },
  },
  // Add more mock invoices as needed
]

export default function HistoryPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Invoice History</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockInvoices.map((invoice) => (
          <Link
            key={invoice.id}
            href={`/invoice/${invoice.id}`}
            className="group rounded-lg border bg-white p-6 transition-shadow hover:shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <File className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {invoice.fileName}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                {invoice.uploadDate}
              </div>
              
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="font-medium">Vendor:</span>{' '}
                  <span className="text-gray-600">{invoice.summary.vendor}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Total:</span>{' '}
                  <span className="text-gray-600">{invoice.summary.total}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Date:</span>{' '}
                  <span className="text-gray-600">{invoice.summary.date}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 
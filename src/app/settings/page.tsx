'use client'

import React, { useState } from 'react'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    extractionPrompt: 'Extract the following information from the invoice: total amount, date, vendor name, invoice number, and line items.',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement settings update
    console.log('Settings updated:', settings)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            API Configuration
          </h3>
          
          <div className="space-y-4">
            <div>
              <label
                htmlFor="apiKey"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                OpenAI API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={settings.openaiApiKey}
                onChange={(e) =>
                  setSettings({ ...settings, openaiApiKey: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="sk-..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Your API key will be stored securely and used for invoice processing
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Extraction Settings
          </h3>
          
          <div>
            <label
              htmlFor="prompt"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Extraction Prompt
            </label>
            <textarea
              id="prompt"
              value={settings.extractionPrompt}
              onChange={(e) =>
                setSettings({ ...settings, extractionPrompt: e.target.value })
              }
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Customize the information you want to extract from your invoices
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
} 
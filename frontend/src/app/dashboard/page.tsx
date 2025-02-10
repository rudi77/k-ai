'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const overviewCards = [
  {
    title: 'Total Invoices',
    value: '2500+',
    trend: 50.25,
    isPositive: true,
  },
  {
    title: 'Total Sales',
    value: '500+',
    trend: 20.25,
    isPositive: false,
  },
  {
    title: 'Total Profit',
    value: '$ 1000',
    trend: 5.25,
    isPositive: true,
  },
  {
    title: 'Expense',
    value: '$ 5000',
    trend: 50.25,
    isPositive: false,
  },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <select className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 focus:border-red-500 focus:outline-none">
          <option>Select a Category</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card, index) => (
          <div
            key={index}
            className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <span
                className={`flex items-center space-x-1 text-sm ${
                  card.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {card.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{card.trend}%</span>
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full ${
                  card.isPositive ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${card.trend}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Statistics Section */}
      <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Statistics</h2>
          <select className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 focus:border-red-500 focus:outline-none">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>

        {/* Add chart component here */}
        <div className="h-[400px] rounded-lg bg-gray-50">
          {/* We'll need to add a proper chart library like recharts or chart.js */}
        </div>
      </div>
    </div>
  )
} 
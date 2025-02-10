'use client'

import React from 'react'
import { Search, User, Bell } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed left-[240px] right-0 top-0 z-50 flex h-16 items-center justify-between bg-white px-6 shadow-sm">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search your favourite Invoice"
          className="h-10 w-[300px] rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-red-500 focus:bg-white focus:outline-none"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            2
          </span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">John Doe</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200">
            <User className="h-full w-full p-1 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  )
} 
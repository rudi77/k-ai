'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, FileText, Clock, Settings, HelpCircle, LogOut } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { name: 'Upload', href: '/upload', icon: FileText },
  { name: 'History', href: '/history', icon: Clock },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col justify-between bg-[#1a1a1a] text-white">
      <div>
        <div className="flex h-16 items-center px-6">
          <h1 className="flex items-center text-xl font-bold">
            <span className="text-green-500">K</span>
            -AI
          </h1>
        </div>
        
        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-green-700 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mb-4 space-y-1 px-3">
        <Link
          href="/support"
          className="flex items-center space-x-3 rounded-lg px-4 py-3 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <HelpCircle className="h-5 w-5" />
          <span>Support</span>
        </Link>
        <button
          className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          onClick={() => {/* TODO: Implement logout */}}
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
} 
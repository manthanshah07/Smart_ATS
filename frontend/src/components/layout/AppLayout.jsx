import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { DemoPersonaBar } from './DemoPersonaBar'

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Sticky Demo Role Switcher */}
      <DemoPersonaBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Static Sidebar */}
        <div className="hidden md:block shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Drawer Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 max-w-xs w-full z-50 bg-card shadow-2xl">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 container max-w-7xl py-6 px-4 sm:px-8 space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

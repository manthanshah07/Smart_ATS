import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { DemoPersonaBar } from '../components/layout/DemoPersonaBar'

export const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <DemoPersonaBar />
      <Navbar />
      <main className="flex-1 container max-w-7xl py-8 px-4 sm:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

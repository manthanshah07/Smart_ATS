import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <h1 className="text-6xl font-black text-primary">404</h1>
      <h2 className="text-xl font-semibold">Page Not Found</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        The page you are looking for does not exist or has been relocated.
      </p>
      <Link to="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}

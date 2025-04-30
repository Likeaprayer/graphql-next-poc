"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { isAuthenticated, logoutUser } from "@/lib/auth"
import { Building, LogOut } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === "/login"
  const isHomePage = pathname === "/"

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const authenticated = isAuthenticated()

  // Don't show header on login or home page
  if (isLoginPage || isHomePage) {
    return <>{children}</>
  }

  // Redirect to login if not authenticated
  if (!authenticated && !isLoginPage) {
    router.push("/login")
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            <span className="font-bold">Department Management</span>
          </Link>
          <Button variant="ghost" onClick={logoutUser}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 py-6">{children}</main>
    </div>
  )
}

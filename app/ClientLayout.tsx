'use client'

import Navigation from "@/components/ui/Navigation"
import { AuthProvider } from "@/context/AuthContext"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navigation />
      <main>{children}</main>
    </AuthProvider>
  )
}

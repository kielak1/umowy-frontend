'use client'

import Navigation from "@/components/ui/Navigation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'


const navItems = [
  { href: '/', label: 'Start' },
  { href: '/contracts', label: 'Umowy' },
  { href: '/nowa-umowa', label: 'Nowa umowa' },
  // dodasz więcej później
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '1rem' }}>
        {navItems.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              style={{
                textDecoration: pathname === href ? 'underline' : 'none',
                fontWeight: pathname === href ? 'bold' : 'normal',
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

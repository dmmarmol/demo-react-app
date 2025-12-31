'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function Navbar() {
    const pathname = usePathname()
    
    useEffect(() => {
        console.log('Current pathname:', pathname)
    }, [pathname])

    const links = [
        { href: '/', label: 'Home', enabled: true },
        { href: '/players', label: 'Players', enabled: true },
        { href: '/author', label: 'Author', enabled: false },
    ]

    return (
        <nav className="flex h-full min-h-screen flex-col bg-white py-10 shadow-md">
            <div className="mb-10 flex items-center gap-3 mx-6">
                <img
                    src="https://placehold.co/64x64/0000FF/FFFFFF?text=Logo"
                    alt="Logo"
                    className="h-16 w-16 rounded"
                />
                <div className="text-lg font-semibold text-gray-800">Dashboard</div>
            </div>

            <div className="flex flex-col gap-4 text-base font-medium text-gray-700 ml-6">
                {links.map((link) => {
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={[
                                'block w-full -mr-6 rounded-l-xl rounded-r-none py-2 px-6 text-md text-left transition-colors duration-150',
                                'hover:bg-[var(--ui-bg)] hover:text-gray-100',
                                isActive
                                    ? 'bg-[var(--ui-bg)] text-gray-100 font-medium'
                                    : 'text-primary-500 font-normal',
                                !link.enabled
                                    ? 'pointer-events-none opacity-50'
                                    : '',
                            ].join(' ')}
                        >
                            {link.label}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
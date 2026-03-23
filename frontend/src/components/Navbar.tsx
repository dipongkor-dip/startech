'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { CategoryMegaMenu } from '@/components/CategoryMegaMenu';
import { ThemeChanger } from '@/components/theme/ThemeChanger';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <header className="bg-background border-b border-border">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-indigo-600">Star Tech</span>
        </Link>

        <div className="flex-1 max-w-xl">
          <input
            type="search"
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <nav className="flex items-center gap-4">
          <ThemeChanger />
          <Link href="/offers" className="text-sm font-medium text-foreground/70 hover:text-orange-500">
            Offers
          </Link>
          <Link href="/deals" className="text-sm font-medium text-foreground/70 hover:text-orange-500">
            Deals
          </Link>
          <Link href="/pc-builder" className="text-sm font-medium text-foreground/70 hover:text-orange-500">
            PC Builder
          </Link>
          {isAuthenticated && user ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-foreground/70 hover:text-orange-500"
            >
              {user.profile?.name || user.email || 'Account'}
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      <CategoryMegaMenu />
    </header>
  );
}

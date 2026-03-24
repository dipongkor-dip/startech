'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export default function Home() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10">
      <section className="rounded-2xl border bg-card p-8">
        <h1 className="text-3xl font-bold text-foreground">Star Tech Storefront</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">Browse products by category, apply filters, and manage your account from a role-based dashboard.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/desktops" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Browse Desktops
          </Link>
          <Link href="/blog" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
            Visit Blog
          </Link>
          <Link href="/chat" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
            Open Customer Chat
          </Link>
          <Link href="/delivery" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
            Delivery Info
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Account Status</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isAuthenticated ? `Logged in as ${user?.profile?.name || user?.email || user?.phone}` : "You are not logged in yet."}
        </p>
        {isAuthenticated ? (
          <div className="mt-4 flex gap-3">
            <Link href="/dashboard" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
              Go to Dashboard
            </Link>
            <button onClick={handleLogout} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="mt-4 inline-flex rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Login / Register
          </Link>
        )}
      </section>
    </div>
  );
}

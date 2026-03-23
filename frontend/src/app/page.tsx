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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">StarTech</h1>
      <p className="text-lg text-gray-600 mb-8">
        Next.js frontend with backend microservices
      </p>
      {isAuthenticated && user ? (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <span className="text-gray-700">
            Hello, {user.profile?.name || user.email || user.phone || 'User'}
          </span>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Open dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="mb-8 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
        >
          Login / Register
        </Link>
      )}
      <div className="flex gap-4 flex-wrap justify-center">
        <a
          href="http://localhost:3001"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Delivery (3001)
        </a>
        <a
          href="http://localhost:3002"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Order (3002)
        </a>
        <a
          href="http://localhost:3003"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          User (3003)
        </a>
        <Link
          href="/phones"
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Browse Phones
        </Link>
      </div>
    </div>
  );
}

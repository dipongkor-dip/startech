"use client";

import Link from "next/link";

export function RootFooter() {
  return (
    <footer className="border-t bg-background border">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Star Tech. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <Link href="/chat" className="hover:text-foreground">
            Customer Chat
          </Link>
          <Link href="/delivery" className="hover:text-foreground">
            Delivery
          </Link>
          <Link href="/order" className="hover:text-foreground">
            Order
          </Link>
        </div>
      </div>
    </footer>
  );
}

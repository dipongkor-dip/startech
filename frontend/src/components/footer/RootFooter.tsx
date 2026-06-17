"use client";

import Link from "next/link";

export function RootFooter() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="w-full flex justify-between items-start gap-10 pb-10">
          <div className="min-w-64 space-y-5 px-2">
            <div className="border rounded-2xl px-5 py-1 flex gap-5 items-center">
              <span className="border-r-2 pr-2">ICON</span>
              <span className="flex flex-col">
                <p className="inline">9 AM - 8 PM</p>
                <p className="inline">12345</p>
              </span>
            </div>
            <div className="border rounded-2xl px-5 py-1 flex items-center gap-5">
              <span className="border-r-2 pr-2">ICON</span>
              <span className="flex flex-col">
                <p>Store Locator</p>
                <strong className="inline">Find Our Stores</strong>
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul className="space-y-2 grid grid-cols-3 gap-x-6 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400">
                  Affiliate Program
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Online Delivery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Refund and Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  EMI Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Star Point Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Career
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400">
                  Brands
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="font-bold">Star Tech Ltd</p>
            <p className="text-sm mt-2">Head Office: Dinajpur</p>
            <p className="text-sm">
              Email:{" "}
              <a href="mailto:dipongkorroy000@gmail.com" className="text-blue-400">
                dipongkorroy000@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-y-2 flex justify-between items-center py-1">
          <div className="text-sm">
            © 2026 Star Tech Ltd | All rights reserved <br />
            Powered By: Star Tech
          </div>

          <div className="flex space-x-4">
            <Link href="#" className="hover:text-green-400">
              WhatsApp
            </Link>
            <Link href="#" className="hover:text-blue-500">
              Facebook
            </Link>
            <Link href="#" className="hover:text-red-500">
              YouTube
            </Link>
            <a href="#" className="hover:text-pink-500">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

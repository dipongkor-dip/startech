"use client";

import Link from "next/link";
import {PhoneCall, MapPin, Facebook, Youtube, Instagram, MessageSquare} from "lucide-react";

export function RootFooter() {
  // ক্যাটাগরি অনুযায়ী লিংকগুলোর ডাটা স্ট্রাকচার
  const footerLinks = [
    {name: "Affiliate Program", path: "#"},
    {name: "Online Delivery", path: "#"},
    {name: "Refund and Return Policy", path: "#"},
    {name: "Blog", path: "#"},
    {name: "EMI Terms", path: "#"},
    {name: "Privacy Policy", path: "#"},
    {name: "Star Point Policy", path: "#"},
    {name: "Contact Us", path: "#"},
    {name: "About Us", path: "#"},
    {name: "Terms and Conditions", path: "#"},
    {name: "Career", path: "#"},
    {name: "Brands", path: "#"},
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 🔝 টপ সেকশন: রেসপনসিভ গ্রিড লেআউট */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* ১. কন্টাক্ট ও সাপোর্ট এরিয়া */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white">Support</h3>
            <div className="space-y-3">
              {/* ফোন কল বক্স */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg text-orange-500">
                  <PhoneCall size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">9 AM - 8 PM</p>
                  <p className="text-lg font-bold text-white tracking-wide">12345</p>
                </div>
              </div>

              {/* স্টোর লোকেটর বক্স */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg text-orange-500">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Store Locator</p>
                  <strong className="text-sm font-semibold text-white">Find Our Stores</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ২. অ্যাবাউট ও পলিসি লিংকস (ডেস্কটপে ২ কলাম জায়গা নিবে) */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">About Us</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4 text-sm">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.path} className="text-slate-400 hover:text-orange-500 transition-colors duration-200 block truncate">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ৩. হেড অফিস ও কানেক্টিভিটি */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white">Stay Connected</h3>
            <div className="text-sm space-y-1 text-slate-400">
              <p className="font-bold text-white text-base">Star Tech Ltd</p>
              <p className="pt-1">Head Office: Dinajpur</p>
              <p>
                Email:{" "}
                <a href="mailto:dipongkorroy000@gmail.com" className="text-orange-500 hover:underline">
                  dipongkorroy000@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* 📜 বটম সেকশন: কপিরাইট ও সোশ্যাল আইকন */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="text-xs text-slate-500 leading-relaxed">
            © 2026 <span className="text-slate-400 font-medium">Star Tech Ltd</span> | All rights reserved
            <br />
            <span className="text-slate-600">Powered By: Star Tech</span>
          </div>

          {/* সোশ্যাল মিডিয়া আইকন লিংক */}
          <div className="flex items-center gap-3">
            <Link
              href="#"
              aria-label="WhatsApp"
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-500 border border-slate-800 transition-all"
            >
              <MessageSquare size={18} />
            </Link>
            <Link
              href="#"
              aria-label="Facebook"
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:bg-blue-500/10 hover:text-blue-500 border border-slate-800 transition-all"
            >
              <Facebook size={18} />
            </Link>
            <Link
              href="#"
              aria-label="YouTube"
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:bg-red-500/10 hover:text-red-500 border border-slate-800 transition-all"
            >
              <Youtube size={18} />
            </Link>
            <Link
              href="#"
              aria-label="Instagram"
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:bg-pink-500/10 hover:text-pink-500 border border-slate-800 transition-all"
            >
              <Instagram size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

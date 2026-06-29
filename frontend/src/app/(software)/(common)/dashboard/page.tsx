"use client";

import React from "react";
import {ShoppingBag, CreditCard, MessageSquare, ArrowRight, CheckCircle2, Clock} from "lucide-react";
import Link from "next/link";

export default function CustomerDashboardHome() {
  // ডেমো ডাটা (স্ট্যাটিক)
  const stats = [
    {name: "Total Orders", value: "12", icon: <ShoppingBag className="text-blue-500" size={24} />, desc: "4 delivered this month"},
    {name: "Pending Payments", value: "$180", icon: <CreditCard className="text-amber-500" size={24} />, desc: "1 invoice requires attention"},
    {name: "Unread Messages", value: "3", icon: <MessageSquare className="text-emerald-500" size={24} />, desc: "From support team"},
  ];

  const recentOrders = [
    {id: "#ST-9582", date: "June 28, 2026", product: "AMD Ryzen 5 5600X Processor", total: "$165.00", status: "Delivered"},
    {id: "#ST-9410", date: "June 25, 2026", product: "Corsair Vengeance LPX 16GB RAM", total: "$55.00", status: "Processing"},
    {id: "#ST-9389", date: "June 20, 2026", product: "Samsung 980 Pro 1TB NVMe SSD", total: "$95.00", status: "Delivered"},
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 👋 ওয়েলকাম সেকশন */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Welcome back, Dipongkor!</h1>
        <p className="text-sm text-muted-foreground mt-1">Here is a quick overview of your account activities and recent orders.</p>
      </div>

      {/* 📊 ১. কুইক স্ট্যাটস কার্ডস (Quick Stats Cards) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.name}</span>
              <div className="p-2 bg-accent/50 rounded-lg">{stat.icon}</div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔄 ২. সাম্প্রতিক অর্ডার টেবিল (Recent Orders) */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Recent Orders</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Your latest purchases from StarTech.</p>
          </div>
          <Link href="/dashboard/orders" className="text-xs font-medium text-blue-500 hover:underline flex items-center gap-1">
            View all orders <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-accent/20 text-xs font-medium text-muted-foreground">
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Product</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-accent/10 transition-colors">
                  <td className="p-4 font-mono font-medium text-foreground">{order.id}</td>
                  <td className="p-4 text-muted-foreground">{order.date}</td>
                  <td className="p-4 font-medium text-foreground max-w-[240px] truncate">{order.product}</td>
                  <td className="p-4 text-foreground">{order.total}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {order.status === "Delivered" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ⚡ ৩. কুইক অ্যাকশন বাটন (Quick Actions) */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Need Assistance?</h3>
            <p className="text-sm text-muted-foreground mt-1">Chat with our customer support managers regarding any delivery or warranty issues.</p>
          </div>
          <Link
            href="/dashboard/messages"
            className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/80 rounded-lg transition-colors w-fit"
          >
            Open Messages
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Complete Your Profile</h3>
            <p className="text-sm text-muted-foreground mt-1">Keep your shipping address and phone number updated for faster order dispatch.</p>
          </div>
          <Link
            href="/dashboard/profile"
            className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/80 rounded-lg transition-colors w-fit"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

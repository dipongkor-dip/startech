"use client";

import {Mail, Phone, Calendar, Bike, ShieldCheck, Star, Award, Edit2} from "lucide-react";

const page = () => {
  // ডেমো স্ট্যাটিক ডাটা
  const deliveryData = {
    name: "Rahat Khan",
    email: "rahat.delivery@startech.com",
    phone: "+880 1911-987654",
    joinedDate: "January 2026",
    role: "DELIVERY_BOY",
    status: "ACTIVE",
    vehicleType: "Motorcycle (Yamaha FZ)",
    licenseNumber: "DHAKA-D-123456",
    rating: "4.9",
    totalDeliveries: "342",
    nidVerified: true,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* প্রোফাইল কার্ড হেডার */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground text-3xl font-bold">
            {deliveryData.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{deliveryData.name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">{deliveryData.role}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">{deliveryData.status}</span>
              {deliveryData.nidVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                  <ShieldCheck size={12} /> NID Verified
                </span>
              )}
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/80 text-sm font-medium rounded-lg transition-colors">
          <Edit2 size={16} /> Edit Details
        </button>
      </div>

      {/* পারফরম্যান্স স্ট্যাটস গ্রিড */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rating Performance</p>
            <p className="text-xl font-bold text-foreground">{deliveryData.rating} / 5.0</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Completed Orders</p>
            <p className="text-xl font-bold text-foreground">{deliveryData.totalDeliveries} Deliveries</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* কন্টাক্ট ইনফরমেশন */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-md font-semibold text-foreground border-b border-border pb-2">Contact Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
              <Mail className="text-muted-foreground" size={18} />
              <div>
                <p className="text-xs text-muted-foreground">Work Email</p>
                <p className="text-sm font-medium text-foreground">{deliveryData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
              <Phone className="text-muted-foreground" size={18} />
              <div>
                <p className="text-xs text-muted-foreground">Emergency Contact</p>
                <p className="text-sm font-medium text-foreground">{deliveryData.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
              <Calendar className="text-muted-foreground" size={18} />
              <div>
                <p className="text-xs text-muted-foreground">Joining Date</p>
                <p className="text-sm font-medium text-foreground">{deliveryData.joinedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* লজিস্টিকস ও যানবাহন সংক্রান্ত তথ্য */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-md font-semibold text-foreground border-b border-border pb-2">Logistics & Vehicle</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
              <Bike className="text-muted-foreground" size={18} />
              <div>
                <p className="text-xs text-muted-foreground">Assigned Vehicle</p>
                <p className="text-sm font-medium text-foreground">{deliveryData.vehicleType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
              <ShieldCheck className="text-muted-foreground" size={18} />
              <div>
                <p className="text-xs text-muted-foreground">Driving License No.</p>
                <p className="text-sm font-medium text-foreground font-mono">{deliveryData.licenseNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

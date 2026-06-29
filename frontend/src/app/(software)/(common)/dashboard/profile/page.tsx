"use client";

import {User, Mail, Phone, MapPin, Calendar, Edit2, ShieldAlert} from "lucide-react";

const page = () => {
  const customerData = {
    name: "Dipongkor Roy",
    email: "dipongkorroy000@gmail.com",
    phone: "+880 1712-345678",
    joinedDate: "February 2026",
    role: "CUSTOMER",
    status: "ACTIVE",
    shippingAddress: "House 42, Road 11, Dhanmondi, Dhaka - 1209, Bangladesh",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* প্রোফাইল কার্ড হেডার */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground text-3xl font-bold">
            {customerData.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{customerData.name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">{customerData.role}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">{customerData.status}</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground hover:bg-accent/80 text-sm font-medium rounded-lg transition-colors">
          <Edit2 size={16} /> Edit Profile
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* ব্যক্তিগত তথ্যাদি */}
        <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-md font-semibold text-foreground border-b border-border pb-2">Personal Information</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
              <Mail className="text-muted-foreground" size={18} />
              <div>
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="text-sm font-medium text-foreground">{customerData.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
              <Phone className="text-muted-foreground" size={18} />
              <div>
                <p className="text-xs text-muted-foreground">Phone Number</p>
                <p className="text-sm font-medium text-foreground">{customerData.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
              <Calendar className="text-muted-foreground" size={18} />
              <div>
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="text-sm font-medium text-foreground">{customerData.joinedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* অ্যাকাউন্ট সিকিউরিটি স্ট্যাটাস */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-md font-semibold text-foreground border-b border-border pb-2">Security</h3>
            <div className="mt-4 flex items-start gap-2.5 text-amber-500 bg-amber-500/10 p-3 rounded-lg text-xs">
              <ShieldAlert size={18} className="shrink-0" />
              <p>Two-factor authentication is disabled. Enable it to secure your account.</p>
            </div>
          </div>
          <button className="mt-4 text-xs font-medium text-blue-500 hover:underline w-fit">Manage Password</button>
        </div>
      </div>

      {/* ডেলিভারি/শিপিং ঠিকানা */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
        <h3 className="text-md font-semibold text-foreground border-b border-border pb-2">Default Shipping Address</h3>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 border border-border/50">
          <MapPin className="text-blue-500 mt-0.5 shrink-0" size={20} />
          <div>
            <p className="text-sm text-foreground font-medium leading-relaxed">{customerData.shippingAddress}</p>
            <button className="text-xs text-blue-500 hover:underline mt-2 block">Change Address</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

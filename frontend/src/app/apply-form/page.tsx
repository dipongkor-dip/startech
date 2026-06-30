"use client";

import React, {useState} from "react";
import {Bike, User, Mail, Phone, ShieldCheck, FileText, Send, CheckCircle, MapPin, Calendar} from "lucide-react";
import {toast} from "sonner";

export default function DeliveryBoyApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "", // Date of Birth
    division: "", // বিভাগ
    city: "", // জেলা / শহর
    upazila: "", // উপজেলা / থানা
    vehicleType: "BICYCLE",
    licenseNumber: "",
    nidNumber: "",
    experience: "NONE",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 🎯 ব্যাকএন্ড এপিআই ইন্টিগ্রেশন এরিয়া
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Application Submitted Successfully!");
      setIsSubmitted(true);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 animate-in fade-in duration-500">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-lg space-y-5">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Application Received!</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Thank you for applying as a Delivery Partner at Star Tech. Our team will review your documents and location layout, then contact you within 2-3 business
              days.
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full py-2.5 bg-accent hover:bg-accent/80 text-accent-foreground font-medium rounded-xl transition-colors text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-500">
      <div className="max-w-3xl w-full grid grid-cols-1 md:bg-card md:border md:border-border rounded-2xl md:shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 md:p-10 space-y-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center mb-3 mx-auto md:mx-0">
              <Bike size={26} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Join as a Delivery Partner</h1>
            <p className="text-sm text-muted-foreground">Submit your detailed profile and operational zone details below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 📋 সেকশন ১: ব্যক্তিগত তথ্য (Personal Details) */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-orange-500 uppercase tracking-wider border-b border-border pb-1">Personal Details</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-muted-foreground" size={16} />
                    <input
                      type="date"
                      name="dob"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-orange-500/50 transition-colors cursor-pointer dark:[color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-muted-foreground" size={16} />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@mail.com"
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-muted-foreground" size={16} />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1712-XXXXXX"
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 📍 সেকশন ২: সার্ভিস এরিয়া / ঠিকানা (Service Area Location) */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-orange-500 uppercase tracking-wider border-b border-border pb-1">Preferred Working Zone</h3>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Division (বিভাগ)</label>
                  <select
                    name="division"
                    required
                    value={formData.division}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-orange-500/50 transition-colors cursor-pointer"
                  >
                    <option value="">Select Division</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">City / District (জেলা)</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Dinajpur / Dhaka"
                      className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Upazila / Thana (থানা)</label>
                  <input
                    type="text"
                    name="upazila"
                    required
                    value={formData.upazila}
                    onChange={handleChange}
                    placeholder="e.g. Kotwali / Mirpur"
                    className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 🛡️ সেকশন ৩: আইডেন্টিটি ও লজিস্টিকস (Identity & Logistics) */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-orange-500 uppercase tracking-wider border-b border-border pb-1">Verification & Experience</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">NID Number</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      name="nidNumber"
                      required
                      value={formData.nidNumber}
                      onChange={handleChange}
                      placeholder="National ID Number"
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-orange-500/50 transition-colors cursor-pointer"
                  >
                    <option value="BICYCLE">Bicycle (বাইসাইকেল)</option>
                    <option value="MOTORCYCLE">Motorcycle (মোটরসাইকেল)</option>
                    <option value="VAN">Van / Commercial Vehicle</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Driving License <span className="text-muted-foreground/50 text-[10px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="License Number (If Motorcycle)"
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Delivery Experience</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-orange-500/50 transition-colors cursor-pointer"
                  >
                    <option value="NONE">No prior experience (কোনো অভিজ্ঞতা নেই)</option>
                    <option value="LESS_THAN_1_YEAR">Less than 1 Year (১ বছরের কম)</option>
                    <option value="MORE_THAN_1_YEAR">1+ Years Experience (১ বছরের বেশি)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ⚡ সাবমিট বাটন */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm shadow-md shadow-orange-600/10"
            >
              <Send size={16} className={isSubmitting ? "animate-spin" : ""} />
              <span>{isSubmitting ? "Submitting Application..." : "Submit Application"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

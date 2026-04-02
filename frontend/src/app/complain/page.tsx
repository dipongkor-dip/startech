"use client";

import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Send, Phone, Mail, Clock, CheckCircle, AlertCircle, Facebook, Instagram, Linkedin} from "lucide-react";

export default function ComplainPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    subject: "",
    description: "",
    category: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = ["Product Quality", "Delivery Issue", "Payment Problem", "Customer Service", "Technical Support", "Return/Refund", "Website Issue", "Other"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white dark:bg-black">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Complaint Submitted!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">We&apos;ve received your complaint and will respond within 24 hours.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Complaint ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <Button onClick={() => setSubmitted(false)} className="w-full">
                Submit Another Complaint
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="my-5 border max-w-7xl mx-auto">
      <div className="bg-card p-10 shadow-sm min-h-screen">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold mb-2">Raise a Complaint</h1>
          <p className="text-gray-600 dark:text-gray-300">We&apos;re here to help. Submit your complaint and we&apos;ll resolve it quickly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Complaint Form */}
          <div className="lg:col-span-2">
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Complaint Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="w-full border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 px-2 py-2 dark:border-gray-600 input-font-poppins"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="w-full border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 px-2 py-2 dark:border-gray-600 input-font-poppins"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+880 1XXX XXXXXX"
                      className="w-full border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 px-2 py-2 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Number (if applicable)</label>
                    <Input
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                      placeholder="ORD-XXXXXX"
                      className="w-full border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 px-2 py-2 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Complaint Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      required
                      className="w-full px-2 py-2 border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white dark:border-gray-600 input-font-poppins"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Brief description of your complaint"
                      required
                      className="w-full border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 focus:ring-0 px-2 py-2 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detailed Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("description", e.target.value)}
                      placeholder="Please provide detailed information about your complaint..."
                      rows={6}
                      required
                      className="w-full px-2 py-2 border-0 border-b-2 border-gray-300 rounded-none focus:ring-0 text-gray-900 dark:text-white dark:border-gray-600 input-font-poppins"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Submit Complaint
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Hotline</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">+880 123 456 789</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Support</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">support@startech.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Response Time</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Within 24 hours</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">What happens next?</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>We acknowledge your complaint immediately</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Support team investigates within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Resolution provided within 3-5 business days</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h3 className="text-xl font-bold">STAR TECH</h3>
          </div>
          <div className="flex justify-center gap-4">
            <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-pink-600 hover:text-pink-700 transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-blue-700 hover:text-blue-800 transition-colors">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

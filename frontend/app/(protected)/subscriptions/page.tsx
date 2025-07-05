"use client";

import axios from "axios";
import { Crown, User2Icon } from "lucide-react";
import {  useState } from "react";
import { toast } from "sonner";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
   try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK");
      setLoading(false);
      return;
    }

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/subscriptions/create`,
      null,
      {
        withCredentials: true,
      }
    );

    const options = {
      key: data.keyId,
      subscription_id: data.subscriptionId,
      name: "Notecraft Pro",
      description: "Unlock unlimited AI formatting",
      image: "/document.svg",
      theme: { color: "#6366F1" },
      handler: function () {
        toast.success("Subscription successful!");
        window.location.href = "/";
      },
      prefill: {
        email: data.email,
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
   } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Failed to create subscription. Please try again.");
    } finally{
      setLoading(false);
    }
    
   }
  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 ">
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-6 mt-16 md:mt-0">
        {/* Free Plan */}
        <div className="bg-white outline outline-blue-500 p-6 rounded-lg shadow-md w-full md:w-1/2">
          <h2 className="text-xl font-semibold flex items-center gap-x-2 text-gray-800 mb-2">
            <User2Icon className="h-8 w-8 " />
            Free
          </h2>
          <p className="text-gray-600 mb-1">Perfect for getting started</p>
          <p className="text-2xl font-bold text-gray-800 mb-2">₹0</p>
          <p className="text-gray-500 mb-4">Always free</p>
          <ul className="space-y-2 text-gray-800 ">
            <li className="flex items-center">✅ 10 AI formatting credits</li>
            <li className="flex items-center">✅ Create unlimited documents</li>
            <li className="flex items-center">✅ Public document sharing</li>
            <li className="flex items-center">✅ Light mode & Dark mode</li>
          </ul>
          <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mt-4">
            Current Plan
          </span>
        </div>

        {/* Pro Plan */}
        <div className="bg-white outline outline-blue-500 p-6 rounded-lg shadow-md w-full md:w-1/2">
        
          <h2 className="text-xl font-semibold flex items-center gap-x-2 text-gray-800 mb-2">
          <Crown className="h-8 w-8" /> Pro
          </h2>
          <p className="text-gray-600 mb-1">For power users & writers</p>
          <p className="text-2xl font-bold text-gray-800 mb-2">₹399/month</p>
          <p className="text-gray-500 mb-4">Billed monthly</p>
          <ul className="space-y-2 text-gray-800 ">
            <li className="flex items-center">✅ 100+ AI formatting credits</li>
            <li className="flex items-center">
              ✅ Early access to new features
            </li>
            <li className="flex items-center">✅ Priority support</li>
          </ul>
          <button onClick={handleSubscribe} disabled={loading} className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useAppSelector } from "@/hooks/redux-hooks";
import axios, { AxiosError } from "axios";
import { Crown, User2Icon, CheckCircle } from "lucide-react";
import { useState } from "react";
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
  const user = useAppSelector((state) => state.user);
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
          toast.success("Subscription successfull!");
          window.location.href = "/";
        },
        modal: {
          ondismiss: async function () {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/subscriptions/cancel`, {
              subscriptionId: data.subscriptionId,
            }, {
              withCredentials: true,
            });
          },
        },
        prefill: {
          email: data.email,
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error subscribing:", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("unexpected error ");
      }
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-6 mt-16 md:mt-0">
        <div className="bg-white dark:bg-gray-800 outline outline-emerald-500 p-6 rounded-lg shadow-md w-full md:w-1/2">
          <h2 className="text-xl font-semibold flex items-center gap-x-2 text-gray-800 dark:text-gray-200 mb-2">
            <User2Icon className="h-8 w-8" />
            Free
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-1">Perfect for getting started</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">₹0</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Always free</p>
          <ul className="space-y-2 text-gray-800 dark:text-gray-200">
            <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-emerald-500" /> 10 AI formatting credits</li>
            <li className="flex items-center"> <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" /> Create unlimited documents</li>
            <li className="flex items-center"> <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" /> Public document sharing</li>
          </ul>
        </div>


        <div className="bg-white dark:bg-gray-800 outline outline-emerald-500 p-6 rounded-lg shadow-md w-full md:w-1/2">
          <h2 className="text-xl font-semibold flex items-center gap-x-2 text-gray-800 dark:text-gray-200 mb-2">
            <Crown className="h-8 w-8" /> Pro
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-1">For power users & writers</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">₹399/month</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Billed monthly</p>
          <ul className="space-y-2 text-gray-800 dark:text-gray-200">
            <li className="flex items-center"> <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" /> 100+ AI formatting credits</li>
            <li className="flex items-center"> <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" /> Early access to new features</li>
            <li className="flex items-center"> <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" /> Priority support</li>
          </ul>
          {user.isPro ? (
            <div className="mt-6 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg">
              <p className="text-lg font-semibold">You are currently on the Pro plan!</p>
              <p className="text-sm">Thank you for your support!</p>
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="mt-6 w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-400 transition"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

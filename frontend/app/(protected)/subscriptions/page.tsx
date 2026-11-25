"use client";

import { useAppSelector } from "@/hooks/redux-hooks";
import { createSubscriptionApi, cancelSubscriptionApi } from "@/lib/api/payment";
import { getApiErrorMessage } from "@/lib/api/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Check, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { queryClient } from "@/helpers/tanstack";
import { PRICING_PLANS } from "@/app/(root)/_components/pricing";
import Link from "next/link";

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
  const router = useRouter();

  useEffect(() => {
    if (user.status === "unauthenticated") {
      router.replace("/login");
    }
  }, [user.status, router]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Failed to load Razorpay SDK");
        setLoading(false);
        return;
      }

      const res = await createSubscriptionApi();
      const data = res.data;
      if (!data) {
        throw new Error(res.message || "Failed to create subscription");
      }

      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Notecraft Pro",
        description: "Unlock unlimited AI formatting",
        image: "/document.svg",
        theme: { color: "#10B981" },
        handler: function () {
          toast.success("Subscription successful!");
          window.location.href = "/?subscribed=true";
        },
        modal: {
          ondismiss: async function () {
            await cancelSubscriptionApi();
          },
        },
        prefill: {
          email: user.email,
          name: user.name,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      await cancelSubscriptionApi();
      toast.success("Subscription cancelled");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    } catch (error) {
      console.error("Error unsubscribing:", error);
      toast.error(getApiErrorMessage(error));
    }
  };

  if (user.subscriptionStatus === "pending") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-4 px-4 bg-background dark:bg-[#1F1F1F]">
        <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
        <h2 className="text-xl font-bold tracking-tight">
          Your payment is being processed...
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Please wait a few moments while we confirm your subscription. Do not refresh or retry payment. This page will update automatically once your payment is verified.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#1F1F1F] flex flex-col items-center justify-center pt-28 pb-16 px-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            Subscription Plans
          </h2>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Upgrade Your Notecraft Superpowers
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Transparent pricing designed to power your knowledge base, writing, and AI assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRICING_PLANS.map((plan, idx) => {
            const isProCard = plan.popular;

            return (
              <div
                key={idx}
                className={`relative p-8 rounded-3xl border flex flex-col justify-between transition-all duration-200 ${
                  isProCard
                    ? "border-emerald-500/60 bg-gradient-to-b from-emerald-500/5 to-transparent dark:from-emerald-500/10 shadow-xl"
                    : "border-border/80 bg-card hover:border-neutral-400 dark:hover:border-neutral-700"
                }`}
              >
                {isProCard && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold">{plan.name}</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className="text-muted-foreground text-sm font-medium">/{plan.period}</span>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-border/60">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  {isProCard ? (
                    user.isPro ? (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center text-xs font-semibold">
                          ✨ You are currently on the Pro plan!
                        </div>
                        <Button
                          variant="destructive"
                          className="w-full py-5 text-sm font-semibold rounded-xl"
                          onClick={cancelSubscription}
                        >
                          Cancel Subscription
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="w-full py-5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connecting to Razorpay...
                          </>
                        ) : (
                          <>
                            Upgrade to Pro
                            <ArrowRight className="h-4 w-4 ml-1.5" />
                          </>
                        )}
                      </Button>
                    )
                  ) : user.isPro ? (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full py-5 text-sm font-semibold rounded-xl"
                    >
                      <Link href="/documents">
                        Included in Pro
                        <ArrowRight className="h-4 w-4 ml-1.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full py-5 text-sm font-semibold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                    >
                      <Link href="/documents">
                        Current Active Plan
                        <ArrowRight className="h-4 w-4 ml-1.5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

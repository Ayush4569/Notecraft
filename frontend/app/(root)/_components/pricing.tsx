"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux-hooks";
import { toast } from "sonner";

export const PRICING_PLANS = [
  {
    name: "Free Starter",
    price: "₹0",
    period: "forever",
    description: "Everything you need to write, organize, and publish your ideas.",
    features: [
      "Unlimited notes & nested sub-pages",
      "Full block-based editor canvas",
      "One-click public web publishing",
      "10 free AI formatting trials",
      "Instant trash retention & recovery",
      "Guest mode with instant workspace",
    ],
    cta: "Start Free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Notecraft Pro",
    price: "₹399",
    period: "per month",
    description: "For power creators, writers, and teams who rely heavily on AI assistance.",
    features: [
      "Everything included in Free Starter",
      "Unlimited AI writing & reformatting credits",
      "Faster AI model generation speed",
      "Pro profile badge across the app",
      "Early access to newly released features",
      "Priority customer & technical support",
    ],
    cta: "Upgrade to Pro",
    href: "/subscriptions",
    popular: true,
  },
];

export function Pricing() {
  const { status, isPro } = useAppSelector((state) => state.user);
  const router = useRouter();

  const handlePlanClick = (e: React.MouseEvent, plan: (typeof PRICING_PLANS)[0]) => {
    e.preventDefault();
    if (status !== "authenticated") {
      if (plan.popular) {
        toast.info("Please sign in or create an account to subscribe to Notecraft Pro.");
        router.push("/login");
      } else {
        router.push(plan.href);
      }
      return;
    }

    if (plan.popular) {
      if (isPro) {
        router.push("/documents");
      } else {
        router.push("/subscriptions");
      }
    } else {
      router.push("/documents");
    }
  };

  return (
    <section id="pricing" className="w-full max-w-5xl mx-auto px-4 py-16 scroll-mt-20">
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
          Transparent Pricing
        </h2>
        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Simple Plans for Every Thinker
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Start for free without a credit card. Upgrade when you need unlimited AI superpowers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {PRICING_PLANS.map((plan, idx) => (
          <div
            key={idx}
            className={`relative p-8 rounded-3xl border flex flex-col justify-between transition-all duration-200 ${
              plan.popular
                ? "border-emerald-500/60 bg-gradient-to-b from-emerald-500/5 to-transparent dark:from-emerald-500/10 shadow-xl"
                : "border-border/80 bg-card hover:border-neutral-400 dark:hover:border-neutral-700"
            }`}
          >
            {plan.popular && (
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
              <Button
                onClick={(e) => handlePlanClick(e, plan)}
                className={`w-full py-5 text-sm font-semibold rounded-xl ${
                  plan.popular
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow"
                    : "bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                }`}
              >
                {status === "authenticated"
                  ? plan.popular
                    ? isPro
                      ? "Currently Active"
                      : "Upgrade to Pro"
                    : "Go to Dashboard"
                  : plan.cta}
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


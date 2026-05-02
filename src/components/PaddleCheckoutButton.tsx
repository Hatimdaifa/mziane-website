"use client";

import { getPaddleInstance } from "@paddle/paddle-js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  priceId: string;
  label: string;
  popular?: boolean;
}

export default function PaddleCheckoutButton({ priceId, label, popular }: Props) {
  const handleCheckout = () => {
    const paddle = getPaddleInstance();
    if (!paddle) return;
    paddle.Checkout.open({ items: [{ priceId, quantity: 1 }] });
  };

  return (
    <Button
      onClick={handleCheckout}
      className={cn(
        "w-full h-12 rounded-full font-bold border-2 border-zinc-900 transition-all text-base",
        "shadow-[4px_4px_0px_0px] shadow-amber-400 hover:shadow-[6px_6px_0px_0px]",
        "hover:translate-x-[-2px] hover:translate-y-[-2px]",
        popular
          ? "bg-zinc-900 text-white hover:bg-zinc-800"
          : "bg-white text-zinc-900 hover:bg-zinc-50"
      )}
    >
      {label}
    </Button>
  );
}

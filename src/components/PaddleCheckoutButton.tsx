"use client";

import { getPaddle } from "@paddle/paddle-js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  priceId: string;
  label: string;
  popular?: boolean;
}

export default function PaddleCheckoutButton({ priceId, label, popular }: Props) {
  const handleCheckout = () => {
    const paddle = getPaddle();
    if (!paddle) return;
    paddle.Checkout.open({ items: [{ priceId, quantity: 1 }] });
  };

  return (
    <Button
      onClick={handleCheckout}
      className={cn(
        "w-full rounded-full font-bold border-2 border-zinc-900 transition-all",
        "shadow-[3px_3px_0px_0px] shadow-zinc-900 hover:shadow-[5px_5px_0px_0px]",
        "hover:translate-x-[-1px] hover:translate-y-[-1px]",
        popular
          ? "bg-amber-400 text-zinc-900 hover:bg-amber-300"
          : "bg-white text-zinc-900 hover:bg-zinc-50"
      )}
    >
      {label}
    </Button>
  );
}

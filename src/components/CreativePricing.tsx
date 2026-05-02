import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PricingTier {
  name: string;
  icon: React.ReactNode;
  price: number | string;
  unit?: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaLabel?: string;
}

export default function CreativePricing({
  tag = "Tarifs transparents",
  title = "Des prix clairs, sans surprise",
  description = "Sans frais cachés, sans engagement",
  tiers,
}: {
  tag?: string;
  title?: string;
  description?: string;
  tiers: PricingTier[];
}) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center space-y-6 mb-16">
        <div className="font-handwritten text-xl text-blue-500 rotate-[-1deg]">{tag}</div>
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold font-handwritten text-zinc-900 rotate-[-1deg]">
            {title}
            <span className="absolute -right-10 top-0 text-amber-500 rotate-12 text-3xl">✨</span>
            <span className="absolute -left-6 bottom-0 text-blue-500 -rotate-12 text-3xl">⭐️</span>
          </h2>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-3 bg-blue-500/20 rotate-[-1deg] rounded-full blur-sm" />
        </div>
        <p className="font-handwritten text-xl text-zinc-600 rotate-[-1deg]">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            className={cn(
              "relative group transition-all duration-300",
              index === 0 && "rotate-[-1deg]",
              index === 1 && "rotate-[1deg]",
              index === 2 && "rotate-[-2deg]"
            )}
          >
            <div
              className={cn(
                "absolute inset-0 bg-white border-2 border-zinc-900 rounded-lg",
                "shadow-[4px_4px_0px_0px] shadow-zinc-900",
                "transition-all duration-300",
                "group-hover:shadow-[8px_8px_0px_0px]",
                "group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]"
              )}
            />
            <div className="relative p-6">
              {tier.popular && (
                <div className="absolute -top-2 -right-2 bg-amber-400 text-zinc-900 font-handwritten px-3 py-1 rounded-full rotate-12 text-sm border-2 border-zinc-900">
                  Populaire !
                </div>
              )}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center border-2 border-zinc-900 text-blue-600">
                  {tier.icon}
                </div>
                <h3 className="font-handwritten text-2xl text-zinc-900">{tier.name}</h3>
                <p className="font-handwritten text-zinc-600">{tier.description}</p>
              </div>

              <div className="mb-6 font-handwritten">
                {typeof tier.price === "number" && tier.price === 0 ? (
                  <span className="text-4xl font-bold text-zinc-900">Gratuit</span>
                ) : typeof tier.price === "string" ? (
                  <span className="text-3xl font-bold text-zinc-900">{tier.price}</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-zinc-900">{tier.price}€</span>
                    {tier.unit && <span className="text-zinc-600 ml-1">{tier.unit}</span>}
                  </>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-zinc-900 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="font-handwritten text-lg text-zinc-900">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={cn(
                  "w-full h-12 font-handwritten text-lg",
                  "border-2 border-zinc-900 transition-all duration-300",
                  "shadow-[4px_4px_0px_0px] shadow-zinc-900",
                  "hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]",
                  tier.popular
                    ? "bg-amber-400 text-zinc-900 hover:bg-amber-300"
                    : "bg-zinc-50 text-zinc-900 hover:bg-white"
                )}
              >
                {tier.ctaLabel ?? "Commencer"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

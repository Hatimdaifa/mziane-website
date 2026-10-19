import type { Metadata } from "next";
import EspaceShell from "@/components/espace/EspaceShell";

export const metadata: Metadata = {
  title: "Espace client",
  robots: { index: false, follow: false },
};

export default function EspaceLayout({ children }: { children: React.ReactNode }) {
  return <EspaceShell>{children}</EspaceShell>;
}

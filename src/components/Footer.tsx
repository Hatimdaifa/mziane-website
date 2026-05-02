import Link from "next/link";
import { Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-2 border-zinc-200 py-10 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center">
            <Building2 className="w-3 h-3 text-amber-400" />
          </div>
          <span className="font-black text-zinc-900">Mziane</span>
        </div>
        <p className="text-sm text-zinc-500">© {new Date().getFullYear()} Mziane · Mentions légales · CGV · RGPD</p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <Link href="#" className="hover:text-zinc-900 transition-colors">Contact</Link>
          <Link href="#" className="hover:text-zinc-900 transition-colors">FAQ</Link>
          <Link href="#" className="hover:text-zinc-900 transition-colors">Blog</Link>
        </div>
      </div>
    </footer>
  );
}

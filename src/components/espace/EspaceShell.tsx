"use client";

// Cadre de l'espace client : vérifie la connexion, rattache une commande en attente, affiche les onglets.
import { createContext, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FolderOpen, LogOut, UserRound, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { attachPending, useSession, type Profile } from "@/lib/espace";

interface Ctx { userId: string; email: string; profile: Profile | null }
const EspaceContext = createContext<Ctx | null>(null);

export function useEspace() {
  const c = useContext(EspaceContext);
  if (!c) throw new Error("useEspace hors de l'espace client");
  return c;
}

export default function EspaceShell({ children }: { children: React.ReactNode }) {
  const { loading, session, profile } = useSession();
  const router = useRouter();
  const pathname = usePathname() ?? "/espace";
  const attached = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace(`/connexion?suivant=${encodeURIComponent(pathname)}`);
      return;
    }
    if (attached.current) return;
    attached.current = true;
    attachPending(session.user.id).then((id) => { if (id) router.replace(`/espace/dossier/${id}`); });
  }, [loading, session, pathname, router]);

  if (loading || !session) {
    return <div className="grid min-h-[60vh] place-items-center bg-zinc-50 text-sm text-zinc-500" role="status">Chargement de votre espace...</div>;
  }

  const conseiller = profile?.role === "conseiller";
  const tabs = [
    { href: "/espace", label: "Mes dossiers", icon: FolderOpen, active: pathname === "/espace" || pathname.startsWith("/espace/dossier") },
    ...(conseiller ? [{ href: "/espace/conseiller", label: "Tous les dossiers", icon: UsersRound, active: pathname.startsWith("/espace/conseiller") }] : []),
    { href: "/espace/profil", label: "Mon profil", icon: UserRound, active: pathname.startsWith("/espace/profil") },
  ];

  async function logout() {
    await supabase().auth.signOut();
    router.replace("/connexion");
  }

  return (
    <EspaceContext.Provider value={{ userId: session.user.id, email: session.user.email ?? "", profile }}>
      <div className="min-h-[70vh] bg-zinc-50 pb-24">
        <div className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-[1080px] items-center gap-1 overflow-x-auto px-4 sm:px-6">
            {tabs.map(({ href, label, icon: Icon, active }) => (
              <Link key={href} href={href} aria-current={active ? "page" : undefined}
                className={cn("inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3.5 text-sm font-semibold transition", active ? "border-blue-700 text-blue-700" : "border-transparent text-zinc-600 hover:text-zinc-900")}>
                <Icon className="h-4 w-4" aria-hidden /> {label}
              </Link>
            ))}
            <button type="button" onClick={logout} className="ml-auto inline-flex shrink-0 items-center gap-2 px-3 py-3.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900">
              <LogOut className="h-4 w-4" aria-hidden /> <span className="max-sm:sr-only">Se déconnecter</span>
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-[1080px] px-4 pt-8 sm:px-6">{children}</div>
      </div>
    </EspaceContext.Provider>
  );
}

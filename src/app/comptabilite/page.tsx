import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, Shield, Users } from "lucide-react";

const prestations = [
  { icon: "📁", title: "Tenue de comptabilité", desc: "Saisie des pièces, lettrage des comptes, rapprochements bancaires et grand livre mensuel conformes au CGNC (Code Général de Normalisation Comptable)." },
  { icon: "📋", title: "Déclarations fiscales (DGI)", desc: "TVA, IS, IR, Patente, taxe professionnelle — déclarations et télépaiement sur Simpl-IS, Simpl-TVA et portail DGI." },
  { icon: "📈", title: "Bilan & liasse fiscale", desc: "Établissement du bilan annuel, CPC, tableau de financement et liasse fiscale dans les délais légaux au Maroc." },
  { icon: "💼", title: "Gestion de la paie (CNSS)", desc: "Bulletins de paie, déclarations CNSS, CIMR, AMO et bordereau de versement mensuel." },
  { icon: "🔍", title: "Conseil & optimisation fiscale", desc: "Analyse de votre résultat, optimisation IS/IR, recommandations sur les régimes d'imposition et avantages fiscaux disponibles." },
  { icon: "📊", title: "Tableaux de bord financiers", desc: "Reporting mensuel sur votre trésorerie, chiffre d'affaires et résultat pour piloter votre activité en temps réel." },
];

const obligations = [
  { code: "TVA", label: "Taxe sur la Valeur Ajoutée", freq: "Mensuelle ou trimestrielle", taux: "7% / 10% / 14% / 20%" },
  { code: "IS", label: "Impôt sur les Sociétés", freq: "Acomptes + solde annuel", taux: "Barème progressif 20-35%" },
  { code: "IR", label: "Impôt sur le Revenu (auto-entrepreneur)", freq: "Mensuelle", taux: "1% (commerce) · 2% (services)" },
  { code: "CNSS", label: "Cotisations sociales salariés", freq: "Mensuelle", taux: "26,46% patronal · 6,29% salarial" },
  { code: "Patente", label: "Taxe professionnelle", freq: "Annuelle (30 nov.)", taux: "10% sur valeur locative" },
];

export default function ComptabilitePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-amber-100 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="inline-flex items-center gap-2 bg-blue-100 border-2 border-blue-400 rounded-full px-4 py-1.5 text-sm font-semibold text-blue-800 mb-8 rotate-[-1deg]">
          📊 Experts-comptables & comptables agréés au Maroc
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-zinc-900 leading-[1.05] tracking-tight mb-6 max-w-3xl">
          Votre comptabilité marocaine,
          <br />
          <span className="relative inline-block">
            <span className="relative z-10">entre de bonnes mains.</span>
            <span className="absolute bottom-1 left-0 w-full h-4 bg-amber-300 -z-0 rotate-[-1deg]" />
          </span>
        </h1>
        <p className="text-xl text-zinc-600 mb-10 max-w-xl leading-relaxed">
          TVA, IS, IR, CNSS, patente — confiez vos obligations fiscales et sociales
          à nos experts-comptables agréés au Maroc et concentrez-vous sur votre activité.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button className="h-14 px-8 bg-zinc-900 text-white text-lg font-bold rounded-full shadow-[4px_4px_0px_0px] shadow-amber-400 hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            Obtenir un devis →
          </Button>
          <Button asChild variant="outline" className="h-14 px-8 text-lg font-bold rounded-full border-2 border-zinc-900 hover:bg-zinc-100 transition-all">
            <Link href="/tarifs">Voir les tarifs</Link>
          </Button>
        </div>
      </section>

      {/* ── PRESTATIONS ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-blue-500 font-semibold mb-2">Nos prestations</p>
          <h2 className="text-4xl font-black text-zinc-900 mb-4">Tout ce que nous gérons pour vous</h2>
          <p className="text-zinc-600 max-w-xl mx-auto">Conformes au CGNC, au Code Général des Impôts marocain et aux obligations DGI/CNSS.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prestations.map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border-2 border-zinc-200 rounded-2xl p-6 hover:border-zinc-900 hover:shadow-[4px_4px_0px_0px] hover:shadow-zinc-900 transition-all duration-200">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="font-black text-lg text-zinc-900 mb-2">{title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OBLIGATIONS FISCALES ── */}
      <section className="bg-zinc-50 border-y-2 border-zinc-200 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-500 font-semibold mb-2">Référentiel fiscal marocain</p>
            <h2 className="text-4xl font-black text-zinc-900 mb-4">Les principales obligations au Maroc</h2>
            <p className="text-zinc-600 max-w-xl mx-auto">On s&apos;occupe de chaque déclaration dans les délais pour éviter les pénalités DGI.</p>
          </div>
          <div className="border-2 border-zinc-900 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px] shadow-zinc-900 bg-white max-w-3xl mx-auto">
            {obligations.map(({ code, label, freq, taux }, i) => (
              <div key={code} className={cn("flex items-center gap-4 px-6 py-4", i !== obligations.length - 1 ? "border-b-2 border-zinc-100" : "")}>
                <span className="font-black text-sm bg-amber-400 text-zinc-900 px-3 py-1 rounded-full border-2 border-zinc-900 min-w-[60px] text-center">{code}</span>
                <div className="flex-1">
                  <p className="font-bold text-zinc-900 text-sm">{label}</p>
                  <p className="text-xs text-zinc-500">{freq}</p>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg text-right">{taux}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENTS ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-blue-500 font-semibold mb-2">Nos engagements</p>
          <h2 className="text-4xl font-black text-zinc-900">Réactif. Conforme. Transparent.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Clock className="w-7 h-7" />, title: "Réponse sous 24h", desc: "Votre expert-comptable dédié répond à toutes vos questions dans la journée, par téléphone, email ou WhatsApp.", color: "bg-blue-50 text-blue-600" },
            { icon: <Shield className="w-7 h-7" />, title: "Zéro pénalité DGI", desc: "Toutes vos déclarations sont déposées avant les échéances légales. En cas d'erreur de notre fait, nous prenons en charge les pénalités.", color: "bg-amber-50 text-amber-600" },
            { icon: <Users className="w-7 h-7" />, title: "Expert dédié", desc: "Un seul interlocuteur expert-comptable ou comptable agréé (OEC/OPCAM) qui connaît votre dossier sur le bout des doigts.", color: "bg-green-50 text-green-600" },
          ].map((item) => (
            <div key={item.title} className="bg-white border-2 border-zinc-200 rounded-2xl p-8 hover:border-zinc-900 hover:shadow-[4px_4px_0px_0px] hover:shadow-zinc-900 transition-all duration-200">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-5", item.color)}>
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-zinc-900 mb-2">{item.title}</h3>
              <p className="text-zinc-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-zinc-900 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Externalisons votre comptabilité.</h2>
          <p className="text-zinc-400 text-lg mb-10">Premier mois offert pour tout nouveau client.</p>
          <Button className="h-14 px-10 bg-amber-400 text-zinc-900 text-lg font-black rounded-full shadow-[4px_4px_0px_0px] shadow-amber-600 hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            Obtenir un devis gratuit →
          </Button>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/site";
import { CONTACT, PROMESSES, packById, waLink } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Politique de remboursement",
  description: "Annulation, rétractation et remboursement chez Mziane : commande sans paiement, frais d'État, packs et aides de l'État.",
};

const MOIS = packById("lancement")?.months ?? 12;

export default function PolitiqueRemboursement() {
  return (
    <LegalShell title="Politique de remboursement" updated="Mise à jour : 19 octobre 2026">
      <section>
        <h2>1. Avant le paiement : annulation libre</h2>
        <p>
          Passer commande sur le site ne vous engage à aucun paiement. Tant que vous n&apos;avez pas accepté le récapitulatif de votre conseiller et payé,
          vous pouvez annuler votre commande sans frais, par simple message.
        </p>
      </section>

      <section>
        <h2>2. Droit de rétractation</h2>
        <p>
          Si vous êtes un consommateur, vous disposez du droit de rétractation prévu par la loi n° 31-08 pour les contrats conclus à distance, dans le
          délai et sous les exceptions prévus par cette loi. Si vous nous demandez de commencer la prestation avant la fin de ce délai, les démarches
          déjà réalisées et les frais d&apos;État déjà engagés pour votre compte restent dus.
        </p>
      </section>

      <section>
        <h2>3. Frais d&apos;État</h2>
        <p>
          Les frais d&apos;État que nous avons déjà payés à l&apos;administration pour votre compte (certificat négatif, greffe, annonces légales, taxes de
          l&apos;OMPIC) ne peuvent pas être remboursés, sauf si l&apos;organisme concerné les rembourse lui-même. Les frais d&apos;État non encore engagés vous sont
          intégralement restitués.
        </p>
      </section>

      <section>
        <h2>4. Prestation non réalisée de notre fait</h2>
        <p>
          Si nous ne réalisons pas une prestation payée pour une raison qui nous est imputable, nous vous remboursons les honoraires correspondants.
        </p>
      </section>

      <section>
        <h2>5. Packs et abonnements</h2>
        <ul className="grid gap-1.5">
          <li>Les packs comportent un engagement de {MOIS} mois. Les mensualités échues ne sont pas remboursées.</li>
          <li>En cas d&apos;arrêt anticipé, la remise accordée (éléments offerts et réduction) est due au prorata des mois restants, comme prévu dans nos <Link href="/terms-and-conditions">conditions générales de vente</Link>.</li>
          <li>Pour un pack payé d&apos;avance, les mois non entamés sont remboursés, déduction faite de la remise due au prorata.</li>
          <li>La comptabilité n&apos;étant facturée qu&apos;à partir du registre de commerce, aucun mois de comptabilité n&apos;est dû avant son obtention.</li>
        </ul>
      </section>

      <section>
        <h2>6. Aides de l&apos;État</h2>
        <p>
          {PROMESSES.zeroRefus}{" "}Le diagnostic est gratuit. Les honoraires ne sont facturés qu&apos;au versement de l&apos;aide (ou à l&apos;accord pour un prêt
          d&apos;honneur) : il n&apos;y a donc rien à rembourser en cas de refus.
        </p>
      </section>

      <section>
        <h2>7. Comment demander un remboursement</h2>
        <p>
          Écrivez-nous à <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ou sur WhatsApp au{" "}
          <a href={waLink("Bonjour, je souhaite faire une demande de remboursement.")} target="_blank" rel="noopener noreferrer">{CONTACT.whatsappDisplay}</a>,
          en indiquant votre nom et votre commande. Nous vous répondons par écrit. Le remboursement accepté est effectué par le moyen de paiement utilisé,
          dans le délai prévu par la loi n° 31-08 [délai à confirmer].
        </p>
      </section>
    </LegalShell>
  );
}

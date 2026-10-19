import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/site";
import {
  ADDONS, AIDES_BAREME, AIDES_MIN, AIDES_PLAFOND, COMPTA_EXTRAS, CONTACT, PROMESSES, TVA,
  fmt, fmtDH, offerById, packById, packTerre, waLink,
} from "@/lib/offers";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales de vente de Mziane : commande, prix, frais d'État, packs, comptabilité, accompagnement aux aides et réclamations.",
};

// Les mentions entre crochets sont à compléter par Mziane avant publication définitive.
const pct = (r: number) => `${fmt(r * 100)} %`;
const MOIS = packById("lancement")?.months ?? 12;
const honneur = offerById("aides-honneur")?.price ?? 0;
const DOMI_MOIS = ADDONS.find((a) => a.id === "domi-business")?.months ?? 6;

export default function ConditionsGenerales() {
  return (
    <LegalShell title="Conditions générales de vente" updated="Mise à jour : 19 octobre 2026">
      <section>
        <h2>1. Qui sommes-nous</h2>
        <p>
          Le site mziane.com est édité par Mziane, [forme juridique] au capital de [montant] DH, dont le siège est situé [adresse complète],
          immatriculée au registre de commerce de [ville] sous le numéro [RC], identifiant commun de l&apos;entreprise [ICE], identifiant fiscal [IF],
          représentée par [nom et qualité du représentant légal].
        </p>
        <p className="mt-3">
          Contact : <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ou WhatsApp{" "}
          <a href={waLink()} target="_blank" rel="noopener noreferrer">{CONTACT.whatsappDisplay}</a>.
        </p>
        <p className="mt-3">{PROMESSES.societePrivee} Mziane n&apos;accorde aucun crédit et n&apos;agit pas au nom d&apos;un organisme public.</p>
      </section>

      <section>
        <h2>2. Objet</h2>
        <p>
          Les présentes conditions s&apos;appliquent à toutes les prestations commandées auprès de Mziane : création d&apos;entreprise et inscription
          d&apos;auto-entrepreneur, formalités de société, dépôt de marque, domiciliation, comptabilité en abonnement, création de site web,
          accompagnement des Marocains résidant à l&apos;étranger et des non-résidents, packs, et accompagnement aux aides de l&apos;État.
          Toute commande vaut acceptation des présentes conditions.
        </p>
      </section>

      <section>
        <h2>3. Professionnels habilités</h2>
        <p>
          Mziane réalise ses prestations avec des professionnels habilités lorsque la loi l&apos;exige :
        </p>
        <ul className="mt-2 grid gap-1.5">
          <li>la tenue comptable et les déclarations fiscales sont assurées par ou sous la responsabilité d&apos;un expert-comptable inscrit à l&apos;Ordre des experts-comptables du Maroc [nom du cabinet, numéro d&apos;inscription] ;</li>
          <li>la domiciliation est fournie par un domiciliataire régulièrement déclaré [raison sociale, RC, références de la déclaration] ;</li>
          <li>les actes qui relèvent d&apos;une profession réglementée (notaire, avocat, traducteur assermenté) sont confiés à un professionnel de cette profession, à vos frais lorsqu&apos;ils ne sont pas compris dans l&apos;offre.</li>
        </ul>
      </section>

      <section>
        <h2>4. Commande puis paiement</h2>
        <ul className="grid gap-1.5">
          <li>Vous passez commande sur le site (page de commande, questionnaire ou WhatsApp). La commande ne donne lieu à aucun paiement en ligne.</li>
          <li>Un conseiller vous contacte pour vérifier votre besoin et vous adresse un récapitulatif écrit : prestations, honoraires, frais d&apos;État estimés et pièces à fournir.</li>
          <li>{PROMESSES.paiement}</li>
          <li>Le contrat est formé lorsque vous acceptez ce récapitulatif. L&apos;exécution commence après réception du paiement prévu, ou de la première mensualité pour un pack.</li>
        </ul>
      </section>

      <section>
        <h2>5. Prix et frais d&apos;État</h2>
        <ul className="grid gap-1.5">
          <li>Les prix affichés sont nos honoraires. Pour les entreprises, ils sont indiqués hors taxes, TVA de {pct(TVA)} en sus. Pour les auto-entrepreneurs et les particuliers, ils sont indiqués toutes taxes comprises.</li>
          <li>Les frais d&apos;État (certificat négatif, greffe, annonces légales, timbres, taxes de l&apos;OMPIC et autres droits) ne sont pas compris dans nos honoraires. Ils sont refacturés au réel, sans marge, sur la base des justificatifs, ou payés directement par vous.</li>
          <li>Les montants de frais d&apos;État indiqués sur le site sont des estimations. Le montant réel est celui fixé par l&apos;administration au jour de la démarche.</li>
          <li>Le prix applicable est celui du récapitulatif que vous avez accepté.</li>
        </ul>
      </section>

      <section>
        <h2>6. Packs</h2>
        <ul className="grid gap-1.5">
          <li>Les packs réunissent plusieurs prestations pour une mensualité fixe, avec un engagement de {MOIS} mois. Certains packs peuvent être payés d&apos;avance pour la durée complète, au prix indiqué.</li>
          <li>Les éléments présentés comme offerts (par exemple la création de la société) le sont en contrepartie de cet engagement.</li>
          <li>La comptabilité comprise dans un pack n&apos;est facturée qu&apos;à partir de l&apos;obtention du registre de commerce.</li>
          <li>En cas d&apos;arrêt anticipé à votre initiative, les mensualités échues restent dues et la remise accordée (valeur des éléments offerts et réduction consentie) est due au prorata des mois restants sur la durée d&apos;engagement.</li>
        </ul>
      </section>

      <section>
        <h2>7. Comptabilité en abonnement</h2>
        <ul className="grid gap-1.5">
          <li>Pour une société en création, l&apos;abonnement de comptabilité est facturé à partir du mois d&apos;obtention du registre de commerce.</li>
          <li>L&apos;abonnement est payable chaque mois. {COMPTA_EXTRAS.annuel}</li>
          <li>Hors pack, l&apos;abonnement peut être résilié [préavis à préciser]. Les déclarations dont l&apos;échéance tombe pendant le préavis restent assurées.</li>
          <li>Les prestations non comprises dans la formule choisie (par exemple les bulletins de paie au-delà du nombre prévu) sont facturées selon les tarifs affichés.</li>
        </ul>
      </section>

      <section>
        <h2>8. Domiciliation</h2>
        <p>Les formules de domiciliation comportent un engagement minimal de {DOMI_MOIS} mois, puis se renouvellent selon les conditions du contrat de domiciliation signé avec le domiciliataire.</p>
      </section>

      <section>
        <h2>9. Accompagnement aux aides de l&apos;État</h2>
        <ul className="grid gap-1.5">
          <li>{PROMESSES.sansInteret}</li>
          <li>Le diagnostic d&apos;éligibilité est gratuit et sans engagement.</li>
          <li>Pour le montage et le suivi d&apos;un dossier, nos honoraires ne sont dus que si l&apos;aide est effectivement versée. {PROMESSES.zeroRefus}</li>
          <li>
            Barème, appliqué par tranche sur le montant versé :{" "}
            {AIDES_BAREME.map(([top, rate], n) => {
              const from = n === 0 ? 0 : AIDES_BAREME[n - 1][0];
              const label = n === 0 ? `jusqu'à ${fmtDH(top)}` : top === Infinity ? `au-delà de ${fmtDH(from)}` : `de ${fmtDH(from)} à ${fmtDH(top)}`;
              return `${pct(rate)} ${label}`;
            }).join(", ")}{" "}
            ; minimum {fmtDH(AIDES_MIN)} et plafond {fmtDH(AIDES_PLAFOND)} par dossier, hors taxes.
          </li>
          <li>Aides agricoles : {pct(packTerre.taux)} de la subvention, minimum {fmtDH(packTerre.min)} hors taxes, dus à la notification de paiement.</li>
          <li>Prêts d&apos;honneur : forfait de {fmtDH(honneur)} hors taxes, dû seulement à l&apos;accord du prêt.</li>
          <li>Les honoraires sont exigibles à réception du versement de l&apos;aide (ou de la notification de paiement). Vous vous engagez à nous informer de ce versement.</li>
          <li>Aucune aide n&apos;est garantie : la décision appartient à l&apos;organisme public, qui instruit les demandes gratuitement. Notre engagement porte sur la qualité et le suivi du dossier.</li>
        </ul>
      </section>

      <section>
        <h2>10. Vos engagements</h2>
        <p>
          Vous fournissez des informations et des pièces exactes, complètes et à jour, dans les délais demandés. Mziane ne peut être tenue responsable
          d&apos;un retard ou d&apos;un refus causé par une information inexacte ou une pièce manquante.
        </p>
      </section>

      <section>
        <h2>11. Délais</h2>
        <p>
          Les délais communiqués sont indicatifs. Ils dépendent en grande partie des administrations et organismes concernés. Nous déposons chaque dossier
          dès qu&apos;il est complet et vous tenons informé de son avancement.
        </p>
      </section>

      <section>
        <h2>12. Responsabilité</h2>
        <p>
          Mziane est tenue d&apos;une obligation de moyens. Sauf faute lourde ou dolosive, sa responsabilité est limitée au montant des honoraires payés
          pour la prestation concernée.
        </p>
      </section>

      <section>
        <h2>13. Rétractation et remboursement</h2>
        <p>
          Les consommateurs bénéficient des droits prévus par la loi n° 31-08 édictant des mesures de protection du consommateur, notamment du droit de
          rétractation applicable aux contrats conclus à distance, dans les conditions et sous les exceptions prévues par cette loi. Les modalités sont
          détaillées dans notre <Link href="/refund-policy">politique de remboursement</Link>.
        </p>
      </section>

      <section>
        <h2>14. Données personnelles</h2>
        <p>
          Vos données sont traitées conformément à la loi n° 09-08. Voir notre <Link href="/privacy-policy">politique de confidentialité</Link>.
        </p>
      </section>

      <section>
        <h2>15. Propriété intellectuelle</h2>
        <p>
          Les contenus du site (textes, visuels, logo) appartiennent à Mziane. Les documents établis pour votre compte (statuts, procès-verbaux, site web
          livré) vous sont remis pour votre usage une fois la prestation payée.
        </p>
      </section>

      <section>
        <h2>16. Réclamations, droit applicable et litiges</h2>
        <p>
          Toute réclamation peut être adressée à <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. Nous y répondons par écrit et recherchons
          d&apos;abord une solution amiable. Les présentes conditions sont soumises au droit marocain. À défaut d&apos;accord, le litige est porté devant les
          tribunaux compétents de [ville], sous réserve des règles de compétence plus favorables au consommateur prévues par la loi n° 31-08.
        </p>
      </section>
    </LegalShell>
  );
}

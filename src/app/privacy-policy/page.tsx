import type { Metadata } from "next";
import { LegalShell } from "@/components/site";
import { CONTACT, waLink } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Protection de vos données personnelles chez Mziane, conformément à la loi n° 09-08 et sous le contrôle de la CNDP.",
};

export default function PolitiqueConfidentialite() {
  return (
    <LegalShell title="Politique de confidentialité" updated="Mise à jour : 19 octobre 2026">
      <section>
        <h2>1. Responsable du traitement</h2>
        <p>
          Mziane, [forme juridique], [adresse complète], RC [RC], ICE [ICE]. Contact : <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
          Les traitements décrits ici sont réalisés conformément à la loi n° 09-08 relative à la protection des personnes physiques à l&apos;égard du
          traitement des données à caractère personnel. Déclaration ou autorisation auprès de la CNDP : [numéro à compléter].
        </p>
      </section>

      <section>
        <h2>2. Données que nous collectons</h2>
        <ul className="grid gap-1.5">
          <li>Identité et coordonnées : nom, téléphone, adresse e-mail, ville ou pays de résidence.</li>
          <li>Informations sur votre projet : réponses au questionnaire, forme juridique envisagée, activité, besoins.</li>
          <li>Pièces nécessaires aux démarches : pièce d&apos;identité, justificatifs, documents de la société, informations fiscales, sociales et comptables.</li>
          <li>Nos échanges avec vous par WhatsApp, par e-mail ou par téléphone.</li>
          <li>Données techniques strictement nécessaires au fonctionnement du site.</li>
        </ul>
      </section>

      <section>
        <h2>3. Pourquoi nous les utilisons</h2>
        <ul className="grid gap-1.5">
          <li>Répondre à vos questions et vous orienter.</li>
          <li>Réaliser les prestations commandées et déposer vos dossiers auprès des administrations et organismes.</li>
          <li>Facturer et respecter nos obligations légales, comptables et fiscales.</li>
        </ul>
        <p className="mt-3">Nous ne vendons pas vos données et ne les utilisons pas à des fins publicitaires sans votre accord.</p>
      </section>

      <section>
        <h2>4. Qui peut les recevoir</h2>
        <ul className="grid gap-1.5">
          <li>Les administrations et organismes concernés par votre dossier : OMPIC, tribunal de commerce, DGI, CNSS, CRI, organismes qui gèrent les aides.</li>
          <li>Les professionnels qui interviennent sur votre dossier : expert-comptable, domiciliataire, notaire ou traducteur si nécessaire.</li>
          <li>Nos prestataires techniques (hébergement du site, messagerie), tenus à la confidentialité : [liste à compléter].</li>
        </ul>
      </section>

      <section>
        <h2>5. Données transmises par WhatsApp</h2>
        <p>
          Lorsque vous nous écrivez sur WhatsApp ({CONTACT.whatsappDisplay}) ou nous y envoyez des pièces, ces échanges transitent par le service
          WhatsApp, édité par WhatsApp Ireland Limited (groupe Meta), qui applique sa propre politique de confidentialité. Les messages sont chiffrés de
          bout en bout. Les pièces que vous nous envoyez sont ensuite enregistrées dans votre dossier client et traitées comme indiqué ici. Si vous
          préférez, vous pouvez nous transmettre vos documents par e-mail à <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
        <p className="mt-3">
          Certains de ces services sont hébergés hors du Maroc. Les transferts de données vers l&apos;étranger sont réalisés dans le respect de la loi
          n° 09-08 [références de l&apos;autorisation de transfert CNDP à compléter].
        </p>
      </section>

      <section>
        <h2>6. Paiement</h2>
        <p>
          Le paiement se fait après la confirmation de votre conseiller, par lien de paiement, virement ou espèces. Nous ne conservons pas vos données de
          carte bancaire : elles sont traitées par le prestataire de paiement [nom du prestataire].
        </p>
      </section>

      <section>
        <h2>7. Durée de conservation</h2>
        <p>
          Les données d&apos;un contact qui n&apos;est pas devenu client sont conservées [durée à préciser] après le dernier échange. Les données des clients sont
          conservées pendant la relation, puis pendant la durée imposée par les obligations légales, notamment comptables (10 ans pour les pièces
          comptables).
        </p>
      </section>

      <section>
        <h2>8. Vos droits</h2>
        <p>
          Conformément à la loi n° 09-08, vous disposez d&apos;un droit d&apos;information, d&apos;accès, de rectification et d&apos;opposition pour motif légitime. Pour
          les exercer, écrivez à <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ou sur{" "}
          <a href={waLink("Bonjour, je souhaite exercer mes droits sur mes données personnelles.")} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
          Vous pouvez aussi saisir la Commission nationale de contrôle de la protection des données à caractère personnel (CNDP) :{" "}
          <a href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer">www.cndp.ma</a>.
        </p>
      </section>

      <section>
        <h2>9. Sécurité et cookies</h2>
        <p>
          Nous limitons l&apos;accès à vos données aux personnes qui en ont besoin pour traiter votre dossier. Le site n&apos;utilise pas de cookies publicitaires
          [à mettre à jour si un outil de mesure d&apos;audience est ajouté].
        </p>
      </section>
    </LegalShell>
  );
}

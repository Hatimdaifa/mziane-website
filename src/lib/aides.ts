// Fiches des aides publiques marocaines (montants indicatifs, à vérifier auprès de l'organisme).
// Généré depuis le guide des aides : ne contient que les informations destinées aux clients.

export type AideCategorie = "agriculture" | "entreprise" | "femmes" | "particuliers";

export interface Aide {
  id: string;
  cat: AideCategorie;
  titre: string;
  organisme: string;
  site: string;
  pourQui: string;
  apport: string;
  conditions: string;
  demarche: string;
}

export const categories: { id: AideCategorie; label: string; desc: string }[] = [
  { id: "agriculture", label: "Agriculteurs", desc: "Irrigation, matériel, plantations, élevage, valorisation et coopératives." },
  { id: "entreprise", label: "Créer ou développer", desc: "Primes à l'investissement, prêts d'honneur à 0 %, exonérations et aides à l'embauche." },
  { id: "femmes", label: "Femmes entrepreneures", desc: "Programmes et avantages réservés ou favorables aux femmes." },
  { id: "particuliers", label: "Particuliers", desc: "Logement, aide sociale, couverture santé, emploi, retraite et études." },
];

export const aides: Aide[] = [
  {
    "id": "A01",
    "cat": "agriculture",
    "titre": "FDA - Irrigation goutte-à-goutte (irrigation localisée)",
    "organisme": "Fonds de Développement Agricole (ministère de l'Agriculture), via la DPA ou l'ORMVA",
    "site": "agriculture.gov.ma",
    "pourQui": "Tout agriculteur (propriétaire ou exploitant) qui veut passer à l'irrigation localisée, à titre individuel ou en groupement.",
    "apport": "Subvention NON remboursable : 100 % pour les petites exploitations (environ 5 ha et moins) et 80 % au-delà, dans la limite de plafonds par hectare (barème fixé par décision conjointe, la dernière connue date d'avril 2023 - n° 559.23 ; pour les grandes exploitations la presse cite environ 23 000 DH/ha sur la première tranche). Couvre le réseau, la filtration, le bassin de stockage et, selon les cas, le pompage (y compris solaire).",
    "conditions": "Disposer d'une ressource en eau autorisée (puits ou forage déclaré, ou eau d'un périmètre). Justifier de l'exploitation du terrain. Installation réalisée par un fournisseur agréé. Accord de principe obtenu AVANT les travaux.",
    "demarche": "1) Dossier de demande d'accord de principe à la DPA/ORMVA. 2) Réalisation des travaux par le fournisseur. 3) Dépôt du dossier de subvention avec factures. 4) Contrôle sur le terrain par la commission. 5) Paiement à l'agriculteur, ou directement au fournisseur si l'agriculteur lui a cédé la subvention (il avance alors peu ou rien)."
  },
  {
    "id": "A02",
    "cat": "agriculture",
    "titre": "FDA - Matériel agricole neuf",
    "organisme": "Fonds de Développement Agricole, via la DPA",
    "site": "agriculture.gov.ma",
    "pourQui": "Agriculteurs individuels, coopératives, groupements et prestataires de services agricoles.",
    "apport": "Subvention d'environ 30 % à 60 % du prix du matériel selon le type (tracteur, moissonneuse, semoir, pulvérisateur, matériel de récolte, de travail du sol...), avec un plafond par machine. Bonus d'environ 10 points pour les agriculteurs membres d'un projet d'agrégation. Taux plus favorables pour les coopératives et groupements.",
    "conditions": "Matériel neuf, homologué, acheté chez un distributeur agréé. Être exploitant agricole. Respect des plafonds et d'un nombre de machines par exploitation.",
    "demarche": "1) Achat du matériel chez un distributeur agréé (certains distributeurs déduisent directement la subvention). 2) Dépôt du dossier à la DPA. 3) Vérification physique du matériel. 4) Paiement."
  },
  {
    "id": "A03",
    "cat": "agriculture",
    "titre": "FDA - Plantations fruitières (olivier, amandier, palmier, figuier, câprier, cactus...)",
    "organisme": "Fonds de Développement Agricole, via la DPA",
    "site": "agriculture.gov.ma",
    "pourQui": "Agriculteurs qui créent ou étendent un verger.",
    "apport": "Subvention forfaitaire par hectare planté, variable selon l'espèce, la densité et le mode d'irrigation (pluvial ou irrigué). Peut se cumuler avec la subvention goutte-à-goutte (fiche A01).",
    "conditions": "Plants certifiés, achetés chez une pépinière agréée. Surface minimale selon l'espèce. Densité de plantation conforme au cahier des charges.",
    "demarche": "1) Demande à la DPA. 2) Plantation. 3) Dépôt du dossier avec factures. 4) Constat sur place du taux de reprise des plants. 5) Paiement."
  },
  {
    "id": "A04",
    "cat": "agriculture",
    "titre": "FDA - Serres",
    "organisme": "Fonds de Développement Agricole, via la DPA ou l'ORMVA",
    "site": "agriculture.gov.ma",
    "pourQui": "Maraîchers et producteurs de fruits rouges, fleurs, plants.",
    "apport": "Subvention par hectare selon le type de serre (canarienne, multichapelle, tunnel...), et pour certains équipements de serre.",
    "conditions": "Serre neuve installée par un fournisseur agréé. Ressource en eau et irrigation adaptée.",
    "demarche": "Demande, installation, dossier avec factures, constat, paiement."
  },
  {
    "id": "A05",
    "cat": "agriculture",
    "titre": "FDA - Élevage et apiculture",
    "organisme": "Fonds de Développement Agricole, via la DPA (et ONSSA pour l'identification des animaux)",
    "site": "agriculture.gov.ma",
    "pourQui": "Éleveurs bovins, ovins, caprins, camelins, apiculteurs, coopératives laitières.",
    "apport": "Primes par tête pour l'achat de génisses de race, subventions pour les bâtiments d'élevage, le matériel de traite et les centres de collecte du lait, les ruches modernes et le matériel apicole. Aides ponctuelles en période de sécheresse (orge et aliments subventionnés).",
    "conditions": "Animaux identifiés (boucles ONSSA). Achats chez des fournisseurs reconnus. Normes sanitaires pour les bâtiments.",
    "demarche": "Demande à la DPA, achat, déclaration et identification, constat, paiement."
  },
  {
    "id": "A06",
    "cat": "agriculture",
    "titre": "FDA - Valorisation des produits agricoles",
    "organisme": "Fonds de Développement Agricole (et Fonds de développement industriel pour certaines unités)",
    "site": "agriculture.gov.ma",
    "pourQui": "Agriculteurs, coopératives et entreprises qui créent une unité de stockage frigorifique, de conditionnement, de trituration (huile), de transformation, de séchage...",
    "apport": "Subvention d'environ 10 % à 30 % de l'investissement selon la filière, avec plafond.",
    "conditions": "Projet dans une filière éligible, unité aux normes ONSSA, plan de financement complet.",
    "demarche": "Dépôt du projet, avis technique, réalisation, contrôle, paiement."
  },
  {
    "id": "A07",
    "cat": "agriculture",
    "titre": "Agrégation agricole",
    "organisme": "Ministère de l'Agriculture (ADA et DPA)",
    "site": "agriculture.gov.ma",
    "pourQui": "Un « agrégateur » (entreprise, coopérative ou grand exploitant) qui encadre des petits agriculteurs (« agrégés ») et leur achète leur production.",
    "apport": "Primes spécifiques et taux de subvention majorés (matériel, irrigation, plantations) pour les projets agréés, plus un accès facilité aux marchés pour les petits agriculteurs.",
    "conditions": "Convention d'agrégation approuvée, cahier des charges technique, nombre minimal d'agrégés selon la filière.",
    "demarche": "Montage du projet, dépôt pour agrément, signature de la convention, puis demandes de subventions majorées."
  },
  {
    "id": "A08",
    "cat": "agriculture",
    "titre": "Génération Green - Jeunes agriculteurs et terres collectives",
    "organisme": "Ministère de l'Agriculture, ministère de l'Intérieur (terres collectives), ONCA",
    "site": "agriculture.gov.ma",
    "pourQui": "Jeunes ruraux (environ 18 à 45 ans), notamment des ayants droit des terres collectives (soulaliyates), hommes et femmes.",
    "apport": "Accès à des terres collectives pour des projets agricoles, accompagnement technique, accès prioritaire aux subventions du FDA et aux programmes d'emploi rural. Objectif officiel : faire émerger une nouvelle classe moyenne agricole.",
    "conditions": "Selon l'appel à projets local. Projet agricole viable. Pour les terres collectives, être ayant droit ou candidat retenu.",
    "demarche": "Suivre les appels de la province ou de la DPA, déposer le projet, sélection, puis montage des dossiers FDA."
  },
  {
    "id": "A09",
    "cat": "agriculture",
    "titre": "Assurance agricole subventionnée (multirisque climatique)",
    "organisme": "MAMDA, avec la subvention de l'État",
    "site": "mamda.ma",
    "pourQui": "Céréaliers, arboriculteurs et maraîchers exposés à la sécheresse, la grêle, le gel, les inondations.",
    "apport": "L'État prend en charge une grande partie de la prime d'assurance (plus forte pour les petits agriculteurs). Indemnisation en cas de mauvaise récolte due au climat.",
    "conditions": "Souscription avant la date limite de la campagne.",
    "demarche": "Souscription à l'agence MAMDA ou chez un intermédiaire."
  },
  {
    "id": "A10",
    "cat": "agriculture",
    "titre": "ONCA - Conseil agricole gratuit",
    "organisme": "Office National du Conseil Agricole",
    "site": "agriculture.gov.ma",
    "pourQui": "Tous les agriculteurs.",
    "apport": "Conseillers agricoles gratuits : techniques de culture, irrigation, aide pour connaître les subventions.",
    "conditions": "Aucune.",
    "demarche": "Contacter le centre de conseil agricole le plus proche."
  },
  {
    "id": "A11",
    "cat": "agriculture",
    "titre": "ADA - Projets solidaires (Pilier II)",
    "organisme": "Agence pour le Développement Agricole",
    "site": "ada.gov.ma",
    "pourQui": "Petits agriculteurs regroupés en coopératives ou associations, surtout en zones difficiles (montagne, pluvial).",
    "apport": "Projets financés en grande partie par l'État et des bailleurs : plantations, petite irrigation, unités de valorisation, matériel collectif.",
    "conditions": "Être organisé en coopérative ou association, zone et filière ciblées par un appel à projets.",
    "demarche": "Appels à projets régionaux, sélection, convention, réalisation."
  },
  {
    "id": "A12",
    "cat": "agriculture",
    "titre": "ANDZOA - Zones oasiennes et arganier",
    "organisme": "Agence Nationale pour le Développement des Zones Oasiennes et de l'Arganier",
    "site": "andzoa.ma",
    "pourQui": "Agriculteurs, coopératives et porteurs de projets dans les oasis (Drâa-Tafilalet, Guelmim...) et l'arganeraie (Souss).",
    "apport": "Programmes de plantation de palmiers et d'arganiers, appui aux coopératives (notamment féminines pour l'argan), tourisme rural, valorisation des produits.",
    "conditions": "Être situé dans la zone d'intervention et répondre aux appels.",
    "demarche": "Contacter l'antenne régionale de l'ANDZOA."
  },
  {
    "id": "A13",
    "cat": "agriculture",
    "titre": "Coopératives - ODCo (Mourafaka, Moussanada Taawouni)",
    "organisme": "Office du Développement de la Coopération",
    "site": "odco.gov.ma",
    "pourQui": "Personnes qui veulent créer une coopérative (5 membres minimum) et coopératives existantes, agricoles ou non.",
    "apport": "Accompagnement gratuit à la création, formations, aides en matériel, emballages et participation aux salons (Moussanada Taawouni), suivi des jeunes coopératives (Mourafaka).",
    "conditions": "Coopérative immatriculée au registre des coopératives.",
    "demarche": "Délégation régionale de l'ODCo, puis réponse aux appels à candidatures."
  },
  {
    "id": "B01",
    "cat": "entreprise",
    "titre": "Charte de l'investissement - Dispositif TPME",
    "organisme": "Centres Régionaux d'Investissement (CRI)",
    "site": "cri-invest.ma",
    "pourQui": "Entreprises marocaines indépendantes dont le chiffre d'affaires est entre 1 et 200 millions DH, ou créées depuis moins de 3 ans, tous secteurs sauf exclusions.",
    "apport": "Primes NON remboursables cumulables jusqu'à 30 % de l'investissement éligible : prime à l'emploi (environ 5 à 10 %), prime territoriale (environ 10 à 15 % dans les provinces prioritaires), prime aux activités prioritaires. Projet de 1 à 50 millions DH.",
    "conditions": "Au moins 10 % du projet financé en fonds propres. Création d'emplois stables. Signature d'une convention avec l'État et respect des engagements (emplois, délais).",
    "demarche": "1) Dépôt en ligne sur la plateforme des CRI. 2) Étude du dossier. 3) Validation et convention. 4) Réalisation de l'investissement. 5) Versement des primes par tranches après contrôle."
  },
  {
    "id": "B02",
    "cat": "entreprise",
    "titre": "Charte de l'investissement - Dispositif principal (grands projets)",
    "organisme": "CRI, AMDIE et Commission nationale des investissements",
    "site": "cri-invest.ma",
    "pourQui": "Projets d'au moins 50 millions DH environ, ou projets créant au moins 150 emplois stables environ (seuils plus bas dans certains secteurs).",
    "apport": "Primes cumulables jusqu'à 30 % : emploi, parité hommes-femmes, emplois des jeunes, province, secteurs prioritaires, développement durable, intégration locale, R&D.",
    "conditions": "Convention d'investissement avec l'État, respect des engagements.",
    "demarche": "Dépôt au CRI, passage en commission, signature de convention, versements par tranches."
  },
  {
    "id": "B03",
    "cat": "entreprise",
    "titre": "Forsa - Programme national d'entrepreneuriat",
    "organisme": "Ministère du Tourisme, de l'Artisanat et de l'Économie sociale et solidaire, avec la SMIT",
    "site": "forsa.ma",
    "pourQui": "Porteurs de projet de 18 ans et plus, tous secteurs, résidant au Maroc ou Marocains du monde (selon les éditions).",
    "apport": "Formation et accompagnement, puis PRÊT D'HONNEUR À 0 % D'INTÉRÊT jusqu'à 100 000 DH, dont environ 10 000 DH de subvention. Remboursement sur 10 ans maximum avec 2 ans de différé. Report d'échéances possible (mesure 2026).",
    "conditions": "Candidature pendant l'ouverture d'une édition, sélection sur le projet, suivi de la formation.",
    "demarche": "Candidature en ligne, présélection, formation et incubation, comité de sélection, déblocage du prêt d'honneur."
  },
  {
    "id": "B04",
    "cat": "entreprise",
    "titre": "Prêts d'honneur associatifs à 0 % (Réseau Entreprendre Maroc, Initiative Maroc...)",
    "organisme": "Associations d'entrepreneurs (financées par des entreprises et des bailleurs)",
    "site": "Sites des associations régionales",
    "pourQui": "Créateurs ou repreneurs d'entreprise avec un projet solide et créateur d'emplois.",
    "apport": "Prêt personnel sans intérêt et sans garantie, plus un mentor (chef d'entreprise) pendant 2 à 3 ans.",
    "conditions": "Passer un comité de sélection. Projet viable.",
    "demarche": "Contact avec l'antenne régionale, accompagnement, présentation devant le comité."
  },
  {
    "id": "B05",
    "cat": "entreprise",
    "titre": "Innov Invest - Innov Idea et Innov Start (startups)",
    "organisme": "Tamwilcom, via des structures labellisées (incubateurs, accélérateurs)",
    "site": "tamwilcom.ma",
    "pourQui": "Porteurs de projets innovants et startups en démarrage (technologie, services innovants, industrie).",
    "apport": "Innov Idea : subvention pour passer de l'idée au prototype. Innov Start : prêt d'honneur sans intérêt pour le lancement. Montants fixés par Tamwilcom.",
    "conditions": "Être accompagné par une structure labellisée. Projet réellement innovant.",
    "demarche": "Passer par un incubateur labellisé, qui présente le dossier à Tamwilcom."
  },
  {
    "id": "B06",
    "cat": "entreprise",
    "titre": "MDM Invest - Marocains du monde",
    "organisme": "Tamwilcom et banques partenaires",
    "site": "tamwilcom.ma",
    "pourQui": "Marocains résidant à l'étranger qui investissent au Maroc (création ou extension d'entreprise).",
    "apport": "Subvention de l'État d'environ 10 % du projet, plafonnée. Le volet subvention est NON remboursable.",
    "conditions": "Apport personnel en devises (part minimale du projet), projet d'investissement réel. Le programme combine souvent la subvention avec un crédit bancaire : pour un client sans crédit à intérêt, vérifier si la subvention peut être obtenue avec un financement participatif ou un apport propre.",
    "demarche": "Dépôt auprès d'une banque partenaire, puis validation par Tamwilcom."
  },
  {
    "id": "B07",
    "cat": "entreprise",
    "titre": "INDH - Activités génératrices de revenus et plateformes des jeunes",
    "organisme": "Initiative Nationale pour le Développement Humain (provinces)",
    "site": "indh.ma",
    "pourQui": "Jeunes et personnes en situation de précarité, coopératives et associations, en milieu urbain et rural.",
    "apport": "Subvention d'une grande partie du projet (petit commerce, atelier, élevage, apiculture, services), formations et accompagnement par les plateformes des jeunes.",
    "conditions": "Appels à projets de la province, projet de petite taille, publics ciblés.",
    "demarche": "S'adresser à la division de l'action sociale de la province ou à la plateforme des jeunes, déposer le projet, comité local."
  },
  {
    "id": "B08",
    "cat": "entreprise",
    "titre": "Statut auto-entrepreneur",
    "organisme": "Barid Al-Maghrib et DGI",
    "site": "ae.gov.ma",
    "pourQui": "Personnes qui veulent exercer seules une activité commerciale, artisanale ou de services, sans créer de société.",
    "apport": "Impôt très faible : 0,5 % du chiffre d'affaires (commerce, industrie, artisanat) ou 1 % (services). Inscription simple. Couverture AMO.",
    "conditions": "Plafonds de chiffre d'affaires : environ 500 000 DH (commerce, industrie, artisanat) et 200 000 DH (services). Au-delà d'environ 80 000 DH par an facturés au même client, une retenue à la source s'applique.",
    "demarche": "Inscription en ligne ou dans une agence Barid Al-Maghrib, puis déclarations trimestrielles."
  },
  {
    "id": "B09",
    "cat": "entreprise",
    "titre": "Exonération de la taxe professionnelle pendant 5 ans",
    "organisme": "Communes et DGI",
    "site": "tax.gov.ma",
    "pourQui": "Toute personne ou société qui démarre une nouvelle activité.",
    "apport": "Pas de taxe professionnelle pendant les 5 premières années d'activité.",
    "conditions": "Nouvelle activité, déclaration d'existence faite dans les délais.",
    "demarche": "Automatique si la création est bien déclarée."
  },
  {
    "id": "B10",
    "cat": "entreprise",
    "titre": "Exonération de TVA sur les biens d'investissement (36 mois)",
    "organisme": "DGI",
    "site": "tax.gov.ma",
    "pourQui": "Entreprises assujetties à la TVA qui achètent du matériel, des équipements ou des machines neufs inscrits en immobilisations.",
    "apport": "Achat du matériel sans payer la TVA (20 %) pendant les 36 premiers mois d'activité.",
    "conditions": "Biens inscrits en immobilisations, achats dans les 36 mois suivant le début d'activité, attestation d'exonération demandée AVANT l'achat.",
    "demarche": "Demande à la DGI, obtention de l'attestation, remise de l'attestation au fournisseur qui facture hors TVA."
  },
  {
    "id": "B11",
    "cat": "entreprise",
    "titre": "Tahfiz - Charges sociales et impôt des premiers salariés",
    "organisme": "CNSS et DGI",
    "site": "cnss.ma / tax.gov.ma",
    "pourQui": "Entreprises, associations et coopératives nouvellement créées qui recrutent.",
    "apport": "Pour les 10 premiers salariés en CDI, pendant 24 mois : l'État paie la part patronale CNSS et la taxe de formation professionnelle, et le salaire (jusqu'à 10 000 DH brut par mois) est exonéré d'IR.",
    "conditions": "Recrutement en CDI dans les 2 premières années d'activité. Fenêtre de création des entreprises éligibles et date limite (dispositif prorogé jusqu'au 31/12/2026) : à vérifier dans la loi de finances en vigueur.",
    "demarche": "Déclarer les salariés à la CNSS et demander le bénéfice de Tahfiz, puis appliquer l'exonération d'IR sur la paie."
  },
  {
    "id": "B12",
    "cat": "entreprise",
    "titre": "Idmaj - Contrat d'insertion",
    "organisme": "ANAPEC",
    "site": "anapec.org",
    "pourQui": "Entreprises qui recrutent des jeunes diplômés inscrits à l'ANAPEC.",
    "apport": "Pendant 24 mois : exonération des cotisations CNSS et de la taxe de formation professionnelle, et exonération d'IR sur l'indemnité de stage (dans une limite mensuelle d'environ 6 000 DH). Bonus si le stagiaire est ensuite embauché en CDI.",
    "conditions": "Candidat inscrit à l'ANAPEC, contrat d'insertion signé avec l'ANAPEC.",
    "demarche": "Déposer l'offre à l'ANAPEC, sélectionner le candidat, signer le contrat d'insertion."
  },
  {
    "id": "B13",
    "cat": "entreprise",
    "titre": "Taehil - Formation des recrues",
    "organisme": "ANAPEC",
    "site": "anapec.org",
    "pourQui": "Entreprises qui recrutent et doivent former leurs nouveaux salariés, et chercheurs d'emploi.",
    "apport": "Formation qualifiante ou d'adaptation au poste financée par l'ANAPEC.",
    "conditions": "Engagement de recrutement par l'entreprise.",
    "demarche": "Dépôt du besoin à l'ANAPEC, convention, formation, recrutement."
  },
  {
    "id": "B14",
    "cat": "entreprise",
    "titre": "CSF - Remboursement des formations des salariés (OFPPT)",
    "organisme": "OFPPT (Contrats Spéciaux de Formation)",
    "site": "ofppt.ma",
    "pourQui": "Toutes les entreprises qui paient la taxe de formation professionnelle (incluse dans les charges CNSS).",
    "apport": "Remboursement d'une grande partie du coût des formations des salariés (souvent 70 à 80 %, selon le type d'action), et financement des études de besoins en formation.",
    "conditions": "Être à jour de la taxe de formation professionnelle. Dépôt du plan de formation AVANT les formations, organisme de formation conforme.",
    "demarche": "1) Dépôt du plan de formation. 2) Réalisation. 3) Dossier de remboursement. 4) Contrôle. 5) Remboursement."
  },
  {
    "id": "B15",
    "cat": "entreprise",
    "titre": "Go Siyaha - TPME du tourisme",
    "organisme": "Ministère du Tourisme et Maroc PME",
    "site": "marocpme.gov.ma",
    "pourQui": "TPME touristiques : animation, loisirs, hébergement classé, restauration, transport touristique, agences.",
    "apport": "Subvention d'investissement d'environ 30 % (hébergement lié aux loisirs) à 35 % (animation), jusqu'à 40 % pour les projets verts (projets jusqu'à 10 millions DH), et prise en charge jusqu'à 90 % des coûts d'expertise technique. Enveloppe annoncée de 720 millions DH jusqu'en 2026.",
    "conditions": "Entreprise touristique éligible, projet validé par le comité du programme.",
    "demarche": "Candidature en ligne auprès de Maroc PME, comité de validation, réalisation, versement."
  },
  {
    "id": "B16",
    "cat": "entreprise",
    "titre": "Maroc PME - Programmes de croissance et d'accompagnement",
    "organisme": "Maroc PME (ex-ANPME)",
    "site": "marocpme.gov.ma",
    "pourQui": "TPE et PME en développement, y compris l'industrie et les projets verts.",
    "apport": "Selon les programmes en cours : subventions à l'investissement (Istitmar, Imtiaz), conseil et diagnostics cofinancés (Moussanada, assistance technique), croissance verte et efficacité énergétique (Tatwir).",
    "conditions": "Selon chaque appel à candidatures.",
    "demarche": "Candidature en ligne lors de l'ouverture des appels."
  },
  {
    "id": "B17",
    "cat": "entreprise",
    "titre": "Aides à l'export",
    "organisme": "AMDIE, Morocco Foodex, Maroc PME, ASMEX",
    "site": "amdie.gov.ma",
    "pourQui": "Entreprises qui exportent ou veulent commencer à exporter (agroalimentaire, artisanat, industrie, services).",
    "apport": "Participation à des salons internationaux à coût réduit, missions de prospection, diagnostics export, appui à la certification.",
    "conditions": "Selon les programmes.",
    "demarche": "Inscription aux programmes et salons de l'AMDIE ou de Morocco Foodex."
  },
  {
    "id": "B18",
    "cat": "entreprise",
    "titre": "Artisans - Appui et couverture sociale",
    "organisme": "Ministère de l'Artisanat, Maison de l'Artisan, chambres d'artisanat",
    "site": "artisanat.gov.ma",
    "pourQui": "Artisans individuels, coopératives artisanales, entreprises d'artisanat.",
    "apport": "Labels et certification, salons et expositions, formations, aide à la commercialisation. Couverture AMO pour les artisans.",
    "conditions": "Être inscrit au registre national de l'artisanat.",
    "demarche": "Chambre d'artisanat ou délégation régionale."
  },
  {
    "id": "C01",
    "cat": "femmes",
    "titre": "Prime parité de la Charte de l'investissement",
    "organisme": "CRI (Charte de l'investissement)",
    "site": "cri-invest.ma",
    "pourQui": "Entreprises qui recrutent une part importante de femmes ou dont la direction est féminine.",
    "apport": "Prime supplémentaire non remboursable qui s'ajoute aux autres primes de la Charte (fiches B01 et B02).",
    "conditions": "Atteindre le seuil de parité fixé par le texte.",
    "demarche": "Demandée en même temps que le dossier Charte."
  },
  {
    "id": "C02",
    "cat": "femmes",
    "titre": "Min Ajliki - Autonomisation économique des femmes",
    "organisme": "Coopération belge (Enabel/APEFE) et ministère marocain chargé de l'Inclusion économique",
    "site": "Site du ministère de l'Inclusion économique",
    "pourQui": "Femmes qui veulent créer ou développer une activité, notamment auto-entrepreneures.",
    "apport": "Formation, accompagnement personnalisé, mise en réseau, aide à la formalisation (phase 3 : 2022-2026).",
    "conditions": "Selon les appels de la phase en cours.",
    "demarche": "Candidature lors des appels."
  },
  {
    "id": "C03",
    "cat": "femmes",
    "titre": "Coopératives féminines (argan, couscous, plantes, artisanat)",
    "organisme": "ODCo, INDH, ANDZOA, ADA, ministère de l'Agriculture",
    "site": "odco.gov.ma",
    "pourQui": "Femmes regroupées en coopérative, surtout en milieu rural.",
    "apport": "Priorité dans plusieurs programmes : matériel, unités de valorisation, emballage, salons, labels (IGP, bio).",
    "conditions": "Coopérative immatriculée.",
    "demarche": "Voir les fiches A11, A12, A13 et B07."
  },
  {
    "id": "C04",
    "cat": "femmes",
    "titre": "Femmes dans les programmes généraux",
    "organisme": "Divers (Forsa, Génération Green, INDH, Prix Ana Moukawil)",
    "site": "Voir chaque programme",
    "pourQui": "Femmes porteuses de projet.",
    "apport": "Les programmes nationaux affichent des objectifs de participation des femmes : Forsa, Génération Green (femmes rurales et soulaliyates), INDH. Le Prix de l'entrepreneuriat « Ana Moukawil » a une catégorie Femmes.",
    "conditions": "Celles de chaque programme.",
    "demarche": "Mettre en avant le profil féminin du projet dans chaque candidature."
  },
  {
    "id": "D01",
    "cat": "particuliers",
    "titre": "Aide directe au logement",
    "organisme": "État (ministère de l'Habitat), plateforme dédiée",
    "site": "daamsakane.ma",
    "pourQui": "Marocains résidant au Maroc ou à l'étranger qui achètent leur premier logement (résidence principale), sans condition de revenu.",
    "apport": "100 000 DH pour un logement de 300 000 DH TTC maximum. 70 000 DH pour un logement entre 300 000 et 700 000 DH TTC. Aide versée au moment de l'achat chez le notaire. Programme 2024-2028.",
    "conditions": "Ne pas être déjà propriétaire au Maroc, ne pas avoir déjà eu d'aide au logement, acheter un logement neuf chez un promoteur inscrit. Habiter le logement comme résidence principale (durée minimale portée à 5 ans selon les annonces 2026), sinon remboursement.",
    "demarche": "Inscription en ligne, validation de l'éligibilité, signature chez le notaire, versement de l'aide."
  },
  {
    "id": "D02",
    "cat": "particuliers",
    "titre": "Registre Social Unifié (RSU)",
    "organisme": "Agence Nationale des Registres",
    "site": "rsu.ma",
    "pourQui": "Tous les ménages : c'est la porte d'entrée obligatoire pour l'aide sociale directe et l'AMO Tadamon.",
    "apport": "Calcule un score socio-économique du ménage. Ce score décide de l'accès aux aides sociales.",
    "conditions": "Inscription au Registre National de la Population (RNP) puis déclaration du ménage.",
    "demarche": "Inscription en ligne ou dans un point d'inscription (commune, caïdat), puis mise à jour en cas de changement."
  },
  {
    "id": "D03",
    "cat": "particuliers",
    "titre": "Aide Sociale Directe (ASD)",
    "organisme": "État, avec la CNSS pour le versement",
    "site": "asd.ma",
    "pourQui": "Ménages inscrits au RSU dont le score est sous le seuil fixé.",
    "apport": "Minimum d'environ 500 DH par mois et par ménage. Allocations pour enfants (de l'ordre de 200 à 300 DH par enfant en 2026 selon l'âge et la scolarité, montant réduit à partir du 4e enfant). Allocation renforcée pour les veuves avec enfants et pour les enfants handicapés. Prime de naissance (environ 2 000 DH pour le 1er enfant, 1 000 DH pour le 2e).",
    "conditions": "Score RSU sous le seuil, ne pas bénéficier d'une autre couverture qui l'exclut.",
    "demarche": "Demande en ligne sur le portail ASD ou en agence, puis versement mensuel."
  },
  {
    "id": "D04",
    "cat": "particuliers",
    "titre": "AMO Tadamon (ex-RAMED)",
    "organisme": "CNSS (cotisations prises en charge par l'État)",
    "site": "cnss.ma",
    "pourQui": "Personnes sans activité ni revenu suffisant, selon le score RSU.",
    "apport": "Couverture santé comme un salarié : remboursement des soins, médicaments, hospitalisations, dans le public et le privé. Cotisation payée par l'État.",
    "conditions": "Score RSU sous le seuil.",
    "demarche": "Activation via le RSU puis la CNSS."
  },
  {
    "id": "D05",
    "cat": "particuliers",
    "titre": "AMO des indépendants (travailleurs non salariés)",
    "organisme": "CNSS",
    "site": "cnss.ma",
    "pourQui": "Commerçants, artisans, agriculteurs, auto-entrepreneurs, professions libérales, chauffeurs de taxi...",
    "apport": "Couverture santé pour la personne et sa famille, contre une cotisation forfaitaire adaptée à la profession.",
    "conditions": "Être immatriculé et payer les cotisations.",
    "demarche": "Immatriculation à la CNSS ou en ligne."
  },
  {
    "id": "D06",
    "cat": "particuliers",
    "titre": "Indemnité pour Perte d'Emploi (IPE)",
    "organisme": "CNSS",
    "site": "cnss.ma",
    "pourQui": "Salariés du secteur privé qui perdent leur emploi sans l'avoir voulu (licenciement, fermeture).",
    "apport": "Environ 70 % du salaire moyen des 36 derniers mois, sans dépasser le SMIG, pendant 6 mois. Maintien de l'AMO et des allocations familiales.",
    "conditions": "Conditions les plus citées : 780 jours déclarés sur les 36 derniers mois, dont 260 sur les 12 derniers mois. Inscription à l'ANAPEC. Demande dans les 60 jours suivant la perte d'emploi. Vérifier les seuils actuels auprès de la CNSS (une réforme les aurait modifiés).",
    "demarche": "Dépôt de la demande en agence CNSS ou en ligne dans le délai."
  },
  {
    "id": "D07",
    "cat": "particuliers",
    "titre": "Allocations familiales CNSS",
    "organisme": "CNSS",
    "site": "cnss.ma",
    "pourQui": "Salariés déclarés à la CNSS qui ont des enfants à charge.",
    "apport": "Allocation mensuelle par enfant, plus une aide à la scolarité selon les années.",
    "conditions": "Nombre minimal de jours déclarés, salaire minimum, enfants dans les âges prévus (prolongation pour les études).",
    "demarche": "Demande à la CNSS ou en ligne."
  },
  {
    "id": "D08",
    "cat": "particuliers",
    "titre": "Pension de retraite CNSS ou remboursement des cotisations",
    "organisme": "CNSS",
    "site": "cnss.ma",
    "pourQui": "Anciens salariés à l'âge de la retraite, notamment ceux qui ont peu de jours déclarés.",
    "apport": "Pension de retraite. Depuis la réforme de 2023, une pension proportionnelle est possible pour ceux qui n'ont pas les 3 240 jours requis (à partir d'environ 1 320 jours). Sinon, remboursement des cotisations.",
    "conditions": "Âge légal de la retraite, nombre de jours déclarés (à vérifier auprès de la CNSS).",
    "demarche": "Demande de liquidation des droits en agence CNSS."
  },
  {
    "id": "D09",
    "cat": "particuliers",
    "titre": "Bourses d'études supérieures (Minhaty)",
    "organisme": "Ministère de l'Enseignement supérieur, ONOUSC",
    "site": "minhaty.ma",
    "pourQui": "Bacheliers et étudiants de familles à revenus modestes.",
    "apport": "Bourse d'études versée par trimestre, et accès prioritaire aux cités universitaires.",
    "conditions": "Critères sociaux (revenus de la famille, score RSU), inscription dans un établissement public.",
    "demarche": "Candidature en ligne dans les délais (souvent en été)."
  },
  {
    "id": "D10",
    "cat": "particuliers",
    "titre": "Personnes en situation de handicap",
    "organisme": "Fonds d'appui à la cohésion sociale, ministère de la Solidarité, Entraide Nationale",
    "site": "social.gov.ma",
    "pourQui": "Personnes en situation de handicap et leurs familles.",
    "apport": "Appareillage (fauteuils, prothèses, appareils auditifs), aide à la scolarisation des enfants handicapés, aide aux activités génératrices de revenus, carte de handicap avec avantages. Allocation supplémentaire pour enfant handicapé dans l'ASD.",
    "conditions": "Carte de personne en situation de handicap, situation sociale.",
    "demarche": "Délégation de l'Entraide Nationale ou du ministère de la Solidarité."
  },
  {
    "id": "D11",
    "cat": "particuliers",
    "titre": "Reconstruction après le séisme d'Al Haouz",
    "organisme": "Commission interministérielle, provinces concernées",
    "site": "Sites des provinces concernées",
    "pourQui": "Familles sinistrées des provinces touchées par le séisme de septembre 2023.",
    "apport": "Aide à la reconstruction (de l'ordre de 140 000 DH pour une maison effondrée et 80 000 DH pour une maison partiellement détruite, selon le programme annoncé) versée par tranches selon l'avancement des travaux.",
    "conditions": "Être recensé comme sinistré, avancer les travaux pour débloquer les tranches.",
    "demarche": "Suivi avec les autorités locales, architecte et commission de contrôle."
  },
  {
    "id": "D12",
    "cat": "particuliers",
    "titre": "Programmes de relogement (bidonvilles, habitat menaçant ruine)",
    "organisme": "Ministère de l'Habitat, Al Omrane, ANRUR, communes",
    "site": "mhpv.gov.ma",
    "pourQui": "Ménages vivant en bidonville ou dans des bâtiments menaçant ruine recensés.",
    "apport": "Lot de terrain ou appartement à prix réduit, aide à la reconstruction ou au relogement.",
    "conditions": "Être recensé dans le programme de la ville.",
    "demarche": "Commission locale du programme."
  }
];

export const aideById = (id: string) => aides.find((a) => a.id === id);

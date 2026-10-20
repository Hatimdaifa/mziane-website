// Pièces à fournir par le client, par prestation.
// Listes pratiques (ce que le client envoie). Les actes rédigés par nous (statuts, PV,
// formulaires, demandes types) ne figurent pas ici. Les listes officielles peuvent
// varier selon le CRI, le greffe ou l'organisme : à confirmer au moment du dépôt.

export interface DocRequirement {
  id: string;
  /** file : pièce à envoyer (défaut) ; info : réponse écrite ; rdv : vu avec le conseiller, rien à envoyer */
  kind?: "file" | "info" | "rdv";
  label: string;
  labelAr: string;
  hint?: string;
  condition?: string;
  optional?: boolean;
}

export interface ServiceDocs {
  key: string;
  title: string;
  titleAr: string;
  docs: DocRequirement[];
}

/* ------------------------------------------------------------------ */
/* Pièces réutilisées (même id = dédoublonnées dans une commande)       */
/* ------------------------------------------------------------------ */

const D = {
  cinGerant: {
    id: "cin-gerant",
    label: "CIN du gérant",
    labelAr: "البطاقة الوطنية للتعريف الإلكترونية للمسير",
    hint: "Recto verso, en couleur, en cours de validité",
  },
  cinAssocies: {
    id: "cin-associes",
    label: "CIN de chaque associé",
    labelAr: "البطاقة الوطنية للتعريف الإلكترونية لكل شريك",
    hint: "Recto verso, en couleur, en cours de validité",
  },
  passeportEtranger: {
    id: "passeport-etranger",
    label: "Passeport et carte de séjour des associés étrangers",
    labelAr: "جواز السفر وبطاقة الإقامة للشركاء الأجانب",
    hint: "Carte de séjour si la personne réside au Maroc",
    condition: "Si un associé ou le gérant est de nationalité étrangère",
  },
  associePersonneMorale: {
    id: "associe-personne-morale",
    label: "Statuts, registre de commerce et pouvoir du représentant de la société associée",
    labelAr: "النظام الأساسي والسجل التجاري وتفويض ممثل الشركة الشريكة",
    hint: "Traduits et légalisés si la société est étrangère",
    condition: "Si un associé est une société",
  },
  nomsProposes: {
    id: "noms-proposes", kind: "info",
    label: "Trois noms possibles pour la société, par ordre de préférence",
    labelAr: "ثلاث تسميات مقترحة للشركة حسب الأفضلية",
    hint: "Pour la demande de certificat négatif à l'OMPIC",
  },
  activite: {
    id: "activite", kind: "info",
    label: "Description de l'activité",
    labelAr: "وصف النشاط",
    hint: "Quelques lignes : ce que vous vendez ou faites",
  },
  repartitionCapital: {
    id: "repartition-capital", kind: "info",
    label: "Montant du capital et répartition entre associés",
    labelAr: "مبلغ رأس المال وتوزيعه بين الشركاء",
  },
  justifSiege: {
    id: "justif-siege",
    label: "Justificatif du siège : contrat de bail, titre de propriété ou contrat de domiciliation",
    labelAr: "ما يثبت المقر : عقد الكراء أو شهادة الملكية أو عقد التوطين",
    hint: "Inutile si vous prenez notre domiciliation",
  },
  blocageCapital: {
    id: "blocage-capital",
    label: "Attestation bancaire de blocage du capital",
    labelAr: "شهادة بنكية بإيداع وتجميد رأس المال",
    hint: "Délivrée par la banque après le dépôt des fonds",
    condition: "Si le capital dépasse 100 000 DH (toujours pour une SA)",
  },
  diplomeAgrement: {
    id: "diplome-agrement",
    label: "Diplôme, agrément ou autorisation de l'activité",
    labelAr: "الشهادة أو الاعتماد أو الترخيص الخاص بالنشاط",
    condition: "Si l'activité est réglementée (santé, transport, BTP, enseignement, etc.)",
  },
  modeleJ: {
    id: "modele-j",
    label: "Extrait du registre de commerce (modèle J) de moins de 3 mois",
    labelAr: "شهادة التقييد في السجل التجاري (النموذج ج) لا يتعدى تاريخها 3 أشهر",
  },
  statutsAJour: {
    id: "statuts-a-jour",
    label: "Statuts à jour de la société",
    labelAr: "النظام الأساسي المحين للشركة",
  },
  identifiants: {
    id: "identifiants-fiscaux",
    label: "Identifiant fiscal, ICE, taxe professionnelle et numéro CNSS",
    labelAr: "التعريف الجبائي والمعرف الموحد للمقاولة ICE والرسم المهني ورقم الانخراط في الضمان الاجتماعي",
    hint: "Une capture ou une copie des attestations suffit",
  },
  regulariteFiscale: {
    id: "regularite-fiscale",
    label: "Attestation de régularité fiscale",
    labelAr: "شهادة الوضعية الجبائية القانونية",
    hint: "Téléchargeable sur SIMPL (DGI)",
  },
  regulariteCnss: {
    id: "regularite-cnss",
    label: "Attestation de régularité CNSS",
    labelAr: "شهادة الوضعية القانونية تجاه الصندوق الوطني للضمان الاجتماعي",
    hint: "Téléchargeable sur Damancom",
  },
  bilan: {
    id: "dernier-bilan",
    label: "Dernier bilan et liasse fiscale",
    labelAr: "آخر حصيلة والقوائم التركيبية",
  },
  rib: {
    id: "rib",
    label: "Relevé d'identité bancaire (RIB)",
    labelAr: "شهادة الهوية البنكية RIB",
  },
  cinDemandeur: {
    id: "cin-demandeur",
    label: "CIN du demandeur",
    labelAr: "البطاقة الوطنية للتعريف الإلكترونية لصاحب الطلب",
    hint: "Recto verso, en couleur, en cours de validité",
  },
  telephone: {
    id: "telephone", kind: "info",
    label: "Numéro de téléphone à votre nom",
    labelAr: "رقم هاتف مسجل باسمك",
    hint: "Les codes de validation arrivent par SMS",
  },
} satisfies Record<string, DocRequirement>;

const cond = (d: DocRequirement, condition: string): DocRequirement => ({ ...d, condition });

/* ------------------------------------------------------------------ */
/* Groupes                                                            */
/* ------------------------------------------------------------------ */

const groups: ServiceDocs[] = [
  // Création par forme juridique
  {
    key: "auto",
    title: "Inscription auto-entrepreneur",
    titleAr: "التسجيل في نظام المقاول الذاتي",
    docs: [
      D.cinDemandeur,
      D.telephone,
      { id: "email", kind: "info", label: "Adresse e-mail active", labelAr: "بريد إلكتروني مفعل" },
      D.activite,
      {
        id: "adresse-activite", kind: "info",
        label: "Adresse où vous exercez l'activité",
        labelAr: "عنوان مزاولة النشاط",
        hint: "Votre domicile peut convenir",
      },
      cond(D.diplomeAgrement, "Si l'activité choisie exige un diplôme ou une autorisation"),
    ],
  },
  {
    key: "sarlau",
    title: "Création d'une SARL à associé unique",
    titleAr: "تأسيس شركة ذات مسؤولية محدودة بشريك وحيد",
    docs: [
      { ...D.cinAssocies, id: "cin-associe-unique", label: "CIN de l'associé unique", labelAr: "البطاقة الوطنية للتعريف الإلكترونية للشريك الوحيد" },
      cond(D.cinGerant, "Si le gérant n'est pas l'associé unique"),
      D.nomsProposes,
      D.activite,
      D.repartitionCapital,
      D.justifSiege,
      D.blocageCapital,
      D.diplomeAgrement,
    ],
  },
  {
    key: "sarl",
    title: "Création d'une SARL",
    titleAr: "تأسيس شركة ذات مسؤولية محدودة",
    docs: [
      D.cinAssocies,
      cond(D.cinGerant, "Si le gérant n'est pas associé"),
      D.passeportEtranger,
      D.associePersonneMorale,
      D.nomsProposes,
      D.activite,
      D.repartitionCapital,
      D.justifSiege,
      D.blocageCapital,
    ],
  },
  {
    key: "sas",
    title: "Création d'une SAS",
    titleAr: "تأسيس شركة المساهمة المبسطة",
    docs: [
      { ...D.cinAssocies, label: "CIN de chaque associé et du président", labelAr: "البطاقة الوطنية للتعريف الإلكترونية لكل شريك وللرئيس" },
      D.passeportEtranger,
      D.associePersonneMorale,
      D.nomsProposes,
      D.activite,
      D.repartitionCapital,
      D.justifSiege,
      D.blocageCapital,
    ],
  },
  {
    key: "cooperative",
    title: "Création d'une coopérative",
    titleAr: "تأسيس تعاونية",
    docs: [
      {
        id: "cin-membres",
        label: "CIN de chaque membre fondateur",
        labelAr: "البطاقة الوطنية للتعريف الإلكترونية لكل عضو مؤسس",
        hint: "Au moins 5 membres",
      },
      {
        id: "liste-membres", kind: "info",
        label: "Liste des membres avec adresse et parts souscrites",
        labelAr: "لائحة الأعضاء مع العناوين والحصص المكتتبة",
      },
      {
        id: "noms-cooperative", kind: "info",
        label: "Trois noms possibles pour la coopérative",
        labelAr: "ثلاث تسميات مقترحة للتعاونية",
        hint: "Pour le certificat négatif de l'ODCO",
      },
      D.activite,
      { ...D.justifSiege, id: "justif-siege-coop", label: "Justificatif du siège : bail, attestation de propriété ou mise à disposition", labelAr: "ما يثبت المقر : عقد الكراء أو شهادة الملكية أو التزام بوضع رهن الإشارة", hint: undefined },
      {
        id: "versement-capital-coop",
        label: "Attestation bancaire de versement du capital",
        labelAr: "شهادة بنكية بإيداع رأس المال",
      },
      cond(D.diplomeAgrement, "Si l'activité est réglementée"),
    ],
  },
  {
    key: "sa",
    title: "Création d'une société anonyme",
    titleAr: "تأسيس شركة مساهمة",
    docs: [
      { ...D.cinAssocies, id: "cin-actionnaires", label: "CIN de chaque actionnaire", labelAr: "البطاقة الوطنية للتعريف الإلكترونية لكل مساهم" },
      {
        id: "cin-administrateurs",
        label: "CIN des administrateurs ou membres du directoire",
        labelAr: "البطاقة الوطنية للتعريف الإلكترونية للمتصرفين أو أعضاء مجلس الإدارة الجماعية",
      },
      D.passeportEtranger,
      D.associePersonneMorale,
      {
        id: "acceptation-cac",
        label: "Lettre d'acceptation du commissaire aux comptes",
        labelAr: "رسالة قبول مراقب الحسابات",
      },
      D.nomsProposes,
      D.repartitionCapital,
      D.justifSiege,
      { ...D.blocageCapital, hint: "Capital minimum 300 000 DH, au moins un quart libéré", condition: undefined },
    ],
  },
  {
    key: "sci",
    title: "Création d'une société civile immobilière",
    titleAr: "تأسيس شركة مدنية عقارية",
    docs: [
      D.cinAssocies,
      D.passeportEtranger,
      D.nomsProposes,
      D.repartitionCapital,
      D.justifSiege,
      {
        id: "titre-foncier-apport",
        label: "Certificat de propriété du bien apporté",
        labelAr: "شهادة الملكية للعقار المقدم كحصة",
        hint: "Délivré par la Conservation foncière, moins de 3 mois",
        condition: "Si un associé apporte un bien immobilier",
      },
    ],
  },

  // Créateur non résident
  {
    key: "mre",
    title: "Création à distance (MRE ou non-résident)",
    titleAr: "التأسيس عن بعد (مغاربة العالم أو غير المقيمين)",
    docs: [
      {
        id: "passeport",
        label: "Passeport ou CIN de chaque associé non résident",
        labelAr: "جواز السفر أو البطاقة الوطنية لكل شريك غير مقيم",
        hint: "Page d'identité en couleur",
      },
      {
        id: "titre-sejour",
        label: "Titre de séjour du pays de résidence",
        labelAr: "بطاقة الإقامة في بلد الإقامة",
        optional: true,
      },
      {
        id: "justif-adresse-etranger",
        label: "Justificatif d'adresse à l'étranger de moins de 3 mois",
        labelAr: "وثيقة تثبت العنوان بالخارج لا يتعدى تاريخها 3 أشهر",
        hint: "Facture, quittance ou attestation de domicile",
      },
      {
        id: "procuration",
        label: "Procuration signée et légalisée",
        labelAr: "وكالة موقعة ومصادق على صحة إمضائها",
        hint: "Au consulat du Maroc, ou apostillée pour un étranger. Nous fournissons le modèle",
      },
      {
        id: "avis-virement-devises",
        label: "Avis de virement des fonds en devises",
        labelAr: "إشعار بتحويل الأموال بالعملة الأجنبية",
        hint: "Permet de rapatrier plus tard le capital et les dividendes",
        condition: "Si le capital est versé depuis l'étranger",
      },
      {
        id: "traduction-documents",
        label: "Traduction en arabe ou en français des documents étrangers",
        labelAr: "ترجمة الوثائق الأجنبية إلى العربية أو الفرنسية",
        hint: "Par un traducteur assermenté",
        condition: "Si un document n'est ni en arabe ni en français",
      },
    ],
  },

  // Domiciliation
  {
    key: "domiciliation",
    title: "Domiciliation du siège",
    titleAr: "توطين المقر الاجتماعي",
    docs: [
      D.cinGerant,
      {
        id: "certificat-negatif-ou-rc",
        label: "Certificat négatif ou extrait du registre de commerce",
        labelAr: "الشهادة السلبية أو شهادة التقييد في السجل التجاري",
        hint: "Le certificat négatif si la société est en création",
      },
      {
        id: "statuts-domi",
        label: "Statuts signés ou projet de statuts",
        labelAr: "النظام الأساسي الموقع أو مشروعه",
        optional: true,
      },
      {
        id: "adresse-gerant", kind: "info",
        label: "Adresse personnelle et téléphone du gérant",
        labelAr: "العنوان الشخصي ورقم هاتف المسير",
      },
    ],
  },

  // Formalités juridiques
  {
    key: "gerant",
    title: "Changement de gérant",
    titleAr: "تغيير المسير",
    docs: [
      D.modeleJ,
      D.statutsAJour,
      { id: "cin-nouveau-gerant", label: "CIN du nouveau gérant", labelAr: "البطاقة الوطنية للتعريف الإلكترونية للمسير الجديد", hint: "Passeport et carte de séjour s'il est étranger" },
      { id: "cin-ancien-gerant", label: "CIN du gérant sortant", labelAr: "البطاقة الوطنية للتعريف الإلكترونية للمسير المغادر" },
      {
        id: "demission-gerant",
        label: "Lettre de démission signée et légalisée",
        labelAr: "رسالة الاستقالة موقعة ومصادق على صحة إمضائها",
        condition: "Si le gérant sortant démissionne",
      },
      { ...D.cinAssocies, hint: "Pour la signature du procès-verbal" },
    ],
  },
  {
    key: "siege",
    title: "Transfert de siège",
    titleAr: "تحويل المقر الاجتماعي",
    docs: [
      D.modeleJ,
      D.statutsAJour,
      D.cinGerant,
      {
        id: "justif-nouveau-siege",
        label: "Justificatif de la nouvelle adresse : bail, titre de propriété ou contrat de domiciliation",
        labelAr: "ما يثبت العنوان الجديد : عقد الكراء أو شهادة الملكية أو عقد التوطين",
        hint: "Inutile si vous prenez notre domiciliation",
      },
      { ...D.identifiants, hint: "Pour la mise à jour auprès des impôts et de la CNSS" },
    ],
  },
  {
    key: "denomination",
    title: "Changement de dénomination",
    titleAr: "تغيير التسمية",
    docs: [
      D.modeleJ,
      D.statutsAJour,
      D.cinGerant,
      { ...D.nomsProposes, label: "Trois nouveaux noms possibles, par ordre de préférence", labelAr: "ثلاث تسميات جديدة مقترحة حسب الأفضلية" },
      { ...D.cinAssocies, hint: "Pour la signature du procès-verbal" },
    ],
  },
  {
    key: "parts",
    title: "Cession de parts",
    titleAr: "تفويت الحصص",
    docs: [
      D.modeleJ,
      D.statutsAJour,
      { id: "cin-cedant", label: "CIN du cédant", labelAr: "البطاقة الوطنية للتعريف الإلكترونية للمفوت" },
      { id: "cin-cessionnaire", label: "CIN du cessionnaire", labelAr: "البطاقة الوطنية للتعريف الإلكترونية للمفوت له", hint: "Passeport et carte de séjour s'il est étranger" },
      {
        id: "conditions-cession", kind: "info",
        label: "Nombre de parts cédées et prix de cession",
        labelAr: "عدد الحصص المفوتة وثمن التفويت",
      },
      { ...D.bilan, hint: "Sert à fixer le prix et à déclarer la plus-value" },
      cond(D.cinAssocies, "Si les statuts imposent l'accord des autres associés"),
    ],
  },
  {
    key: "capital",
    title: "Augmentation ou réduction de capital",
    titleAr: "الزيادة في رأس المال أو تخفيضه",
    docs: [
      D.modeleJ,
      D.statutsAJour,
      D.cinGerant,
      { ...D.cinAssocies, hint: "Et des nouveaux associés s'il y en a" },
      {
        id: "montant-capital", kind: "info",
        label: "Nouveau montant du capital et répartition",
        labelAr: "المبلغ الجديد لرأس المال وتوزيعه",
      },
      {
        id: "blocage-augmentation",
        label: "Attestation bancaire de dépôt des fonds",
        labelAr: "شهادة بنكية بإيداع الأموال",
        condition: "Si l'augmentation se fait par apport d'argent",
      },
      { ...D.bilan, condition: "Si l'opération utilise les réserves ou en cas de réduction" },
    ],
  },
  {
    key: "objet",
    title: "Changement d'activité",
    titleAr: "تغيير النشاط",
    docs: [
      D.modeleJ,
      D.statutsAJour,
      D.cinGerant,
      { ...D.activite, label: "Description de la nouvelle activité", labelAr: "وصف النشاط الجديد" },
      cond(D.diplomeAgrement, "Si la nouvelle activité est réglementée"),
    ],
  },
  {
    key: "sommeil",
    title: "Mise en sommeil",
    titleAr: "التوقف المؤقت عن النشاط",
    docs: [
      D.modeleJ,
      D.statutsAJour,
      D.cinGerant,
      D.identifiants,
      D.bilan,
      {
        id: "acces-simpl-damancom", kind: "rdv",
        label: "Accès SIMPL (impôts) et Damancom (CNSS)",
        labelAr: "الولوج إلى بوابة سمبل للضرائب وبوابة ضمانكم للضمان الاجتماعي",
        hint: "Nous les créons si vous ne les avez pas",
        optional: true,
      },
    ],
  },
  {
    key: "fermer",
    title: "Dissolution et liquidation amiable",
    titleAr: "الحل والتصفية الودية",
    docs: [
      D.modeleJ,
      D.statutsAJour,
      { id: "cin-liquidateur", label: "CIN du liquidateur", labelAr: "البطاقة الوطنية للتعريف الإلكترونية للمصفي", hint: "Souvent le gérant" },
      D.cinAssocies,
      D.identifiants,
      D.bilan,
      {
        id: "releves-liquidation",
        label: "Relevés bancaires des 12 derniers mois",
        labelAr: "الكشوفات البنكية للأشهر الاثني عشر الأخيرة",
      },
      {
        id: "dettes-creances", kind: "info",
        label: "Liste des dettes et créances restantes",
        labelAr: "لائحة الديون والمستحقات المتبقية",
      },
    ],
  },

  // Marque
  {
    key: "marque",
    title: "Dépôt de marque à l'OMPIC",
    titleAr: "إيداع العلامة لدى المكتب المغربي للملكية الصناعية والتجارية",
    docs: [
      {
        id: "identite-deposant",
        label: "CIN du déposant ou extrait du registre de commerce de la société",
        labelAr: "البطاقة الوطنية للمودع أو شهادة التقييد في السجل التجاري للشركة",
      },
      { id: "ice-deposant", kind: "info", label: "ICE de la société", labelAr: "المعرف الموحد للمقاولة ICE", condition: "Si le déposant est une société" },
      {
        id: "logo-marque",
        label: "Logo de la marque",
        labelAr: "شعار العلامة",
        hint: "JPG ou PNG haute définition, en couleur et en noir et blanc",
        condition: "Si la marque n'est pas un simple mot",
      },
      {
        id: "produits-services", kind: "info",
        label: "Liste des produits ou services à protéger",
        labelAr: "لائحة المنتجات أو الخدمات المراد حمايتها",
        hint: "En mots simples, nous choisissons les classes",
      },
      {
        id: "pouvoir-marque",
        label: "Pouvoir signé pour le dépôt",
        labelAr: "توكيل موقع لإيداع العلامة",
        hint: "Nous fournissons le modèle",
      },
      {
        id: "priorite",
        label: "Copie du dépôt antérieur à l'étranger",
        labelAr: "نسخة من الإيداع السابق بالخارج",
        condition: "Si vous revendiquez une priorité d'un dépôt fait il y a moins de 6 mois",
      },
    ],
  },

  // Site web
  {
    key: "web",
    title: "Site web",
    titleAr: "الموقع الإلكتروني",
    docs: [
      { id: "logo", label: "Logo", labelAr: "الشعار", hint: "Fichier SVG, PDF ou PNG haute définition", optional: true },
      {
        id: "textes-site", kind: "info",
        label: "Présentation de l'activité et des services",
        labelAr: "تقديم النشاط والخدمات",
        hint: "Quelques lignes suffisent, nous rédigeons le reste",
      },
      { id: "photos", label: "Photos de vos locaux, produits ou équipe", labelAr: "صور المقر أو المنتجات أو الفريق", optional: true },
      {
        id: "coordonnees-site", kind: "info",
        label: "Coordonnées à afficher : téléphone, WhatsApp, adresse, horaires",
        labelAr: "معلومات الاتصال : الهاتف وواتساب والعنوان وأوقات العمل",
      },
      { id: "nom-domaine", kind: "info", label: "Nom de domaine souhaité", labelAr: "اسم النطاق المرغوب فيه", optional: true },
    ],
  },

  // Comptabilité
  {
    key: "compta",
    title: "Reprise de la comptabilité",
    titleAr: "التكفل بمسك المحاسبة",
    docs: [
      { ...D.modeleJ, condition: "Si la société existe déjà" },
      { ...D.statutsAJour, condition: "Si la société existe déjà" },
      { ...D.identifiants, condition: "Si la société existe déjà" },
      {
        id: "acces-portails", kind: "rdv",
        label: "Accès SIMPL (impôts) et Damancom (CNSS)",
        labelAr: "الولوج إلى بوابة سمبل للضرائب وبوابة ضمانكم للضمان الاجتماعي",
        hint: "Nous les créons pour une société nouvelle",
        optional: true,
      },
      {
        id: "releves-bancaires",
        label: "Relevés bancaires depuis le début de l'exercice",
        labelAr: "الكشوفات البنكية منذ بداية السنة المحاسبية",
        hint: "Ensuite chaque mois",
      },
      {
        id: "factures",
        label: "Factures d'achat et de vente",
        labelAr: "فواتير الشراء والبيع",
        hint: "Ensuite chaque mois, photo ou PDF",
      },
      { ...D.bilan, label: "Dernier bilan, liasse fiscale et grand livre", labelAr: "آخر حصيلة والقوائم التركيبية ودفتر الأستاذ", condition: "Si un exercice a déjà été clôturé" },
      {
        id: "dossier-salaries",
        label: "Contrat, CIN et numéro CNSS de chaque salarié",
        labelAr: "عقد العمل والبطاقة الوطنية ورقم الضمان الاجتماعي لكل أجير",
        condition: "Si la société a des salariés",
      },
    ],
  },
  {
    key: "compta-ae",
    title: "Déclarations auto-entrepreneur",
    titleAr: "تصريحات المقاول الذاتي",
    docs: [
      {
        id: "carte-ae",
        label: "Carte ou attestation d'auto-entrepreneur",
        labelAr: "بطاقة أو شهادة المقاول الذاتي",
        condition: "Si vous êtes déjà inscrit",
      },
      {
        id: "if-ice-ae", kind: "info",
        label: "Identifiant fiscal et ICE",
        labelAr: "التعريف الجبائي والمعرف الموحد للمقاولة ICE",
        condition: "Si vous êtes déjà inscrit",
      },
      {
        id: "acces-portail-ae", kind: "rdv",
        label: "Accès au portail auto-entrepreneur",
        labelAr: "الولوج إلى بوابة المقاول الذاتي",
        optional: true,
      },
      {
        id: "numero-cnss-ae", kind: "info",
        label: "Numéro d'immatriculation CNSS (AMO)",
        labelAr: "رقم التسجيل في الصندوق الوطني للضمان الاجتماعي (التأمين الإجباري عن المرض)",
        condition: "Si vous êtes déjà inscrit",
      },
      {
        id: "factures-ae",
        label: "Factures émises ou relevé des encaissements",
        labelAr: "الفواتير الصادرة أو بيان المداخيل",
        hint: "Chaque trimestre, photo ou PDF",
      },
    ],
  },

  // Aides aux entreprises
  {
    key: "aides",
    title: "Dossier d'aide de l'État",
    titleAr: "ملف الدعم العمومي",
    docs: [
      { ...D.cinGerant, label: "CIN du dirigeant", labelAr: "البطاقة الوطنية للتعريف الإلكترونية للمسير" },
      { ...D.modeleJ, condition: "Si la société est déjà créée" },
      { ...D.regulariteFiscale, condition: "Si la société est déjà créée" },
      { ...D.regulariteCnss, condition: "Si la société est déjà créée" },
      { ...D.bilan, label: "Derniers états financiers", labelAr: "آخر القوائم التركيبية", condition: "Si un exercice a déjà été clôturé" },
      {
        id: "devis-investissement",
        label: "Devis ou factures pro forma de l'investissement",
        labelAr: "عروض الأثمان أو الفواتير الأولية للاستثمار",
      },
      {
        id: "infos-business-plan", kind: "info",
        label: "Éléments du projet : chiffre d'affaires visé, emplois prévus, apport personnel",
        labelAr: "معطيات المشروع : رقم المعاملات المتوقع ومناصب الشغل المرتقبة والمساهمة الشخصية",
        hint: "Nous construisons le business plan à partir de ces éléments",
      },
      {
        id: "preuve-fonds-propres",
        label: "Justificatif de l'apport en fonds propres",
        labelAr: "ما يثبت المساهمة بالأموال الذاتية",
        hint: "Relevé ou attestation bancaire",
        condition: "Pour la prime TPME (au moins 10 % du projet)",
      },
      D.rib,
    ],
  },
  {
    key: "aides-honneur",
    title: "Prêt d'honneur à 0 %",
    titleAr: "برنامج فرصة وقرض الشرف",
    docs: [
      { ...D.cinDemandeur, hint: "Être de nationalité marocaine et majeur" },
      { id: "cv", label: "CV", labelAr: "السيرة الذاتية" },
      {
        id: "idee-projet", kind: "info",
        label: "Présentation du projet en quelques lignes",
        labelAr: "تقديم موجز للمشروع",
        hint: "Le besoin, les clients visés, le montant nécessaire",
      },
      { id: "diplomes", label: "Diplômes ou attestations de formation", labelAr: "الشهادات أو شواهد التكوين", optional: true },
      { ...D.modeleJ, condition: "Si l'entreprise est déjà créée" },
      { id: "devis-honneur", label: "Devis du matériel ou des travaux prévus", labelAr: "عروض أثمان المعدات أو الأشغال المرتقبة", optional: true },
    ],
  },

  // Agriculture
  {
    key: "terre",
    title: "Subvention irrigation (FDA)",
    titleAr: "إعانة صندوق التنمية الفلاحية للري",
    docs: [
      { ...D.cinDemandeur, hint: "Copie certifiée conforme" },
      {
        id: "justif-foncier",
        label: "Titre de propriété ou contrat de location du terrain",
        labelAr: "ما يثبت الملكية أو عقد كراء الأرض",
        hint: "Certificat de propriété de moins de 3 mois, moulkia ou bail enregistré",
      },
      {
        id: "attestation-collectif",
        label: "Attestation de l'autorité locale d'exploitation du terrain",
        labelAr: "شهادة السلطة المحلية باستغلال الأرض",
        condition: "Si le terrain est collectif ou sans titre",
      },
      {
        id: "plan-situation",
        label: "Plan de situation de la parcelle",
        labelAr: "تصميم موقع القطعة الأرضية",
      },
      {
        id: "etude-devis-installateur",
        label: "Étude technique et devis de l'installateur agréé",
        labelAr: "الدراسة التقنية وعرض أثمان المركب المعتمد",
        hint: "Plan du réseau et note de calcul signés",
      },
      {
        id: "justif-eau",
        label: "Justificatif de la ressource en eau",
        labelAr: "ما يثبت مصدر الماء",
        hint: "Autorisation de l'agence de bassin pour un puits ou forage, ou attestation de l'ORMVA",
      },
      {
        id: "engagement-5ha",
        label: "Justificatif de superficie de 5 ha ou moins",
        labelAr: "ما يثبت أن المساحة لا تتجاوز 5 هكتارات",
        condition: "Pour la subvention à 100 % des petits exploitants",
      },
      {
        id: "factures-travaux",
        label: "Factures définitives des travaux",
        labelAr: "الفواتير النهائية للأشغال",
        hint: "Après les travaux, pour la demande de paiement",
      },
      { ...D.rib, condition: "Si la subvention vous est versée et non à l'installateur" },
    ],
  },

  // Particuliers
  {
    key: "part-asd",
    title: "Aide sociale directe",
    titleAr: "الدعم الاجتماعي المباشر",
    docs: [
      { ...D.cinDemandeur, label: "CIN du chef de ménage", labelAr: "البطاقة الوطنية للتعريف الإلكترونية لرب الأسرة" },
      {
        id: "identifiant-rnp-rsu", kind: "info",
        label: "Identifiant RNP et numéro RSU du ménage",
        labelAr: "المعرف المدني والاجتماعي الرقمي ورقم السجل الاجتماعي الموحد للأسرة",
        hint: "Sur le reçu d'inscription, nous vous aidons à l'obtenir sinon",
      },
      D.telephone,
      {
        id: "livret-famille",
        label: "Livret de famille ou actes de naissance des enfants",
        labelAr: "الدفتر العائلي أو عقود ازدياد الأطفال",
        condition: "Si le ménage a des enfants de moins de 21 ans",
      },
      {
        id: "carte-handicap",
        label: "Carte ou certificat de handicap",
        labelAr: "بطاقة أو شهادة الإعاقة",
        condition: "Si un membre du ménage est en situation de handicap",
      },
    ],
  },
  {
    key: "part-logement",
    title: "Aide directe au logement",
    titleAr: "الدعم المباشر للسكن",
    docs: [
      D.cinDemandeur,
      D.telephone,
      {
        id: "infos-logement", kind: "info",
        label: "Nom du promoteur, adresse et prix TTC du logement",
        labelAr: "اسم المنعش العقاري وعنوان السكن وثمنه مع احتساب الرسوم",
        hint: "Prix de 700 000 DH TTC au plus",
      },
      {
        id: "promesse-vente",
        label: "Promesse de vente signée chez le notaire",
        labelAr: "الوعد بالبيع الموقع لدى الموثق",
        hint: "Le notaire la dépose sur la plateforme sous 7 jours",
      },
      {
        id: "permis-habiter",
        label: "Permis d'habiter du logement",
        labelAr: "رخصة السكن الخاصة بالمسكن",
        hint: "Délivré à partir du 1er janvier 2023, fourni par le promoteur",
      },
      {
        id: "justif-indivision",
        label: "Références du bien hérité en indivision",
        labelAr: "مراجع العقار الموروث على الشياع",
        condition: "Si vous détenez une part d'un logement en héritage",
      },
    ],
  },
];

export const SERVICE_DOCS: Record<string, ServiceDocs> = Object.fromEntries(groups.map((g) => [g.key, g]));

/* ------------------------------------------------------------------ */
/* Pièces d'une commande                                              */
/* ------------------------------------------------------------------ */

const FORME_KEYS = ["auto", "sarlau", "sarl", "sas", "cooperative", "sa", "sci"] as const;

/** Pièces à demander pour une commande, groupées et sans doublon. */
export function docsForOrder(p: {
  packId?: string;
  offreId?: string;
  formalites?: string[];
  forme?: string;
  opts?: string[];
}): ServiceDocs[] {
  const keys: string[] = [];
  const add = (...k: string[]) => k.forEach((x) => x && !keys.includes(x) && keys.push(x));

  const formeSoc = p.forme && (FORME_KEYS as readonly string[]).includes(p.forme) && p.forme !== "auto" ? p.forme : "sarlau";
  const forme = p.forme && (FORME_KEYS as readonly string[]).includes(p.forme) ? p.forme : undefined;
  const comptaKey = (id?: string) => (id === "compta-declaratif" || forme === "auto" ? "compta-ae" : "compta");

  switch (p.packId) {
    case "lancement":
    case "lancement-equipe":
      add(formeSoc, "compta", "web");
      break;
    case "demarrage":
      add("auto", "compta-ae", "web");
      break;
    case "envol":
      add(formeSoc, "aides");
      break;
    case "diaspora":
      add(formeSoc, "mre", "domiciliation", "compta");
      break;
    case "identite":
      add("marque", "web");
      break;
    case "terre":
      add("terre");
      if (forme === "cooperative") add("cooperative", "compta");
      break;
  }

  const o = p.offreId ?? "";
  if (o.startsWith("ae-")) add("auto");
  else if (o.startsWith("soc-")) add(formeSoc);
  else if (o.startsWith("compta-")) add(comptaKey(o));
  else if (o === "aides-dossier" || o === "aides-diagnostic") add("aides");
  else if (o === "aides-honneur") add("aides-honneur");
  else if (o.startsWith("domi-")) add("domiciliation");
  else if (o.startsWith("marque-")) add("marque");
  else if (o.startsWith("web-")) add("web");
  else if (o === "intl-mre" || o === "intl-etranger" || o === "intl-zai") add(formeSoc, "mre");
  else if (o === "part-asd" || o === "part-logement") add(o);
  else if (o === "terre") add("terre");

  if (!p.packId && !o && forme) add(forme);

  for (const f of p.formalites ?? []) if (SERVICE_DOCS[f]) add(f);

  for (const opt of p.opts ?? []) {
    if (opt === "web-page" || opt === "web-vitrine") add("web");
    else if (opt === "domi-business" || opt.startsWith("domi-")) add("domiciliation");
    else if (opt.startsWith("marque-")) add("marque");
    else if (opt === "aides-dossier") add("aides");
    else if (opt.startsWith("compta-")) add(comptaKey(opt));
  }

  // Une pièce déjà demandée dans un groupe précédent n'est pas répétée.
  const seen = new Set<string>();
  const out: ServiceDocs[] = [];
  for (const k of keys) {
    const g = SERVICE_DOCS[k];
    if (!g) continue;
    const docs = g.docs.filter((d) => !seen.has(d.id));
    docs.forEach((d) => seen.add(d.id));
    if (docs.length) out.push({ ...g, docs });
  }
  return out;
}

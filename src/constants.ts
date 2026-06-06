import type { StatutService, Clients, Freelancers, Administrateur, Messagerie, Service, Paiements, Wallet, ProfilFreelancers, Rang, Commentaires, Notifications, Signalements, Justifications, Avertissements } from "./Type";

export const statutServiceMock: StatutService = {
  EN_ATTENTE: "en_attente",
  CONFIRME: "confirme",
  ANNULE: "annule",
  FINALISE: "finalise",
  REFUSE: "refuse",
};

export const clientMock: Clients = {
  id_client: 1,
  Nom: "Kaboukoussou",
  prenom: "William",
  email: "william@gmail.com",
  Telephone: "066123456",
  photo: "https://picsum.photos/200",
  mot_de_passe: "William123",
  date_creation: "2026-06-06",
};


export const freelancerMock: Freelancers = {
  id_freelancer: 1,
  nom: "Mavoungou",
  prenom: "Jean",
  email: "jean@gmail.com",
  Telephone: "066654321",
  photo: "https://picsum.photos/201",
  mot_de_passe: "Jean123",
  date_creation: "2026-06-06",
};

export const administrateurMock: Administrateur = {
  id_admin: 1,
  nom: "Admin Principal",
  email: "admin@gmail.com",
  mot_de_passe: "Admin123",
};

export const messageMock: Messagerie = {
  id_message: 1,
  id_envoyeur: 1,
  id_receveur: 2,
  contenu_message: "Bonjour, je souhaite commander votre service.",
  date: "2026-06-06 14:30",
  Lu: false,
};

export const serviceMock: Service = {
  id_service: 1,
  id_client: 1,
  id_freelancer: 1,
  intitule: "Création d'un logo",
  description: "Création d'un logo professionnel",
  statut: {
    EN_ATTENTE: "en_attente",
    CONFIRME: "confirme",
    ANNULE: "annule",
    FINALISE: "finalise",
    REFUSE: "refuse",
  },
  date_creation: "2026-06-06",
};

export const paiementMock: Paiements = {
  id_paiement: 1,
  id_service: 1,
  id_client: 1,
  id_freelancer: 1,
  montant_ajoute: 50000,
};

export const walletMock: Wallet = {
  id_wallet: 1,
  id_client: 1,
  id_freelancer: null,
  montant: 100000,
  devise: "XAF",
};

export const profilFreelancerMock: ProfilFreelancers = {
  id_profil: 1,
  id_freelancer: 1,
  secteur_activite: "Informatique",
  profession: "Développeur React Native",
  descritpion: "Développeur mobile avec 5 ans d'expérience",
  document: "cv.pdf",
};

export const rangMock: Rang = {
  id_rang: 1,
  id_freelancer: 1,
  rang: "expert",
};

export const commentaireMock: Commentaires = {
  id_commentaire: 1,
  id_client: 1,
  id_freelancer: 1,
  commentaire: "Je recommande fortement ce freelancer.",
  date: "2026-06-06",
};

export const notificationMock: Notifications = {
  id_notification: 1,
  id_client: 1,
  id_freelancer: null,
  id_admin: null,
  notification: "Votre commande a été confirmée.",
};

export const signalementMock: Signalements = {
  id_signale: 1,
  id_signaleur: 2,
  Signalement: "Comportement inapproprié.",
};

export const justificationMock: Justifications = {
  id_justification: 1,
  id_signalement: 1,
  Justification: "Le problème a été résolu après discussion.",
};

export const avertissementMock: Avertissements = {
  id_avertissement: 1,
  id_client: 1,
  id_freelancer: null,
  id_admin: 1,
  contenu_avertissement:
    "Veuillez respecter les règles de la plateforme.",
};
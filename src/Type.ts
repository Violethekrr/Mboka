import type { LucideIcon } from "lucide-react";
export interface StatutService {
  EN_ATTENTE: "en_attente",
  CONFIRME: "confirme",
  ANNULE: "annule",
  FINALISE: "finalise",
  REFUSE: "refuse",
}

export interface Clients {
  id_client: number,
  nom: string,
  prenom: string,
  email: string,
  Telephone: string,
  photo:string,
  mot_de_passe:string,
  date_creation:string
}

export interface Freelancers{
id_freelancer:number, 
nom:string,
 prenom:string,
 email:string,
 Telephone:string,
 photo:string,
 mot_de_passe:string,
 date_creation:string}

export interface Administrateur {
id_admin:number,
 nom:string,
 email:string,
  mot_de_passe:string}

export interface Messagerie {
id_message: number,
 id_envoyeur: number,
 id_receveur: number,
 contenu_message:string,
 date:string, 
Lu:boolean}

export interface Service {
  id_service: number;
  id_client: number;
  id_freelancer: number;

  intitule: string;
  description: string;

  statut: StatutService;

  date_creation: string;
}

export interface Paiements {
id_paiement: number,
id_service: number,
 id_client: number,
 id_freelancer: number,
 montant_ajoute: number}

export interface Wallet {
id_wallet: number,
 id_client: number | null,
 id_freelancer: number | null,
 montant: number,
 devise:string}

export interface ProfilFreelancers {
id_profil: number,
 id_freelancer: number,
 secteur_activite:string,
 profession:string,
 descritpion:string,
 document:string}

export interface Rang {
id_rang: number,
 id_freelancer: number,
 rang:'niveau_débutant' | 'intermédiaire' | 'expert'}

export interface Avis {
id_avis: number,
 id_client: number,
 id_freelancer: number,
 Avis:string}

export interface Commentaires {
id_commentaire: number,
 id_client: number,
 id_freelancer: number,
 commentaire:string,
 date:string}

export interface Notifications {
id_notification: number,
id_client: number | null,
 id_freelancer: number | null, 
id_admin: number | null,
 notification:string, date?:string,
lu?: boolean,
}

export interface Signalement {
  id_signalement: number;
  id_signaleur: number;
  id_signalé: number;
  signaleur_type: "client" | "freelancer" | "admin";
  Signalement: string;
  statut?: "en_attente" | "en_cours" | "resolu" | "rejete";
  date?: string;
  categorie?: string;
  note_admin?: string;
}

export interface Justifications {
id_justification: number, 
id_signalement: number,
 Justification:string}

export interface Avertissements {

id_avertissement:number,

  id_client: number | null;
  id_freelancer: number | null;
id_admin: number | null;
contenu_avertissement:string}

export type ArtisanCardProps = {
  id: number;
  photo: string;
  nom: string;
  prenom: string;
  metier: string;
  note: number;
  avis: number;
  distance: string;
  prix?: string;
  disponible: boolean;
  verified: boolean;
  badge?: "Expert" | "Premium";
  id_freelancer?: number;
  currentClientId?: number;
  onOpenComments?: (freelancerId: number, nom: string, photo: string, metier: string) => void;
  onOpenForm?: (artisan: {
    photo: string;
    nom: string;
    metier: string;
    note: number;
    avis: number;
    verified: boolean;
    disponible: boolean;
  }) => void;
};

export type Category = {
  label: string;
  icon: LucideIcon;
};

export type Props = {
  freelancerId: number;
  freelancerNom: string;
  freelancerPhoto: string;
  freelancerMetier: string;
  currentClientId: number;
  onClose: () => void;
};

export type FormulaireProps = {
  artisan: {
    photo: string;
    nom: string;
    metier: string;
    note: number;
    avis: number;
    verified: boolean;
    disponible: boolean;
  };
  onClose: () => void;
};

export type RecommendedSectionProps = {
  onOpenComments?: (freelancerId: number, nom: string, photo: string, metier: string) => void;
  onOpenForm?: (artisan: {
    photo: string;
    nom: string;
    metier: string;
    note: number;
    avis: number;
    verified: boolean;
    disponible: boolean;
  }) => void;
};
export type FeaturedArtisansProps = {
  searchQuery?: string;
  selectedCategory?: string | null;
  onOpenComments?: (freelancerId: number, nom: string, photo: string, metier: string) => void;
  onOpenForm?: (artisan: {
    photo: string;
    nom: string;
    metier: string;
    note: number;
    avis: number;
    verified: boolean;
    disponible: boolean;
  }) => void;
};

export type CommentsModalData = {
  isOpen: boolean;
  freelancerId: number;
  freelancerNom: string;
  freelancerPhoto: string;
  freelancerMetier: string;
};

export type FormModalData = {
  isOpen: boolean;
  artisan: {
    photo: string;
    nom: string;
    metier: string;
    note: number;
    avis: number;
    verified: boolean;
    disponible: boolean;
  } | null;
};

export type ModalState = {
  comments: CommentsModalData;
  form: FormModalData;
};

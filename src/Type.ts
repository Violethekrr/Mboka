export interface StatutService {
  EN_ATTENTE: "en_attente",
  CONFIRME: "confirme",
  ANNULE: "annule",
  FINALISE: "finalise",
  REFUSE: "refuse",
}

export interface Clients {
  id_client: number,
  Nom: string,
  prenom: string,
  email: string,
  Telephone: string,
 photo:string,
 mot_de_passe:string,
 date_creation:string}

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
 notification:string}

export interface Signalements {
id_signale: number, 
id_signaleur: number, 
Signalement:string}

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
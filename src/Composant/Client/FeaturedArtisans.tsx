import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";

import ArtisanCard from "./ArtisanCard";

import type { ArtisanCardProps, FeaturedArtisansProps } from "../../Type";

import {
  commentairesMock,
  freelancersMock,
  paiementsMock,
  profilsFreelancersMock,
  rangsMock,
} from "../../constants";

type ArtisanAffiche = ArtisanCardProps & {
  secteur: string;
  description: string;
};

export default function FeaturedArtisans({
  searchQuery = "",
  selectedCategory = null,
  onOpenComments,
  onOpenForm,
}: FeaturedArtisansProps) {
  const artisans = freelancersMock.map((freelancer) =>
    creerArtisanAffiche(freelancer.id_freelancer)
  );

  const recherche = searchQuery.trim().toLowerCase();

  const artisansFiltres = artisans.filter((artisan) => {
    const correspondCategorie =
      selectedCategory === null || artisan.secteur === selectedCategory;

    const correspondRecherche =
      recherche === "" ||
      artisan.nom.toLowerCase().includes(recherche) ||
      artisan.prenom.toLowerCase().includes(recherche) ||
      artisan.metier.toLowerCase().includes(recherche) ||
      artisan.secteur.toLowerCase().includes(recherche) ||
      artisan.description.toLowerCase().includes(recherche);

    return correspondCategorie && correspondRecherche;
  });

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white md:text-lg">
            {searchQuery || selectedCategory
              ? "Résultats de recherche"
              : "Freelancers vérifiés"}
          </h2>

          <p className="mt-0.5 text-[11px] text-white/40">
            {artisansFiltres.length} freelancer
            {artisansFiltres.length > 1 ? "s" : ""} trouvé
            {artisansFiltres.length > 1 ? "s" : ""}
          </p>
        </div>

        <Link
          to="/client/services"
          className="flex items-center gap-1 text-xs font-semibold text-[#FF6257] no-underline transition-all hover:gap-2"
        >
          Voir tout <ArrowRight size={13} />
        </Link>
      </div>

      {artisansFiltres.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#2a2a32] bg-[#24242c] px-4 py-16 text-center">
          <Search size={48} className="mb-4 text-white/20" />

          <h3 className="mb-2 text-lg font-bold text-white">
            Aucun freelancer trouvé
          </h3>

          <p className="max-w-md text-sm text-white/40">
            Aucun freelancer ne correspond à votre recherche. Essayez un autre
            mot-clé ou une autre catégorie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {artisansFiltres.map((artisan) => (
            <ArtisanCard
              key={artisan.id}
              {...artisan}
              onOpenComments={onOpenComments}
              onOpenForm={onOpenForm}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function creerArtisanAffiche(idFreelancer: number): ArtisanAffiche {
  const freelancer = freelancersMock.find(
    (item) => item.id_freelancer === idFreelancer
  );

  const profil = profilsFreelancersMock.find(
    (item) => item.id_freelancer === idFreelancer
  );

  const rang = rangsMock.find((item) => item.id_freelancer === idFreelancer);

  if (!freelancer) {
    throw new Error("Freelancer introuvable");
  }

  return {
    id: freelancer.id_freelancer,
    id_freelancer: freelancer.id_freelancer,
    photo: freelancer.photo,
    nom: freelancer.nom,
    prenom: freelancer.prenom,
    metier: profil?.profession ?? "Freelancer",
    secteur: profil?.secteur_activite ?? "Autre",
    description: profil?.descritpion ?? "",
    note: obtenirNoteMoyenne(idFreelancer),
    avis: obtenirNombreAvis(idFreelancer),
    distance: "À proximité",
    prix: obtenirPrixDepart(idFreelancer),
    disponible: estDisponible(idFreelancer),
    verified: true,
    badge: obtenirBadge(rang?.rang),
  };
}

function obtenirNombreAvis(idFreelancer: number) {
  return commentairesMock.filter(
    (commentaire) => commentaire.id_freelancer === idFreelancer
  ).length;
}

function obtenirNoteMoyenne(idFreelancer: number) {
  const commentaires = commentairesMock.filter(
    (commentaire) => commentaire.id_freelancer === idFreelancer
  );

  if (commentaires.length === 0) return 4.5;

  const total = commentaires.reduce(
    (somme, commentaire) => somme + obtenirNote(commentaire.id_commentaire),
    0
  );

  return Number((total / commentaires.length).toFixed(1));
}

function obtenirNote(idCommentaire: number) {
  const notes = [5, 4, 5, 3, 4, 2, 5, 4, 1, 5];

  return notes[(idCommentaire - 1) % notes.length];
}

function obtenirPrixDepart(idFreelancer: number) {
  const paiements = paiementsMock.filter(
    (paiement) => paiement.id_freelancer === idFreelancer
  );

  if (paiements.length === 0) return "0";

  const prixMinimum = Math.min(
    ...paiements.map((paiement) => paiement.montant_ajoute)
  );

  return prixMinimum.toLocaleString("fr-FR");
}

function estDisponible(idFreelancer: number) {
  return idFreelancer % 3 !== 0;
}

function obtenirBadge(rang?: string) {
  if (rang === "expert") return "Expert";
  if (rang === "intermédiaire") return "Premium";

  return undefined;
}
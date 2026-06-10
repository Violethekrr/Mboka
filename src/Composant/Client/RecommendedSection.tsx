import { useState } from "react";
import { ArrowRight, CheckCircle, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

import type { RecommendedSectionProps } from "../../Type";

import {
  commentairesMock,
  freelancersMock,
  profilsFreelancersMock,
} from "../../constants";

import FreelancerDetailsModal from "./FreelancerDetailsModal";

type FreelancerDetail = {
  id_freelancer: number;
  nom: string;
  prenom: string;
  photo: string;
  metier: string;
  secteur: string;
  description: string;
  note: number;
  avis: number;
  distance: string;
  disponible: boolean;
};

export default function RecommendedSection({
  onOpenComments,
  onOpenForm,
}: RecommendedSectionProps) {
  const [freelancerSelectionne, setFreelancerSelectionne] =
    useState<FreelancerDetail | null>(null);

  const freelancersRecommandes = freelancersMock
    .map((freelancer) => {
      const profil = profilsFreelancersMock.find(
        (item) => item.id_freelancer === freelancer.id_freelancer
      );

      return {
        id_freelancer: freelancer.id_freelancer,
        nom: freelancer.nom,
        prenom: freelancer.prenom,
        photo: freelancer.photo,
        metier: profil?.profession ?? "Freelancer",
        secteur: profil?.secteur_activite ?? "Non renseigné",
        description: profil?.descritpion ?? "",
        note: obtenirNoteMoyenne(freelancer.id_freelancer),
        avis: obtenirNombreAvis(freelancer.id_freelancer),
        distance: "À proximité",
        disponible: freelancer.id_freelancer % 3 !== 0,
      };
    })
    .sort((a, b) => b.note - a.note)
    .slice(0, 4);

  function ouvrirCommentaires(freelancer: FreelancerDetail) {
    onOpenComments?.(
      freelancer.id_freelancer,
      `${freelancer.prenom} ${freelancer.nom}`,
      freelancer.photo,
      freelancer.metier
    );
  }

  function ouvrirFormulaire(freelancer: FreelancerDetail) {
    onOpenForm?.({
      photo: freelancer.photo,
      nom: `${freelancer.prenom} ${freelancer.nom}`,
      metier: freelancer.metier,
      note: freelancer.note,
      avis: freelancer.avis,
      verified: true,
      disponible: freelancer.disponible,
    });

    setFreelancerSelectionne(null);
  }

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white md:text-lg">
            Recommandés pour vous
          </h2>

          <p className="mt-0.5 text-[11px] text-[#B8B8BE]">
            Les freelancers les mieux notés
          </p>
        </div>

        <Link
          to="/client/services"
          className="flex items-center gap-1 text-xs font-semibold text-[#FF6257] no-underline transition-all hover:gap-2"
        >
          Voir tout <ArrowRight size={13} />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
        {freelancersRecommandes.map((freelancer) => (
          <div
            key={freelancer.id_freelancer}
            className="group w-64 shrink-0 overflow-hidden rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF6257]/40 hover:shadow-[0_8px_32px_rgba(255,98,87,0.14)] md:w-auto"
          >
            <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#B52D3A]/40 via-[#1B1B1D] to-[#111113]">
              <img
                src={freelancer.photo}
                alt={`${freelancer.prenom} ${freelancer.nom}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B1D] via-transparent to-transparent" />

              <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-[#2D2D31] bg-[#1B1B1D]/85 px-2 py-0.5 backdrop-blur-sm">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    freelancer.disponible
                      ? "animate-pulse bg-emerald-400"
                      : "bg-gray-500"
                  }`}
                />

                <span className="text-[9px] font-semibold text-[#B8B8BE]">
                  {freelancer.disponible ? "Disponible" : "Occupé"}
                </span>
              </div>
            </div>

            <div className="p-3.5">
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold leading-tight text-white">
                    {freelancer.prenom} {freelancer.nom.charAt(0)}.
                  </h3>

                  <p className="mt-0.5 text-[10px] font-medium text-[#FF6257]">
                    {freelancer.metier}
                  </p>
                </div>

                <CheckCircle size={14} className="mt-0.5 text-[#FF6257]" />
              </div>

              <button
                onClick={() => ouvrirCommentaires(freelancer)}
                className="mb-3 flex items-center gap-2 text-[10px] text-[#B8B8BE] transition-opacity hover:opacity-80"
              >
                <div className="flex items-center gap-1">
                  <Star size={10} className="fill-amber-400 text-amber-400" />

                  <span className="font-semibold text-white">
                    {freelancer.note}
                  </span>

                  <span className="hover:text-[#FF6257]">
                    ({freelancer.avis})
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin size={10} className="text-[#FF6257]" />
                  <span>{freelancer.distance}</span>
                </div>
              </button>

              <button
                onClick={() => setFreelancerSelectionne(freelancer)}
                className="w-full rounded-xl border border-[#FF6257]/40 bg-[#FF6257]/10 px-3 py-2 text-[11px] font-bold text-[#FF6257] transition-colors hover:bg-[#FF6257] hover:text-white"
              >
                Consulter le profil
              </button>
            </div>
          </div>
        ))}
      </div>

      {freelancerSelectionne && (
        <FreelancerDetailsModal
          ouvert={true}
          onClose={() => setFreelancerSelectionne(null)}
          freelancer={{
            photo: freelancerSelectionne.photo,
            nom: `${freelancerSelectionne.prenom} ${freelancerSelectionne.nom}`,
            metier: freelancerSelectionne.metier,
            secteur: freelancerSelectionne.secteur,
            description: freelancerSelectionne.description,
            note: freelancerSelectionne.note,
            avis: freelancerSelectionne.avis,
            disponible: freelancerSelectionne.disponible,
            verified: true,
          }}
          onVoirAvis={() => ouvrirCommentaires(freelancerSelectionne)}
          onDemanderService={() => ouvrirFormulaire(freelancerSelectionne)}
        />
      )}
    </section>
  );
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
import { useState } from "react";
import {
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  Star,
} from "lucide-react";

import type { ArtisanCardProps } from "../../Type";
import FreelancerDetailsModal from "./FreelancerDetailsModal";

type Props = ArtisanCardProps & {
  description?: string;
  secteur?: string;
};

export default function ArtisanCard({
  id,
  photo,
  nom,
  prenom,
  metier,
  note,
  avis,
  distance,
  disponible,
  verified,
  badge,
  id_freelancer,
  description,
  secteur,
  onOpenComments,
  onOpenForm,
}: Props) {
  const [modalOuvert, setModalOuvert] = useState(false);

  const nomComplet = `${prenom} ${nom}`;

  function ouvrirCommentaires() {
    onOpenComments?.(id_freelancer ?? id, nomComplet, photo, metier);
  }

  function ouvrirFormulaire() {
    onOpenForm?.({
      photo,
      nom: nomComplet,
      metier,
      note,
      avis,
      verified,
      disponible,
    });

    setModalOuvert(false);
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF6257]/40 hover:shadow-[0_8px_32px_rgba(255,98,87,0.14)]">
        {badge && (
          <div className="absolute left-3 top-3 z-10">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                badge === "Expert"
                  ? "bg-[#FF6257] text-white"
                  : "bg-[#FF7B6B] text-white"
              }`}
            >
              {badge}
            </span>
          </div>
        )}

        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full border border-[#2D2D31] bg-[#1B1B1D]/85 px-2 py-1 backdrop-blur-sm">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              disponible ? "animate-pulse bg-emerald-400" : "bg-gray-500"
            }`}
          />

          <span className="text-[9px] font-semibold text-[#B8B8BE]">
            {disponible ? "Dispo" : "Occupé"}
          </span>
        </div>

        <div className="relative h-24 bg-gradient-to-br from-[#B52D3A]/40 via-[#1B1B1D] to-[#111113] md:h-28">
          <div className="absolute bottom-0 left-4 translate-y-1/2">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border-2 border-[#1B1B1D] shadow-lg md:h-16 md:w-16">
              <img
                src={photo}
                alt={nomComplet}
                className="h-full w-full object-cover"
              />

              {verified && (
                <div className="absolute bottom-0 right-0 rounded-full border border-[#1B1B1D] bg-[#FF6257] p-0.5">
                  <CheckCircle size={10} className="fill-white text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 pt-9">
          <h3 className="text-sm font-bold leading-tight text-white">
            {prenom} {nom.charAt(0).toUpperCase()}.
          </h3>

          <p className="mt-0.5 text-[11px] font-semibold text-[#FF6257]">
            {metier}
          </p>

          <button
            onClick={ouvrirCommentaires}
            className="mb-3 mt-2 flex items-center gap-1 transition-opacity hover:opacity-80"
          >
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-white">{note}</span>

            <span className="text-[10px] text-[#B8B8BE] hover:text-[#FF6257]">
              ({avis} avis)
            </span>

            <MessageSquare size={10} className="ml-0.5 text-[#B8B8BE]/40" />
          </button>

          <div className="mb-4 flex items-center justify-between text-[10px] text-[#B8B8BE]">
            <div className="flex items-center gap-1">
              <MapPin size={10} className="text-[#FF6257]" />
              <span>{distance}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span>Rapide</span>
            </div>
          </div>

          <button
            onClick={() => setModalOuvert(true)}
            className="w-full rounded-xl border border-[#FF6257]/40 bg-[#FF6257]/10 px-3 py-2 text-[11px] font-bold text-[#FF6257] transition-colors hover:bg-[#FF6257] hover:text-white"
          >
            Consulter le profil
          </button>
        </div>
      </div>

      <FreelancerDetailsModal
        ouvert={modalOuvert}
        onClose={() => setModalOuvert(false)}
        freelancer={{
          photo,
          nom: nomComplet,
          metier,
          secteur,
          description,
          note,
          avis,
          disponible,
          verified,
        }}
        onVoirAvis={ouvrirCommentaires}
        onDemanderService={ouvrirFormulaire}
      />
    </>
  );
}
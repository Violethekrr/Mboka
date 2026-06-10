import { Star, MapPin, CheckCircle, MessageSquare } from "lucide-react";
import type { ArtisanCardProps, ProfilArtisanDataType } from "../../Type";

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
  onOpenProfil,
  onOpenComments,
}: ArtisanCardProps) {

  const handleCardClick = () => {
    if (onOpenProfil) {
      const artisanData: ProfilArtisanDataType = {
        id_freelancer: id_freelancer ?? id,
        nom,
        prenom,
        photo,
        metier,
        note,
        avis,
        distance,
        prix: "0", // À remplacer par la vraie valeur si disponible
        disponible,
        verified,
        badge,
      };
      onOpenProfil(artisanData);
    }
  };

  const handleOpenComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenComments) {
      onOpenComments(id_freelancer ?? id, `${prenom} ${nom}`, photo, metier);
    }
  };

 
  return (
    <>
      <div 
        onClick={handleCardClick}
        className="group relative bg-[#24242c] border border-[#2a2a32] hover:border-[#FE686440] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_#FE686418] hover:-translate-y-0.5 cursor-pointer"
      >
        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              badge === "Expert" ? "bg-[#FE6864] text-white" : "bg-amber-500 text-white"
            }`}>
              {badge}
            </span>
          </div>
        )}

        {/* Disponibility dot */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[#1e1e22]/80 backdrop-blur-sm border border-[#2a2a32] rounded-full px-2 py-1">
          <span className={`w-1.5 h-1.5 rounded-full ${disponible ? "bg-emerald-400 animate-pulse" : "bg-gray-500"}`} />
          <span className="text-[9px] font-semibold text-white/70">
            {disponible ? "Dispo" : "Occupé"}
          </span>
        </div>

        {/* Cover gradient + photo */}
        <div className="relative h-24 md:h-28 bg-linear-to-br from-[#2a1a1a] to-[#1a1a2e]">
          <div className="absolute bottom-0 left-4 translate-y-1/2">
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 border-[#24242c] overflow-hidden shadow-lg">
              <img src={photo} alt={`${prenom} ${nom}`} className="w-full h-full object-cover" />
              {verified && (
                <div className="absolute bottom-0 right-0 bg-[#FE6864] rounded-full p-0.5 translate-x-0.5 translate-y-0.5 border border-[#24242c]">
                  <CheckCircle size={10} className="text-white fill-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-9 px-4 pb-4">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-white leading-tight">
              {prenom} {nom.charAt(0).toUpperCase()}.
            </h3>
            <p className="text-[11px] text-[#FE6864] font-semibold mt-0.5">{metier}</p>
          </div>

          {/* Rating cliquable → ouvre les commentaires */}
          <button
            onClick={handleOpenComments}
            className="flex items-center gap-1 mb-3 group/stars hover:opacity-80 transition-opacity"
          >
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-white">{note}</span>
            <span className="text-[10px] text-white/40 group-hover/stars:text-[#FE6864] transition-colors">
              ({avis} avis)
            </span>
            <MessageSquare size={10} className="text-white/20 group-hover/stars:text-[#FE6864] transition-colors ml-0.5" />
          </button>

          {/* Distance */}
          <div className="flex items-center text-[10px] text-white/50 mb-3">
            <div className="flex items-center gap-1">
              <MapPin size={10} className="text-[#FE6864]" />
              <span>{distance}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
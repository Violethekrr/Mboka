import { ArrowRight, Star, MapPin, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { freelancersMock, profilsFreelancersMock } from "../../constants";
import type { RecommendedSectionProps } from "../../Type";

const extras: Record<number, { note: number; avis: number; distance: string; prix: string; disponible: boolean }> = {
  7:  { note: 4.8, avis: 112, distance: "2 km", prix: "6 000", disponible: true  },
  8:  { note: 4.6, avis: 79,  distance: "3 km", prix: "8 500", disponible: false },
  9:  { note: 4.9, avis: 201, distance: "1 km", prix: "5 500", disponible: true  },
  10: { note: 4.7, avis: 95,  distance: "4 km", prix: "7 000", disponible: true  },
};

export default function RecommendedSection({ onOpenComments, onOpenForm }: RecommendedSectionProps) {
  // On prend les freelancers 7 à 10 du mock pour varier
  const recommended = freelancersMock.slice(6, 10).map((f) => {
    const profil = profilsFreelancersMock.find((p) => p.id_freelancer === f.id_freelancer);
    const extra  = extras[f.id_freelancer] ?? { note: 4.5, avis: 50, distance: "5 km", prix: "5 000", disponible: true };
    return { ...f, profil, ...extra };
  });

  const handleOpenComments = (freelancerId: number, nom: string, photo: string, metier: string) => {
    if (onOpenComments) {
      onOpenComments(freelancerId, nom, photo, metier);
    }
  };

  const handleOpenForm = (artisanData: {
    photo: string;
    nom: string;
    metier: string;
    note: number;
    avis: number;
    verified: boolean;
    disponible: boolean;
  }) => {
    if (onOpenForm) {
      onOpenForm(artisanData);
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white">
            Recommandés pour vous
          </h2>
          <p className="text-[11px] text-white/40 mt-0.5">Basé sur votre localisation</p>
        </div>
        <Link
          to="/client/services"
          className="flex items-center gap-1 text-xs text-[#FE6864] font-semibold no-underline hover:gap-2 transition-all"
        >
          Voir tout <ArrowRight size={13} />
        </Link>
      </div>

      {/* Scroll horizontal mobile, grille desktop */}
      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible scrollbar-hide">
        {recommended.map((r) => (
          <div
            key={r.id_freelancer}
            className="group shrink-0 w-64 md:w-auto bg-[#24242c] border border-[#2a2a32] hover:border-[#FE686440] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_#FE686418] hover:-translate-y-0.5"
          >
            {/* Cover image */}
            <div className="relative h-36 overflow-hidden bg-linear-to-br from-[#2a1a1a] to-[#1a1a2e]">
              <img
                src={r.photo}
                alt={`${r.prenom} ${r.nom}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1e1e22] via-transparent to-transparent" />

              {/* Disponibilité */}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#1e1e22]/80 backdrop-blur-sm border border-[#2a2a32] rounded-full px-2 py-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${r.disponible ? "bg-emerald-400 animate-pulse" : "bg-gray-500"}`} />
                <span className="text-[9px] font-semibold text-white/70">
                  {r.disponible ? "Disponible" : "Occupé"}
                </span>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-3.5">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {r.prenom} {r.nom.charAt(0)}.
                  </h3>
                  <p className="text-[10px] text-[#FE6864] font-medium mt-0.5">
                    {r.profil?.profession ?? "Artisan"}
                  </p>
                </div>
                <CheckCircle size={14} className="text-[#FE6864] shrink-0 mt-0.5" />
              </div>

              {/* Note cliquable → commentaires */}
              <button
                onClick={() => handleOpenComments(
                  r.id_freelancer, 
                  `${r.prenom} ${r.nom}`, 
                  r.photo, 
                  r.profil?.profession ?? "Artisan"
                )}
                className="flex items-center gap-2 text-[10px] text-white/50 mb-3 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold">{r.note}</span>
                  <span className="hover:text-[#FE6864] transition-colors">({r.avis})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={10} className="text-[#FE6864]" />
                  <span>{r.distance}</span>
                </div>
              </button>

              <div className="flex items-center justify-between">
              
                <button
                  onClick={() => handleOpenForm({
                    photo: r.photo,
                    nom: `${r.prenom} ${r.nom}`,
                    metier: r.profil?.profession ?? "Prestataire",
                    note: r.note,
                    avis: r.avis,
                    verified: true,
                    disponible: r.disponible,
                  })}
                  className="text-[10px] font-bold bg-[#FE686415] border border-[#FE686430] hover:bg-[#FE6864] text-[#FE6864] hover:text-white px-2.5 py-1 rounded-lg transition-all"
                >
                  Voir →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
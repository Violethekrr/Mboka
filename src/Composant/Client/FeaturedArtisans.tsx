import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import ArtisanCard from "./ArtisanCard";
import { freelancersMock, profilsFreelancersMock, rangsMock } from "../../constants";
import type {FeaturedArtisansProps} from "../../Type"

// Données statiques complémentaires non présentes dans le mock
const extras: Record<number, { note: number; avis: number; distance: string; prix: string; disponible: boolean }> = {
  1: { note: 4.8, avis: 134,  distance: "3 km", prix: "5 000", disponible: true  },
  2: { note: 4.6, avis: 98,   distance: "2 km", prix: "7 000", disponible: false },
  3: { note: 4.7, avis: 88,   distance: "4 km", prix: "8 000", disponible: true  },
  4: { note: 4.5, avis: 72,   distance: "5 km", prix: "6 000", disponible: true  },
  5: { note: 4.9,  avis: 156,  distance: "1 km", prix: "4 500", disponible: true  },
  6: { note: 4.4,  avis: 61,   distance: "6 km", prix: "9 000", disponible: false },
  7: { note: 4.8,  avis: 112,  distance: "2 km", prix: "6 000", disponible: true  },
  8: { note: 4.6,  avis: 79,   distance: "3 km", prix: "8 500", disponible: false },
  9: { note: 4.9,  avis: 201,  distance: "1 km", prix: "5 500", disponible: true  },
  10: { note: 4.7, avis: 95,  distance: "4 km", prix: "7 000", disponible: true  },
};

// Tous les artisans disponibles
const allArtisans = freelancersMock.map((f) => {
  const profil = profilsFreelancersMock.find((p) => p.id_freelancer === f.id_freelancer);
  const rang = rangsMock.find((r) => r.id_freelancer === f.id_freelancer);
  const extra = extras[f.id_freelancer] ?? { note: 4.5, avis: 50, distance: "5 km", prix: "5 000", disponible: true };

  const badge: "Expert" | "Premium" | undefined =
    rang?.rang === "expert" ? "Expert" :
    rang?.rang === "intermédiaire" ? "Premium" :
    undefined;

  return {
    id: f.id_freelancer,
    id_freelancer: f.id_freelancer,
    photo: f.photo,
    nom: f.nom,
    prenom: f.prenom,
    metier: profil?.profession ?? "Artisan",
    secteur: profil?.secteur_activite ?? "",
    verified: true,
    badge,
    ...extra,
  };
});


export default function FeaturedArtisans({ 
  searchQuery = "", 
  selectedCategory = null,
  onOpenComments,
  onOpenForm,
}: FeaturedArtisansProps) {
  // Filtrer les artisans
  const filteredArtisans = allArtisans.filter((artisan) => {
    // Filtre par catégorie
    if (selectedCategory && artisan.secteur !== selectedCategory) {
      return false;
    }
    
    // Filtre par recherche (nom, prénom, métier)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        artisan.nom.toLowerCase().includes(searchLower) ||
        artisan.prenom.toLowerCase().includes(searchLower) ||
        artisan.metier.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white">
            {searchQuery || selectedCategory ? "Résultats de recherche" : "Artisans vérifiés"}
          </h2>
          <p className="text-[11px] text-white/40 mt-0.5">
            {filteredArtisans.length} artisan{filteredArtisans.length > 1 ? 's' : ''} trouvé{filteredArtisans.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/client/services"
          className="flex items-center gap-1 text-xs text-[#FE6864] font-semibold no-underline hover:gap-2 transition-all"
        >
          Voir tout <ArrowRight size={13} />
        </Link>
      </div>

      {filteredArtisans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#24242c] border border-[#2a2a32] rounded-2xl text-center">
          <Search size={48} className="text-white/20 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Aucun artisan trouvé</h3>
          <p className="text-sm text-white/40 max-w-md">
            Aucun artisan ne correspond à votre recherche "{searchQuery || selectedCategory}". 
            Essayez d'autres mots-clés ou parcourez toutes nos catégories.
          </p>
          {(searchQuery || selectedCategory) && (
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 text-sm text-[#FE6864] font-semibold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filteredArtisans.map((a) => (
            <ArtisanCard 
              key={a.id} 
              {...a} 
              onOpenComments={onOpenComments}
              onOpenForm={onOpenForm}
            />
          ))}
        </div>
      )}
    </section>
  );
}
import { useState } from "react";
import {
  Monitor,
  Palette,
  Megaphone,
  PenLine,
  Video,
  Camera,
  Languages,
  GraduationCap,
  TrendingUp,
  Wrench,
  MoreHorizontal,
  X,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { Category } from "../../Type";

import { profilsFreelancersMock } from "../../constants";

const iconesParSecteur: Record<string, LucideIcon> = {
  Informatique: Monitor,
  Design: Palette,
  Marketing: Megaphone,
  Rédaction: PenLine,
  Vidéo: Video,
  Photographie: Camera,
  Traduction: Languages,
  Formation: GraduationCap,
  Consulting: TrendingUp,
  _default: Wrench,
};

const secteursUniques = Array.from(
  new Set(profilsFreelancersMock.map((profil) => profil.secteur_activite))
);

const categories: Category[] = [
  ...secteursUniques.map((secteur) => ({
    label: secteur,
    icon: iconesParSecteur[secteur] ?? iconesParSecteur._default,
  })),
  {
    label: "Voir plus",
    icon: MoreHorizontal,
  },
];

export default function CategoryGrid({
  onSelectCategory,
}: {
  onSelectCategory?: (category: string | null) => void;
}) {
  const [categorieActive, setCategorieActive] = useState<string | null>(null);
  const [afficherTout, setAfficherTout] = useState(false);

  const nombreVisible = 7;

  const categoriesAffichees = afficherTout
    ? categories
    : [
        ...categories
          .filter((categorie) => categorie.label !== "Voir plus")
          .slice(0, nombreVisible),
        {
          label: "Voir plus",
          icon: MoreHorizontal,
        },
      ];

  function choisirCategorie(label: string, estVoirPlus: boolean) {
    if (estVoirPlus) {
      setAfficherTout(!afficherTout);
      return;
    }

    const nouvelleCategorie = categorieActive === label ? null : label;

    setCategorieActive(nouvelleCategorie);
    onSelectCategory?.(nouvelleCategorie);
  }

  function reinitialiserCategorie() {
    setCategorieActive(null);
    onSelectCategory?.(null);
  }

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-white md:text-lg">
            Catégories
          </h2>

          {categorieActive && (
            <button
              onClick={reinitialiserCategorie}
              className="flex items-center gap-1 rounded-lg bg-[#FF6257]/10 px-2 py-1 text-xs font-semibold text-[#FF6257] transition hover:bg-[#FF6257]/15"
            >
              <X size={12} />
              Réinitialiser
            </button>
          )}
        </div>

        <button
          onClick={() => setAfficherTout(!afficherTout)}
          className="text-xs font-semibold text-[#FF6257] hover:underline"
        >
          {afficherTout ? "Réduire" : "Voir tout"}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-8 md:gap-3">
        {categoriesAffichees.map(({ label, icon: Icon }) => {
          const estVoirPlus = label === "Voir plus";
          const estActive = categorieActive === label && !estVoirPlus;

          return (
            <button
              key={label}
              onClick={() => choisirCategorie(label, estVoirPlus)}
              className={`group flex flex-col items-center gap-2 rounded-2xl border-[#2D2D31] px-2 py-3.5 transition-all duration-200 ${
                estActive
                  ? "border-[#FF6257] bg-[#FF6257]/10 shadow-[0_0_18px_rgba(255,98,87,0.18)]"
                  : "border-[#2D2D31] bg-[#1B1B1D] hover:border-[#FF6257]/40 hover:bg-[#2D2D31]"
              }`}
            >
              <Icon
                size={22}
                className={`transition-colors ${
                  estActive
                    ? "text-[#FF6257]"
                    : "text-[#FF6257]/60 group-hover:text-[#FF6257]"
                }`}
              />

              <span
                className={`text-center text-[10px] font-semibold leading-tight transition-colors ${
                  estActive
                    ? "text-[#FF6257]"
                    : "text-[#B8B8BE] group-hover:text-white"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
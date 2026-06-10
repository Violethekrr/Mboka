import { useState } from "react";
import {
  Monitor, Palette, Megaphone, PenLine, Video,
  Camera, Languages, GraduationCap, TrendingUp,
  Wrench, MoreHorizontal, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { profilsFreelancersMock } from "../../constants";
import type { Category } from "../../Type";

const secteurIconMap: Record<string, LucideIcon> = {
  Informatique:  Monitor,
  Design:        Palette,
  Marketing:     Megaphone,
  Rédaction:     PenLine,
  Vidéo:         Video,
  Photographie:  Camera,
  Traduction:    Languages,
  Formation:     GraduationCap,
  Consulting:    TrendingUp,
  _default:      Wrench,
};

// Extraire dynamiquement les secteurs uniques depuis le mock
const secteursUniques = Array.from(
  new Set(profilsFreelancersMock.map((p) => p.secteur_activite))
);

const categories: Category[] = [
  ...secteursUniques.map((secteur) => ({
    label: secteur,
    icon: secteurIconMap[secteur] ?? secteurIconMap["_default"],
  })),
  { label: "Voir plus", icon: MoreHorizontal },
];

export default function CategoryGrid({ onSelectCategory }: { onSelectCategory?: (category: string | null) => void }) {
  const [active, setActive] = useState<string | null>(null);

  const MAX_VISIBLE = 7;
  const [showAll, setShowAll] = useState(false);

  const visible = showAll
    ? categories
    : [
        ...categories.filter((c) => c.label !== "Voir plus").slice(0, MAX_VISIBLE),
        { label: "Voir plus", icon: MoreHorizontal },
      ];

  const handleCategoryClick = (label: string, isVoirPlus: boolean) => {
    if (isVoirPlus) {
      setShowAll(!showAll);
    } else {
      const newActive = active === label ? null : label;
      setActive(newActive);
      onSelectCategory?.(newActive);
    }
  };

  const handleReset = () => {
    setActive(null);
    onSelectCategory?.(null);
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base md:text-lg font-bold text-white">Catégories</h2>
          {active && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-[#FE6864] font-semibold hover:underline bg-[#FE686415] px-2 py-1 rounded-lg transition-all"
            >
              <X size={12} />
              Réinitialiser
            </button>
          )}
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-[#FE6864] font-semibold hover:underline"
        >
          {showAll ? "Réduire" : "Voir tout"}
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
        {visible.map(({ label, icon: Icon }) => {
          const isVoirPlus = label === "Voir plus";
          const isActive   = active === label && !isVoirPlus;

          return (
            <button
              key={label}
              onClick={() => handleCategoryClick(label, isVoirPlus)}
              className={`flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl border transition-all duration-200 group ${
                isActive
                  ? "border-[#FE6864] bg-[#FE686415] shadow-[0_0_16px_#FE686420]"
                  : "border-[#2a2a32] bg-[#24242c] hover:border-[#3a3a42] hover:bg-[#2a2a32]"
              }`}
            >
              <Icon
                size={22}
                className={`transition-colors ${
                  isActive
                    ? "text-[#FE6864]"
                    : "text-[#FE6864]/50 group-hover:text-[#FE6864]"
                }`}
              />
              <span
                className={`text-[10px] font-semibold text-center leading-tight transition-colors ${
                  isActive
                    ? "text-[#FE6864]"
                    : "text-white/60 group-hover:text-white/90"
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
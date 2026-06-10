import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { profilsFreelancersMock } from "../../constants";

const suggestions = Array.from(
  new Set(
    profilsFreelancersMock.map((profil) => profil.profession).filter(Boolean)
  )
);

export default function SearchBar({
  onSearch,
}: {
  onSearch?: (query: string) => void;
}) {
  const [recherche, setRecherche] = useState("");
  const [focus, setFocus] = useState(false);

  const suggestionsFiltrees = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(recherche.toLowerCase())
  );

  function changerRecherche(valeur: string) {
    setRecherche(valeur);
    onSearch?.(valeur);
  }

  return (
    <div className="relative mb-6">
      <div
        className={`flex items-center gap-3 rounded-2xl border-[#2D2D31] bg-[#1B1B1D] px-4 py-3 transition-all ${
          focus
            ? "border-[#FF6257] shadow-[0_0_0_3px_rgba(255,98,87,0.18)]"
            : "border-[#2D2D31] hover:border-[#FF6257]/40"
        }`}
      >
        <Search size={18} className="shrink-0 text-[#FF6257]" />

        <input
          type="text"
          placeholder="Rechercher un service, un métier ou un freelancer..."
          value={recherche}
          onChange={(e) => changerRecherche(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#B8B8BE]/60"
        />

        <button className="flex items-center gap-1.5 rounded-xl border border-[#2D2D31] bg-[#1B1B1D] px-3 py-1.5 text-xs font-semibold text-[#B8B8BE] transition hover:border-[#FF6257]/40 hover:bg-[#FF6257]/10 hover:text-[#FF6257]">
          <SlidersHorizontal size={13} />
          <span className="hidden sm:inline">Filtres</span>
        </button>
      </div>

      {focus && recherche.length > 0 && suggestionsFiltrees.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-[#2D2D31] bg-[#1B1B1D] shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
          {suggestionsFiltrees.map((suggestion) => (
            <button
              key={suggestion}
              onMouseDown={() => changerRecherche(suggestion)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#B8B8BE] transition hover:bg-[#FF6257]/10 hover:text-white"
            >
              <Search size={13} className="text-[#FF6257]" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
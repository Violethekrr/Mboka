import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const suggestions = [
  "Plombier",
  "Électricien",
  "Peintre",
  "Maçon",
  "Menuisier",
  "Soudeur",
];

export default function SearchBar({ onSearch }: { onSearch?: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="relative mb-6">
      <div
        className={`flex items-center gap-3 bg-[#24242c] border rounded-2xl px-4 py-3 transition-all duration-200 ${
          focused
            ? "border-[#FE6864] shadow-[0_0_0_3px_#FE686420]"
            : "border-[#2a2a32] hover:border-[#3a3a42]"
        }`}
      >
        <Search size={18} className="text-[#FE6864] shrink-0" />
        <input
          type="text"
          placeholder="Rechercher un service, un artisan…"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none"
        />
        <button className="flex items-center gap-1.5 bg-[#2a2a32] hover:bg-[#FE686415] border border-[#3a3a42] hover:border-[#FE686440] text-white/70 hover:text-[#FE6864] text-xs font-semibold px-3 py-1.5 rounded-xl transition-all">
          <SlidersHorizontal size={13} />
          <span className="hidden sm:inline">Filtres</span>
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {focused && query.length > 0 && filtered.length > 0 && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[#1e1e24] border border-[#2a2a32] rounded-xl shadow-[0_16px_40px_#00000070] z-50 overflow-hidden">
          {filtered.map((s) => (
            <button
              key={s}
              onMouseDown={() => handleSearch(s)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-[#FE686410] text-left transition-colors"
            >
              <Search size={13} className="text-[#FE6864]/60" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
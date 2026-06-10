import { Bell, MapPin, Briefcase } from "lucide-react";
import { useUser } from "../../Context/UtilisateurContext";

export default function HeroSection() {
  const { user } = useUser();
  const prenom = user && "prenom" in user ? user.prenom : "Utilisateur";

  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#2a1a1a] via-[#1e1e22] to-[#1a1a2e] p-6 md:p-10 mb-6 border border-[#2a2a32]">
   
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FE6864]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#FE6864]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: greeting */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            {/* Logo depuis le dossier public */}
            <img 
              src="/MbokaSansFond2.png" 
              alt="Mboka Logo" 
              className="h-12 md:h-16 w-auto object-contain"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#FE6864] bg-[#FE686415] border border-[#FE686430] px-2.5 py-1 rounded-full uppercase tracking-wider">
                Bienvenue
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={24} className="text-[#FE6864]" />
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
              Bonjour, {prenom}
            </h1>
          </div>
          <p className="text-white/60 text-sm md:text-base max-w-md">
            Que recherchez-vous aujourd'hui ? Des artisans qualifiés près de chez vous, disponibles maintenant.
          </p>

          {/* Location badge */}
          <div className="flex items-center gap-1.5 mt-4 text-white/50 text-xs">
            <MapPin size={13} className="text-[#FE6864]" />
            <span>Pointe-Noire, Congo</span>
          </div>
        </div>

        {/* Right: stats cards */}
        <div className="flex gap-3 md:gap-4 shrink-0">
          {[
            { label: "Artisans vérifiés", value: "1 200+", accent: true },
            { label: "Services réalisés", value: "8 400+", accent: false },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex flex-col items-center justify-center rounded-2xl px-5 py-4 min-w-27.5 border ${
                s.accent
                  ? "bg-[#FE6864] border-[#FE6864] shadow-[0_0_24px_#FE686440]"
                  : "bg-[#24242c] border-[#2a2a32]"
              }`}
            >
              <span
                className={`text-2xl font-black ${
                  s.accent ? "text-white" : "text-[#FE6864]"
                }`}
              >
                {s.value}
              </span>
              <span
                className={`text-[10px] font-semibold mt-1 text-center leading-tight ${
                  s.accent ? "text-white/80" : "text-white/50"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification button mobile only */}
      <button className="absolute top-4 right-4 md:hidden w-9 h-9 rounded-xl bg-[#24242c] border border-[#2a2a32] flex items-center justify-center text-white/70">
        <Bell size={16} />
      </button>
    </section>
  );
}
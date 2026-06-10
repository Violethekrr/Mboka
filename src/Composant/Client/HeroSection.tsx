import { Bell, Briefcase, MapPin } from "lucide-react";

import { useUser } from "../../Context/UtilisateurContext";
import { freelancersMock, servicesMock } from "../../constants";

export default function HeroSection() {
  const { user } = useUser();

  const prenom = user && "prenom" in user ? user.prenom : "Client";

  return (
    <section className="relative mb-6 overflow-hidden rounded-2xl border border-[#2a2a32] bg-linear-to-br from-[#2a1a1a] via-[#1e1e22] to-[#1a1a2e] p-6 md:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FE6864]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#FE6864]/5 blur-2xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="mb-4 flex items-center gap-3">
            <img
              src="/MbokaSansFond2.png"
              alt="Logo Mboka"
              className="h-12 w-auto object-contain md:h-16"
            />

            <span className="rounded-full border border-[#FE686430] bg-[#FE686415] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#FE6864]">
              Bienvenue
            </span>
          </div>

          <div className="mb-2 flex items-center gap-2">
            <Briefcase size={24} className="text-[#FE6864]" />

            <h1 className="text-2xl font-black leading-tight text-white md:text-4xl">
              Bonjour, {prenom}
            </h1>
          </div>

          <p className="max-w-md text-sm text-white/60 md:text-base">
            Trouvez rapidement un freelancer qualifié pour vos besoins :
            design, informatique, marketing, rédaction, vidéo et plus encore.
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-white/50">
            <MapPin size={13} className="text-[#FE6864]" />
            <span>Pointe-Noire, Congo</span>
          </div>
        </div>

        <div className="flex gap-3 md:gap-4">
          <CarteStatistique
            label="Freelancers"
            value={`${freelancersMock.length}+`}
            accent
          />

          <CarteStatistique
            label="Services"
            value={`${servicesMock.length}+`}
          />
        </div>
      </div>

      <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a2a32] bg-[#24242c] text-white/70 md:hidden">
        <Bell size={16} />
      </button>
    </section>
  );
}

function CarteStatistique({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex min-w-28 flex-col items-center justify-center rounded-2xl border px-5 py-4 ${
        accent
          ? "border-[#FE6864] bg-[#FE6864] shadow-[0_0_24px_#FE686440]"
          : "border-[#2a2a32] bg-[#24242c]"
      }`}
    >
      <span
        className={`text-2xl font-black ${
          accent ? "text-white" : "text-[#FE6864]"
        }`}
      >
        {value}
      </span>

      <span
        className={`mt-1 text-center text-[10px] font-semibold leading-tight ${
          accent ? "text-white/80" : "text-white/50"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
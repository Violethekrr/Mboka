import { ShieldCheck, Zap, Star, Headphones } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={20} />,
    title: "Fiable",
    desc: "Artisans vérifiés et certifiés par nos équipes",
    color: "#10B981",
  },
  {
    icon: <Zap size={20} />,
    title: "Rapide",
    desc: "Intervention en moins de 24h garantie",
    color: "#F59E0B",
  },
  {
    icon: <Star size={20} />,
    title: "Qualité",
    desc: "Travaux garantis avec suivi client inclus",
    color: "#FE6864",
  },
  {
    icon: <Headphones size={20} />,
    title: "Support",
    desc: "Assistance disponible 7j/7 pour vous aider",
    color: "#8B5CF6",
  },
];

export default function TrustBanner() {
  return (
    <section className="mb-8">
      <div className="rounded-2xl border border-[#2a2a32] bg-[#24242c] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2a2a32] flex items-center gap-2">
          <div className="w-1.5 h-5 bg-[#FE6864] rounded-full" />
          <h2 className="text-sm font-bold text-white">Pourquoi Mboka ?</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x-0 md:divide-x divide-y md:divide-y-0 divide-[#2a2a32]">
          {features.map(({ icon, title, desc, color }) => (
            <div
              key={title}
              className="flex flex-col items-start gap-2 p-5 hover:bg-[#2a2a32] transition-colors group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110"
                style={{ background: `${color}20`, color }}
              >
                {icon}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="text-[11px] text-white/50 leading-snug mt-0.5">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
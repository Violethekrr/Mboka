import { Headphones, ShieldCheck, Star, Zap } from "lucide-react";

const elementsConfiance = [
  {
    icon: <ShieldCheck size={20} />,
    titre: "Fiable",
    description: "Freelancers avec profils vérifiés et avis clients.",
    couleur: "#FF6257",
  },
  {
    icon: <Zap size={20} />,
    titre: "Rapide",
    description: "Trouvez rapidement un professionnel disponible.",
    couleur: "#FF7B6B",
  },
  {
    icon: <Star size={20} />,
    titre: "Qualité",
    description: "Les notes et commentaires aident à mieux choisir.",
    couleur: "#E84D4D",
  },
  {
    icon: <Headphones size={20} />,
    titre: "Support",
    description: "Un espace prévu pour signaler un problème si besoin.",
    couleur: "#B52D3A",
  },
];

export default function TrustBanner() {
  return (
    <section className="mb-8">
      <div className="overflow-hidden rounded-2xl border border-[#2D2D31] bg-[#1B1B1D]">
        <div className="flex items-center gap-2 border-b border-[#2D2D31] px-5 py-4">
          <div className="h-5 w-1.5 rounded-full bg-[#FF6257]" />

          <h2 className="text-sm font-bold text-white">Pourquoi MBOKA ?</h2>
        </div>

        <div className="grid grid-cols-2 divide-y divide-[#2D2D31] md:grid-cols-4 md:divide-x md:divide-y-0">
          {elementsConfiance.map((element) => (
            <div
              key={element.titre}
              className="group flex flex-col items-start gap-2 p-5 transition-colors hover:bg-[#2D2D31]"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: `${element.couleur}20`,
                  color: element.couleur,
                }}
              >
                {element.icon}
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {element.titre}
                </p>

                <p className="mt-0.5 text-[11px] leading-snug text-[#B8B8BE]">
                  {element.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
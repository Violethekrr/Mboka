import { Star, Quote } from "lucide-react";
import { commentairesMock, clientsMock } from "../../constants";

// Fonction pour obtenir une note stable basée sur l'ID du commentaire
const getStableNote = (commentaireId: number): number => {
  // Mapping stable des notes par ID de commentaire
  const notesMap: Record<number, number> = {
    1: 5.0,
    2: 4.8,
    3: 4.9,
    4: 4.7,
    5: 5.0,
    6: 4.6,
    7: 4.9,
    8: 4.5,
    9: 5.0,
    10: 4.8,
  };
  
  return notesMap[commentaireId] || 4.5;
};

// Préparer les reviews une seule fois en dehors du composant
const reviews = commentairesMock.slice(0, 4).map((c) => {
  const client = clientsMock.find((cl) => cl.id_client === c.id_client);
  return {
    ...c,
    clientNom: client ? `${client.prenom} ${client.nom.charAt(0)}.` : "Anonyme",
    clientPhoto: client?.photo ?? "https://picsum.photos/200",
    note: getStableNote(c.id_commentaire),
  };
});

export default function ReviewsSection() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white">
            Ce que disent nos clients
          </h2>
          <p className="text-[11px] text-white/40 mt-0.5">Avis vérifiés</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {reviews.map((r) => (
          <div
            key={`review-${r.id_commentaire}`}
            className="bg-[#24242c] border border-[#2a2a32] rounded-2xl p-4 hover:border-[#FE686430] transition-all"
          >
            <div className="flex items-start gap-2 mb-3">
              <img
                src={r.clientPhoto}
                alt={r.clientNom}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {r.clientNom}
                </p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={9}
                      className={
                        i < Math.round(r.note)
                          ? "text-amber-400 fill-amber-400"
                          : "text-white/20"
                      }
                    />
                  ))}
                </div>
              </div>
              <Quote size={14} className="text-[#FE6864]/30 ml-auto shrink-0" />
            </div>

            <p className="text-[11px] text-white/60 leading-relaxed line-clamp-3">
              {r.commentaire}
            </p>

            <p className="text-[10px] text-white/30 mt-2">{r.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
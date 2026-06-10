import { Quote, Star } from "lucide-react";

import { clientsMock, commentairesMock } from "../../constants";

function obtenirNoteStable(idCommentaire: number): number {
  const notes: Record<number, number> = {
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

  return notes[idCommentaire] ?? 4.5;
}

const avisClients = commentairesMock.slice(0, 4).map((commentaire) => {
  const client = clientsMock.find(
    (item) => item.id_client === commentaire.id_client
  );

  return {
    ...commentaire,
    clientNom: client
      ? `${client.prenom} ${client.nom.charAt(0)}.`
      : "Client MBOKA",
    clientPhoto: client?.photo ?? "https://picsum.photos/200",
    note: obtenirNoteStable(commentaire.id_commentaire),
  };
});

export default function ReviewsSection() {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white md:text-lg">
            Ce que disent nos clients
          </h2>

          <p className="mt-0.5 text-[11px] text-[#B8B8BE]">
            Avis vérifiés après prestation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {avisClients.map((avis) => (
          <div
            key={avis.id_commentaire}
            className="rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-4 transition-all hover:border-[#FF6257]/40 hover:shadow-[0_8px_28px_rgba(255,98,87,0.12)]"
          >
            <div className="mb-3 flex items-start gap-2">
              <img
                src={avis.clientPhoto}
                alt={avis.clientNom}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">
                  {avis.clientNom}
                </p>

                <div className="mt-0.5 flex items-center gap-0.5">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={9}
                      className={
                        index < Math.round(avis.note)
                          ? "fill-amber-400 text-amber-400"
                          : "text-[#B8B8BE]/30"
                      }
                    />
                  ))}
                </div>
              </div>

              <Quote
                size={14}
                className="ml-auto shrink-0 text-[#FF6257]/35"
              />
            </div>

            <p className="line-clamp-3 text-[11px] leading-relaxed text-[#B8B8BE]">
              {avis.commentaire}
            </p>

            <p className="mt-2 text-[10px] text-[#B8B8BE]/60">
              {avis.date}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
import { useState, type ReactNode } from "react";
import { MessageCircle, MessageSquare, Search, Send, Star, ThumbsUp, TriangleAlert, UserRound, } from "lucide-react";
import type { Commentaires } from "../../Type";
import { clientsMock, commentairesMock, freelancersMock, } from "../../constants";
import { useUser } from "../../Context/UtilisateurContext";

type FiltreAvis = "tous" | "positifs" | "moyens" | "faibles";

export default function AvisEtCommentaires() {
  const { user } = useUser();

  const freelancer =
    user && "id_freelancer" in user ? user : freelancersMock[0];

  const [recherche, setRecherche] = useState("");
  const [filtreAvis, setFiltreAvis] = useState<FiltreAvis>("tous");

  const [reponses, setReponses] = useState<Record<number, string>>({});

  const commentairesDuFreelancer = commentairesMock
    .filter(
      (commentaire) =>
        commentaire.id_freelancer === freelancer.id_freelancer
    )
    .map((commentaire) => {
      const client = clientsMock.find(
        (client) => client.id_client === commentaire.id_client
      );

      return {
        commentaire,
        client,
        note: obtenirNote(commentaire),
      };
    });

  const commentairesAffiches = commentairesDuFreelancer.filter((item) => {
    const texteRecherche = recherche.toLowerCase();

    const correspondRecherche =
      item.commentaire.commentaire.toLowerCase().includes(texteRecherche) ||
      item.client?.nom.toLowerCase().includes(texteRecherche) ||
      item.client?.prenom.toLowerCase().includes(texteRecherche);

    const correspondFiltre =
      filtreAvis === "tous" ||
      (filtreAvis === "positifs" && item.note >= 4) ||
      (filtreAvis === "moyens" && item.note === 3) ||
      (filtreAvis === "faibles" && item.note <= 2);

    return correspondRecherche && correspondFiltre;
  });

  const totalAvis = commentairesDuFreelancer.length;

  const noteMoyenne =
    totalAvis > 0
      ? commentairesDuFreelancer.reduce(
          (total, item) => total + item.note,
          0
        ) / totalAvis
      : 0;

  const avisPositifs = commentairesDuFreelancer.filter(
    (item) => item.note >= 4
  ).length;

  const avisFaibles = commentairesDuFreelancer.filter(
    (item) => item.note <= 2
  ).length;

  function modifierReponse(idCommentaire: number, texte: string) {
    setReponses((anciennesReponses) => ({
      ...anciennesReponses,
      [idCommentaire]: texte,
    }));
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f]  px-4 pb-10 pt-24 text-white md:px-8">
      <div className="">
        <section className="mb-7">
          <p className="text-sm font-semibold text-[#FF6257]">
            Freelancer - Avis et commentaires
          </p>

          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            Avis reçus
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-[#B8B8BE]">
            Consultez les retours des clients sur vos prestations et répondez
            aux commentaires si nécessaire.
          </p>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <CarteStatistique
            titre="Total avis"
            valeur={totalAvis.toString()}
            icone={<MessageSquare size={18} />}
          />

          <CarteStatistique
            titre="Note moyenne"
            valeur={noteMoyenne.toFixed(1)}
            icone={<Star size={18} />}
          />

          <CarteStatistique
            titre="Avis positifs"
            valeur={avisPositifs.toString()}
            icone={<ThumbsUp size={18} />}
          />

          <CarteStatistique
            titre="À améliorer"
            valeur={avisFaibles.toString()}
            icone={<TriangleAlert size={18} />}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-[#1B1B1D] p-3 lg:col-span-2">
            <div className="mb-5 flex flex-col gap-3 md:flex-row">
              <div className="relative w-full">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B8BE]"
                />

                <input
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Rechercher un commentaire ou un client..."
                  className="w-full rounded-md border border-white/10 bg-[#202023] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#B8B8BE] focus:border-[#FF6257]"
                />
              </div>

              <select
                value={filtreAvis}
                onChange={(e) => setFiltreAvis(e.target.value as FiltreAvis)}
                className="rounded-md border border-white/10 bg-[#202023] px-4 py-3 text-sm text-white outline-none focus:border-[#FF6257]"
              >
                <option value="tous">Tous</option>
                <option value="positifs">Positifs</option>
                <option value="moyens">Moyens</option>
                <option value="faibles">Faibles</option>
              </select>
            </div>

            <div className="space-y-4">
              {commentairesAffiches.map((item) => (
                <CarteCommentaire
                  key={item.commentaire.id_commentaire}
                  commentaire={item.commentaire}
                  nomClient={
                    item.client
                      ? `${item.client.prenom} ${item.client.nom}`
                      : "Client inconnu"
                  }
                  photoClient={item.client?.photo}
                  note={item.note}
                  reponse={reponses[item.commentaire.id_commentaire] ?? ""}
                  modifierReponse={modifierReponse}
                />
              ))}

              {commentairesAffiches.length === 0 && (
                <div className="rounded-lg border border-white/10 bg-[#202023] p-8 text-center text-sm text-[#B8B8BE]">
                  Aucun avis trouvé.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#1B1B1D] p-5">
            <h2 className="text-lg font-semibold">Répartition des avis</h2>

            <p className="mt-2 text-sm text-[#B8B8BE]">
              Résumé de la satisfaction des clients.
            </p>

            <div className="mt-6 space-y-4">
              <BarreAvis
                label="5 étoiles"
                valeur={compterNotes(commentairesDuFreelancer, 5)}
                total={totalAvis}
              />

              <BarreAvis
                label="4 étoiles"
                valeur={compterNotes(commentairesDuFreelancer, 4)}
                total={totalAvis}
              />

              <BarreAvis
                label="3 étoiles"
                valeur={compterNotes(commentairesDuFreelancer, 3)}
                total={totalAvis}
              />

              <BarreAvis
                label="2 étoiles"
                valeur={compterNotes(commentairesDuFreelancer, 2)}
                total={totalAvis}
              />

              <BarreAvis
                label="1 étoile"
                valeur={compterNotes(commentairesDuFreelancer, 1)}
                total={totalAvis}
              />
            </div>

            <div className="mt-6 rounded-lg border border-white/10 bg-[#202023] p-4">
              <div className="mb-2 flex items-center gap-2 text-[#FF6257]">
                <MessageCircle size={17} />
                <h3 className="text-sm font-semibold">Conseil</h3>
              </div>

              <p className="text-sm text-[#B8B8BE]">
                Répondez avec politesse aux avis clients. Cela renforce la
                confiance et améliore votre image professionnelle.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function CarteStatistique({
  titre,
  valeur,
  icone,
}: {
  titre: string;
  valeur: string;
  icone: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#1B1B1D] p-3">
        <div className="mb-4 w-fit rounded-lg bg-[#FF6257]/10 p-2 text-[#FF6257]">
            {icone}
        </div>
        <div className="flex items-center justify-between">
            <p className="text-sm text-[#B8B8BE]">{titre}</p>
            <h2 className="mt-2 text-sm font-bold">{valeur}</h2>
        </div>
    </div>
  );
}

function CarteCommentaire({
  commentaire,
  nomClient,
  photoClient,
  note,
  reponse,
  modifierReponse,
}: {
  commentaire: Commentaires;
  nomClient: string;
  photoClient?: string;
  note: number;
  reponse: string;
  modifierReponse: (idCommentaire: number, texte: string) => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#202023] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          {photoClient ? (
            <img
              src={photoClient}
              alt={nomClient}
              className="h-11 w-11 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6257]/10 text-[#FF6257]">
              <UserRound size={18} />
            </div>
          )}

          <div>
            <h3 className="font-semibold text-white">{nomClient}</h3>

            <p className="mt-1 text-xs text-[#B8B8BE]">
              Avis publié le {commentaire.date}
            </p>

            <div className="mt-2 flex items-center gap-1 text-yellow-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  fill={index < note ? "currentColor" : "none"}
                />
              ))}
            </div>
          </div>
        </div>

        <BadgeAvis note={note} />
      </div>

      <p className="mt-4 text-sm text-[#B8B8BE]">
        “{commentaire.commentaire}”
      </p>

      <div className="mt-4 rounded-lg border border-white/10 bg-[#1B1B1D] p-3">
        <label className="mb-2 block text-xs font-semibold text-[#B8B8BE]">
          Réponse du freelancer
        </label>

        <textarea
          value={reponse}
          onChange={(e) =>
            modifierReponse(commentaire.id_commentaire, e.target.value)
          }
          placeholder="Écrire une réponse au client..."
          rows={3}
          className="w-full resize-none rounded-lg border border-white/10 bg-[#202023] px-3 py-2 text-sm text-white outline-none placeholder:text-[#B8B8BE] focus:border-[#FF6257]"
        />

        <button className="mt-3 flex items-center gap-2 rounded-lg bg-[#FF6257] px-4 py-2 text-xs font-semibold text-white hover:bg-[#E84D4D]">
          <Send size={14} />
          Enregistrer la réponse
        </button>
      </div>
    </div>
  );
}

function BadgeAvis({ note }: { note: number }) {
  if (note >= 4) {
    return (
      <span className="w-fit rounded-lg bg-green-500/10 px-3 py-1 text-xs text-green-400">
        Positif
      </span>
    );
  }

  if (note === 3) {
    return (
      <span className="w-fit rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
        Moyen
      </span>
    );
  }

  return (
    <span className="w-fit rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">
      Faible
    </span>
  );
}

function BarreAvis({
  label,
  valeur,
  total,
}: {
  label: string;
  valeur: number;
  total: number;
}) {
  const pourcentage = total > 0 ? (valeur / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-[#B8B8BE]">{label}</span>
        <span className="font-semibold text-white">{valeur}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#2D2D31]">
        <div
          className="h-full rounded-lg bg-[#FF6257]"
          style={{ width: `${pourcentage}%` }}
        />
      </div>
    </div>
  );
}

function obtenirNote(commentaire: Commentaires) {
  const notes = [5, 4, 5, 3, 4, 2, 5, 4, 1, 5];

  return notes[(commentaire.id_commentaire - 1) % notes.length];
}

function compterNotes(
  commentaires: {
    note: number;
  }[],
  note: number
) {
  return commentaires.filter((commentaire) => commentaire.note === note).length;
}
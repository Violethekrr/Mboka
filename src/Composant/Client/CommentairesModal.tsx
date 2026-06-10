import { X, Star, UserRound } from "lucide-react";

import { clientsMock, commentairesMock } from "../../constants";

type Props = {
  freelancerId: number;
  freelancerNom: string;
  freelancerPhoto: string;
  freelancerMetier: string;
  currentClientId: number;
  onClose: () => void;
};

export default function CommentairesModal({
  freelancerId,
  freelancerNom,
  freelancerPhoto,
  freelancerMetier,
  onClose,
}: Props) {
  const commentaires = commentairesMock
    .filter((commentaire) => commentaire.id_freelancer === freelancerId)
    .map((commentaire) => {
      const client = clientsMock.find(
        (item) => item.id_client === commentaire.id_client
      );

      return {
        ...commentaire,
        clientNom: client
          ? `${client.prenom} ${client.nom}`
          : "Client MBOKA",
        clientPhoto: client?.photo,
        note: obtenirNote(commentaire.id_commentaire),
      };
    });

  const noteMoyenne =
    commentaires.length > 0
      ? commentaires.reduce((total, item) => total + item.note, 0) /
        commentaires.length
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between border-b border-[#2D2D31] p-5">
          <div className="flex gap-4">
            <img
              src={freelancerPhoto}
              alt={freelancerNom}
              className="h-14 w-14 rounded-2xl object-cover"
            />

            <div>
              <h2 className="text-lg font-bold text-white">
                Avis de {freelancerNom}
              </h2>

              <p className="text-sm text-[#FF6257]">{freelancerMetier}</p>

              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold text-white">
                    {noteMoyenne.toFixed(1)}
                  </span>
                </div>

                <span className="text-xs text-[#B8B8BE]">
                  {commentaires.length} avis
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-[#2D2D31] p-2 text-[#B8B8BE] transition hover:border-[#FF6257]/40 hover:bg-[#FF6257]/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-5">
          {commentaires.length > 0 ? (
            <div className="space-y-4">
              {commentaires.map((commentaire) => (
                <div
                  key={commentaire.id_commentaire}
                  className="rounded-xl border border-[#2D2D31] bg-[#111113] p-4"
                >
                  <div className="mb-3 flex items-start gap-3">
                    {commentaire.clientPhoto ? (
                      <img
                        src={commentaire.clientPhoto}
                        alt={commentaire.clientNom}
                        className="h-10 w-10 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6257]/10 text-[#FF6257]">
                        <UserRound size={17} />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-white">
                          {commentaire.clientNom}
                        </h3>

                        <span className="text-xs text-[#B8B8BE]">
                          {commentaire.date}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            size={12}
                            fill={
                              index < commentaire.note
                                ? "currentColor"
                                : "none"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-[#B8B8BE]">
                    “{commentaire.commentaire}”
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#2D2D31] bg-[#111113] p-8 text-center">
              <p className="text-sm text-[#B8B8BE]">
                Aucun commentaire pour ce freelancer pour le moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function obtenirNote(idCommentaire: number) {
  const notes = [5, 4, 5, 3, 4, 2, 5, 4, 1, 5];

  return notes[(idCommentaire - 1) % notes.length];
}
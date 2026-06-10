import { useState } from "react";
import { X, Star, Send, Quote, User } from "lucide-react";
import { commentairesMock, clientsMock } from "../../constants";
import type { Commentaires ,Props  } from "../../Type";



export default function CommentairesModal({
  freelancerId,
  freelancerNom,
  freelancerPhoto,
  freelancerMetier,
  currentClientId,
  onClose,
}: Props) {
  // Tous les commentaires de cet artisan depuis le mock
  const [commentaires, setCommentaires] = useState<Commentaires[]>(
    commentairesMock.filter((c) => c.id_freelancer === freelancerId)
  );


  const getNoteSimulee = (id: number) => ((id % 5) || 5);

  // Formulaire nouveau commentaire
  const [note, setNote] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [texte, setTexte] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const dejaCommente = commentaires.some((c) => c.id_client === currentClientId);

  const handleSubmit = () => {
    if (note === 0 || texte.trim().length < 5 || dejaCommente) return;

    const nouveau: Commentaires = {
      id_commentaire: commentaires.length + 999,
      id_client: currentClientId,
      id_freelancer: freelancerId,
      commentaire: texte.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    setCommentaires((prev) => [nouveau, ...prev]);
    setSubmitted(true);
    setTexte("");
    setNote(0);
  };

  const getClient = (id: number) =>
    clientsMock.find((c) => c.id_client === id);

  const moyenneNote =
    commentaires.length > 0
      ? (
          commentaires.reduce((acc, c) => acc + getNoteSimulee(c.id_commentaire), 0) /
          commentaires.length
        ).toFixed(1)
      : "—";

  return (
    <div className="fixed inset-0 z-999 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-[#1e1e24] border border-[#2a2a32] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92dvh] flex flex-col shadow-[0_-16px_60px_#00000080] sm:shadow-[0_32px_80px_#00000090]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#2a2a32] shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={freelancerPhoto}
              alt={freelancerNom}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <p className="text-sm font-black text-white">{freelancerNom}</p>
              <p className="text-[11px] text-[#FE6864] font-medium">{freelancerMetier}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#2a2a32] hover:bg-[#3a3a42] flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Résumé note ── */}
        <div className="mx-5 mt-4 flex items-center gap-4 bg-[#24242c] border border-[#2a2a32] rounded-2xl px-4 py-3 shrink-0">
          <div className="text-center">
            <p className="text-3xl font-black text-[#FE6864]">{moyenneNote}</p>
            <div className="flex gap-0.5 mt-1 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={10}
                  className={
                    i <= Math.round(Number(moyenneNote))
                      ? "text-amber-400 fill-amber-400"
                      : "text-white/20"
                  }
                />
              ))}
            </div>
          </div>
          <div className="w-px h-10 bg-[#2a2a32]" />
          <div>
            <p className="text-sm font-bold text-white">{commentaires.length} avis</p>
            <p className="text-[11px] text-white/40">clients vérifiés</p>
          </div>
        </div>

        {/* ── Body scrollable ── */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* Formulaire — masqué si déjà commenté ou après soumission */}
          {!dejaCommente && !submitted && (
            <div className="bg-[#24242c] border border-[#2a2a32] rounded-2xl p-4">
              <p className="text-xs font-bold text-white mb-3">
                Laisser un avis
              </p>

              {/* Étoiles cliquables */}
              <div className="flex gap-1.5 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setNote(i)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={26}
                      className={`transition-colors ${
                        i <= (hovered || note)
                          ? "text-amber-400 fill-amber-400"
                          : "text-white/20"
                      }`}
                    />
                  </button>
                ))}
                {note > 0 && (
                  <span className="text-xs text-white/40 self-center ml-1">
                    {["", "Mauvais", "Passable", "Bien", "Très bien", "Excellent"][note]}
                  </span>
                )}
              </div>

              {/* Textarea commentaire */}
              <textarea
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                placeholder="Partagez votre expérience avec cet artisan…"
                rows={3}
                className="w-full bg-[#1e1e22] border border-[#2a2a32] focus:border-[#FE6864] focus:shadow-[0_0_0_3px_#FE686420] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 resize-none outline-none transition-all"
              />

              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-white/30">{texte.length} car.</span>
                <button
                  onClick={handleSubmit}
                  disabled={note === 0 || texte.trim().length < 5}
                  className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                    note > 0 && texte.trim().length >= 5
                      ? "bg-[#FE6864] hover:bg-[#e55a56] text-white"
                      : "bg-[#2a2a32] text-white/30 cursor-not-allowed"
                  }`}
                >
                  <Send size={12} /> Publier
                </button>
              </div>
            </div>
          )}

          {/* Confirmation après soumission */}
          {submitted && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 py-3">
              <Star size={14} className="text-amber-400 fill-amber-400 shrink-0" />
              <p className="text-xs text-emerald-400 font-semibold">
                Merci ! Votre avis a bien été publié.
              </p>
            </div>
          )}

          {dejaCommente && !submitted && (
            <div className="flex items-center gap-2 bg-[#FE686410] border border-[#FE686430] rounded-2xl px-4 py-3">
              <Star size={14} className="text-[#FE6864] fill-[#FE6864] shrink-0" />
              <p className="text-xs text-[#FE6864] font-semibold">
                Vous avez déjà laissé un avis pour cet artisan.
              </p>
            </div>
          )}

          {/* Liste des commentaires */}
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
              Tous les avis
            </p>

            {commentaires.length === 0 ? (
              <div className="text-center py-8">
                <Quote size={28} className="text-white/10 mx-auto mb-2" />
                <p className="text-sm text-white/30">Aucun avis pour le moment.</p>
                <p className="text-xs text-white/20 mt-1">Soyez le premier à en laisser un !</p>
              </div>
            ) : (
              <div className="space-y-3">
                {commentaires.map((c) => {
                  const client = getClient(c.id_client);
                  const noteC = getNoteSimulee(c.id_commentaire);
                  const isOwn = c.id_client === currentClientId;

                  return (
                    <div
                      key={c.id_commentaire}
                      className={`rounded-2xl p-4 border transition-all ${
                        isOwn
                          ? "bg-[#FE686408] border-[#FE686425]"
                          : "bg-[#24242c] border-[#2a2a32]"
                      }`}
                    >
                      {/* Client info + note */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {client?.photo ? (
                            <img
                              src={client.photo}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#2a2a32] flex items-center justify-center shrink-0">
                              <User size={13} className="text-white/40" />
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-white leading-none">
                              {client
                                ? `${client.prenom} ${client.nom.charAt(0)}.`
                                : "Client"}
                              {isOwn && (
                                <span className="ml-1.5 text-[9px] text-[#FE6864] font-black bg-[#FE686420] px-1.5 py-0.5 rounded-full">
                                  Vous
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-white/30 mt-0.5">{c.date}</p>
                          </div>
                        </div>

                        {/* Étoiles */}
                        <div className="flex gap-0.5 shrink-0">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={10}
                              className={
                                i <= noteC
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-white/15"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {/* Texte */}
                      <p className="text-[12px] text-white/70 leading-relaxed">
                        {c.commentaire}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
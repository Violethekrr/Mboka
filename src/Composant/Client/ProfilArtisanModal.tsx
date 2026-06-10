import { X, Star, MapPin, CheckCircle, MessageSquare, Send, Shield, Clock, Award } from "lucide-react";
import { commentairesMock, clientsMock, profilsFreelancersMock, rangsMock, servicesMock } from "../../constants";
import type { FormModalData } from "../../Type";

type Props = {
  freelancerId: number;
  nom: string;
  prenom: string;
  photo: string;
  metier: string;
  note: number;
  avis: number;
  distance: string;
  prix: string;
  disponible: boolean;
  verified: boolean;
  badge?: "Expert" | "Premium";
  onClose: () => void;
  onOpenComments: (freelancerId: number, nom: string, photo: string, metier: string) => void;
  onOpenForm: (artisan: FormModalData["artisan"]) => void;
};

const rangLabel: Record<string, string> = {
  expert:           "Expert",
  intermédiaire:    "Intermédiaire",
  niveau_débutant:  "Débutant",
};

const rangColor: Record<string, string> = {
  expert:          "text-[#FE6864] bg-[#FE686415] border-[#FE686430]",
  intermédiaire:   "text-amber-400 bg-amber-400/10 border-amber-400/20",
  niveau_débutant: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

export default function ProfilArtisanModal({
  freelancerId,
  nom,
  prenom,
  photo,
  metier,
  note,
  avis,
  distance,
  prix,
  disponible,
  verified,
  badge,
  onClose,
  onOpenComments,
  onOpenForm,
}: Props) {
  const profil    = profilsFreelancersMock.find((p) => p.id_freelancer === freelancerId);
  const rang      = rangsMock.find((r) => r.id_freelancer === freelancerId);
  const comments  = commentairesMock.filter((c) => c.id_freelancer === freelancerId).slice(0, 3);
  const services  = servicesMock.filter((s) => s.id_freelancer === freelancerId);

  // Étoiles simulées par id
  const getNote = (id: number) => ((id % 5) || 5);

  const fullNom = `${prenom} ${nom}`;

  return (
    <div className="fixed inset-0 z-999 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-[#1e1e24] border border-[#2a2a32] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[92dvh] flex flex-col shadow-[0_-16px_60px_#00000080] sm:shadow-[0_32px_80px_#00000090] overflow-hidden">

        {/* ── Cover + photo ── */}
        <div className="relative h-32 bg-linear-to-br from-[#2a1a1a] via-[#1e1e22] to-[#1a1a2e] shrink-0">
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-[#1e1e22]/80 backdrop-blur-sm border border-[#2a2a32] flex items-center justify-center text-white/60 hover:text-white transition-colors z-10"
          >
            <X size={15} />
          </button>

          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                badge === "Expert" ? "bg-[#FE6864] text-white" : "bg-amber-500 text-white"
              }`}>
                {badge}
              </span>
            </div>
          )}

          {/* Avatar */}
          <div className="absolute -bottom-8 left-5">
            <div className="relative w-16 h-16 rounded-2xl border-2 border-[#1e1e24] overflow-hidden shadow-xl">
              <img src={photo} alt={fullNom} className="w-full h-full object-cover" />
              {verified && (
                <div className="absolute bottom-0 right-0 bg-[#FE6864] rounded-full p-0.5 translate-x-0.5 translate-y-0.5 border border-[#1e1e24]">
                  <CheckCircle size={11} className="text-white fill-white" />
                </div>
              )}
            </div>
          </div>

          {/* Disponibilité */}
          <div className="absolute bottom-3 right-4 flex items-center gap-1 bg-[#1e1e22]/80 backdrop-blur-sm border border-[#2a2a32] rounded-full px-2.5 py-1">
            <span className={`w-1.5 h-1.5 rounded-full ${disponible ? "bg-emerald-400 animate-pulse" : "bg-gray-500"}`} />
            <span className="text-[10px] font-semibold text-white/70">
              {disponible ? "Disponible maintenant" : "Occupé"}
            </span>
          </div>
        </div>

        {/* ── Infos principales ── */}
        <div className="pt-10 px-5 pb-4 border-b border-[#2a2a32] shrink-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-lg font-black text-white">{fullNom}</h2>
              <p className="text-sm text-[#FE6864] font-semibold">{metier}</p>
              {profil?.secteur_activite && (
                <p className="text-[11px] text-white/40 mt-0.5">{profil.secteur_activite}</p>
              )}
            </div>

            {/* Rang */}
            {rang && (
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${rangColor[rang.rang]}`}>
                {rangLabel[rang.rang]}
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <button
              onClick={() => { onClose(); onOpenComments(freelancerId, fullNom, photo, metier); }}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-white">{note}</span>
              <span className="text-xs text-white/40 hover:text-[#FE6864] transition-colors">
                ({avis} avis)
              </span>
            </button>
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <MapPin size={12} className="text-[#FE6864]" />
              <span>{distance}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock size={12} />
              <span>Réponse rapide</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Shield size={12} className="text-emerald-400" />
              <span>{services.length} mission{services.length > 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* ── Body scrollable ── */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* Description */}
          {profil?.descritpion && (
            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">À propos</h3>
              <p className="text-sm text-white/70 leading-relaxed">{profil.descritpion}</p>
            </div>
          )}

          {/* Services proposés depuis servicesMock */}
          {services.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Services</h3>
              <div className="space-y-2">
                {services.map((s) => (
                  <div
                    key={s.id_service}
                    className="flex items-center justify-between bg-[#24242c] border border-[#2a2a32] rounded-xl px-4 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{s.intitule}</p>
                      <p className="text-[11px] text-white/40 mt-0.5">{s.description}</p>
                    </div>
                    <span className="text-xs font-black text-[#FE6864] shrink-0 ml-3">
                      {prix} FCFA
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Derniers avis */}
          {comments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider">Avis récents</h3>
                <button
                  onClick={() => { onClose(); onOpenComments(freelancerId, fullNom, photo, metier); }}
                  className="text-[11px] text-[#FE6864] font-semibold hover:underline flex items-center gap-1"
                >
                  Voir tout <MessageSquare size={10} />
                </button>
              </div>
              <div className="space-y-2.5">
                {comments.map((c) => {
                  const client = clientsMock.find((cl) => cl.id_client === c.id_client);
                  const noteC  = getNote(c.id_commentaire);
                  return (
                    <div key={c.id_commentaire} className="bg-[#24242c] border border-[#2a2a32] rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={client?.photo ?? "https://picsum.photos/200"}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-white">
                            {client ? `${client.prenom} ${client.nom.charAt(0)}.` : "Client"}
                          </span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map((i) => (
                            <Star key={i} size={9} className={i <= noteC ? "text-amber-400 fill-amber-400" : "text-white/15"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-white/60 leading-relaxed">{c.commentaire}</p>
                      <p className="text-[10px] text-white/25 mt-1">{c.date}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Badge de confiance */}
          <div className="flex items-center gap-3 bg-[#FE686408] border border-[#FE686420] rounded-2xl px-4 py-3">
            <Award size={18} className="text-[#FE6864] shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Artisan vérifié Mboka</p>
              <p className="text-[10px] text-white/40 mt-0.5">
                Identité confirmée · Compétences validées · Assurance incluse
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="px-5 py-4 border-t border-[#2a2a32] flex gap-3 shrink-0">
          <button
            onClick={() => { onClose(); onOpenComments(freelancerId, fullNom, photo, metier); }}
            className="flex-1 flex items-center justify-center gap-2 bg-[#24242c] border border-[#2a2a32] hover:border-[#FE686430] text-white/70 hover:text-white font-semibold text-sm py-3 rounded-xl transition-all"
          >
            <MessageSquare size={15} />
            Avis ({avis})
          </button>
          <button
            onClick={() =>
              onOpenForm({
                photo,
                nom: fullNom,
                metier,
                note,
                avis,
                verified,
                disponible,
              })
            }
            className="flex-1 flex items-center justify-center gap-2 bg-[#FE6864] hover:bg-[#e55a56] text-white font-bold text-sm py-3 rounded-xl transition-all shadow-[0_4px_20px_#FE686440]"
          >
            <Send size={15} />
            Demander un devis
          </button>
        </div>
      </div>
    </div>
  );
}
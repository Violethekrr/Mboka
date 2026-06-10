import { useState } from "react";
import { CheckCircle, Send, Star, UserRound, X } from "lucide-react";

import type { FormModalData } from "../../Type";

type Props = {
  artisan: FormModalData["artisan"];
  onClose: () => void;
};

export default function FormulaireDeDemande({ artisan, onClose }: Props) {
  const [formulaire, setFormulaire] = useState({
    titre: "",
    categorie: "",
    description: "",
    delai: "",
  });

  const [envoye, setEnvoye] = useState(false);

  if (!artisan) return null;

  function envoyerDemande(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formulaire.titre || !formulaire.description) return;

    setEnvoye(true);
  }

  if (envoye) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-400">
            <CheckCircle size={34} />
          </div>

          <h2 className="text-xl font-bold text-white">Demande envoyée</h2>

          <p className="mt-2 text-sm text-[#B8B8BE]">
            Votre demande a été transmise au freelancer. Il pourra vous répondre
            depuis la messagerie.
          </p>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-[#FF6257] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#E84D4D]"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-hidden rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between border-b border-[#2D2D31] p-5">
          <div>
            <p className="text-sm font-semibold text-[#FF6257]">
              Demander un service
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Décrivez votre besoin
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-[#2D2D31] p-2 text-[#B8B8BE] transition hover:border-[#FF6257]/40 hover:bg-[#FF6257]/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto scrollbar-custom p-5">
          <div className="mb-5 rounded-xl border border-[#2D2D31] bg-[#111113] p-4">
            <div className="flex items-center gap-3">
              {artisan.photo ? (
                <img
                  src={artisan.photo}
                  alt={artisan.nom}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6257]/10 text-[#FF6257]">
                  <UserRound size={20} />
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-semibold text-white">{artisan.nom}</h3>

                <p className="text-sm text-[#FF6257]">{artisan.metier}</p>

                <div className="mt-1 flex items-center gap-2 text-xs text-[#B8B8BE]">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>
                    {artisan.note} ({artisan.avis} avis)
                  </span>

                  {artisan.verified && (
                    <span className="rounded-full bg-[#FF6257]/10 px-2 py-0.5 text-[#FF6257]">
                      Vérifié
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={envoyerDemande} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#B8B8BE]">
                Titre de la demande
              </label>

              <input
                value={formulaire.titre}
                onChange={(e) =>
                  setFormulaire({ ...formulaire, titre: e.target.value })
                }
                placeholder="Ex : Création d’un logo professionnel"
                className="w-full rounded-xl border border-[#2D2D31] bg-[#111113] px-4 py-3 text-sm text-white outline-none placeholder:text-[#B8B8BE]/50 focus:border-[#FF6257]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#B8B8BE]">
                Catégorie
              </label>

              <input
                value={formulaire.categorie}
                onChange={(e) =>
                  setFormulaire({ ...formulaire, categorie: e.target.value })
                }
                placeholder="Ex : Design, Développement, Rédaction..."
                className="w-full rounded-xl border border-[#2D2D31] bg-[#111113] px-4 py-3 text-sm text-white outline-none placeholder:text-[#B8B8BE]/50 focus:border-[#FF6257]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#B8B8BE]">
                Description du besoin
              </label>

              <textarea
                value={formulaire.description}
                onChange={(e) =>
                  setFormulaire({
                    ...formulaire,
                    description: e.target.value,
                  })
                }
                placeholder="Expliquez clairement ce que vous souhaitez faire réaliser..."
                rows={5}
                className="w-full resize-none rounded-xl border border-[#2D2D31] bg-[#111113] px-4 py-3 text-sm text-white outline-none placeholder:text-[#B8B8BE]/50 focus:border-[#FF6257]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#B8B8BE]">
                Délai souhaité
              </label>

              <select
                value={formulaire.delai}
                onChange={(e) =>
                  setFormulaire({ ...formulaire, delai: e.target.value })
                }
                className="w-full rounded-xl border border-[#2D2D31] bg-[#111113] px-4 py-3 text-sm text-white outline-none focus:border-[#FF6257]"
              >
                <option value="">Choisir un délai</option>
                <option value="urgent">Urgent</option>
                <option value="cette_semaine">Cette semaine</option>
                <option value="ce_mois">Ce mois-ci</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-[#2D2D31] px-4 py-3 text-sm font-semibold text-[#B8B8BE] transition hover:border-[#FF6257]/40 hover:text-white"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6257] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#E84D4D]"
              >
                <Send size={16} />
                Envoyer la demande
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
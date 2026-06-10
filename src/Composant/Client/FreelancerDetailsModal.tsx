import { Briefcase, CheckCircle, X } from "lucide-react";

type Props = {
  ouvert: boolean;
  onClose: () => void;
  freelancer: {
    photo: string;
    nom: string;
    metier: string;
    secteur?: string;
    description?: string;
    note: number;
    avis: number;
    disponible: boolean;
    verified?: boolean;
  };
  onVoirAvis?: () => void;
  onDemanderService?: () => void;
};

export default function FreelancerDetailsModal({
  ouvert,
  onClose,
  freelancer,
  onVoirAvis,
  onDemanderService,
}: Props) {
  if (!ouvert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#2D2D31] bg-[#1B1B1D] shadow-2xl">
        <div className="relative border-b border-[#2D2D31] p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#FF7B6B] via-[#FF6257] to-[#B52D3A]" />

          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-xl border border-[#2D2D31] bg-[#111113] p-2 text-[#B8B8BE] hover:border-[#FF6257]/40 hover:text-white"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4 pr-12">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-[#2D2D31] bg-[#111113]">
              <img
                src={freelancer.photo}
                alt={freelancer.nom}
                className="h-full w-full object-cover"
              />

              {freelancer.verified && (
                <div className="absolute bottom-1 right-1 rounded-full bg-[#FF6257] p-1">
                  <CheckCircle size={14} className="fill-white text-white" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white md:text-2xl">
                  {freelancer.nom}
                </h2>

                {freelancer.verified && (
                  <CheckCircle size={18} className="text-[#FF6257]" />
                )}
              </div>

              <p className="mt-1 font-semibold text-[#FF6257]">
                {freelancer.metier}
              </p>

              <p className="mt-1 text-sm text-[#B8B8BE]">
                {freelancer.disponible
                  ? "Disponible pour une mission"
                  : "Actuellement occupé"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-5 grid grid-cols-3 gap-3">
            <StatCard titre="Note" valeur={`${freelancer.note} ⭐`} />
            <StatCard titre="Avis" valeur={String(freelancer.avis)} />
            <StatCard
              titre="Statut"
              valeur={freelancer.disponible ? "Disponible" : "Occupé"}
            />
          </div>

          <div className="mb-6 rounded-2xl border border-[#2D2D31] bg-[#111113] p-4">
            <div className="mb-3 flex items-center gap-2 text-[#FF6257]">
              <Briefcase size={18} />
              <h3 className="font-semibold">Informations professionnelles</h3>
            </div>

            <p className="text-sm text-[#B8B8BE]">
              Secteur : {freelancer.secteur || "Non renseigné"}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-[#B8B8BE]">
              {freelancer.description ||
                "Aucune description disponible pour ce profil."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onVoirAvis}
              className="flex-1 rounded-xl border border-[#2D2D31] py-3 font-semibold text-[#B8B8BE] hover:border-[#FF6257]/40 hover:text-white"
            >
              Voir les avis
            </button>

            <button
              onClick={onDemanderService}
              className="flex-1 rounded-xl bg-[#FF6257] py-3 font-semibold text-white hover:bg-[#E84D4D]"
            >
              Demander un service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ titre, valeur }: { titre: string; valeur: string }) {
  return (
    <div className="rounded-xl border border-[#2D2D31] bg-[#111113] p-4">
      <p className="text-xs text-[#B8B8BE]">{titre}</p>
      <p className="mt-1 text-lg font-bold text-white">{valeur}</p>
    </div>
  );
}
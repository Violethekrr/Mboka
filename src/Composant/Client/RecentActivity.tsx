import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { servicesMock, statutServiceMock } from "../../constants";
import { useUser } from "../../Context/UtilisateurContext";

type StatutSimple = "en_attente" | "confirme" | "annule" | "finalise" | "refuse";

const statuts: Record<
  StatutSimple,
  {
    label: string;
    icon: ReactNode;
    className: string;
  }
> = {
  [statutServiceMock.EN_ATTENTE]: {
    label: "En attente",
    icon: <Clock size={12} />,
    className: "border-amber-400/20 bg-amber-400/10 text-amber-400",
  },
  [statutServiceMock.CONFIRME]: {
    label: "Confirmé",
    icon: <CheckCircle2 size={12} />,
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
  },
  [statutServiceMock.ANNULE]: {
    label: "Annulé",
    icon: <XCircle size={12} />,
    className: "border-red-400/20 bg-red-400/10 text-red-400",
  },
  [statutServiceMock.FINALISE]: {
    label: "Finalisé",
    icon: <CheckCircle2 size={12} />,
    className: "border-[#FE686430] bg-[#FE686415] text-[#FE6864]",
  },
  [statutServiceMock.REFUSE]: {
    label: "Refusé",
    icon: <AlertCircle size={12} />,
    className: "border-gray-400/20 bg-gray-400/10 text-gray-400",
  },
};

export default function RecentActivity() {
  const { user } = useUser();

  const idClientConnecte = user && "id_client" in user ? user.id_client : 1;

  const servicesClient = servicesMock
    .filter((service) => service.id_client === idClientConnecte)
    .slice(0, 3)
    .map((service) => ({
      ...service,
      statutAffichage: obtenirStatut(service.id_service),
    }));

  if (servicesClient.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white md:text-lg">
            Mes services récents
          </h2>

          <p className="mt-0.5 text-[11px] text-white/40">
            Suivez vos demandes en cours
          </p>
        </div>

        <Link
          to="/client/services"
          className="flex items-center gap-1 text-xs font-semibold text-[#FE6864] no-underline transition-all hover:gap-2"
        >
          Tous les services <ArrowRight size={13} />
        </Link>
      </div>

      <div className="flex flex-col gap-2.5">
        {servicesClient.map((service) => {
          const statut = statuts[service.statutAffichage];

          return (
            <div
              key={service.id_service}
              className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-[#2a2a32] bg-[#24242c] px-4 py-3.5 transition-all hover:border-[#FE686430]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FE686430] bg-[#FE686415] text-lg text-[#FE6864]">
                🔧
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {service.intitule}
                </p>

                <p className="mt-0.5 truncate text-[10px] text-white/40">
                  {service.description}
                </p>
              </div>

              <div
                className={`flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold ${statut.className}`}
              >
                {statut.icon}
                <span>{statut.label}</span>
              </div>

              <ArrowRight
                size={14}
                className="shrink-0 text-white/20 transition-colors group-hover:text-[#FE6864]"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function obtenirStatut(idService: number): StatutSimple {
  if (idService % 5 === 0) return statutServiceMock.REFUSE;
  if (idService % 4 === 0) return statutServiceMock.ANNULE;
  if (idService % 3 === 0) return statutServiceMock.EN_ATTENTE;
  if (idService % 2 === 0) return statutServiceMock.FINALISE;

  return statutServiceMock.CONFIRME;
}
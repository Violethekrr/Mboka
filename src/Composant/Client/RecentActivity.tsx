import { Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { servicesMock, statutServiceMock } from "../../constants";
import React from "react";

// Type pour les clés de statut
type StatusKey = "en_attente" | "confirme" | "annule" | "finalise" | "refuse";

// Configuration typée des statuts
const statusConfig: Record<StatusKey, {
  label: string;
  icon: React.ReactNode;
  className: string;
}> = {
  [statutServiceMock.EN_ATTENTE]: {
    label: "En attente",
    icon: <Clock size={12} />,
    className: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  [statutServiceMock.CONFIRME]: {
    label: "Confirmé",
    icon: <CheckCircle2 size={12} />,
    className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  [statutServiceMock.ANNULE]: {
    label: "Annulé",
    icon: <XCircle size={12} />,
    className: "text-red-400 bg-red-400/10 border-red-400/20",
  },
  [statutServiceMock.FINALISE]: {
    label: "Finalisé",
    icon: <CheckCircle2 size={12} />,
    className: "text-[#FE6864] bg-[#FE686415] border-[#FE686430]",
  },
  [statutServiceMock.REFUSE]: {
    label: "Refusé",
    icon: <AlertCircle size={12} />,
    className: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  },
};

// Fonction pour déterminer un statut stable basé sur l'ID du service
const getStableStatus = (serviceId: number): StatusKey => {
  // Mapping stable des statuts par ID
  const statusMap: Record<number, StatusKey> = {
    1: statutServiceMock.CONFIRME,
    2: statutServiceMock.FINALISE,
    3: statutServiceMock.EN_ATTENTE,
    4: statutServiceMock.CONFIRME,
    5: statutServiceMock.FINALISE,
    6: statutServiceMock.EN_ATTENTE,
    7: statutServiceMock.ANNULE,
    8: statutServiceMock.REFUSE,
    9: statutServiceMock.CONFIRME,
    10: statutServiceMock.FINALISE,
  };
  
  return statusMap[serviceId] || statutServiceMock.EN_ATTENTE;
};

// Show only first 3 services for the current user (id_client: 1 in mock)
const myServices = servicesMock
  .filter((s) => s.id_client === 1)
  .slice(0, 3)
  .map((service) => ({
    ...service,
    stableStatus: getStableStatus(service.id_service)
  }));

export default function RecentActivity() {
  if (myServices.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white">
            Mes services récents
          </h2>
          <p className="text-[11px] text-white/40 mt-0.5">
            Suivez vos commandes en temps réel
          </p>
        </div>
        <Link
          to="/client/services"
          className="flex items-center gap-1 text-xs text-[#FE6864] font-semibold no-underline hover:gap-2 transition-all"
        >
          Tous les services <ArrowRight size={13} />
        </Link>
      </div>

      <div className="flex flex-col gap-2.5">
        {myServices.map((service) => {
          const cfg = statusConfig[service.stableStatus];

          return (
            <div
              key={`service-${service.id_service}`}
              className="flex items-center gap-4 bg-[#24242c] border border-[#2a2a32] hover:border-[#FE686430] rounded-2xl px-4 py-3.5 transition-all cursor-pointer group"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#FE686415] border border-[#FE686430] flex items-center justify-center shrink-0 text-[#FE6864] text-lg">
                🔧
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {service.intitule}
                </p>
                <p className="text-[10px] text-white/40 mt-0.5 truncate">
                  {service.description}
                </p>
              </div>

              {/* Status */}
              <div
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${cfg.className} shrink-0`}
              >
                {cfg.icon}
                <span>{cfg.label}</span>
              </div>

              <ArrowRight
                size={14}
                className="text-white/20 group-hover:text-[#FE6864] transition-colors shrink-0"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
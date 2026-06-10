import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness, Search, Filter, Eye, Check,
  X, Clock, CheckCircle, XCircle, Star, AlertCircle,
 CalendarDays, User, Download,
} from "lucide-react";
import { servicesMock, clientsMock, paiementsMock } from "../../constants";
import { useUser } from "../../Context/UtilisateurContext";
import type { Service, Clients } from "../../Type";

// ── Tailles de texte — modifiez ici ──────────────────────
const TEXT = {
  xs: "text-sm lg:text-base",
  sm: "text-sm lg:text-base",
  badge: "text-xs lg:text-sm",
  sub: "text-xs lg:text-sm",
  label: "text-xs lg:text-sm",
  head: "text-sm lg:text-base",
  stat: "text-sm lg:text-base",
};

// ── Statut local (string discriminée) ────────────────────
type StatutKey = "en_attente" | "confirme" | "annule" | "finalise" | "refuse";

// Config d'affichage par statut
const statutCfg: Record<StatutKey, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
}> = {
  en_attente: { label: "En attente",  color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/25",   icon: <Clock size={12} />        },
  confirme:   { label: "Confirmé",    color: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/25",    icon: <CheckCircle size={12} />  },
  annule:     { label: "Annulé",      color: "text-[#55555e]",   bg: "bg-[#2a2a34]",      border: "border-[#33333e]",      icon: <XCircle size={12} />      },
  finalise:   { label: "Finalisé",    color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/25", icon: <Star size={12} />         },
  refuse:     { label: "Refusé",      color: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/25",     icon: <X size={12} />            },
};

// ── Type service local avec statut string ─────────────────
interface ServiceLocal extends Omit<Service, "statut"> {
  statut: StatutKey;
  montant?: number;
}

// ── Modal détail service ──────────────────────────────────
function ModalService({
  service, client, onClose, onAction,
}: {
  service: ServiceLocal;
  client?: Clients;
  onClose: () => void;
  onAction: (id: number, action: StatutKey) => void;
}) {
  const cfg = statutCfg[service.statut];
  const isPending   = service.statut === "en_attente";
  const isConfirmed = service.statut === "confirme";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 z-[400] flex items-center justify-center p-5"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
        transition={{ duration: 0.18 }}
        className="bg-[#16161c] border border-[#22222c] rounded-2xl w-full max-w-lg shadow-[0_30px_80px_#00000090] overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#22222c] flex justify-between items-start">
          <div>
            <h3 className={`m-0 ${TEXT.sm} font-bold text-white`}>{service.intitule}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${TEXT.badge} font-semibold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                {cfg.icon} {cfg.label}
              </span>
              <span className={`${TEXT.xs} text-[#55555e]`}>#{service.id_service} · {service.date_creation}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-[#2a2a34] border-none text-white flex items-center justify-center cursor-pointer shrink-0 mt-0.5">
            <X size={13} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Client */}
          {client && (
            <div className="flex items-center gap-3 p-3 bg-[#1c1c24] rounded-xl border border-[#22222c]">
              <img src={client.photo} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
              <div>
                <div className={`${TEXT.sm} font-semibold text-white`}>{client.prenom} {client.nom}</div>
                <div className={`${TEXT.xs} text-[#55555e]`}>{client.email}</div>
              </div>
              <div className={`ml-auto ${TEXT.xs} text-[#55555e] flex items-center gap-1`}>
                <User size={11} /> Client
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-[#1c1c24] border border-[#22222c] rounded-xl p-4">
            <p className={`m-0 mb-1.5 ${TEXT.label} text-[#55555e] uppercase tracking-wider font-semibold`}>Description</p>
            <p className={`m-0 ${TEXT.sm} text-[#c0c0cc] leading-relaxed`}>{service.description}</p>
          </div>

          {/* Montant */}
          {service.montant !== undefined && (
            <div className="flex justify-between items-center p-3.5 bg-[#FE686410] border border-[#FE686430] rounded-xl">
              <span className={`${TEXT.xs} text-[#FE6864] font-semibold`}>Montant du service</span>
              <span className={`${TEXT.sm} font-bold text-white`}>{service.montant.toLocaleString("fr-FR")} XAF</span>
            </div>
          )}

          {/* Date */}
          <div className={`flex items-center gap-2 ${TEXT.xs} text-[#55555e]`}>
            <CalendarDays size={13} /> Créé le {service.date_creation}
          </div>

          {/* Actions contextuelles */}
          {(isPending || isConfirmed) && (
            <div className="border-t border-[#22222c] pt-4">
              <p className={`m-0 mb-3 ${TEXT.label} text-[#55555e] font-semibold uppercase tracking-wider`}>
                {isPending ? "Actions disponibles" : "Gérer ce service"}
              </p>
              <div className="flex gap-2">
                {isPending && (
                  <>
                    <button onClick={() => { onAction(service.id_service, "confirme"); onClose(); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-none bg-blue-500 text-white font-bold ${TEXT.xs} cursor-pointer hover:bg-blue-600 transition-colors`}>
                      <Check size={13} /> Confirmer
                    </button>
                    <button onClick={() => { onAction(service.id_service, "refuse"); onClose(); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-bold ${TEXT.xs} cursor-pointer hover:bg-red-500/20 transition-colors`}>
                      <X size={13} /> Refuser
                    </button>
                  </>
                )}
                {isConfirmed && (
                  <>
                    <button onClick={() => { onAction(service.id_service, "finalise"); onClose(); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-none bg-emerald-500 text-white font-bold ${TEXT.xs} cursor-pointer hover:bg-emerald-600 transition-colors`}>
                      <Star size={13} /> Finaliser
                    </button>
                    <button onClick={() => { onAction(service.id_service, "annule"); onClose(); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#33333e] bg-[#2a2a34] text-[#9090a0] font-bold ${TEXT.xs} cursor-pointer hover:text-white transition-colors`}>
                      <XCircle size={13} /> Annuler
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page principale ───────────────────────────────────────
export default function ServicesFreelancers() {
  const { user } = useUser();
  const currentFreelancerId = user && "id_freelancer" in user ? (user as { id_freelancer: number }).id_freelancer : 1;

  // Normaliser le statut : servicesMock.statut est l'objet StatutService entier,
  // on leur assigne des statuts variés pour la démo
  const statutsDemo: StatutKey[] = ["en_attente", "confirme", "annule", "finalise", "refuse", "en_attente", "confirme", "finalise", "en_attente", "refuse"];
  const [services, setServices] = useState<ServiceLocal[]>(
    servicesMock
      .filter(s => s.id_freelancer === currentFreelancerId)
      // Si pas de services pour ce freelancer en mock, on prend tous pour la démo
      .concat(servicesMock.filter(s => s.id_freelancer !== currentFreelancerId))
      .slice(0, 10)
      .map((s, i) => ({
        ...s,
        statut: statutsDemo[i] ?? "en_attente",
        montant: paiementsMock.find(p => p.id_service === s.id_service)?.montant_ajoute,
      }))
  );

  const [filtreStatut, setFiltreStatut] = useState<"tout" | StatutKey>("tout");
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState<ServiceLocal | null>(null);
  const [showFilters, setShowFilters]   = useState(false);

  // Stats
  const stats = useMemo(() => ({
    total:      services.length,
    en_attente: services.filter(s => s.statut === "en_attente").length,
    confirme:   services.filter(s => s.statut === "confirme").length,
    finalise:   services.filter(s => s.statut === "finalise").length,
    annule:     services.filter(s => s.statut === "annule").length,
    refuse:     services.filter(s => s.statut === "refuse").length,
  }), [services]);

  const totalGagné = useMemo(() =>
    services.filter(s => s.statut === "finalise").reduce((a, s) => a + (s.montant ?? 0), 0),
    [services]
  );

  const filtered = useMemo(() => {
    return services.filter(s => {
      const matchS = filtreStatut === "tout" || s.statut === filtreStatut;
      const client = clientsMock.find(c => c.id_client === s.id_client);
      const matchQ = search === "" ||
        `${s.intitule} ${s.description} ${client?.prenom} ${client?.nom}`
          .toLowerCase().includes(search.toLowerCase());
      return matchS && matchQ;
    });
  }, [services, filtreStatut, search]);

  const handleAction = (id: number, newStatut: StatutKey) => {
    setServices(p => p.map(s => s.id_service === id ? { ...s, statut: newStatut } : s));
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Intitulé", "Client", "Statut", "Montant", "Date"],
      ...services.map(s => {
        const c = clientsMock.find(cl => cl.id_client === s.id_client);
        return [s.id_service, s.intitule, `${c?.prenom} ${c?.nom}`, s.statut, s.montant ?? 0, s.date_creation];
      }),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "services.csv"; a.click();
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans pt-15">

      {/* Top bar */}
      <div className="  h-14 flex items-center gap-3 sticky top-0 z-[100]">
       
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#55555e]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
              className={`bg-[#1c1c24] border border-[#22222c] rounded-lg py-1.5 pr-2.5 pl-8 text-white ${TEXT.sm} outline-none w-48 focus:border-[#FE686460]`} />
          </div>
          <button onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${TEXT.xs} cursor-pointer transition-all
              ${showFilters ? "border-[#FE686460] bg-[#FE686412] text-[#FE6864]" : "border-[#22222c] bg-transparent text-[#55555e] hover:text-white"}`}>
            <Filter size={13} /> Filtres
          </button>
          <button onClick={exportCSV}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#22222c] bg-transparent text-[#55555e] ${TEXT.xs} cursor-pointer hover:text-white transition-colors`}>
            <Download size={13} /> Exporter
          </button>
        </div>
      </div>

      <div className=" px-6 py-6 flex flex-col gap-5">

        {/* ── Stats ────────────────────────────────────── */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: "Total",       val: stats.total,      color: "text-white",          key: "tout"       },
            { label: "En attente",  val: stats.en_attente, color: "text-amber-400",       key: "en_attente" },
            { label: "Confirmés",   val: stats.confirme,   color: "text-blue-400",        key: "confirme"   },
            { label: "Finalisés",   val: stats.finalise,   color: "text-emerald-400",     key: "finalise"   },
            { label: "Annulés",     val: stats.annule,     color: "text-[#55555e]",       key: "annule"     },
            { label: "Refusés",     val: stats.refuse,     color: "text-red-400",         key: "refuse"     },
          ].map(s => (
            <button key={s.key}
              onClick={() => setFiltreStatut(s.key as "tout" | StatutKey)}
              className={` bg-[#1B1B1D] rounded-xl p-3.5 text-left cursor-pointer transition-all border
                ${filtreStatut === s.key ? "border-[#FE686460]" : "border-[#22222c] hover:border-[#33333e]"}`}>
              <p className={`m-0 mb-1 ${TEXT.xs} text-[#55555e]`}>{s.label}</p>
              <p className={`m-0 text-xl font-extrabold ${s.color}`}>{s.val}</p>
            </button>
          ))}
        </div>

        {/* Gains totaux */}
        <div className="bg-gradient-to-r from-[#FE6864]/15 to-transparent border border-[#FE686430] rounded-xl px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FE686420] flex items-center justify-center">
              <Star size={15} className="text-[#FE6864]" />
            </div>
            <div>
              <p className={`m-0 ${TEXT.label} text-[#FE6864] font-semibold uppercase tracking-wider`}>Gains totaux (services finalisés)</p>
              <p className={`m-0 ${TEXT.sm} font-extrabold text-white`}>{totalGagné.toLocaleString("fr-FR")} XAF</p>
            </div>
          </div>
          <span className={`${TEXT.badge} text-[#FE6864] bg-[#FE686418] px-2.5 py-1 rounded-full font-semibold`}>
            {stats.finalise} service{stats.finalise > 1 ? "s" : ""} finalisé{stats.finalise > 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Filtres expand ────────────────────────────── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="bg-[#16161c] border border-[#22222c] rounded-xl px-5 py-4 overflow-hidden">
              <p className={`m-0 mb-3 ${TEXT.label} text-[#55555e] font-semibold uppercase tracking-wider`}>Filtrer par statut</p>
              <div className="flex gap-2 flex-wrap">
                {(["tout", "en_attente", "confirme", "annule", "finalise", "refuse"] as const).map(s => {
                  const label = s === "tout" ? "Tous" : statutCfg[s].label;
                  const isA = filtreStatut === s;
                  const cfg = s !== "tout" ? statutCfg[s] : null;
                  return (
                    <button key={s} onClick={() => setFiltreStatut(s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${TEXT.xs} border cursor-pointer transition-all
                        ${isA
                          ? `font-bold ${cfg?.color ?? "text-white"} ${cfg?.bg ?? "bg-white/10"} ${cfg?.border ?? "border-white/20"}`
                          : "font-normal text-[#55555e] bg-transparent border-[#22222c] hover:text-white"}`}>
                      {cfg?.icon} {label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tableau des services ──────────────────────── */}
        <div className=" bg-[#1B1B1D] border border-[#22222c] rounded-2xl overflow-hidden">

          {/* Header */}
          <div className="grid grid-cols-[40px_1fr_1fr_120px_100px_120px_100px] px-5 py-3 border-b border-[#22222c] bg-[#1c1c24]">
            {["#", "Service", "Client", "Montant", "Date", "Statut", "Actions"].map((h, i) => (
              <span key={h} className={`${TEXT.label} text-[#55555e] font-bold uppercase tracking-wider ${i === 6 ? "text-center" : "text-left"}`}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-[#55555e]">
              <BriefcaseBusiness size={36} className="opacity-20 mx-auto mb-3" />
              <p className={`m-0 ${TEXT.sm}`}>Aucun service trouvé.</p>
            </div>
          )}

          {filtered.map((service, idx) => {
            const client = clientsMock.find(c => c.id_client === service.id_client);
            const cfg    = statutCfg[service.statut];
            const isPending   = service.statut === "en_attente";
            const isConfirmed = service.statut === "confirme";

            return (
              <motion.div key={service.id_service} layout
                className={`grid grid-cols-[40px_1fr_1fr_120px_100px_120px_100px] px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors
                  ${idx < filtered.length - 1 ? "border-b border-[#1e1e26]" : ""}`}>

                <span className={`${TEXT.xs} text-[#55555e] font-bold`}>#{service.id_service}</span>

                {/* Service */}
                <div className="min-w-0 pr-2">
                  <div className={`${TEXT.sm} font-semibold text-white truncate`}>{service.intitule}</div>
                  <div className={`${TEXT.xs} text-[#55555e] truncate`}>{service.description}</div>
                </div>

                {/* Client */}
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  {client ? (
                    <>
                      <img src={client.photo} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className={`${TEXT.xs} font-semibold text-[#e0e0e8] truncate`}>{client.prenom} {client.nom}</div>
                      </div>
                    </>
                  ) : <span className={`${TEXT.xs} text-[#55555e]`}>—</span>}
                </div>

                {/* Montant */}
                <span className={`${TEXT.xs} font-semibold ${service.montant ? "text-white" : "text-[#55555e]"}`}>
                  {service.montant ? `${service.montant.toLocaleString("fr-FR")} XAF` : "—"}
                </span>

                {/* Date */}
                <span className={`${TEXT.xs} text-[#55555e]`}>{service.date_creation}</span>

                {/* Statut */}
                <span className={`inline-flex items-center gap-1 ${cfg.bg} ${cfg.color} ${TEXT.badge} font-semibold px-2.5 py-1 rounded-full border ${cfg.border} w-fit`}>
                  {cfg.icon} {cfg.label}
                </span>

                {/* Actions */}
                <div className="flex gap-1 justify-center">
                  {/* Voir détail */}
                  <button onClick={() => setSelected(service)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border border-[#FE686450] bg-[#FE686412] text-[#FE6864] ${TEXT.badge} font-semibold cursor-pointer hover:bg-[#FE686425] transition-colors`}>
                    <Eye size={11} /> Voir
                  </button>

                  {/* Actions rapides en_attente */}
                  {isPending && (
                    <>
                      <button onClick={() => handleAction(service.id_service, "confirme")}
                        className="w-6 h-6 flex items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 cursor-pointer hover:bg-blue-500/25 transition-colors"
                        title="Confirmer">
                        <Check size={11} />
                      </button>
                      <button onClick={() => handleAction(service.id_service, "refuse")}
                        className="w-6 h-6 flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 cursor-pointer hover:bg-red-500/25 transition-colors"
                        title="Refuser">
                        <X size={11} />
                      </button>
                    </>
                  )}

                  {/* Actions rapides confirme */}
                  {isConfirmed && (
                    <>
                      <button onClick={() => handleAction(service.id_service, "finalise")}
                        className="w-6 h-6 flex items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-pointer hover:bg-emerald-500/25 transition-colors"
                        title="Finaliser">
                        <Star size={11} />
                      </button>
                      <button onClick={() => handleAction(service.id_service, "annule")}
                        className="w-6 h-6 flex items-center justify-center rounded-lg border border-[#33333e] bg-[#2a2a34] text-[#55555e] cursor-pointer hover:text-white transition-colors"
                        title="Annuler">
                        <XCircle size={11} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Compteur */}
        <div className="flex justify-between items-center">
          <span className={`${TEXT.xs} text-[#55555e]`}>{filtered.length} service{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}</span>
          <span className={`${TEXT.xs} text-[#55555e]`}>Total : {services.length} services</span>
        </div>

        {/* Légende des actions */}
        <div className=" bg-[#1B1B1D] border border-[#22222c] rounded-xl p-4">
          <p className={`m-0 mb-3 ${TEXT.label} text-[#55555e] font-semibold uppercase tracking-wider flex items-center gap-1.5`}>
            <AlertCircle size={11} /> Guide des actions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { statut: "En attente",  actions: "Confirmer ✓ ou Refuser ✗", color: "text-amber-400",   icon: <Clock size={12} /> },
              { statut: "Confirmé",    actions: "Finaliser ★ ou Annuler ○",  color: "text-blue-400",    icon: <CheckCircle size={12} /> },
              { statut: "Finalisé",    actions: "Aucune action disponible",   color: "text-emerald-400", icon: <Star size={12} /> },
              { statut: "Refusé / Annulé", actions: "Aucune action disponible", color: "text-[#55555e]", icon: <XCircle size={12} /> },
            ].map(row => (
              <div key={row.statut} className="flex items-center gap-2.5">
                <span className={`${row.color} shrink-0`}>{row.icon}</span>
                <span className={`${TEXT.xs} text-white font-semibold shrink-0`}>{row.statut} →</span>
                <span className={`${TEXT.xs} text-[#55555e]`}>{row.actions}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal détail */}
      <AnimatePresence>
        {selected && (
          <ModalService
            service={selected}
            client={clientsMock.find(c => c.id_client === selected.id_client)}
            onClose={() => setSelected(null)}
            onAction={handleAction}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
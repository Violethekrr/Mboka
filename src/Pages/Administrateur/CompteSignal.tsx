import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {Flag, Search, Filter, Download, Eye, Trash2,AlertTriangle, CheckCircle, Clock, X, Send,ArrowUpDown, RefreshCw, XCircle,} from "lucide-react";
import { clientsMock, freelancersMock, signalementsMock } from "../../constants";
import type { Signalement } from "../../Type";
import type { Clients, Freelancers } from "../../Type";

// ── Tailles de texte — modifiez ici ──────────────────────
const TEXT = {
  xs:    "text-sm lg:text-base",
  sm:    "text-sm lg:text-base",
  badge: "text-xs lg:text-sm",
  label: "text-xs lg:text-sm",
  head:  "text-sm lg:text-base",
  stat:  "text-sm lg:text-base",
};



// Statut local des comptes (suspendu/banni/actif)
type CompteStatut = "actif" | "suspendu" | "banni";
interface CompteStatutMap { id: number; type: "client" | "freelancer"; statut: CompteStatut }

// ── Statut signalement ────────────────────────────────────
type Statut = "en_attente" | "en_cours" | "resolu" | "rejete";
const statutCfg: Record<Statut, { label: string; colorClass: string; bgClass: string; icon: React.ReactNode }> = {
  en_attente: { label: "En attente", colorClass: "text-amber-400",  bgClass: "bg-amber-400/10",  icon: <Clock size={12} />       },
  en_cours:   { label: "En cours",   colorClass: "text-blue-400",   bgClass: "bg-blue-400/10",   icon: <RefreshCw size={12} />   },
  resolu:     { label: "Résolu",     colorClass: "text-emerald-400",bgClass: "bg-emerald-400/10",icon: <CheckCircle size={12} /> },
  rejete:     { label: "Rejeté",     colorClass: "text-gray-300",  bgClass: "bg-gray-300/10",     icon: <X size={12} />           },
};

const compteCfgColor: Record<CompteStatut, string> = {
  actif:    "text-emerald-400",
  suspendu: "text-amber-400",
  banni:    "text-red-500",
};

// Helpers pour trouver client/freelancer
function findUser(id: number, type: "client" | "freelancer", clients: Clients[], freelancers: Freelancers[]) {
  if (type === "client") {
    const c = clients.find(u => u.id_client === id);
    return c ? { id: c.id_client, nom: c.nom, prenom: c.prenom, photo: c.photo, type: "client" as const } : null;
  }
  const f = freelancers.find(u => u.id_freelancer === id);
  return f ? { id: f.id_freelancer, nom: f.nom, prenom: f.prenom, photo: f.photo, type: "freelancer" as const } : null;
}

// ── Modal ─────────────────────────────────────────────────
function ModalSignalement({
  sig, signaleurUser, signaleUser, onClose, onUpdate, onAction,
}: {
  sig: Signalement;
  signaleurUser: ReturnType<typeof findUser>;
  signaleUser: ReturnType<typeof findUser>;
  signaleStatut: CompteStatut;
  onClose: () => void;
  onUpdate: (id: number, statut: Statut, note: string) => void;
  onAction: (id: number, type: "client" | "freelancer", action: "suspendre" | "bannir" | "restaurer") => void;
}) {
  const [statut, setStatut] = useState<Statut>((sig.statut as Statut) ?? "en_attente");
  const [note, setNote] = useState(sig.note_admin ?? "");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-400 flex items-center justify-center p-1"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
        transition={{ duration: 0.18 }}
        className="bg-[#16161c] border border-[#22222c] rounded-2xl w-full max-w-145 max-h-[90vh] overflow-y-auto shadow-[0_30px_80px_#00000090]"
      >
        {/* Header */}
        <div className="px-5.5 py-4.5 border-b border-[#22222c] flex justify-between items-center">
          <div>
            <h3 className={`m-0 ${TEXT.sm} font-bold text-white`}>Signalement #{sig.id_signalement}</h3>
            <p className={`m-0 mt-0.5 ${TEXT.xs} text-white/90`}>{sig.date} · {sig.categorie}</p>
          </div>
          <button onClick={onClose} className="bg-[#3a3a46] border-none text-white rounded-lg w-7 h-7 flex items-center justify-center cursor-pointer">
            <X size={13} />
          </button>
        </div>

        <div className="px-5.5 py-5 flex flex-col gap-4.5">
          {/* Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            {[
              { label: "Signaleur", user: signaleurUser, isSignale: false },
              { label: "Signalé",   user: signaleUser,   isSignale: true  },
            ].map(({ label, user, isSignale }) => (
              <div key={label}
                className={`bg-[#1c1c24] rounded-[10px] p-3 border ${isSignale ? "border-[#FE686440]" : "border-[#22222c]"}`}>
                <p className={`m-0 mb-2 ${TEXT.label} text-white/90 uppercase tracking-[0.8px] font-semibold`}>{label}</p>
                {user ? (
                  <div className="flex items-center gap-2.5">
                    <img src={user.photo} alt="" className="w-8.5 h-8.5 rounded-full object-cover" />
                    <div>
                      <div className={`${TEXT.sm} font-bold text-white`}>{user.prenom} {user.nom}</div>
                      <div className={`${TEXT.xs} capitalize ${isSignale ? "text-[#FE6864]" : "text-white/90"}`}>{user.type}</div>
                    </div>
                  </div>
                ) : <div className={`${TEXT.xs} text-white/90`}>Inconnu</div>}
              </div>
            ))}
            <div className="flex justify-center text-[#FE6864]">
              <AlertTriangle size={20} />
            </div>
          </div>

          {/* Motif */}
          <div className="bg-[#FE686410] border border-[#FE686430] rounded-[10px] p-3">
            <p className={`m-0 mb-1.5 ${TEXT.label} text-[#FE6864] uppercase tracking-[0.8px] font-bold`}>Description</p>
            <p className={`m-0 ${TEXT.sm} text-[#e0e0e8] leading-relaxed`}>{sig.Signalement}</p>
          </div>

          {/* Statut */}
          <div>
            <p className={`m-0 mb-2 ${TEXT.label} text-white/90 font-semibold uppercase tracking-[0.8px]`}>Changer le statut</p>
            <div className="flex gap-2">
              {(["en_attente", "en_cours", "resolu", "rejete"] as Statut[]).map(s => {
                const c = statutCfg[s];
                const isA = statut === s;
                return (
                  <button key={s} onClick={() => setStatut(s)}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs sm:${TEXT.xs} cursor-pointer border transition-all
                      ${isA ? `font-bold ${c.colorClass} ${c.bgClass} border-current` : "font-normal text-white/90 bg-transparent border-[#22222c]"}`}>
                    {c.icon} {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note admin */}
          <div>
            <p className={`m-0 mb-2 ${TEXT.label} text-white/90 font-semibold uppercase tracking-[0.8px]`}>Note admin</p>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="Ajouter une note, une décision ou une justification..."
              rows={3}
              className={`w-full bg-[#1c1c24] border border-[#22222c] rounded-xl px-3.5 py-2.5 text-white ${TEXT.sm} resize-y outline-none font-sans leading-snug focus:border-[#FE686460] box-border`}
            />
          </div>

          {/* Actions compte signalé */}
          {signaleUser && (
            <div>
              <p className={`m-0 mb-2 ${TEXT.label} text-white/90 font-semibold uppercase tracking-[0.8px]`}>Actions sur le compte signalé</p>
              <div className="flex gap-2">
                <button onClick={() => onAction(signaleUser.id, signaleUser.type, "suspendre")}
                  className={`flex items-center gap-3 px-2 py-2 rounded-lg border border-amber-400/25 bg-amber-400/10 text-amber-400 ${TEXT.xs} font-semibold cursor-pointer`}>
                  <Clock size={16} /> Suspendre
                </button>
                <button onClick={() => onAction(signaleUser.id, signaleUser.type, "bannir")}
                  className={`flex items-center gap-3 px-2 py-2 rounded-lg border border-red-500/25 bg-red-500/10 text-red-500 ${TEXT.xs} font-semibold cursor-pointer`}>
                  <XCircle size={16} /> Bannir
                </button>
                <button onClick={() => onAction(signaleUser.id, signaleUser.type, "restaurer")}
                  className={`flex items-center gap-3 px-2 py-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 ${TEXT.xs} font-semibold cursor-pointer`}>
                  <CheckCircle size={16} /> Restaurer
                </button>
              </div>
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-2.5 justify-end pt-1">
            <button onClick={onClose}
              className={`px-4.5 py-2 rounded-lg border border-[#22222c] bg-transparent text-white/90 cursor-pointer ${TEXT.sm}`}>
              Annuler
            </button>
            <button onClick={() => { onUpdate(sig.id_signalement, statut, note); onClose(); }}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-lg border-none bg-[#FE6864] text-white font-bold cursor-pointer ${TEXT.sm} shadow-[0_4px_16px_#FE686440]`}>
              <Send size={14} /> Enregistrer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page principale ───────────────────────────────────────
export default function CompteSignale() {
  const [signalements, setSignalements] = useState<Signalement[]>(signalementsMock);
  const [clients] = useState<Clients[]>(clientsMock);
  const [freelancers] = useState<Freelancers[]>(freelancersMock);
  // Statuts locaux des comptes
  const [comptesStatut, setComptesStatut] = useState<CompteStatutMap[]>([]);

  const [filtreStatut, setFiltreStatut] = useState<"tout" | Statut>("tout");
  const [filtreCategorie, setFiltreCategorie] = useState("tout");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Signalement | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  const getCompteStatut = (id: number, type: "client" | "freelancer"): CompteStatut => {
    return comptesStatut.find(c => c.id === id && c.type === type)?.statut ?? "actif";
  };

  const stats = useMemo(() => ({
    total:      signalements.length,
    en_attente: signalements.filter(s => s.statut === "en_attente").length,
    en_cours:   signalements.filter(s => s.statut === "en_cours").length,
    resolu:     signalements.filter(s => s.statut === "resolu").length,
    rejete:     signalements.filter(s => s.statut === "rejete").length,
  }), [signalements]);

  const categories = useMemo(() =>
    ["tout", ...Array.from(new Set(signalements.map(s => s.categorie ?? "Autre")))],
    [signalements]
  );

  const filtered = useMemo(() => {
    let list = signalements.filter(s => {
      const matchS = filtreStatut === "tout" || s.statut === filtreStatut;
      const matchC = filtreCategorie === "tout" || s.categorie === filtreCategorie;
      const sigUser = findUser(s.id_signalé, s.signaleur_type==='client'? "freelancer" : "client", clients, freelancers);
      const srUser  = findUser(s.id_signaleur, s.signaleur_type as "client" | "freelancer", clients, freelancers);
      const matchQ = search === "" ||
        `${sigUser?.prenom} ${sigUser?.nom} ${srUser?.prenom} ${srUser?.nom} ${s.Signalement} ${s.categorie}`
          .toLowerCase().includes(search.toLowerCase());
      return matchS && matchC && matchQ;
    });
    if (sortDir === "desc") list = [...list].reverse();
    return list;
  }, [signalements, filtreStatut, filtreCategorie, search, sortDir, clients, freelancers]);

  const updateSignalement = (id: number, statut: Statut, note: string) => {
    setSignalements(p => p.map(s => s.id_signalement === id ? { ...s, statut, note_admin: note } : s));
  };

  const supprimerSignalement = (id: number) => {
    if (window.confirm("Supprimer ce signalement ?"))
      setSignalements(p => p.filter(s => s.id_signalement !== id));
  };

  const actionCompte = (id: number, type: "client" | "freelancer", action: "suspendre" | "bannir" | "restaurer") => {
    const map = { suspendre: "suspendu", bannir: "banni", restaurer: "actif" } as const;
    setComptesStatut(p => {
      const exists = p.find(c => c.id === id && c.type === type);
      if (exists) return p.map(c => c.id === id && c.type === type ? { ...c, statut: map[action] } : c);
      return [...p, { id, type, statut: map[action] }];
    });
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Signaleur", "Signalé", "Signalement", "Catégorie", "Statut", "Date"],
      ...filtered.map(s => {
        const sr = findUser(s.id_signaleur, s.signaleur_type as "client" | "freelancer", clients, freelancers);
        const sg = findUser(s.id_signalé, s.signaleur_type==='client'? "freelancer" : "client", clients, freelancers);
        return [s.id_signalement, `${sr?.prenom} ${sr?.nom}`, `${sg?.prenom} ${sg?.nom}`, s.Signalement, s.categorie, s.statut, s.date];
      })
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "signalements.csv"; a.click();
  };

  return (
    <div className="min-h-screen bg-[#111116] font-sans text-white flex">
      <div className="flex-1 flex flex-col min-h-screen transition-[margin] duration-[0.25s]">

        {/* Top bar */}
        <div className="bg-[#16161c] py-2 w-full border-b border-[#22222c] px-7 ml-auto  h-auto grid grid-cols-1 sm:flex items-center gap-3 sticky top-0 z-100">
          <h1 className={`text-nowrap sm:mx-[5%] ml-auto ${TEXT.head}  font-extrabold text-white`}>Comptes Signalés</h1>
          <div className=" w-full ml-5 sm:ml-auto justify-end flex items-center  gap-2.5">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/90" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
                className={`bg-[#1c1c24] border border-[#22222c] rounded-lg py-1.5 pr-2.5 pl-8 text-white ${TEXT.sm} outline-none w-50 focus:border-[#FE686460]`} />
            </div>
            
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${TEXT.sm} cursor-pointer transition-all
                  ${showFilters ? "border-[#FE686460] bg-[#FE686412] text-[#FE6864]" : "border-[#22222c] bg-transparent text-white/90 hover:text-white"}`}>
                <Filter size={13} /> <p className="hidden sm:block">Filtres</p> 
              </button>
              <button onClick={exportCSV}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#22222c] bg-transparent text-white/90 ${TEXT.sm} cursor-pointer`}>
                <Download size={13} /> <p className="hidden sm:block">Exporter</p>
              </button>
            
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-5">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Total",      val: stats.total,      color: "text-white",          key: "tout"       },
              { label: "En attente", val: stats.en_attente, color: "text-amber-400",       key: "en_attente" },
              { label: "En cours",   val: stats.en_cours,   color: "text-blue-400",        key: "en_cours"   },
              { label: "Résolus",    val: stats.resolu,     color: "text-emerald-400",     key: "resolu"     },
              { label: "Rejetés",    val: stats.rejete,     color: "text-[#55555e]",       key: "rejete"     },
            ].map(s => (
              <button key={s.label}
                onClick={() => setFiltreStatut(s.key as "tout" | Statut)}
                className="bg-[#16161c] border border-[#22222c] rounded-xl p-3.5 text-left flex items-center  gap-2 sm:items-start sm:flex-col cursor-pointer transition-all hover:border-white/20">
                <p className={`m-0 mb-1 ${TEXT.xs} text-white/90`}>{s.label}</p>
                <p className={`m-0 text-2xl font-extrabold ${s.color}`}>{s.val}</p>
              </button>
            ))}
          </div>

          {/* Filtres */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="bg-[#16161c] border border-[#22222c] rounded-xl px-4.5 py-3.5 overflow-hidden">
                <div className="hidden lg:flex gap-6 flex-wrap items-center">
                  <div>
                    <p className={`m-0 mb-2 ${TEXT.label} text-white/90 font-semibold uppercase tracking-[0.8px]`}>Statut</p>
                    <div className="flex gap-1.5">
                      {(["tout", "en_attente", "en_cours", "resolu", "rejete"] as const).map(s => {
                        const label = s === "tout" ? "Tout" : statutCfg[s].label;
                        const isA = filtreStatut === s;
                        return (
                          <button key={s} onClick={() => setFiltreStatut(s)}
                            className={`px-3 py-1 rounded-full ${TEXT.xs} border cursor-pointer transition-all
                              ${isA ? "font-bold border-white/30 bg-white/10 text-white" : "font-normal border-[#22222c] bg-transparent text-white/80"}`}>
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className={`m-0 mb-2 ${TEXT.label} text-white/80 font-semibold uppercase tracking-[0.8px]`}>Catégorie</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {categories.map(c => {
                        const isA = filtreCategorie === c;
                        return (
                          <button key={c} onClick={() => setFiltreCategorie(c)}
                            className={`px-3 py-1 rounded-full ${TEXT.xs} border cursor-pointer capitalize transition-all
                              ${isA ? "font-bold border-[#FE686480] bg-[#FE686418] text-[#FE6864]" : "font-normal border-[#22222c] bg-transparent text-white/90"}`}>
                            {c === "tout" ? "Toutes" : c}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <button onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#22222c] bg-transparent text-white/80 ${TEXT.xs} cursor-pointer`}>
                      <ArrowUpDown size={12} /> Tri : {sortDir === "desc" ? "Récent" : "Ancien"}
                    </button>
                  </div>
                </div>
                                {/* Mobile */}
                <div className="lg:hidden flex flex-col gap-3">

                  {/* Statut */}
                  <div>
                    <label
                      className={`block mb-1 ${TEXT.label} text-white/80 font-semibold`}
                    >
                      Statut
                    </label>

                    <select
                      value={filtreStatut}
                      onChange={(e) =>
                        setFiltreStatut(e.target.value as "tout" | Statut)
                      }
                      className="w-full bg-[#16161c] border border-[#22222c] rounded-lg px-3 py-2 text-sm text-white outline-none"
                    >
                      <option value="tout">Tout</option>
                      <option value="en_attente">En attente</option>
                      <option value="en_cours">En cours</option>
                      <option value="resolu">Résolu</option>
                      <option value="rejete">Rejeté</option>
                    </select>
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label
                      className={`block mb-1 ${TEXT.label} text-white/80 font-semibold`}
                    >
                      Catégorie
                    </label>

                    <select
                      value={filtreCategorie}
                      onChange={(e) =>
                        setFiltreCategorie(e.target.value)
                      }
                      className="w-full bg-[#16161c] border border-[#22222c] rounded-lg px-3 py-2 text-sm text-white outline-none capitalize"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c === "tout" ? "Toutes" : c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tri */}
                  <button
                    onClick={() =>
                      setSortDir((d) =>
                        d === "asc" ? "desc" : "asc"
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#22222c] bg-[#16161c] text-white text-sm"
                  >
                    <ArrowUpDown size={16} />
                    Tri : {sortDir === "desc" ? "Récent" : "Ancien"}
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Tableau */}
          <div className="bg-[#16161c] hidden lg:block border border-[#22222c] rounded-[14px] overflow-hidden flex-1">
            {/* Header */}
            <div className="grid grid-cols-[50px_1fr_1fr_1fr_110px_100px_110px] px-4.5 py-3 border-b border-[#22222c] bg-[#1c1c24]">
              {["#ID", "Signaleur", "Signalé", "Motif", "Date", "Statut", "Actions"].map((h, i) => (
                <span key={h} className={`${TEXT.label} text-white/90 font-bold uppercase tracking-[0.8px] ${i === 6 ? "text-center" : "text-left"}`}>{h}</span>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-16 text-center text-white/90 ">
                <Flag size={36} className="opacity-25 mx-auto mb-3" />
                <p className={`m-0 ${TEXT.sm}`}>Aucun signalement trouvé.</p>
              </div>
            )}

            {filtered.map((sig, idx) => {
              const signaleurType = sig.signaleur_type as "client" | "freelancer";
              const signaleType   = sig.signaleur_type==='client'? "freelancer" : "client";
              const signaleurUser = findUser(sig.id_signaleur, signaleurType, clients, freelancers);
              const signaleUser   = findUser(sig.id_signalé,   signaleType,   clients, freelancers);
              const sCfg          = statutCfg[(sig.statut as Statut) ?? "en_attente"];
              const sigStatut     = getCompteStatut(sig.id_signalé, signaleType);

              return (
                <motion.div key={sig.id_signalement} layout
                  className={`grid grid-cols-[50px_1fr_1fr_1fr_110px_100px_110px] px-4.5 py-3 items-center hover:bg-white/2 transition-colors ${idx < filtered.length - 1 ? "border-b border-[#22222c]" : ""}`}
                >
                  <span className={`${TEXT.xs} text-white/90  font-bold`}>#{sig.id_signalement}</span>

                  {/* Signaleur */}
                  {[
                    { user: signaleurUser, type: signaleurType, statut: "actif" as CompteStatut },
                    { user: signaleUser,   type: signaleType,   statut: sigStatut               },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      {item.user ? (
                        <>
                          <div className="relative shrink-0">
                            <img src={item.user.photo} alt=""
                              className={`w-8 h-8 rounded-full object-cover border-2 ${i === 1 && item.statut !== "actif" ? `border-current ${compteCfgColor[item.statut]}` : "border-transparent"}`} />
                            {i === 1 && item.statut !== "actif" && (
                              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#16161c] ${compteCfgColor[item.statut]} bg-current`} />
                            )}
                          </div>
                          <div>
                            <div className={`${TEXT.sm} font-semibold text-[#e0e0e8]`}>{item.user.prenom} {item.user.nom}</div>
                            <div className={`${TEXT.xs} capitalize ${i === 1 ? compteCfgColor[item.statut] : "text-gray-400 "}`}>
                              {item.type}{i === 1 ? ` · ${item.statut}` : ""}
                            </div>
                          </div>
                        </>
                      ) : <span className={`${TEXT.xs} text-gray-300`}>Inconnu</span>}
                    </div>
                  ))}

                  {/* Motif */}
                  <div className="overflow-hidden">
                    <div className={`${TEXT.xs} text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap max-w-45`}>{sig.Signalement}</div>
                    <span className={`${TEXT.badge} text-[#FE6864] bg-[#FE686415] px-1.5 py-px rounded-full inline-block mt-0.5`}>{sig.categorie}</span>
                  </div>

                  <span className={`${TEXT.xs} text-gray-300`}>{sig.date}</span>

                  {/* Statut badge */}
                  <span className={`inline-flex items-center gap-1 ${sCfg.bgClass} ${sCfg.colorClass} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                    {sCfg.icon} {sCfg.label}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-1 justify-center items-center">
                    <button onClick={() => setSelected(sig)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#FE686450] bg-[#FE686412] text-[#FE6864] ${TEXT.xs} font-semibold cursor-pointer hover:bg-[#FE686425] transition-colors`}>
                      <Eye size={12} /> Voir
                    </button>
                    <button onClick={() => supprimerSignalement(sig.id_signalement)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-500/25 bg-red-500/10 text-red-500 cursor-pointer hover:bg-red-500/20 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#16161c] border border-[#22222c] rounded-[14px] overflow-hidden flex-1">
            {filtered.map((sig) => {
              const signaleurType = sig.signaleur_type as "client" | "freelancer";
              const signaleType   = sig.signaleur_type==='client'? "freelancer" : "client";
              const signaleurUser = findUser(sig.id_signaleur, signaleurType, clients, freelancers);
              const signaleUser   = findUser(sig.id_signalé,   signaleType,   clients, freelancers);
              const sCfg          = statutCfg[(sig.statut as Statut) ?? "en_attente"];
              const sigStatut     = getCompteStatut(sig.id_signalé, signaleType);


                return (
                  <motion.div
                    key={sig.id_signalement}
                    layout
                    className="bg-[#1A1A22] border border-[#2A2A35] rounded-2xl p-5 space-y-4 hover:border-[#FE686450] transition-all"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-400">
                          Signalement #{sig.id_signalement}
                        </p>

                        <span
                          className={`inline-flex items-center gap-1 mt-2 ${sCfg.bgClass} ${sCfg.colorClass} text-xs font-semibold px-2.5 py-1 rounded-full`}
                        >
                          {sCfg.icon}
                          {sCfg.label}
                        </span>
                      </div>

                      <span className="text-xs text-gray-400">
                        {sig.date}
                      </span>
                    </div>

                    {/* Utilisateurs */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Signaleur */}
                      <div className="bg-[#16161C] rounded-xl p-3">
                        <p className="text-[11px] text-gray-400 mb-2 uppercase">
                          Signaleur
                        </p>

                        {signaleurUser && (
                          <div className="flex items-center gap-3">
                            <img
                              src={signaleurUser.photo}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover"
                            />

                            <div>
                              <h4 className="text-sm font-semibold text-white">
                                {signaleurUser.prenom} {signaleurUser.nom}
                              </h4>

                              <p className="text-xs text-gray-400 capitalize">
                                {signaleurType}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Signalé */}
                      <div className="bg-[#16161C] rounded-xl p-3">
                        <p className="text-[11px] text-gray-400 mb-2 uppercase">
                          Compte signalé
                        </p>

                        {signaleUser && (
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={signaleUser.photo}
                                alt=""
                                className={`w-10 h-10 rounded-full object-cover border-2 border-current ${compteCfgColor[sigStatut]}`}
                              />

                              <span
                                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#16161C] ${compteCfgColor[sigStatut]} bg-current`}
                              />
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold text-white">
                                {signaleUser.prenom} {signaleUser.nom}
                              </h4>

                              <p
                                className={`text-xs capitalize ${compteCfgColor[sigStatut]}`}
                              >
                                {signaleType} • {sigStatut}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Motif */}
                    <div className="bg-[#16161C] rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">
                          Motif du signalement
                        </span>

                        <span className="text-xs font-medium text-[#FE6864] bg-[#FE686415] px-2 py-1 rounded-full">
                          {sig.categorie}
                        </span>
                      </div>

                      <p className="text-sm text-gray-300">
                        {sig.Signalement}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelected(sig)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FE686415] border border-[#FE686450] text-[#FE6864] text-sm font-medium hover:bg-[#FE686425]"
                      >
                        <Eye size={15} />
                      
                      </button>

                      <button
                        onClick={() =>
                          supprimerSignalement(sig.id_signalement)
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20"
                      >
                        <Trash2 size={15} />
                     
                      </button>
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {/* Pagination info */}
          <div className="flex justify-between items-center">
            <span className={`${TEXT.xs} text-[#55555e]`}>{filtered.length} signalement{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}</span>
            <span className={`${TEXT.xs} text-[#55555e]`}>Total : {signalements.length} signalements</span>
          </div>
        </div>

    
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <ModalSignalement
            sig={selected}
            signaleurUser={findUser(selected.id_signaleur, selected.signaleur_type as "client" | "freelancer", clients, freelancers)}
            signaleUser={findUser(selected.id_signalé, selected.signaleur_type==='client'? "freelancer" : "client", clients, freelancers)}
            signaleStatut={getCompteStatut(selected.id_signalé, selected.signaleur_type==='client'? "freelancer" : "client")}
            onClose={() => setSelected(null)}
            onUpdate={updateSignalement}
            onAction={actionCompte}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
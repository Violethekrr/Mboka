import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, Plus, ArrowDownLeft, ArrowUpRight, 
  Smartphone, X, Check, ChevronRight,
  TrendingUp, TrendingDown, Clock, Filter, Download,
  Eye, EyeOff, AlertCircle,
} from "lucide-react";
import { useUser } from "../../Context/UtilisateurContext";
import { walletsMock, paiementsMock, clientsMock, freelancersMock } from "../../constants";
import type { Wallet as WalletType } from "../../Type";

// ── Tailles de texte — modifiez ici ──────────────────────
const TEXT = {
  xs:    "text-xs",
  sm:    "text-sm",
  badge: "text-[10px]",
  label: "text-[10px]",
  head:  "text-sm",
  hero:  "text-4xl",
};

type TxType    = "credit" | "debit" | "pending";
type MethodeId = "mobile_money" | "airtel_money" 

interface Transaction {
  id: number;
  label: string;
  sous_label: string;
  montant: number;
  devise: string;
  type: TxType;
  date: string;
  methode: string;
  statut: "complete" | "en_cours" | "echec";
}

interface MethodePaiement {
  id: MethodeId;
  label: string;
  detail: string;
  icon: React.ReactNode;
  color: string;
}

const methodesMock: MethodePaiement[] = [
  { id: "mobile_money",    label: "Mobile Money",    detail: "Mtn •••• 0098", icon: <Smartphone size={16} />, color: "#f59e0b" },
  { id: "airtel_money",      label: "Airtel_Money",      detail: "Airtel•••• 4242",        icon: <Smartphone size={16} />, color: "#f63b41" },
 ];

const statutTxCfg = {
  complete: { label: "Complété", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  en_cours: { label: "En cours", color: "text-amber-400",   bg: "bg-amber-400/10"   },
  echec:    { label: "Échoué",   color: "text-red-400",     bg: "bg-red-400/10"     },
};

const fmt = (n: number, devise: string) => `${Math.abs(n).toLocaleString("fr-FR")} ${devise}`;

function buildTransactions(userId: number, isFreelancer: boolean, devise: string): Transaction[] {
  const txs: Transaction[] = paiementsMock
    .filter(p => isFreelancer ? p.id_freelancer === userId : p.id_client === userId)
    .map(p => {
      const client = clientsMock.find(c => c.id_client === p.id_client);
      const fl     = freelancersMock.find(f => f.id_freelancer === p.id_freelancer);
      return {
        id:         p.id_paiement,
        label:      isFreelancer ? `Paiement de ${client?.prenom ?? "—"} ${client?.nom ?? ""}` : `Service de ${fl?.prenom ?? "—"} ${fl?.nom ?? ""}`,
        sous_label: `Service #${p.id_service}`,
        montant:    isFreelancer ? p.montant_ajoute : -p.montant_ajoute,
        devise,
        type:       (isFreelancer ? "credit" : "debit") as TxType,
        date:       "2026-06-06",
        methode:    "Mobile Money",
        statut:     "complete" as const,
      };
    });

  return [...txs,
    { id: 9001, label: "Virement en attente", sous_label: "Traitement en cours…", montant: 60000, devise, type: "pending" as TxType, date: "Aujourd'hui", methode: "Mtn_Money", statut: "en_cours" as const },
    { id: 9002, label: isFreelancer ? "Retrait vers Mobile Money" : "Dépôt Airtel Money", sous_label: isFreelancer ? "Mtn •••• 0098" : "Airtel •••• 4242", montant: isFreelancer ? -100000 : 100000, devise, type: (isFreelancer ? "debit" : "credit") as TxType, date: "06 mai 2024", methode: isFreelancer ? "Mobile Money" : "Carte Visa", statut: "complete" as const },
    { id: 9003, label: "Frais de service", sous_label: "Commission MBOKA 5%", montant: -5000, devise, type: "debit" as TxType, date: "05 mai 2024", methode: "Automatique", statut: "complete" as const },
  ];
}

// ── Modal Recharge ────────────────────────────────────────
function ModalRecharge({ devise, onClose, onConfirm }: { devise: string; onClose: () => void; onConfirm: (m: number, me: MethodeId) => void }) {
  const [montant, setMontant] = useState("");
  const [methode, setMethode] = useState<MethodeId>("mobile_money");
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 z-[500] flex items-center justify-center p-5"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
        transition={{ duration: 0.18 }}
        className="bg-[#16161c] border border-[#22222c] rounded-2xl w-full max-w-md shadow-[0_30px_80px_#00000099] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#22222c] flex justify-between items-center">
          <div>
            <h3 className={`m-0 ${TEXT.sm} font-bold text-white`}>Ajouter des fonds</h3>
            <p className={`m-0 mt-0.5 ${TEXT.xs} text-[#55555e]`}>Rechargez votre wallet MBOKA</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-[#2a2a34] border-none text-white flex items-center justify-center cursor-pointer"><X size={13} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-5">
          <div>
            <p className={`m-0 mb-2 ${TEXT.label} text-[#55555e] font-semibold uppercase tracking-wider`}>Montant ({devise})</p>
            <input type="number" value={montant} onChange={e => setMontant(e.target.value)} placeholder="0"
              className={`w-full bg-[#1c1c24] border border-[#22222c] rounded-xl px-4 py-3 text-white ${TEXT.sm} outline-none focus:border-[#FE686460] box-border`} />
            <div className="flex gap-2 mt-2">
              {[10000, 25000, 50000, 100000].map(v => (
                <button key={v} onClick={() => setMontant(String(v))}
                  className={`flex-1 py-1.5 rounded-lg border border-[#22222c] bg-transparent text-[#9090a0] ${TEXT.xs} cursor-pointer hover:border-[#FE686460] hover:text-[#FE6864] transition-all`}>{v / 1000}k</button>
              ))}
            </div>
          </div>
          <div>
            <p className={`m-0 mb-2 ${TEXT.label} text-[#55555e] font-semibold uppercase tracking-wider`}>Méthode</p>
            <div className="flex flex-col gap-2">
              {methodesMock.map(m => (
                <button key={m.id} onClick={() => setMethode(m.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-left ${methode === m.id ? "border-[#FE686460] bg-[#FE686410]" : "border-[#22222c] bg-transparent hover:border-[#33333e]"}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: m.color + "20", color: m.color }}>{m.icon}</div>
                  <div className="flex-1"><div className={`${TEXT.sm} font-semibold text-white`}>{m.label}</div><div className={`${TEXT.xs} text-[#55555e]`}>{m.detail}</div></div>
                  {methode === m.id && <Check size={15} className="text-[#FE6864] shrink-0" />}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2.5 pt-1">
            <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl border border-[#22222c] bg-transparent text-[#55555e] ${TEXT.sm} cursor-pointer`}>Annuler</button>
            <button onClick={() => { if (Number(montant) > 0) { onConfirm(Number(montant), methode); onClose(); } }} disabled={!montant || Number(montant) <= 0}
              className={`flex-1 py-2.5 rounded-xl border-none font-bold ${TEXT.sm} transition-all ${montant && Number(montant) > 0 ? "bg-[#FE6864] text-white cursor-pointer" : "bg-[#2a2a34] text-[#55555e] cursor-not-allowed"}`}>
              Confirmer le dépôt
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Modal Retrait ─────────────────────────────────────────
function ModalRetrait({ solde, devise, onClose, onConfirm }: { solde: number; devise: string; onClose: () => void; onConfirm: (m: number, me: MethodeId) => void }) {
  const [montant, setMontant] = useState("");
  const [methode, setMethode] = useState<MethodeId>("mobile_money");
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0f0f0f] z-[500] flex items-center justify-center p-5"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
        transition={{ duration: 0.18 }}
        className="bg-[#16161c] border border-[#22222c] rounded-2xl w-full max-w-md shadow-[0_30px_80px_#00000099] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#22222c] flex justify-between items-center">
          <div>
            <h3 className={`m-0 ${TEXT.sm} font-bold text-white`}>Retirer des fonds</h3>
            <p className={`m-0 mt-0.5 ${TEXT.xs} text-[#55555e]`}>Dispo : {fmt(solde, devise)}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-[#2a2a34] border-none text-white flex items-center justify-center cursor-pointer"><X size={13} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-5">
          <div>
            <p className={`m-0 mb-2 ${TEXT.label} text-[#55555e] font-semibold uppercase tracking-wider`}>Montant ({devise})</p>
            <input type="number" value={montant} onChange={e => setMontant(e.target.value)} placeholder="0" max={solde}
              className={`w-full bg-[#1c1c24] border border-[#22222c] rounded-xl px-4 py-3 text-white ${TEXT.sm} outline-none focus:border-[#FE686460] box-border`} />
            <div className="flex gap-2 mt-2">
              {[25, 50, 75, 100].map(pct => (
                <button key={pct} onClick={() => setMontant(String(Math.floor(solde * pct / 100)))}
                  className={`flex-1 py-1.5 rounded-lg border border-[#22222c] bg-transparent text-[#9090a0] ${TEXT.xs} cursor-pointer hover:border-[#FE686460] hover:text-[#FE6864] transition-all`}>{pct}%</button>
              ))}
            </div>
            {montant && Number(montant) > solde && (
              <div className={`flex items-center gap-1.5 mt-2 ${TEXT.xs} text-red-400`}><AlertCircle size={12} /> Montant supérieur au solde</div>
            )}
          </div>
          <div>
            <p className={`m-0 mb-2 ${TEXT.label} text-[#55555e] font-semibold uppercase tracking-wider`}>Vers quel compte ?</p>
            <div className="flex flex-col gap-2">
              {methodesMock.map(m => (
                <button key={m.id} onClick={() => setMethode(m.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-left ${methode === m.id ? "border-[#FE686460] bg-[#FE686410]" : "border-[#22222c] bg-transparent hover:border-[#33333e]"}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: m.color + "20", color: m.color }}>{m.icon}</div>
                  <div className="flex-1"><div className={`${TEXT.sm} font-semibold text-white`}>{m.label}</div><div className={`${TEXT.xs} text-[#55555e]`}>{m.detail}</div></div>
                  {methode === m.id && <Check size={15} className="text-[#FE6864] shrink-0" />}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2.5 pt-1">
            <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl border border-[#22222c] bg-transparent text-[#55555e] ${TEXT.sm} cursor-pointer`}>Annuler</button>
            <button onClick={() => { const v = Number(montant); if (v > 0 && v <= solde) { onConfirm(v, methode); onClose(); } }}
              disabled={!montant || Number(montant) <= 0 || Number(montant) > solde}
              className={`flex-1 py-2.5 rounded-xl border-none font-bold ${TEXT.sm} transition-all ${montant && Number(montant) > 0 && Number(montant) <= solde ? "bg-[#FE6864] text-white cursor-pointer" : "bg-[#2a2a34] text-[#55555e] cursor-not-allowed"}`}>
              Confirmer le retrait
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page principale ───────────────────────────────────────
export default function WalletPage() {
  const { user } = useUser();

  const isFreelancer = user != null && "id_freelancer" in user;
  const userId = isFreelancer
    ? (user as { id_freelancer: number }).id_freelancer
    : user && "id_client" in user ? (user as { id_client: number }).id_client : null;

  const walletFound: WalletType | undefined = walletsMock.find(w =>
    isFreelancer ? w.id_freelancer === userId : w.id_client === userId
  );

  const [wallet, setWallet] = useState<WalletType>(
    walletFound ?? { id_wallet: 0, id_client: isFreelancer ? null : (userId ?? null), id_freelancer: isFreelancer ? (userId ?? null) : null, montant: 0, devise: "XAF" }
  );

  const initTx = useMemo(() => userId ? buildTransactions(userId, isFreelancer, wallet.devise) : [], []);
  const [transactions, setTransactions] = useState<Transaction[]>(initTx);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showRetrait,  setShowRetrait]  = useState(false);
  const [filtreType,   setFiltreType]   = useState<"tout" | TxType>("tout");
  const [showSolde,    setShowSolde]    = useState(true);
  const [showAll,      setShowAll]      = useState(false);

  const stats = useMemo(() => {
    const credits = transactions.filter(t => t.type === "credit"  && t.statut === "complete");
    const debits  = transactions.filter(t => t.type === "debit"   && t.statut === "complete");
    return {
      entrees: credits.reduce((a, t) => a + t.montant, 0),
      sorties: debits.reduce((a, t)  => a + Math.abs(t.montant), 0),
      pending: transactions.filter(t => t.statut === "en_cours").length,
    };
  }, [transactions]);

  const allFiltered = useMemo(() =>
    filtreType === "tout" ? transactions : transactions.filter(t => t.type === filtreType),
    [transactions, filtreType]
  );
  const displayed = showAll ? allFiltered : allFiltered.slice(0, 6);

  const handleRecharge = (montant: number, methode: MethodeId) => {
    setWallet(w => ({ ...w, montant: w.montant + montant }));
    setTransactions(p => [{ id: Date.now(), label: "Dépôt de fonds", sous_label: methodesMock.find(m => m.id === methode)?.label ?? "", montant, devise: wallet.devise, type: "credit" as TxType, date: new Date().toLocaleDateString("fr-FR"), methode: methodesMock.find(m => m.id === methode)?.label ?? "", statut: "complete" as const }, ...p]);
  };

  const handleRetrait = (montant: number, methode: MethodeId) => {
    setWallet(w => ({ ...w, montant: w.montant - montant }));
    setTransactions(p => [{ id: Date.now(), label: "Retrait de fonds", sous_label: methodesMock.find(m => m.id === methode)?.label ?? "", montant: -montant, devise: wallet.devise, type: "debit" as TxType, date: new Date().toLocaleDateString("fr-FR"), methode: methodesMock.find(m => m.id === methode)?.label ?? "", statut: "en_cours" as const }, ...p]);
  };

  const exportCSV = () => {
    const rows = [["ID","Label","Montant","Devise","Type","Date","Méthode","Statut"], ...transactions.map(t => [t.id,t.label,t.montant,t.devise,t.type,t.date,t.methode,t.statut])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
  };

  return (
    <div className="min-h-screen bg-[#111116] text-white font-sans">
      <div className="bg-[#16161c] border-b border-[#1e1e26] px-7 h-14 flex items-center gap-3 sticky top-0 z-[100]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FE6864] flex items-center justify-center shrink-0"><Wallet size={14} className="text-white" /></div>
          <h1 className={`m-0 ${TEXT.head} font-extrabold text-white`}>Mon Wallet <span className={`ml-1 ${TEXT.badge} font-semibold text-[#55555e] uppercase tracking-wider`}>{isFreelancer ? "Freelancer" : "Client"}</span></h1>
        </div>
        <div className="ml-auto">
          <button onClick={exportCSV} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#22222c] bg-transparent text-[#55555e] ${TEXT.xs} cursor-pointer hover:text-white transition-colors`}>
            <Download size={13} /> Exporter
          </button>
        </div>
      </div>

      <div className=" px-6 py-6 flex flex-col gap-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Carte solde */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FE6864] via-[#e8524e] to-[#c43e3b] p-6 flex flex-col justify-between shadow-[0_8px_40px_#FE686440]">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10 translate-y-12 -translate-x-8" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className={`m-0 ${TEXT.xs} text-white/60 uppercase tracking-wider font-semibold`}>Solde disponible</p>
                  <p className={`m-0 ${TEXT.badge} text-white/50 mt-0.5`}>{wallet.devise}</p>
                </div>
                <button onClick={() => setShowSolde(v => !v)} className="w-8 h-8 rounded-lg bg-white/10 border-none text-white/70 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                  {showSolde ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="flex gap-2 w-full justify-between">
              <div className="">
                <span className={`font-black tracking-tight text-white ${TEXT.hero}`}>{showSolde ? wallet.montant.toLocaleString("fr-FR") : "••••••"}</span>
                <span className={`ml-2 ${TEXT.sm} text-white/60 font-medium`}>{wallet.devise}</span>
              </div>
              <div className="flex gap-2 ">
                <button onClick={() => setShowRecharge(true)} className={`flex-1 px-3 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white text-[#c43e3b] font-bold ${TEXT.xs} cursor-pointer border-none hover:bg-white/90 transition-all`}>
                  <Plus size={14} /> 
                </button>
                {isFreelancer && (
                  <button onClick={() => setShowRetrait(true)} className={`flex-1 px-3 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/15 text-white font-bold ${TEXT.xs} cursor-pointer border border-white/20 hover:bg-white/25 transition-all`}>
                    <ArrowUpRight size={14} /> 
                  </button>
                )}
              </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Entrées totales", val: stats.entrees, icon: <ArrowDownLeft size={16} />, color: "text-emerald-400", border: "border-emerald-400/20", bg: "bg-emerald-400/10", trend: <TrendingUp size={12} />,   trendLabel: "+12% ce mois", isCount: false },
              { label: "Sorties totales", val: stats.sorties, icon: <ArrowUpRight size={16} />,  color: "text-red-400",     border: "border-red-400/20",     bg: "bg-red-400/10",     trend: <TrendingDown size={12} />, trendLabel: "-3% ce mois",  isCount: false },
              { label: "En attente",      val: stats.pending, icon: <Clock size={16} />,         color: "text-amber-400",   border: "border-amber-400/20",   bg: "bg-amber-400/10",   trend: null, trendLabel: `transaction${stats.pending > 1 ? "s" : ""}`, isCount: true },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.08 * (i + 1) }}
                className={`bg-[#1B1B1D] border ${s.border} rounded-2xl p-5 flex flex-col gap-3`}>
                <div className="flex justify-between items-start">
                  <p className={`m-0 ${TEXT.xs} text-[#55555e] font-medium`}>{s.label}</p>
                  <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}>{s.icon}</div>
                </div>
                <div>
                  {s.isCount
                    ? <span className={`text-3xl font-black ${s.color}`}>{s.val}</span>
                    : <span className="text-2xl font-black text-white">{showSolde ? s.val.toLocaleString("fr-FR") : "••••"}<span className={`ml-1 ${TEXT.xs} text-[#55555e]`}>{wallet.devise}</span></span>
                  }
                </div>
                <div className={`flex items-center gap-1 ${TEXT.xs} ${s.color}`}>{s.trend} {s.trendLabel}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Méthodes */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-[#1B1B1D] border border-[#22222c] rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className={`m-0 ${TEXT.sm} font-bold text-white`}>Moyens de paiement</h2>
              <button className={`${TEXT.xs} text-[#FE6864] bg-none border-none cursor-pointer font-semibold`}>+ Ajouter</button>
            </div>
            <div className="flex flex-col gap-2">
              {methodesMock.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#0f0f0f] border border-[#22222c] hover:border-[#33333e] transition-colors group cursor-pointer">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: m.color + "20", color: m.color }}>{m.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`${TEXT.sm} font-semibold text-white`}>{m.label}</div>
                    <div className={`${TEXT.xs} text-[#55555e]`}>{m.detail}</div>
                  </div>
                  <ChevronRight size={14} className="text-[#3a3a46] group-hover:text-[#55555e] transition-colors shrink-0" />
                </div>
              ))}
            </div>
            <div className="border-t border-[#22222c] pt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setShowRecharge(true)} className={`flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FE686418] border border-[#FE686430] text-[#FE6864] ${TEXT.xs} font-semibold cursor-pointer hover:bg-[#FE686425] transition-colors`}>
                <Plus size={13} /> Recharger
              </button>
              {isFreelancer && (
                <button onClick={() => setShowRetrait(true)} className={`flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-[#22222c] text-[#9090a0] ${TEXT.xs} font-semibold cursor-pointer hover:text-white transition-colors`}>
                  <ArrowUpRight size={13} /> Retirer
                </button>
              )}
            </div>
          </motion.div>

          {/* Historique */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-2 bg-[#1B1B1D] border border-[#22222c] rounded-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[#22222c] flex justify-between items-center flex-wrap gap-3">
              <h2 className={`m-0 ${TEXT.sm} font-bold text-white`}>Historique des transactions</h2>
              <div className="flex items-center gap-2">
                <Filter size={12} className="text-[#55555e]" />
                <div className="flex gap-1">
                  {(["tout", "credit", "debit", "pending"] as const).map(f => {
                    const labels = { tout: "Tout", credit: "Entrées", debit: "Sorties", pending: "En attente" };
                    const isA = filtreType === f;
                    return (
                      <button key={f} onClick={() => { setFiltreType(f); setShowAll(false); }}
                        className={`px-2.5 py-1 rounded-lg ${TEXT.xs} border cursor-pointer transition-all ${isA ? "bg-[#FE686418] border-[#FE686450] text-[#FE6864] font-semibold" : "bg-transparent border-[#22222c] text-[#55555e] hover:text-white"}`}>
                        {labels[f]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {displayed.map((tx, idx) => {
                  const isCredit = tx.type === "credit";
                  const sCfg = statutTxCfg[tx.statut];
                  return (
                    <motion.div key={tx.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15, delay: idx * 0.03 }}
                      className={`flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors ${idx < displayed.length - 1 ? "border-b border-[#1e1e26]" : ""}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.statut === "echec" ? "bg-red-500/10 text-red-400" : tx.statut === "en_cours" ? "bg-amber-400/10 text-amber-400" : isCredit ? "bg-emerald-400/10 text-emerald-400" : "bg-[#FE686410] text-[#FE6864]"}`}>
                        {tx.statut === "echec" ? <AlertCircle size={16} /> : tx.statut === "en_cours" ? <Clock size={16} /> : isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`${TEXT.sm} font-semibold text-white truncate`}>{tx.label}</div>
                        <div className={`${TEXT.xs} text-[#55555e] truncate`}>{tx.sous_label}</div>
                      </div>
                      <div className="hidden sm:block text-center shrink-0">
                        <div className={`${TEXT.xs} text-[#55555e]`}>{tx.methode}</div>
                        <div className={`${TEXT.badge} text-[#3a3a46]`}>{tx.date}</div>
                      </div>
                      <span className={`hidden sm:inline-flex items-center ${TEXT.badge} font-semibold px-2 py-0.5 rounded-full ${sCfg.bg} ${sCfg.color} shrink-0`}>{sCfg.label}</span>
                      <div className="text-right shrink-0">
                        <div className={`${TEXT.sm} font-bold ${tx.statut === "echec" ? "text-[#55555e] line-through" : tx.statut === "en_cours" ? "text-amber-400" : isCredit ? "text-emerald-400" : "text-[#FE6864]"}`}>
                          {isCredit ? "+" : ""}{showSolde ? fmt(tx.montant, tx.devise) : "••••"}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {displayed.length === 0 && (
                <div className="py-16 text-center text-[#55555e]">
                  <Wallet size={32} className="opacity-20 mx-auto mb-3" />
                  <p className={`m-0 ${TEXT.sm}`}>Aucune transaction.</p>
                </div>
              )}
            </div>
            {!showAll && allFiltered.length > 6 && (
              <div className="px-5 py-3 border-t border-[#22222c] text-center">
                <button onClick={() => setShowAll(true)} className={`${TEXT.xs} text-[#FE6864] bg-none border-none cursor-pointer font-semibold`}>Voir tout ({allFiltered.length}) →</button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showRecharge && <ModalRecharge devise={wallet.devise} onClose={() => setShowRecharge(false)} onConfirm={handleRecharge} />}
        {showRetrait  && <ModalRetrait  solde={wallet.montant} devise={wallet.devise} onClose={() => setShowRetrait(false)}  onConfirm={handleRetrait} />}
      </AnimatePresence>
    </div>
  );
}
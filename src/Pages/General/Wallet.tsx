import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, Plus, ArrowDownLeft, ArrowUpRight, CreditCard,
  Smartphone, Building2, X, Check, ChevronRight,
  TrendingUp, TrendingDown, Clock, Filter, Download,
  Eye, EyeOff, RefreshCw, AlertCircle,
} from "lucide-react";
import { useUser } from "../../Context/UtilisateurContext";
import type { Wallet as WalletType } from "../../Type";

// ── Tailles de texte — modifiez ici ──────────────────────
const TEXT = {
  xs: "text-sm lg:text-base",
  sm: "text-sm lg:text-base",
  badge: "text-xs lg:text-sm",
  sub: "text-xs lg:text-sm",
  label: "text-xs lg:text-sm",
  head: "text-sm lg:text-base",
  stat: "text-sm lg:text-base",
  base:  "text-base lg:text-lg",
  lg:    "text-base lg:text-lg",
  xl:    "text-base lg:text-lg",
  
  hero:  "text-4xl",      // solde principal
  
};

// ── Types ─────────────────────────────────────────────────
type TxType = "credit" | "debit" | "pending";
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

type MethodeKey = "mobile_money" | "carte_visa" | "paypal" | "compte_bancaire";
interface MethodePaiement {
  id: MethodeKey;
  label: string;
  detail: string;
  icon: React.ReactNode;
  color: string;
}

// ── Mock wallet ───────────────────────────────────────────
const walletMock: WalletType = {
  id_wallet: 1,
  id_client: null,
  id_freelancer: 1,
  montant: 180000,
  devise: "FCFA",
};

const transactionsMock: Transaction[] = [
  { id: 1,  label: "Paiement de Alain Dev",    sous_label: "Projet site vitrine",        montant:  250000, devise: "FCFA", type: "credit",  date: "10 mai 2024", methode: "Mobile Money",   statut: "complete" },
  { id: 2,  label: "Frais de service",          sous_label: "Commission MBOKA 5%",        montant:  -12500, devise: "FCFA", type: "debit",   date: "10 mai 2024", methode: "Automatique",    statut: "complete" },
  { id: 3,  label: "Paiement de Sarah D.",      sous_label: "Rédaction articles SEO",     montant:   75000, devise: "FCFA", type: "credit",  date: "08 mai 2024", methode: "Carte Visa",     statut: "complete" },
  { id: 4,  label: "Retrait vers Mobile Money", sous_label: "Orange Money •••• 0098",     montant: -100000, devise: "FCFA", type: "debit",   date: "06 mai 2024", methode: "Mobile Money",   statut: "complete" },
  { id: 5,  label: "Dépôt par carte Visa",      sous_label: "Visa •••• 4242",             montant:  100000, devise: "FCFA", type: "credit",  date: "15 mai 2024", methode: "Carte Visa",     statut: "complete" },
  { id: 6,  label: "Paiement de Kevin L.",      sous_label: "Développement web",          montant:  320000, devise: "FCFA", type: "credit",  date: "02 mai 2024", methode: "PayPal",         statut: "complete" },
  { id: 7,  label: "Retrait compte bancaire",   sous_label: "LCB •••• 1234",              montant: -150000, devise: "FCFA", type: "debit",   date: "28 avr 2024", methode: "Virement",       statut: "complete" },
  { id: 8,  label: "Paiement de Grace M.",      sous_label: "Design logo branding",       montant:   45000, devise: "FCFA", type: "credit",  date: "25 avr 2024", methode: "Mobile Money",   statut: "complete" },
  { id: 9,  label: "Virement en attente",       sous_label: "Traitement en cours…",       montant:   60000, devise: "FCFA", type: "pending", date: "Aujourd'hui", methode: "Virement",       statut: "en_cours" },
  { id: 10, label: "Paiement échoué",           sous_label: "Fonds insuffisants",         montant:  -20000, devise: "FCFA", type: "debit",   date: "22 avr 2024", methode: "Carte Visa",     statut: "echec"    },
];

const methodesMock: MethodePaiement[] = [
  { id: "mobile_money",    label: "Mobile Money",    detail: "Orange •••• 0098", icon: <Smartphone size={16} />,   color: "#f59e0b" },
  { id: "carte_visa",      label: "Carte Visa",      detail: "•••• 4242",        icon: <CreditCard size={16} />,   color: "#3b82f6" },
  { id: "paypal",          label: "PayPal",          detail: "user@email.com",   icon: <span className="font-black text-[13px]">P</span>, color: "#0ea5e9" },
  { id: "compte_bancaire", label: "Compte bancaire", detail: "LCB •••• 1234",    icon: <Building2 size={16} />,    color: "#8b5cf6" },
];

// ── Statut config ─────────────────────────────────────────
const statutCfg = {
  complete: { label: "Complété", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  en_cours: { label: "En cours", color: "text-amber-400",   bg: "bg-amber-400/10"   },
  echec:    { label: "Échoué",   color: "text-red-400",     bg: "bg-red-400/10"     },
};

// ── Helpers ───────────────────────────────────────────────
const fmt = (n: number, devise: string) =>
  `${Math.abs(n).toLocaleString("fr-FR")} ${devise}`;

// ── Modal Recharge ────────────────────────────────────────
function ModalRecharge({ devise, onClose, onConfirm }: {
  devise: string;
  onClose: () => void;
  onConfirm: (montant: number, methode: MethodeKey) => void;
}) {
  const [montant, setMontant] = useState("");
  const [methode, setMethode] = useState<MethodeKey>("mobile_money");
  const rapides = [10000, 25000, 50000, 100000];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 z-500 flex items-center justify-center p-5"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
        transition={{ duration: 0.18 }}
        className="bg-[#16161c] border border-[#22222c] rounded-2xl w-full max-w-md shadow-[0_30px_80px_#00000099] overflow-hidden">

        <div className="px-6 py-5 border-b border-[#22222c] flex justify-between items-center">
          <div>
            <h3 className={`m-0 ${TEXT.sm} font-bold text-white`}>Ajouter des fonds</h3>
            <p className={`m-0 mt-0.5 ${TEXT.xs} text-[#55555e]`}>Rechargez votre wallet MBOKA</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-[#2a2a34] border-none text-white flex items-center justify-center cursor-pointer">
            <X size={13} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Montant */}
          <div>
            <p className={`m-0 mb-2 ${TEXT.label} text-[#55555e] font-semibold uppercase tracking-wider`}>Montant ({devise})</p>
            <input
              type="number"
              value={montant}
              onChange={e => setMontant(e.target.value)}
              placeholder="0"
              className={`w-full border  border-white/10 bg-[#202023]  rounded-xl px-4 py-3 text-white ${TEXT.sm} outline-none focus:border-[#FE686460] box-border`}
            />
            <div className="flex gap-2 mt-2">
              {rapides.map(v => (
                <button key={v} onClick={() => setMontant(String(v))}
                  className={`flex-1 py-1.5 rounded-lg border border-[#22222c] bg-transparent text-[#9090a0] ${TEXT.xs} cursor-pointer hover:border-[#FE686460] hover:text-[#FE6864] transition-all`}>
                  {(v / 1000)}k
                </button>
              ))}
            </div>
          </div>

          {/* Méthode */}
          <div>
            <p className={`m-0 mb-2 ${TEXT.label} text-[#55555e] font-semibold uppercase tracking-wider`}>Méthode de paiement</p>
            <div className="flex flex-col gap-2">
              {methodesMock.map(m => (
                <button key={m.id} onClick={() => setMethode(m.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-left
                    ${methode === m.id ? "border-[#FE686460] bg-[#FE686410]" : "border-white/10 bg-transparent hover:border-[#33333e]"}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}
                    style={{ background: m.color + "20", color: m.color }}>
                    {m.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`${TEXT.sm} font-semibold text-white`}>{m.label}</div>
                    <div className={`${TEXT.xs} text-[#55555e]`}>{m.detail}</div>
                  </div>
                  {methode === m.id && <Check size={15} className="text-[#FE6864] shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl border border-[#22222c] bg-transparent text-[#55555e] ${TEXT.sm} cursor-pointer`}>
              Annuler
            </button>
            <button
              onClick={() => { if (Number(montant) > 0) { onConfirm(Number(montant), methode); onClose(); } }}
              disabled={!montant || Number(montant) <= 0}
              className={`flex-1 py-2.5 rounded-xl border-none font-bold ${TEXT.sm} transition-all
                ${montant && Number(montant) > 0
                  ? "bg-[#FE6864] text-white cursor-pointer shadow-[0_4px_20px_#FE686440]"
                  : "bg-[#2a2a34] text-[#55555e] cursor-not-allowed"}`}>
              Confirmer le dépôt
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Modal Retrait ─────────────────────────────────────────
function ModalRetrait({ solde, devise, onClose, onConfirm }: {
  solde: number;
  devise: string;
  onClose: () => void;
  onConfirm: (montant: number, methode: MethodeKey) => void;
}) {
  const [montant, setMontant] = useState("");
  const [methode, setMethode] = useState<MethodeKey>("mobile_money");
  const pourcentages = [25, 50, 75, 100];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 z-500 flex items-center justify-center p-5"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
        transition={{ duration: 0.18 }}
        className="bg-[#16161c] border border-[#22222c] rounded-2xl w-full max-w-md shadow-[0_30px_80px_#00000099] overflow-hidden">

        <div className="px-6 py-5 border-b border-[#22222c] flex justify-between items-center">
          <div>
            <h3 className={`m-0 ${TEXT.sm} font-bold text-white`}>Retirer des fonds</h3>
            <p className={`m-0 mt-0.5 ${TEXT.xs} text-[#55555e]`}>Solde disponible : {fmt(solde, devise)}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-[#2a2a34] border-none text-white flex items-center justify-center cursor-pointer">
            <X size={13} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          <div>
            <p className={`m-0 mb-2 ${TEXT.label} text-[#55555e] font-semibold uppercase tracking-wider`}>Montant à retirer ({devise})</p>
            <input
              type="number"
              value={montant}
              onChange={e => setMontant(e.target.value)}
              placeholder="0"
              max={solde}
              className={`w-full border  border-white/10 bg-[#202023]  rounded-xl px-4 py-3 text-white ${TEXT.sm} outline-none focus:border-[#FE686460] box-border`}
            />
            <div className="flex gap-2 mt-2">
              {pourcentages.map(pct => (
                <button key={pct} onClick={() => setMontant(String(Math.floor(solde * pct / 100)))}
                  className={`flex-1 py-1.5 rounded-lg border border-white/10 bg-transparent text-[#9090a0] ${TEXT.xs} cursor-pointer hover:border-[#FE686460] hover:text-[#FE6864] transition-all`}>
                  {pct}%
                </button>
              ))}
            </div>
            {montant && Number(montant) > solde && (
              <div className={`flex items-center gap-1.5 mt-2 ${TEXT.xs} text-red-400`}>
                <AlertCircle size={12} /> Montant supérieur au solde disponible
              </div>
            )}
          </div>

          <div>
            <p className={`m-0 mb-2 ${TEXT.label} text-[#55555e] font-semibold uppercase tracking-wider`}>Vers quel compte ?</p>
            <div className="flex flex-col gap-2">
              {methodesMock.map(m => (
                <button key={m.id} onClick={() => setMethode(m.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all text-left
                    ${methode === m.id ? "border-[#FE686460] bg-[#FE686410]" : "border-white/10 bg-transparent hover:border-[#33333e]"}`}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: m.color + "20", color: m.color }}>
                    {m.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`${TEXT.sm} font-semibold text-white`}>{m.label}</div>
                    <div className={`${TEXT.xs} text-[#55555e]`}>{m.detail}</div>
                  </div>
                  {methode === m.id && <Check size={15} className="text-[#FE6864] shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl border border-[#22222c] bg-transparent text-[#55555e] ${TEXT.sm} cursor-pointer`}>
              Annuler
            </button>
            <button
              onClick={() => {
                const v = Number(montant);
                if (v > 0 && v <= solde) { onConfirm(v, methode); onClose(); }
              }}
              disabled={!montant || Number(montant) <= 0 || Number(montant) > solde}
              className={`flex-1 py-2.5 rounded-xl border-none font-bold ${TEXT.sm} transition-all
                ${montant && Number(montant) > 0 && Number(montant) <= solde
                  ? "bg-[#FE6864] text-white cursor-pointer shadow-[0_4px_20px_#FE686440]"
                  : "bg-[#2a2a34] text-[#55555e] cursor-not-allowed"}`}>
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
  const isFreelancer = user && "id_freelancer" in user;

  const [wallet, setWallet] = useState<WalletType>(walletMock);
  const [transactions, setTransactions] = useState<Transaction[]>(transactionsMock);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showRetrait, setShowRetrait] = useState(false);
  const [filtreType, setFiltreType] = useState<"tout" | TxType>("tout");
  const [showSolde, setShowSolde] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Stats
  const stats = useMemo(() => {
    const credits = transactions.filter(t => t.type === "credit" && t.statut === "complete");
    const debits  = transactions.filter(t => t.type === "debit"  && t.statut === "complete");
    return {
      entrees:  credits.reduce((a, t) => a + t.montant, 0),
      sorties:  debits.reduce((a, t)  => a + Math.abs(t.montant), 0),
      pending:  transactions.filter(t => t.statut === "en_cours").length,
    };
  }, [transactions]);

  const filtered = useMemo(() => {
    const list = filtreType === "tout" ? transactions : transactions.filter(t => t.type === filtreType);
    return showAll ? list : list.slice(0, 6);
  }, [transactions, filtreType, showAll]);

  const handleRecharge = (montant: number, _methode: MethodeKey) => {
    setWallet(w => ({ ...w, montant: w.montant + montant }));
    const tx: Transaction = {
      id: Date.now(), label: "Dépôt de fonds", sous_label: methodesMock.find(m => m.id === _methode)?.label ?? "",
      montant, devise: wallet.devise, type: "credit",
      date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
      methode: methodesMock.find(m => m.id === _methode)?.label ?? "",
      statut: "complete",
    };
    setTransactions(p => [tx, ...p]);
  };

  const handleRetrait = (montant: number, _methode: MethodeKey) => {
    setWallet(w => ({ ...w, montant: w.montant - montant }));
    const tx: Transaction = {
      id: Date.now(), label: "Retrait de fonds", sous_label: methodesMock.find(m => m.id === _methode)?.label ?? "",
      montant: -montant, devise: wallet.devise, type: "debit",
      date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
      methode: methodesMock.find(m => m.id === _methode)?.label ?? "",
      statut: "en_cours",
    };
    setTransactions(p => [tx, ...p]);
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Label", "Montant", "Devise", "Type", "Date", "Méthode", "Statut"],
      ...transactions.map(t => [t.id, t.label, t.montant, t.devise, t.type, t.date, t.methode, t.statut]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
  };

  return (
    <div className="min-h-screen bg-[#111116] text-white font-sans">
      {/* Top bar */}
      <div className="bg-[#16161c] border-b border-[#1e1e26] px-7 h-14 flex items-center gap-3 sticky top-0 z-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FE6864] flex items-center justify-center shrink-0">
            <Wallet size={14} className="text-white" />
          </div>
          <h1 className={`m-0 ${TEXT.sm} font-extrabold text-white`}>
            Mon Wallet
            <span className={`ml-2 ${TEXT.badge} font-semibold text-[#55555e] uppercase tracking-wider`}>
              {isFreelancer ? "Freelancer" : "Client"}
            </span>
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={exportCSV}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#22222c] bg-transparent text-[#55555e] ${TEXT.xs} cursor-pointer hover:text-white transition-colors`}>
            <Download size={13} /> Exporter
          </button>
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#22222c] bg-transparent text-[#55555e] ${TEXT.xs} cursor-pointer hover:text-white transition-colors`}>
            <RefreshCw size={13} /> Actualiser
          </button>
        </div>
      </div>

      <div className="max-w-300 mx-auto px-6 py-6 flex flex-col gap-5">

        {/* ── Ligne 1 : Hero solde + stats ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Carte solde principale */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="lg:col-span-1 relative overflow-hidden rounded-2xl bg-linear-to-br from-[#FE6864] via-[#e8524e] to-[#c43e3b] p-6 flex flex-col justify-between min-h-50 shadow-[0_8px_40px_#FE686440]"
          >
            {/* Décors de fond */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10 translate-y-12 -translate-x-8" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className={`m-0 ${TEXT.xs} text-white/60 uppercase tracking-wider font-semibold`}>Solde disponible</p>
                  <p className={`m-0 ${TEXT.badge} text-white/50 mt-0.5`}>{wallet.devise}</p>
                </div>
                <button onClick={() => setShowSolde(v => !v)}
                  className="w-8 h-8 rounded-lg bg-white/10 border-none text-white/70 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                  {showSolde ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <div className="mb-6">
                <span className={`font-black tracking-tight text-white ${TEXT.hero}`}>
                  {showSolde ? wallet.montant.toLocaleString("fr-FR") : "••••••"}
                </span>
                <span className={`ml-2 ${TEXT.sm} text-white/60 font-medium`}>{wallet.devise}</span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setShowRecharge(true)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white text-[#c43e3b] font-bold ${TEXT.xs} cursor-pointer border-none transition-all hover:bg-white/90`}>
                  <Plus size={14} /> Ajouter des fonds
                </button>
                {isFreelancer && (
                  <button onClick={() => setShowRetrait(true)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/15 text-white font-bold ${TEXT.xs} cursor-pointer border border-white/20 transition-all hover:bg-white/25`}>
                    <ArrowUpRight size={14} /> Retirer
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Entrées totales",
                val: stats.entrees,
                icon: <ArrowDownLeft size={16} />,
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
                border: "border-emerald-400/20",
                trend: <TrendingUp size={12} />,
                trendLabel: "+12% ce mois",
              },
              {
                label: "Sorties totales",
                val: stats.sorties,
                icon: <ArrowUpRight size={16} />,
                color: "text-red-400",
                bg: "bg-red-400/10",
                border: "border-red-400/20",
                trend: <TrendingDown size={12} />,
                trendLabel: "-3% ce mois",
              },
              {
                label: "En attente",
                val: stats.pending,
                isCount: true,
                icon: <Clock size={16} />,
                color: "text-amber-400",
                bg: "bg-amber-400/10",
                border: "border-amber-400/20",
                trend: null,
                trendLabel: `transaction${stats.pending > 1 ? "s" : ""}`,
              },
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 * (i + 1) }}
                className={` border-white/10 bg-[#202023] border ${s.border} rounded-2xl p-5 flex flex-col gap-3`}>
                <div className="flex justify-between items-start">
                  <p className={`m-0 ${TEXT.xs} text-[#55555e] font-medium`}>{s.label}</p>
                  <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}>
                    {s.icon}
                  </div>
                </div>
                <div>
                  {s.isCount
                    ? <span className={`text-3xl font-black ${s.color}`}>{s.val}</span>
                    : <span className={`text-2xl font-black text-white`}>
                        {showSolde ? s.val.toLocaleString("fr-FR") : "••••"}
                        <span className={`ml-1 ${TEXT.xs} text-[#55555e]`}>{wallet.devise}</span>
                      </span>
                  }
                </div>
                <div className={`flex items-center gap-1 ${TEXT.xs} ${s.color}`}>
                  {s.trend} {s.trendLabel}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Ligne 2 : Méthodes + Historique ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Méthodes de paiement */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}
            className="lg:col-span-1 bg-[#16161c] border border-[#22222c] rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className={`m-0 ${TEXT.sm} font-bold text-white`}>Moyens de paiement</h2>
              <button className={`${TEXT.xs} text-[#FE6864] bg-none border-none cursor-pointer font-semibold`}>
                + Ajouter
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {methodesMock.map(m => (
                <div key={m.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#1c1c24] border border-[#22222c] hover:border-[#33333e] transition-colors group cursor-pointer">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: m.color + "20", color: m.color }}>
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`${TEXT.sm} font-semibold text-white`}>{m.label}</div>
                    <div className={`${TEXT.xs} text-[#55555e]`}>{m.detail}</div>
                  </div>
                  <ChevronRight size={14} className="text-[#3a3a46] group-hover:text-[#55555e] transition-colors shrink-0" />
                </div>
              ))}
            </div>

            {/* Mini actions rapides */}
            <div className="border-t border-[#22222c] pt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setShowRecharge(true)}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FE686418] border border-[#FE686430] text-[#FE6864] ${TEXT.xs} font-semibold cursor-pointer hover:bg-[#FE686425] transition-colors`}>
                <Plus size={13} /> Recharger
              </button>
              {isFreelancer && (
                <button onClick={() => setShowRetrait(true)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#ffffff08] border border-[#22222c] text-[#9090a0] ${TEXT.xs} font-semibold cursor-pointer hover:text-white transition-colors`}>
                  <ArrowUpRight size={13} /> Retirer
                </button>
              )}
            </div>
          </motion.div>

          {/* Historique */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-2 bg-[#16161c] border border-[#22222c] rounded-2xl overflow-hidden flex flex-col">

            {/* Header historique */}
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
                        className={`px-2.5 py-1 rounded-lg ${TEXT.xs} border cursor-pointer transition-all
                          ${isA ? "bg-[#FE686418] border-[#FE686450] text-[#FE6864] font-semibold" : "bg-transparent border-[#22222c] text-[#55555e] hover:text-white"}`}>
                        {labels[f]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Transactions list */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filtered.map((tx, idx) => {
                  const isCredit = tx.type === "credit";
                  const sCfg = statutCfg[tx.statut];
                  return (
                    <motion.div key={tx.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15, delay: idx * 0.03 }}
                      className={`flex items-center gap-3 px-5 py-3.5 hover:bg-white/2 transition-colors ${idx < filtered.length - 1 ? "border-b border-[#1e1e26]" : ""}`}>

                      {/* Icône type */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                        ${tx.statut === "echec"   ? "bg-red-500/10 text-red-400" :
                          tx.statut === "en_cours" ? "bg-amber-400/10 text-amber-400" :
                          isCredit ? "bg-emerald-400/10 text-emerald-400" : "bg-[#FE686410] text-[#FE6864]"}`}>
                        {tx.statut === "echec"   ? <AlertCircle size={16} /> :
                         tx.statut === "en_cours" ? <Clock size={16} /> :
                         isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <div className={`${TEXT.sm} font-semibold text-white truncate`}>{tx.label}</div>
                        <div className={`${TEXT.xs} text-[#55555e] truncate`}>{tx.sous_label}</div>
                      </div>

                      {/* Méthode */}
                      <div className="hidden sm:block text-center">
                        <div className={`${TEXT.xs} text-[#55555e]`}>{tx.methode}</div>
                        <div className={`${TEXT.badge} text-[#3a3a46]`}>{tx.date}</div>
                      </div>

                      {/* Statut badge */}
                      <span className={`hidden sm:inline-flex items-center ${TEXT.badge} font-semibold px-2 py-0.5 rounded-full ${sCfg.bg} ${sCfg.color}`}>
                        {sCfg.label}
                      </span>

                      {/* Montant */}
                      <div className="text-right shrink-0">
                        <div className={`${TEXT.sm} font-bold
                          ${tx.statut === "echec" ? "text-[#55555e] line-through" :
                            tx.statut === "en_cours" ? "text-amber-400" :
                            isCredit ? "text-emerald-400" : "text-[#FE6864]"}`}>
                          {isCredit ? "+" : ""}{showSolde ? fmt(tx.montant, tx.devise) : "••••"}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filtered.length === 0 && (
                <div className="py-16 text-center text-[#55555e]">
                  <Wallet size={32} className="opacity-20 mx-auto mb-3" />
                  <p className={`m-0 ${TEXT.sm}`}>Aucune transaction trouvée.</p>
                </div>
              )}
            </div>

            {/* Voir tout */}
            {!showAll && transactions.filter(t => filtreType === "tout" || t.type === filtreType).length > 6 && (
              <div className="px-5 py-3 border-t border-[#22222c] text-center">
                <button onClick={() => setShowAll(true)}
                  className={`${TEXT.xs} text-[#FE6864] bg-none border-none cursor-pointer font-semibold`}>
                  Voir tout →
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showRecharge && (
          <ModalRecharge
            devise={wallet.devise}
            onClose={() => setShowRecharge(false)}
            onConfirm={handleRecharge}
          />
        )}
        {showRetrait && (
          <ModalRetrait
            solde={wallet.montant}
            devise={wallet.devise}
            onClose={() => setShowRetrait(false)}
            onConfirm={handleRetrait}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
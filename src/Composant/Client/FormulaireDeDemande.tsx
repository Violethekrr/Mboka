import { useState, useRef } from "react";
import {
  X,
  ChevronDown,
  CalendarDays,
  MapPin,
  Camera,
  Plus,
  Star,
  CheckCircle,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { FormulaireProps } from "../../Type";

const typesDeService = [
  "Installation sanitaire",
  "Débouchage",
  "Réparation fuite",
  "Entretien plomberie",
  "Câblage électrique",
  "Tableau électrique",
  "Peinture intérieure",
  "Peinture extérieure",
  "Soudure portail",
  "Menuiserie",
  "Autre",
];

type FormStatus = "idle" | "loading" | "success" | "error";

export default function FormulaireDeDemande({ artisan, onClose }: FormulaireProps) {
  const [typeService, setTypeService] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [adresse, setAdresse] = useState("Pointe-Noire, Congo");
  const [date, setDate] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [status, setStatus] = useState<FormStatus>("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.slice(0, 3 - photos.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos((p) => [...p, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (i: number) =>
    setPhotos((p) => p.filter((_, idx) => idx !== i));

  const canSubmit =
    typeService.trim() !== "" &&
    description.trim().length >= 10 &&
    adresse.trim() !== "" &&
    date !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1800);
  };

  /* ── Success screen ── */
  if (status === "success") {
    return (
      <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
        <div className="bg-[#1e1e24] border border-[#2a2a32] rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_32px_80px_#00000090]">
          <div className="w-16 h-16 bg-[#FE686415] border border-[#FE686430] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-[#FE6864]" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Demande envoyée !</h3>
          <p className="text-sm text-white/50 mb-6 leading-relaxed">
            Votre demande a bien été transmise à{" "}
            <span className="text-white font-semibold">{artisan.nom}</span>.
            Vous recevrez une réponse sous peu.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#FE6864] hover:bg-[#e55a56] text-white font-bold py-3 rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-999 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-[#1e1e24] border border-[#2a2a32] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92dvh] flex flex-col shadow-[0_-16px_60px_#00000080] sm:shadow-[0_32px_80px_#00000090]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#2a2a32] shrink-0">
          <div>
            <p className="text-[10px] font-semibold text-[#FE6864] uppercase tracking-wider mb-0.5">
              Demande de devis
            </p>
            <h2 className="text-base font-black text-white">Décrire votre besoin</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#2a2a32] hover:bg-[#3a3a42] flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Artisan recap ── */}
        <div className="mx-5 mt-4 mb-1 flex items-center gap-3 bg-[#24242c] border border-[#2a2a32] rounded-2xl px-4 py-3 shrink-0">
          <img
            src={artisan.photo}
            alt={artisan.nom}
            className="w-11 h-11 rounded-xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{artisan.nom}</p>
            <p className="text-[11px] text-[#FE6864] font-medium">{artisan.metier}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-bold text-white">{artisan.note}</span>
                <span className="text-[10px] text-white/40">({artisan.avis} avis)</span>
              </div>
              {artisan.verified && (
                <CheckCircle size={11} className="text-[#FE6864]" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#1e1e22] border border-[#2a2a32] rounded-full px-2 py-0.5 shrink-0">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                artisan.disponible ? "bg-emerald-400 animate-pulse" : "bg-gray-500"
              }`}
            />
            <span className="text-[9px] font-semibold text-white/60">
              {artisan.disponible ? "Disponible" : "Occupé"}
            </span>
          </div>
        </div>

        {/* ── Scrollable form body (scrollbar cachée) ── */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 scrollbar-none">

          {/* Type de service */}
          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5">
              Type de service <span className="text-[#FE6864]">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setSelectOpen(!selectOpen)}
                className={`w-full flex items-center justify-between bg-[#24242c] border rounded-xl px-3.5 py-2.5 text-sm transition-all ${
                  selectOpen
                    ? "border-[#FE6864] shadow-[0_0_0_3px_#FE686420]"
                    : typeService
                    ? "border-[#FE686440] text-white"
                    : "border-[#2a2a32] text-white/30"
                }`}
              >
                <span className={typeService ? "text-white" : "text-white/30"}>
                  {typeService || "Sélectionner un service"}
                </span>
                <ChevronDown
                  size={15}
                  className={`text-white/40 transition-transform ${selectOpen ? "rotate-180" : ""}`}
                />
              </button>

              {selectOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#1e1e24] border border-[#2a2a32] rounded-xl shadow-[0_16px_40px_#00000080] z-50 overflow-hidden max-h-44 overflow-y-auto">
                  {typesDeService.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTypeService(t); setSelectOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        typeService === t
                          ? "text-[#FE6864] bg-[#FE686415]"
                          : "text-white/70 hover:text-white hover:bg-[#2a2a32]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5">
              Description du besoin <span className="text-[#FE6864]">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre problème ou votre besoin en détail…"
              rows={4}
              className={`w-full bg-[#24242c] border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 resize-none outline-none transition-all ${
                description.length > 0 && description.length < 10
                  ? "border-amber-500/50 focus:border-amber-500 focus:shadow-[0_0_0_3px_#F59E0B20]"
                  : description.length >= 10
                  ? "border-emerald-500/40 focus:border-emerald-500 focus:shadow-[0_0_0_3px_#10B98120]"
                  : "border-[#2a2a32] focus:border-[#FE6864] focus:shadow-[0_0_0_3px_#FE686420]"
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {description.length > 0 && description.length < 10 && (
                <p className="text-[10px] text-amber-400 flex items-center gap-1">
                  <AlertCircle size={10} /> Minimum 10 caractères
                </p>
              )}
              <span className="text-[10px] text-white/30 ml-auto">
                {description.length} car.
              </span>
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5">
              Adresse <span className="text-[#FE6864]">*</span>
            </label>
            <div className="relative">
              <MapPin
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FE6864]"
              />
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="w-full bg-[#24242c] border border-[#2a2a32] focus:border-[#FE6864] focus:shadow-[0_0_0_3px_#FE686420] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all"
              />
            </div>
          </div>

          {/* Date souhaitée */}
          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5">
              Date souhaitée <span className="text-[#FE6864]">*</span>
            </label>
            <div className="relative">
              <CalendarDays
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FE6864] pointer-events-none"
              />
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#24242c] border border-[#2a2a32] focus:border-[#FE6864] focus:shadow-[0_0_0_3px_#FE686420] rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white outline-none transition-all scheme-dark"
              />
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-xs font-bold text-white/70 mb-1.5">
              Ajouter des photos{" "}
              <span className="text-white/30 font-normal">(optionnel · max 3)</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {photos.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#2a2a32]">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}

              {photos.length < 3 && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-[#2a2a32] hover:border-[#FE686450] bg-[#24242c] hover:bg-[#FE686408] flex flex-col items-center justify-center gap-1 transition-all group"
                >
                  <Camera size={18} className="text-white/30 group-hover:text-[#FE6864] transition-colors" />
                  <Plus size={10} className="text-white/20 group-hover:text-[#FE6864]/60 transition-colors" />
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotos}
            />
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="px-5 pb-6 pt-3 border-t border-[#2a2a32] shrink-0">
          {!canSubmit && (
            <p className="text-[10px] text-white/30 text-center mb-2">
              Remplissez tous les champs obligatoires pour continuer
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || status === "loading"}
            className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm transition-all ${
              canSubmit && status !== "loading"
                ? "bg-[#FE6864] hover:bg-[#e55a56] text-white shadow-[0_4px_20px_#FE686440] active:scale-[0.98]"
                : "bg-[#2a2a32] text-white/30 cursor-not-allowed"
            }`}
          >
            {status === "loading" ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Envoi en cours…
              </>
            ) : (
              <>
                <Send size={15} />
                Envoyer la demande
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
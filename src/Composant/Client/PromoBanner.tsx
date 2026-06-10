import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PromoBanner() {
  return (
    <section className="mb-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#FE6864] via-[#e55a56] to-[#c94540] p-6 md:p-8">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />

        <div className="relative flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-white/80" />
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                Offre limitée
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white mb-1">
              Première intervention offerte
            </h3>
            <p className="text-white/70 text-sm">
              Commandez votre premier service et bénéficiez de frais de déplacement gratuits.
            </p>
          </div>

          <Link
            to="/client/services"
            className="flex items-center gap-2 bg-white hover:bg-white/90 text-[#FE6864] font-black text-sm px-5 py-3 rounded-xl transition-all no-underline shrink-0 hover:shadow-lg w-fit"
          >
            En profiter <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
import { House, BriefcaseBusiness, MessageCircle, User, Wallet } from "lucide-react";

 
import { Link } from "react-router-dom";

// ── Footer ──────────────────────────────────────────
export default function FooterBar() {

  const TEXT = {
  xs: "text-sm lg:text-base",
  sm: "text-sm lg:text-base",
  badge: "text-xs lg:text-sm",
  sub: "text-xs lg:text-sm",
  label: "text-xs lg:text-sm",
  head: "text-sm lg:text-base",
  stat: "text-sm lg:text-base",
};

const freelancerLinks = [
  {
    id: 1,
    label: "Accueil",
    route: "/freelancer",
    icon: <House size={16} />,
  },
  {
    id: 2,
    label: "Services",
    route: "/freelancer/services",
    icon: <BriefcaseBusiness size={16} />,
  },
  {
    id: 3,
    label: "Messagerie",
    route: "/freelancer/messagerie",
    icon: <MessageCircle size={16} />,
  },
  {
    id: 4,
    label: "Compte",
    route: "/freelancer/compte",
    icon: <User size={16} />,
  },
  {
    id: 5,
    label: "Wallet",
    route: "/wallet",
    icon: <Wallet size={16} />,
  },
];

  return (
    <footer className="bg-[#111114] border-t border-[#2a2a32] py-7 px-8 pb-5">
      <div className="max-w-350 mx-auto">
        <div className="flex justify-between items-start flex-wrap gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md bg-[#FE6864] flex items-center justify-center font-black text-white text-xs">
                M
              </div>
              <span className="font-extrabold text-base text-white">
                MBO<span className="text-[#FE6864]">KA</span>
              </span>
            </div>
            <p className={`${TEXT.xs} text-[#6b6b76] max-w-50 leading-relaxed m-0`}>
              La plateforme congolaise qui connecte vos projets aux meilleurs talents.
            </p>
          </div>
          <div className="flex gap-12 flex-wrap">
            {[
              { 
                title: "Navigation", 
                links: freelancerLinks.map(l => ({ label: l.label, to: l.route })) 
              },
              { 
                title: "Légal", 
                links: [
                  { label: "CGU", to: "/cgu" }, 
                  { label: "Confidentialité", to: "/confidentialite" }, 
                  { label: "Support", to: "/support" }
                ] 
              },
            ].map(col => (
              <div key={col.title}>
                <h5 className={`${TEXT.label} m-0 mb-3 font-bold text-white uppercase tracking-wide`}>
                  {col.title}
                </h5>
                <div className="flex flex-col gap-1.5">
                  {col.links.map(l => (
                    <Link 
                      key={l.to} 
                      to={l.to} 
                      className={`${TEXT.xs} text-[#6b6b76] no-underline hover:text-white transition-colors`}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-px bg-[#2a2a32] mb-4" />
        <div className="flex justify-between items-center flex-wrap gap-2">
          <span className={`${TEXT.badge} text-[#45454e]`}>
            © 2026 MBOKA — Tous droits réservés.
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span className={`${TEXT.badge} text-[#45454e]`}>
              Plateforme opérationnelle
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
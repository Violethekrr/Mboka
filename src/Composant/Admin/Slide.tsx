import { NavLink, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {LayoutDashboard,Users,Briefcase,MessageSquare,Flag,Wallet,LogOut,ChevronLeft,Menu,Settings, User,} from "lucide-react";
import { useState } from "react";
import {useUser} from "../../Context/UtilisateurContext";
import {signalementsMock} from "../../constants";
const TEXT = {
  xs: "text-sm lg:text-base",
  sm: "text-sm lg:text-base",
  badge: "text-xs lg:text-sm",
  sub: "text-xs lg:text-sm",
  label: "text-xs lg:text-sm",
  head: "text-sm lg:text-base",
  stat: "text-sm lg:text-base",
};

const adminLinks = [
  {
    id: 1,
    label: "Tableau de bord",
    route: "/administrateur",
    icon: <LayoutDashboard size={15} />,
  },
  {
    id: 2,
    label: "Clients",
    route: "/administrateur/clients",
    icon: <Users size={15} />,
  },
  {
    id: 3,
    label: "Freelancers",
    route: "/administrateur/freelancers",
    icon: <Briefcase size={15} />,
  },
  {
    id: 4,
    label: "Commentaires",
    route: "/administrateur/commentaires",
    icon: <MessageSquare size={15} />,
  },
  {
    id: 5,
    label: "Comptes signalés",
    route: "/administrateur/signales",
    icon: <Flag size={15} />,
  },
  {
    id: 6,
    label: "Wallet",
    route: "/wallet",
    icon: <Wallet size={15} />,
  },
  {
    id: 7,
    label: "Paramètres",
    route: "/administrateur/parametres",
    icon: <Settings size={15} />,
  },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  return (
    <>
      {/* Bouton ouverture */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-300 w-9 h-9 rounded-xl bg-[#FE6864] text-white flex items-center justify-center border-none cursor-pointer shadow-[0_4px_16px_#FE686440]"
        >
          <Menu size={17} />
        </button>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/70 z-200 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{
              duration: 0.25,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="fixed top-0 left-0 h-screen w-62 z-250 bg-[#111116] border-r border-[#1e1e26] flex flex-col shadow-[6px_0_40px_#00000060]"
          >
            {/* Header */}
            <div className="px-4 pt-4.5 pb-4 border-b border-[#1e1e26] flex items-center justify-between">
              <Link
                to="/administrateur"
                className="flex items-center gap-2.5 no-underline"
              >
                <div className="w-8.5 h-8.5 rounded-xl bg-[#FE6864] flex items-center justify-center font-black text-white">
                  <span className={TEXT.sm}>M</span>
                </div>

                <div>
                  <div
                    className={`font-extrabold text-white ${TEXT.sm} leading-none`}
                  >
                    MBO<span className="text-[#FE6864]">KA</span>
                  </div>

                  <div
                    className={`${TEXT.sub} text-[#55555e] mt-0.5 tracking-[0.5px]`}
                  >
                    ADMINISTRATION
                  </div>
                </div>
              </Link>

              <button
                onClick={() => setOpen(false)}
                className="bg-transparent border border-[#1e1e26] text-[#55555e] rounded-lg w-7 h-7 flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-2.5 py-2.5 flex flex-col gap-0.5 overflow-y-auto">
              <p
                className={`mx-1.5 mb-2 mt-1.5 ${TEXT.sub} text-[#55555e] font-bold uppercase tracking-[1.2px]`}
              >
                Menu principal
              </p>

              {adminLinks.map(({ id, label, route, icon }) => (
                <NavLink
                  key={id}
                  to={route}
                  end={route === "/administrateur"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.25 rounded-xl no-underline ${TEXT.sm} transition-all duration-150 ${
                      isActive
                        ? "font-semibold text-[#FE6864] bg-[#FE686418] border-l-2 border-[#FE6864]"
                        : "font-normal text-[#9090a0] bg-transparent border-l-2 border-transparent hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`shrink-0 ${
                          isActive ? "opacity-100" : "opacity-60"
                        }`}
                      >
                        {icon}
                      </span>

                      {label}

                      {id === 5 && (
                        <span
                          className={`ml-auto bg-[#FE6864] text-white ${TEXT.badge} font-bold rounded-full px-1.5 py-px`}
                        >
                          {signalementsMock.filter((s) => s.statut !== "resolu").length}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Profil */}
            <div className="border-t border-[#1e1e26] p-2.5">
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl mb-1 bg-white/2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <User size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`${TEXT.sm} font-bold text-white truncate`}>
                    {user?.nom} 
                  </div>

                  <div className={`${TEXT.xs} text-[#55555e]`}>
                    {user?.email}
                  </div>
                </div>

                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>

              <Link
                to="/"
                className={`flex items-center gap-2.5 px-3 py-2.25 rounded-xl no-underline ${TEXT.sm} text-red-500 hover:bg-red-500/10 transition-all`}
              >
                <LogOut size={14} />
                Déconnexion
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
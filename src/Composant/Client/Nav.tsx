import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Circle, X, LogOut, Menu, BriefcaseBusiness, House, MessageCircle, User, Wallet } from "lucide-react";
import { notificationsMock } from "../../constants";
import type { Notifications } from "../../Type";
import {useUser} from "../../Context/UtilisateurContext";
 const clientLinks = [
  {
    id: 1,
    label: "Accueil",
    route: "/client",
    icon: <House size={16} />,
  },
  {
    id: 2,
    label: "Services",
    route: "/client/services",
    icon: <BriefcaseBusiness size={16} />,
  },
  {
    id: 3,
    label: "Messagerie",
    route: "/client/messagerie",
    icon: <MessageCircle size={16} />,
  },
  {
    id: 4,
    label: "Compte",
    route: "/client/compte",
    icon: <User size={16} />,
  },
  {
    id: 5,
    label: "Wallet",
    route: "/wallet",
    icon: <Wallet size={16} />,
  },
];


// ── Tailles de texte — modifiez ici ──────────────────────
const TEXT = {
  xs:    "text-xs",
  sm:    "text-sm",
  badge: "text-[9px]",
  sub:   "text-[11px]",
  logo:  "text-sm",
  nav:   "text-sm",
  notif: "text-[12.5px]",
  date:  "text-[11px]",
};



export default function NavBar() {
  const { user } = useUser();
  const notifInit = notificationsMock.filter(
    n => n.id_freelancer === ("id_freelancer" in user! && user?.id_freelancer)
  );

  const [slide, setSlide] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showN, setShowN] = useState(false);
  const [notifs, setNotifs] = useState<Notifications[]>(notifInit);
  const ref = useRef<HTMLDivElement>(null);
  const nonLus = notifs.filter(n => !n?.lu).length;
  const pathname = useLocation().pathname;

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowN(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <nav className={`fixed top-0 left-0  w-full z-200 backdrop-blur-[14px] transition-all duration-300
      ${scrolled ? "bg-[#0f0f0f] border-b border-[#2a2a32]" : "bg-[#0f0f0f]/90 border-b border-transparent"}`}>
      <div className="pr-4 h-15.5 flex items-center gap-2 ">

        {/* Logo */}
        <Link to="/client" className="no-underline flex items-center gap-2.5 mr-6">
         <div className="w-25 h-25 rounded-xl  flex items-center justify-center font-black text-white">
                 <img src="/MbokaSansFond2.png" alt="Logo" className="w-25 h-25  p-1" />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-0.5 flex-1">
          {clientLinks.map(({ label, route, icon }) => {
            const a = pathname === route;
            return (
              <Link key={route} to={route}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${TEXT.nav} font-medium no-underline transition-all duration-200
                  ${a ? "text-white bg-[#FE6864] font-semibold" : "text-white/80 hover:text-white hover:bg-white/5"}`}>
                {icon}{label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Notifs */}
          <div ref={ref} className="relative">
            <button onClick={() => setShowN(!showN)}
              className={`relative w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all
                ${showN ? "bg-[#FE686418] border border-[#FE686450] text-[#FE6864]" : "bg-transparent border border-[#2a2a32] text-white/80 hover:text-white"}`}>
              <Bell size={16} />
              {nonLus > 0 && (
                <span className={`absolute -top-1 -right-1 bg-[#FE6864] text-white ${TEXT.badge} font-black rounded-full w-3.75 h-3.75 flex items-center justify-center border-2 border-[#1e1e22]`}>
                  {nonLus}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showN && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-[calc(100%+8px)] right-0 w-80 bg-[#1e1e24] border border-[#2a2a32] rounded-xl shadow-[0_20px_60px_#00000080] z-999 overflow-hidden"
                >
                  <div className="px-3.5 py-3 border-b border-[#2a2a32] flex justify-between items-center">
                    <span className={`font-bold ${TEXT.sm} text-white`}>Notifications</span>
                    <button onClick={() => setNotifs(p => p.map(n => ({ ...n, lu: true })))}
                      className={`${TEXT.xs} text-[#FE6864] bg-none border-none cursor-pointer font-semibold`}>
                      Tout marquer lu
                    </button>
                  </div>
                  {notifs.map(n => (
                    <div key={n.id_notification}
                      className={`flex items-start gap-2.5 px-3.5 py-2.5 border-b border-[#2a2a32] ${n.lu ? "bg-transparent" : "bg-[#FE686408]"}`}>
                      {!n.lu && <Circle size={7} fill="#FE6864" color="#FE6864" className="mt-1 shrink-0" />}
                      <div className="flex-1">
                        <p className={`m-0 ${TEXT.notif} ${n.lu ? "text-white/80" : "text-[#e0e0e0]"} leading-snug`}>
                          {n.notification}
                        </p>
                        <span className={`${TEXT.date} text-white/80`}>{n.date}</span>
                      </div>
                      <button onClick={() => setNotifs(p => p.filter(x => x.id_notification !== n.id_notification))}
                        className="bg-none border-none text-white/80 cursor-pointer p-0 shrink-0">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <div className="px-3.5 py-2.5 text-center">
                    <Link to="/client/notifications" className={`${TEXT.xs} text-[#FE6864] no-underline font-semibold`}>
                      Voir tout →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar desktop */}
          <div className="hidden md:flex items-center gap-2 py-1 pl-0.5 pr-2.5 rounded-[10px] border border-[#2a2a32] bg-[#24242c]">
            <img src="https://picsum.photos/seed/william/80" alt=""
              className="w-6.5 h-6.5 rounded-lg object-cover" />
            <div>
              <div className={`${TEXT.xs} font-bold text-white leading-none`}>{user?.nom}</div>
              <div className={`${TEXT.xs} text-white/80 mt-0.5`}>Client</div>
            </div>
          </div>

          {/* Déconnexion desktop */}
          <Link to="/" title="Déconnexion"
            className="hidden md:flex w-9 h-9 rounded-lg border border-[#2a2a32] text-white/80 items-center justify-center no-underline transition-all hover:text-red-500 hover:border-red-500">
            <LogOut size={16} />
          </Link>

          {/* Burger mobile */}
          <button onClick={() => setSlide(!slide)}
            className="md:hidden w-9 h-9 rounded-lg border border-[#2a2a32] bg-transparent text-white flex items-center justify-center cursor-pointer">
            {slide ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {slide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="bg-[#1e1e22] border-t border-[#2a2a32] overflow-hidden">
            <div className="px-4 pt-2.5 pb-4 flex flex-col gap-1">
              {clientLinks.map(({ label, route, icon }) => {
                const a = pathname === route;
                return (
                  <Link key={route} to={route} onClick={() => setSlide(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.25 rounded-xl no-underline ${TEXT.sm} font-medium transition-all
                      ${a ? "text-[#FE6864] bg-[#FE686415] border-l-[3px] border-[#FE6864]" : "text-[#6b6b76] border-l-[3px] border-transparent"}`}>
                    {icon}{label}
                  </Link>
                );
              })}
              <Link to="/" onClick={() => setSlide(false)}
                className={`flex items-center gap-2.5 px-3 py-2.25 rounded-xl no-underline ${TEXT.sm} text-red-500 mt-1`}>
                <LogOut size={14} /> Déconnexion
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
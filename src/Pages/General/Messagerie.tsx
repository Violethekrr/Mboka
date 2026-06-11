import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Send, Trash2, Phone, Video,
  MessageSquare, X, Check, ArrowLeft,
} from "lucide-react";
import type { Messagerie } from "../../Type";
import { clientsMock, freelancersMock, messagesMock } from "../../constants";
import { useUser } from "../../Context/UtilisateurContext";

// ── Tailles de texte — modifiez ici ──────────────────────
const TEXT = {
  xs:    "text-sm",
  sm:    "text-sm",
  badge: "text-xs",
  label: "text-xs",
  head:  "text-sm",
};

// ── Types ─────────────────────────────────────────────────
interface Conversation {
  id: number;
  interlocuteur: { id: number; nom: string; prenom: string; photo: string; role: string };
  messages: Messagerie[];
  nonLus: number;
}

// ── État vide par défaut (évite les crashes si aucune conv) ─
const EMPTY_CONV: Conversation = {
  id: -1,
  interlocuteur: { id: -1, nom: "", prenom: "—", photo: "", role: "" },
  messages: [],
  nonLus: 0,
};

// ════════════════════════════════════════════════════════════
// Liste des conversations
// ════════════════════════════════════════════════════════════
interface ConversationsListProps {
  convs: Conversation[];
  activeId: number;
  search: string;
  setSearch: (v: string) => void;
  onOpenConv: (id: number) => void;
  totalNonLus: number;
  myId: number;
}

function ConversationsList({
  convs, activeId, search, setSearch, onOpenConv, totalNonLus, myId,
}: ConversationsListProps) {
  const filtered = convs.filter(c =>
    `${c.interlocuteur.prenom} ${c.interlocuteur.nom}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full lg:w-[300px] shrink-0 bg-[#0f0f0f] border-r border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-5 pb-3.5">
        <div className="flex justify-between items-center mb-3.5">
          <h2 className={`${TEXT.head} m-0 font-bold text-white`}>Messages</h2>
          <span className={`${TEXT.badge} bg-[#FE6864]/20 text-[#FE6864] font-bold px-2 py-0.5 rounded-full`}>
            {totalNonLus} non lus
          </span>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6b6b76]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className={`${TEXT.label} w-full border border-white/10 bg-[#202023] rounded-lg py-2 px-2.5 pl-7.5 text-white outline-none box-border`}
          />
        </div>
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className={`text-center py-10 ${TEXT.xs} text-[#55555e]`}>Aucune conversation</div>
        )}
        {filtered.map(conv => {
          const last = conv.messages[conv.messages.length - 1];
          const isA  = conv.id === activeId;
          return (
            <div
              key={conv.id}
              onClick={() => onOpenConv(conv.id)}
              className={`flex items-center gap-2.5 py-3 px-4 cursor-pointer transition-all duration-150 border-l-[3px]
                ${isA ? "bg-[#FE6864]/10 border-[#FE6864]" : "bg-transparent border-transparent hover:bg-white/[0.03]"}`}
            >
              <div className="relative shrink-0">
                <img
                  src={conv.interlocuteur.photo}
                  alt=""
                  className={`w-10 h-10 rounded-full object-cover border-2 ${isA ? "border-[#FE6864]" : "border-transparent"}`}
                />
                {conv.nonLus > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#FE6864] text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#0f0f0f]">
                    {conv.nonLus}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`${TEXT.sm} font-medium ${conv.nonLus > 0 ? "font-bold" : ""} ${isA ? "text-[#FE6864]" : "text-[#e0e0e0]"}`}>
                    {conv.interlocuteur.prenom} {conv.interlocuteur.nom}
                  </span>
                  <span className={`${TEXT.badge} text-[#6b6b76] shrink-0 ml-1`}>
                    {last?.date?.split(" ")[1] ?? ""}
                  </span>
                </div>
                <p className={`${TEXT.xs} m-0 text-[#6b6b76] truncate ${conv.nonLus > 0 ? "font-semibold text-[#9090a0]" : ""}`}>
                  {last?.id_envoyeur === myId ? "Vous : " : ""}
                  {last?.contenu_message ?? "Aucun message"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Zone de chat
// ════════════════════════════════════════════════════════════
interface ChatAreaProps {
  activeConv: Conversation;
  input: string;
  setInput: (v: string) => void;
  hoverMsg: number | null;
  setHoverMsg: (v: number | null) => void;
  onSend: () => void;
  onDeleteMsg: (id: number) => void;
  onDeleteConv: () => void;
  onBack: () => void;
  myId: number;
}

function ChatArea({
  activeConv, input, setInput, hoverMsg, setHoverMsg,
  onSend, onDeleteMsg, onDeleteConv, onBack, myId,
}: ChatAreaProps) {
  const endRef         = useRef<HTMLDivElement>(null);
  const prevCountRef   = useRef<number>(activeConv.messages.length);
  const isFirstRender  = useRef(true);

  // Scroll uniquement quand un NOUVEAU message arrive, pas au chargement
  useEffect(() => {
    const count = activeConv.messages.length;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevCountRef.current  = count;
      return;
    }
    if (count > prevCountRef.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCountRef.current = count;
  }, [activeConv.messages]);

  // Reset quand on change de conversation
  useEffect(() => {
    isFirstRender.current = true;
    prevCountRef.current  = activeConv.messages.length;
  }, [activeConv.id]);

  // Guard : si aucune conversation sélectionnée
  if (activeConv.id === -1) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0f0f0f] text-[#55555e]">
        <div className="text-center">
          <MessageSquare size={40} className="opacity-20 mx-auto mb-3" />
          <p className={`${TEXT.sm} m-0`}>Sélectionnez une conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0f0f0f] h-full min-w-0">
      {/* Header */}
      <div className="py-3.5 px-5 border-b border-white/10 bg-[#0f0f0f] flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="lg:hidden w-9 h-9 rounded-lg bg-transparent border border-white/10 text-white/80 flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="relative shrink-0">
          <img src={activeConv.interlocuteur.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0f0f0f]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className={`${TEXT.sm} font-bold text-white truncate`}>
            {activeConv.interlocuteur.prenom} {activeConv.interlocuteur.nom}
          </div>
          <div className={`${TEXT.badge} text-emerald-500`}>
            En ligne · {activeConv.interlocuteur.role}
          </div>
        </div>

        <div className="flex gap-1.5 shrink-0">
          {[{ icon: <Phone size={15} />, title: "Appeler" }, { icon: <Video size={15} />, title: "Vidéo" }].map(btn => (
            <button key={btn.title} title={btn.title}
              className="w-9 h-9 rounded-lg bg-transparent border border-white/10 text-white/60 flex items-center justify-center cursor-pointer hover:text-white hover:border-white/40 transition-all">
              {btn.icon}
            </button>
          ))}
          <button onClick={onDeleteConv} title="Supprimer"
            className="w-9 h-9 rounded-lg bg-transparent border border-white/10 text-red-500 flex items-center justify-center cursor-pointer hover:bg-red-500/10 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-5 px-5 flex flex-col gap-2.5">
        <div className="text-center my-1">
          <span className={`${TEXT.badge} bg-[#202023] text-[#6b6b76] py-0.5 px-3 rounded-full border border-white/10`}>
            Aujourd'hui
          </span>
        </div>

        {activeConv.messages.length === 0 && (
          <div className="text-center mt-16 text-[#6b6b76]">
            <MessageSquare size={36} className="opacity-20 mb-3 mx-auto" />
            <p className={`${TEXT.sm} m-0`}>Aucun message. Commencez la conversation !</p>
          </div>
        )}

        {activeConv.messages.map(msg => {
          const isMe = msg.id_envoyeur === myId;
          return (
            <div
              key={msg.id_message}
              className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
              onMouseEnter={() => setHoverMsg(msg.id_message)}
              onMouseLeave={() => setHoverMsg(null)}
            >
              {!isMe && (
                <img src={activeConv.interlocuteur.photo} alt=""
                  className="w-7 h-7 rounded-full object-cover shrink-0" />
              )}

              <div className="max-w-[60%] relative">
                <div className={`${TEXT.sm} py-2.5 px-3.5 leading-[1.5]
                  ${isMe
                    ? "rounded-t-2xl rounded-bl-2xl rounded-br-md bg-[#FE6864] text-white"
                    : "rounded-t-2xl rounded-br-2xl rounded-bl-md bg-[#202023] text-white border border-white/10"
                  }`}>
                  {msg.contenu_message}
                </div>
                <div className={`flex items-center gap-1 mt-0.5 ${isMe ? "justify-end" : "justify-start"}`}>
                  <span className={`${TEXT.badge} text-[#55555e]`}>{msg.date}</span>
                  {isMe && (
                    <Check size={11} className={msg.Lu ? "text-blue-400" : "text-[#55555e]"} />
                  )}
                </div>

                {hoverMsg === msg.id_message && isMe && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={() => onDeleteMsg(msg.id_message)}
                    className="absolute -top-2 -right-2 bg-red-500 border-none text-white rounded-full w-5 h-5 cursor-pointer flex items-center justify-center shadow-lg">
                    <X size={10} />
                  </motion.button>
                )}
              </div>

              {isMe && (
                <img src={activeConv.interlocuteur.photo} alt=""
                  className="w-7 h-7 rounded-full object-cover shrink-0 opacity-0 pointer-events-none" />
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="py-3.5 px-5 border-t border-white/10 bg-[#0f0f0f] flex gap-2.5 items-center shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSend()}
          placeholder="Écrire un message..."
          className={`${TEXT.sm} flex-1 bg-[#1a1a1e] border border-white/10 rounded-xl py-2.5 px-4 text-white outline-none focus:border-[#FE6864]/50 transition-colors`}
        />
        <button
          onClick={onSend}
          disabled={!input.trim()}
          className={`w-10 h-10 rounded-xl border-none flex items-center justify-center transition-all shrink-0
            ${input.trim() ? "bg-[#FE6864] text-white cursor-pointer hover:bg-[#e8524e]" : "bg-[#2a2a32] text-[#55555e] cursor-not-allowed"}`}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Page principale
// ════════════════════════════════════════════════════════════
export default function MessageriePage() {
  const { user, role } = useUser();

  // ID courant — sécurisé même si user est null
  const myId: number = user
    ? "id_client"     in user ? (user as { id_client: number }).id_client
    : "id_freelancer" in user ? (user as { id_freelancer: number }).id_freelancer
    : 1
    : 1;

  const myRole = role ?? "client";
  const données = myRole === "client" ? freelancersMock : clientsMock;

  const buildConvs = (): Conversation[] =>
    données
      .map(p => {
        const pId  = "id_freelancer" in p ? p.id_freelancer : p.id_client;
        const msgs = messagesMock.filter(
          m => (m.id_envoyeur === pId && m.id_receveur === myId) ||
               (m.id_envoyeur === myId && m.id_receveur === pId)
        );
        return {
          id: pId,
          interlocuteur: {
            id: pId, nom: p.nom, prenom: p.prenom, photo: p.photo,
            role: myRole === "client" ? "Freelancer" : "Client",
          },
          messages: msgs,
          nonLus: msgs.filter(m => !m.Lu && m.id_envoyeur === pId).length,
        };
      })
      .filter(conv => conv.messages.length > 0);

  const [convs,     setConvs]     = useState<Conversation[]>(buildConvs);
  const [activeId,  setActiveId]  = useState<number>(convs[0]?.id ?? -1);
  const [input,     setInput]     = useState("");
  const [search,    setSearch]    = useState("");
  const [hoverMsg,  setHoverMsg]  = useState<number | null>(null);
  const [showChat,  setShowChat]  = useState(false);

  // activeConv avec fallback sur EMPTY_CONV — jamais undefined
  const activeConv = convs.find(c => c.id === activeId) ?? EMPTY_CONV;
  const totalNonLus = convs.reduce((a, c) => a + c.nonLus, 0);

  const openConv = (id: number) => {
    setActiveId(id);
    setConvs(p => p.map(c =>
      c.id === id ? { ...c, nonLus: 0, messages: c.messages.map(m => ({ ...m, Lu: true })) } : c
    ));
    setShowChat(true);
  };

  const send = () => {
    if (!input.trim() || activeConv.id === -1) return;
    const msg: Messagerie = {
      id_message:       Date.now(),
      id_envoyeur:      myId,
      id_receveur:      activeConv.interlocuteur.id,
      contenu_message:  input.trim(),
      date:             new Date().toLocaleString("fr-FR"),
      Lu:               false,
    };
    setConvs(p => p.map(c =>
      c.id === activeId ? { ...c, messages: [...c.messages, msg] } : c
    ));
    setInput("");
    setTimeout(() => {
      const reply: Messagerie = {
        id_message:       Date.now() + 1,
        id_envoyeur:      activeConv.interlocuteur.id,
        id_receveur:      myId,
        contenu_message:  "Merci pour votre message, je vous réponds dès que possible ! 🙏",
        date:             new Date().toLocaleString("fr-FR"),
        Lu:               false,
      };
      setConvs(p => p.map(c =>
        c.id === activeId ? { ...c, messages: [...c.messages, reply] } : c
      ));
    }, 1400);
  };

  const delMsg = (id: number) => {
    setConvs(p => p.map(c =>
      c.id === activeId ? { ...c, messages: c.messages.filter(m => m.id_message !== id) } : c
    ));
  };

  const delConv = () => {
    if (window.confirm("Supprimer toute la conversation ?"))
      setConvs(p => p.map(c =>
        c.id === activeId ? { ...c, messages: [] } : c
      ));
  };

  const sharedListProps = { convs, activeId, search, setSearch, onOpenConv: openConv, totalNonLus, myId };
  const sharedChatProps = {
    activeConv, input, setInput, hoverMsg, setHoverMsg,
    onSend: send, onDeleteMsg: delMsg, onDeleteConv: delConv,
    onBack: () => setShowChat(false), myId,
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] font-sans text-white flex flex-col">
      <div className="flex-1 flex mt-[62px] w-full h-[calc(100vh-62px)]">

        {/* ── Desktop : côte à côte ── */}
        <div className="hidden lg:flex w-full overflow-hidden">
          <ConversationsList {...sharedListProps} />
          <ChatArea {...sharedChatProps} />
        </div>

        {/* ── Mobile : plein écran conditionnel ── */}
        <div className="lg:hidden w-full h-full overflow-hidden">
          <AnimatePresence mode="wait">
            {!showChat ? (
              <motion.div key="list"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                className="h-full">
                <ConversationsList {...sharedListProps} />
              </motion.div>
            ) : (
              <motion.div key="chat"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex flex-col bg-[#0f0f0f]">
                <ChatArea {...sharedChatProps} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Trash2, Phone, Video, MessageSquare, X, Check, ArrowLeft } from "lucide-react";
import type { Messagerie } from "../../Type";
import { clientsMock, freelancersMock, messagesMock } from "../../constants";

const TEXT = {
  xs: "text-sm lg:text-base",
  sm: "text-sm lg:text-base",
  badge: "text-xs lg:text-sm",
  sub: "text-xs lg:text-sm",
  label: "text-xs lg:text-sm",
  head: "text-sm lg:text-base",
  stat: "text-sm lg:text-base",
};

const myId = 1;
const myRole = "client"; // "client" | "freelancer"

interface Conversation {
  id: number;
  interlocuteur: { id: number; nom: string; prenom: string; photo: string; role: string };
  messages: Messagerie[];
  nonLus: number;
}

// ── Composant Liste des conversations ─────────────────────────
interface ConversationsListProps {
  convs: Conversation[];
  activeId: number;
  search: string;
  setSearch: (value: string) => void;
  onOpenConv: (id: number) => void;
  totalNonLus: number;
}

const ConversationsList = ({ 
  convs, 
  activeId, 
  search, 
  setSearch, 
  onOpenConv, 
  totalNonLus 
}: ConversationsListProps) => {
  const filtered = convs.filter(c =>
    `${c.interlocuteur.prenom} ${c.interlocuteur.nom}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full lg:w-75  border-white/10 bg-[#0f0f0f]   lg:border-r  flex flex-col h-full">
      {/* Header sidebar */}
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
            className={`${TEXT.label} w-full border  border-white/10 bg-[#202023]  rounded-lg py-2 px-2.5 pl-7.5 text-white outline-none box-border`}
          />
        </div>
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map(conv => {
          const last = conv.messages[conv.messages.length - 1];
          const isA = conv.id === activeId;
          return (
            <div 
              key={conv.id} 
              onClick={() => onOpenConv(conv.id)} 
              className={`flex items-center gap-2.5 py-3 px-4 cursor-pointer transition-all duration-150
                ${isA ? 'bg-[#FE6864]/10' : 'bg-transparent'}
                lg:border-l-[3px] ${isA ? 'lg:border-[#FE6864]' : 'lg:border-transparent'}`}
            >
              <div className="relative shrink-0">
                <img 
                  src={conv.interlocuteur.photo} 
                  alt="" 
                  className={`w-10.5 h-10.5 rounded-full object-cover border-2 ${isA ? 'border-[#FE6864]' : 'border-transparent'}`} 
                />
                {conv.nonLus > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#FE6864] text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#1a1a20]">
                    {conv.nonLus}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`${TEXT.sm} ${conv.nonLus > 0 ? 'font-bold' : 'font-medium'} ${isA ? 'text-[#FE6864]' : 'text-[#e0e0e0]'}`}>
                    {conv.interlocuteur.prenom} {conv.interlocuteur.nom}
                  </span>
                  <span className={`${TEXT.badge} text-[#6b6b76]`}>{last?.date?.split(" ")[1] ?? ""}</span>
                </div>
                <p className={`${TEXT.xs} m-0 text-gray-400 truncate ${conv.nonLus > 0 ? 'font-semibold' : 'font-normal'}`}>
                  {last?.id_envoyeur === myId ? "Vous : " : ""}{last?.contenu_message ?? "Aucun message"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Composant Zone de chat ────────────────────────────────────
interface ChatAreaProps {
  activeConv: Conversation;
  input: string;
  setInput: (value: string) => void;
  hoverMsg: number | null;
  setHoverMsg: (value: number | null) => void;
  onSend: () => void;
  onDeleteMsg: (id: number) => void;
  onDeleteConv: () => void;
  onBack: () => void;
}

const ChatArea = ({ 
  activeConv, 
  input, 
  setInput, 
  hoverMsg, 
  setHoverMsg, 
  onSend, 
  onDeleteMsg, 
  onDeleteConv, 
  onBack 
}: ChatAreaProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv.messages]);

  return (
    <div className="flex-1 flex flex-col bg-[#0f0f0f]  h-full ">
      {/* Header chat */}
      <div className="py-3.5 px-5 border-b  border-white/10 bg-[#0f0f0f]   flex items-center gap-3">
        {/* Bouton retour mobile */}
        <button 
          onClick={onBack}
          className="lg:hidden w-9 h-9 rounded-lg bg-transparent border border-[#2a2a32] text-white/80 flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        
        <div className="relative">
          <img 
            src={activeConv?.interlocuteur.photo} 
            alt="" 
            className="w-10 h-10 rounded-full object-cover" 
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#1e1e24]" />
        </div>
        <div className="flex-1">
          <div className={`${TEXT.sm} font-bold text-white`}>
            {activeConv?.interlocuteur.prenom} {activeConv?.interlocuteur.nom}
          </div>
          <div className={`${TEXT.badge} text-emerald-500`}>
            En ligne · {activeConv?.interlocuteur.role}
          </div>
        </div>
        <div className="flex gap-1.5">
          {[
            { icon: <Phone size={16} />, title: "Appeler" },
            { icon: <Video size={16} />, title: "Vidéo" },
          ].map(btn => (
            <button 
              key={btn.title} 
              title={btn.title} 
              className="group w-9 h-9 rounded-lg bg-transparent border border-[#2a2a32] text-white/80 flex items-center justify-center cursor-pointer transition-all duration-200 hover:text-white hover:border-white"
            >
              {btn.icon}
            </button>
          ))}
          <button 
            onClick={onDeleteConv} 
            title="Supprimer conversation" 
            className="w-9 h-9 rounded-lg bg-transparent border border-[#2a2a32] text-red-500 flex items-center justify-center cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-5 px-6 flex flex-col gap-2.5">
        <div className="text-center my-2">
          <span className={`${TEXT.badge} bg-[#1e1e24] text-[#6b6b76] py-0.5 px-3 rounded-full border border-[#2a2a32]`}>
            Aujourd'hui
          </span>
        </div>

        {activeConv?.messages.length === 0 && (
          <div className="text-center mt-15 text-[#6b6b76]">
            <MessageSquare size={36} color="#6b6b76" className="opacity-30 mb-2.5 mx-auto" />
            <p className={`${TEXT.sm} m-0`}>Aucun message. Commencez la conversation !</p>
          </div>
        )}

        {activeConv?.messages.map(msg => {
          const isMe = msg.id_envoyeur === myId;
          return (
            <div
              key={msg.id_message}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
              onMouseEnter={() => setHoverMsg(msg.id_message)}
              onMouseLeave={() => setHoverMsg(null)}
            >
              {!isMe && (
                <img 
                  src={activeConv.interlocuteur.photo} 
                  alt="" 
                  className="w-7.5 h-7.5 rounded-full object-cover shrink-0" 
                />
              )}

              <div className="max-w-[60%] relative">
                <div className={`${TEXT.sm} py-2.5 px-3.5 leading-5
                  ${isMe 
                    ? 'rounded-t-2xl rounded-b-2xl rounded-bl-md bg-[#FE6864] text-white' 
                    : 'rounded-t-2xl rounded-b-2xl rounded-br-md  border-white/10 bg-[#202023]  text-white border '
                  }`}>
                  {msg.contenu_message}
                </div>
                <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <span className={`${TEXT.badge} text-[#6b6b76]`}>{msg.date}</span>
                  {isMe && (
                    <span className={`${TEXT.xs} ${msg.Lu ? 'text-blue-500' : 'text-[#6b6b76]'}`}>
                      <Check size={12} />
                    </span>
                  )}
                </div>

                {hoverMsg === msg.id_message && isMe && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => onDeleteMsg(msg.id_message)}
                    className="absolute -top-2 -right-2 bg-red-500 border-none text-white rounded-full w-5 h-5 text-[10px] cursor-pointer flex items-center justify-center shadow-lg"
                  >
                    <X size={10} />
                  </motion.button>
                )}
              </div>

              {isMe && (
                <img 
                  src="https://picsum.photos/seed/william/80" 
                  alt="" 
                  className="w-7.5 h-7.5 rounded-full object-cover shrink-0" 
                />
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="py-3.5 px-5 border-t  border-white/10 bg-[#0f0f0f]   flex gap-2.5 items-center">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSend()}
          placeholder="Écrire un message..."
          className={`${TEXT.sm} flex-1 bg-[#16161a] border border-[#2a2a32] rounded-lg py-2.5 px-4 text-white outline-none transition-colors duration-200 focus:border-[#FE6864]/60`}
        />
        <button 
          onClick={onSend} 
          disabled={!input.trim()} 
          className={`w-10.5 h-10.5 rounded-lg border-none flex items-center justify-center transition-all duration-200
            ${input.trim() 
              ? 'bg-[#FE6864] text-white cursor-pointer' 
              : 'bg-[#45454e] text-white cursor-not-allowed'
            }`}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

// ── Page Messagerie ────────────────────────────────────────
export default function MessageriePage() {
  const données = myRole === "client" ? freelancersMock : clientsMock;

 const buildConvs = (): Conversation[] =>
  données
    .map(p => {
      const pId = "id_freelancer" in p ? p.id_freelancer : p.id_client;
      const msgs = messagesMock.filter(
        m => (m.id_envoyeur === pId && m.id_receveur === myId) ||
             (m.id_envoyeur === myId && m.id_receveur === pId)
      );
      return {
        id: pId,
        interlocuteur: { 
          id: pId, 
          nom: p.nom, 
          prenom: p.prenom, 
          photo: p.photo, 
          role: myRole === "client" ? "Freelancer" : "Client" 
        },
        messages: msgs,
        nonLus: msgs.filter(m => !m.Lu && m.id_envoyeur === pId).length,
      };
    })
    .filter(conv => conv.messages.length > 0); 

  const [convs, setConvs] = useState<Conversation[]>(buildConvs);
  const [activeId, setActiveId] = useState<number>(convs[0]?.id ?? 0);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [hoverMsg, setHoverMsg] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);

  const activeConv = convs.find(c => c.id === activeId)!;
  const totalNonLus = convs.reduce((a, c) => a + c.nonLus, 0);

  const openConv = (id: number) => {
    setActiveId(id);
    setConvs(p => p.map(c => c.id === id ? { ...c, nonLus: 0, messages: c.messages.map(m => ({ ...m, Lu: true })) } : c));
    setShowChat(true);
  };

  const send = () => {
    if (!input.trim()) return;
    const msg: Messagerie = {
      id_message: new Date().getTime(), 
      id_envoyeur: myId, 
      id_receveur: activeConv.interlocuteur.id,
      contenu_message: input.trim(), 
      date: new Date().toLocaleString("fr-FR"), 
      Lu: false,
    };
    setConvs(p => p.map(c => c.id === activeId ? { ...c, messages: [...c.messages, msg] } : c));
    setInput("");
    setTimeout(() => {
      const reply: Messagerie = {
        id_message: new Date().getTime() + 1, 
        id_envoyeur: activeConv.interlocuteur.id, 
        id_receveur: myId,
        contenu_message: "Merci pour votre message, je vous réponds dès que possible ! 🙏",
        date: new Date().toLocaleString("fr-FR"), 
        Lu: false,
      };
      setConvs(p => p.map(c => c.id === activeId ? { ...c, messages: [...c.messages, reply] } : c));
    }, 1400);
  };

  const delMsg = (id: number) => {
    setConvs(p => p.map(c => c.id === activeId ? { ...c, messages: c.messages.filter(m => m.id_message !== id) } : c));
  };

  const delConv = () => {
    if (window.confirm("Supprimer toute la conversation ?"))
      setConvs(p => p.map(c => c.id === activeId ? { ...c, messages: [] } : c));
  };

  return (
    <div className="min-h-screen bg-[#16161a] font-['Segoe_UI',sans-serif] text-white flex flex-col">
      {/* Layout */}
      <div className="flex-1 flex   mt-15.5 w-full h-[calc(100vh-62px)]">
        
        {/* Sur desktop: affichage côte à côte */}
        <div className="hidden lg:flex w-full">
          <ConversationsList 
            convs={convs}
            activeId={activeId}
            search={search}
            setSearch={setSearch}
            onOpenConv={openConv}
            totalNonLus={totalNonLus}
          />
          <ChatArea 
            activeConv={activeConv}
            input={input}
            setInput={setInput}
            hoverMsg={hoverMsg}
            setHoverMsg={setHoverMsg}
            onSend={send}
            onDeleteMsg={delMsg}
            onDeleteConv={delConv}
            onBack={() => setShowChat(false)}
          />
        </div>

        {/* Sur mobile: affichage conditionnel */}
        <div className="lg:hidden w-full h-full">
          <AnimatePresence mode="wait">
            {!showChat ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ConversationsList 
                  convs={convs}
                  activeId={activeId}
                  search={search}
                  setSearch={setSearch}
                  onOpenConv={openConv}
                  totalNonLus={totalNonLus}
                />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-[#16161a]"
                style={{ top: 0, left: 0, right: 0, bottom: 0 }}
              >
                <ChatArea 
                  activeConv={activeConv}
                  input={input}
                  setInput={setInput}
                  hoverMsg={hoverMsg}
                  setHoverMsg={setHoverMsg}
                  onSend={send}
                  onDeleteMsg={delMsg}
                  onDeleteConv={delConv}
                  onBack={() => setShowChat(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
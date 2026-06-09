import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import logo from "../../assets/Mboka.png";

export default function Inscription() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"client" | "freelance">("client");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Compte créé avec succès !");
    if (role === "client") navigate("/MonCompte");
    else navigate("/Freelancer");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      <div className="hidden lg:flex w-[45%] xl:w-[45%] bg-[#111111] flex-col items-center justify-center px-16 relative">
        <div className="relative z-10 text-center max-w-xs">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="MBOKA" className="w-40 h-40" />
          </div>
          <p className="text-white font-black text-5xl tracking-widest uppercase mb-6">MBOKA</p>
          <h2 className="text-white/80 font-semibold text-3xl mb-4">Rejoignez MBOKA</h2>
          <p className="text-white/40 text-base">Trouvez des talents. Réalisez vos projets.</p>
        </div>
      </div>

      <div className="flex-1 bg-[#161616] flex items-center justify-center p-6 lg:p-20 border-l border-white/5">
        <div className="w-full max-w-sm mx-auto">
          <div className="lg:hidden flex justify-center mb-6">
            <img src={logo} alt="MBOKA" className="w-16 h-16" />
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-white font-bold text-2xl mb-1">Créer un compte</h1>
            <p className="text-white/60 text-sm">Commencez votre aventure</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={() => setRole("client")}
              className={`p-3 rounded-xl border transition-all ${role === "client" ? "border-[#E53E3E] bg-[#E53E3E]/10" : "border-white/10 bg-[#1a1a1a]"}`}
            >
              <p className="text-white text-xs font-bold">Client</p>
              <p className="text-white/40 text-[10px]">Je cherche des services</p>
            </button>
            <button 
              onClick={() => setRole("freelance")}
              className={`p-3 rounded-xl border transition-all ${role === "freelance" ? "border-[#E84D4D] bg-[#E53E3E]/10" : "border-white/10 bg-[#1a1a1a]"}`}
            >
              <p className="text-white text-xs font-bold">Freelance</p>
              <p className="text-white/40 text-[10px]">Je propose mes services</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { icon: User, placeholder: "Nom complet", type: "text" },
              { icon: Mail, placeholder: "E-mail", type: "email" },
              { icon: Phone, placeholder: "Téléphone", type: "tel" },
            ].map((field, i) => (
              <div key={i} className="relative">
                <field.icon className="absolute left-3 top-3.5 text-white/20" size={18} />
                <input type={field.type} placeholder={field.placeholder} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-10 py-3 text-white text-sm focus:outline-none focus:border-[#E53E3E]" required />
              </div>
            ))}

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-white/20" size={18} />
              <input type={showPassword ? "text" : "password"} placeholder="Mot de passe" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-10 py-3 text-white text-sm focus:outline-none focus:border-[#E53E3E]" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-white/40">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" className="w-full bg-[#E84D4D] hover:bg-[#c53030] text-white font-bold rounded-xl py-3 text-sm transition-all mt-2">
              Créer mon compte
            </button>
          </form>

          <p className="text-center text-white/60 text-sm mt-8">
            Déjà un compte ? <Link to="/connexion" className="text-[#E84D4D] font-bold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

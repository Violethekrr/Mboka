import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Apple, Disc } from "lucide-react";
import {
  clientsMock,
  freelancersMock,
  administrateursMock,
} from "../../constants";
import logo from "../../assets/Mboka.png";
import { useUser } from "../../Context/UtilisateurContext";

export default function Connexion() {
  const navigate = useNavigate();
  const { setRole, setUser } = useUser(); // Ajout des fonctions du contexte
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const client = clientsMock.find(
      (c) => c.email === email && c.mot_de_passe === password
    );

    const freelancer = freelancersMock.find(
      (f) => f.email === email && f.mot_de_passe === password
    );

    const admin = administrateursMock.find(
      (a) => a.email === email && a.mot_de_passe === password
    );

    if (client) {
      setRole("client");
      setUser(client);
      navigate("/client");
    } else if (freelancer) {
      setRole("prestataire");
      setUser(freelancer);
      navigate("/freelancer");
    } else if (admin) {
      setRole("admin");
      setUser(admin);
      navigate("/administrateur");
    } else {
      alert("Identifiants incorrects");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      <div className="hidden lg:flex w-[45%] bg-[#111111] flex-col items-center justify-center p-12">
        <img src={logo} alt="MBOKA" className="w-40 h-40 mb-8" />
        <h2 className="text-white text-4xl font-bold mb-4">Bienvenue de retour !</h2>
        <p className="text-white/40 text-center max-w-xs">Connectez-vous à votre espace et retrouvez vos projets, artisans et services.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center text-center mb-8">
            <img src={logo} alt="MBOKA" className="w-28 h-28 mb-4" />
            <h1 className="text-white font-bold text-3xl mb-1">MBOKA</h1>
            <h2 className="text-white font-semibold text-3xl mb-2">Bienvenue !</h2>
            <p className="text-white/60 text-xl">Connectez-vous pour continuer</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-white/20" size={18} />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email ou numéro de téléphone" 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-10 py-3 text-white text-sm focus:outline-none focus:border-[#E84D4D]" 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-white/20" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Mot de passe" 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-10 py-3 text-white text-sm focus:outline-none focus:border-[#E84D4D]" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-3.5 text-white/40"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-[#E84D4D] text-xs hover:underline">Mot de passe oublié ?</Link>
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#E84D4D] hover:bg-[#c53030] text-white font-bold rounded-xl py-3 text-sm transition-all"
            >
              Se connecter
            </button>
          </form>

          <div className="w-full text-center text-white/30 text-xs my-6">OU CONTINUER AVEC</div>
          <div className="w-full grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-[#1a1a1a] border border-white/10 rounded-xl py-3 text-white text-sm hover:bg-[#252525]">
              <Disc size={18} /> Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#1a1a1a] border border-white/10 rounded-xl py-3 text-white text-sm hover:bg-[#252525]">
              <Apple size={18} /> Apple
            </button>
          </div>
          <p className="text-center text-white/60 text-sm mt-8">
            Pas encore de compte ? <Link to="/inscription" className="text-[#E53E3E] font-bold">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
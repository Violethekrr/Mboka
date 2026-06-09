import { useState, useRef } from "react";
import { User, Shield, Settings, MapPin, CreditCard, Bell, History, Camera } from "lucide-react";
import electriciens from "../../assets/electriciens.png";

export default function MonCompte() {
  const [activeMenu, setActiveMenu] = useState("Informations personnelles");
  const [profile, setProfile] = useState({
    nom: "Alain Dev",
    email: "alain.dev@email.com",
    telephone: "+243 81 123 45 67",
    photo: electriciens 
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newPhoto = URL.createObjectURL(e.target.files[0]);
      setProfile({ ...profile, photo: newPhoto });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profil mis à jour avec succès !");
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "Informations personnelles":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Informations personnelles</h3>
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="text-[10px] border border-white/10 px-3 py-1.5 rounded-md hover:bg-white/5 uppercase tracking-wider"
              >
                Modifier le profil
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSave}>
              <div>
                <label className="block text-[11px] text-white/50 mb-1.5 uppercase tracking-wide">Nom complet</label>
                <input 
                  type="text" 
                  value={profile.nom} 
                  onChange={(e) => setProfile({...profile, nom: e.target.value})}
                  className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-[#E53E3E] outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1.5 uppercase tracking-wide">E-mail</label>
                <input 
                  type="text" 
                  value={profile.email} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-[#E53E3E] outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-[11px] text-white/50 mb-1.5 uppercase tracking-wide">Téléphone</label>
                <input 
                  type="text" 
                  value={profile.telephone} 
                  onChange={(e) => setProfile({...profile, telephone: e.target.value})}
                  className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-[#E53E3E] outline-none transition-all" 
                />
                 <div>
                <label className="block text-[11px] text-white/50 mb-1.5 uppercase tracking-wide">Pays</label>
                <select className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-[#E53E3E] outline-none">
                  <option>République Démocratique du Congo</option>
                </select>
              </div>
              </div>
              
              <button type="submit" className="w-full bg-[#E53E3E] hover:bg-[#c53030] py-3 rounded-lg font-bold text-sm transition-all mt-6">
                Enregistrer les modifications
              </button>
            </form>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-white/30">
            <Settings size={48} className="mb-4 opacity-20" />
            <p>Section "{activeMenu}" en cours de développement.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 lg:p-10 text-white">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
      
      <div className="max-w-5xl mx-auto bg-[#1a1a1a] rounded-3xl border border-white/5 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-center font-bold uppercase tracking-wider">Mon compte</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="flex flex-col items-center text-center p-6 bg-[#111111] rounded-2xl border border-white/5">
              <div className="relative w-24 h-24 mb-4">
                <img src={profile.photo} alt="Profil" className="w-full h-full rounded-full object-cover border-2 border-[#E53E3E]" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-[#E53E3E] p-2 rounded-full border-2 border-[#111111]"
                >
                  <Camera size={14} />
                </button>
              </div>
              <h2 className="font-bold text-lg">{profile.nom}</h2>
              <p className="text-green-500 text-xs">Client vérifié</p>
            </div>

            <nav className="space-y-1">
              {[
                { name: "Mon profil", icon: User },
                { name: "Informations personnelles", icon: User },
                { name: "Sécurité du compte", icon: Shield },
                { name: "Préférences", icon: Settings },
                { name: "Adresses", icon: MapPin },
                { name: "Moyens de paiement", icon: CreditCard },
                { name: "Abonnement", icon: Bell },
                { name: "Historique", icon: History },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveMenu(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeMenu === item.name ? "bg-[#E53E3E]/10 text-[#E53E3E]" : "text-white/60 hover:bg-white/5"}`}
                >
                  <item.icon size={18} />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

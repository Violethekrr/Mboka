import { useState } from "react";

// Données enrichies pour permettre le scroll
const allServices = [
  { id: 1, service: "Création site vitrine", prestataire: "Kevin L.", date: "12 mai 2024", statut: "Confirmés", montant: "250 000 FCFA" },
  { id: 2, service: "Rédaction articles SEO", prestataire: "Mike T.", date: "10 mai 2024", statut: "En cours", montant: "75 000 FCFA" },
  { id: 3, service: "Design flyer promo", prestataire: "Grace K.", date: "08 mai 2024", statut: "Finalisés", montant: "30 000 FCFA" },
  { id: 4, service: "Community management", prestataire: "Sarah D.", date: "05 mai 2024", statut: "Annulés", montant: "20 000 FCFA" },
  { id: 5, service: "Installation caméra", prestataire: "Tech Solutions", date: "01 mai 2024", statut: "En attente", montant: "120 000 FCFA" },
  { id: 6, service: "Réparation plomberie", prestataire: "Jean M.", date: "15 mai 2024", statut: "En cours", montant: "45 000 FCFA" },
  { id: 7, service: "Maintenance électrique", prestataire: "Electro Pro", date: "16 mai 2024", statut: "Confirmés", montant: "85 000 FCFA" },
  { id: 8, service: "Maçonnerie terrasse", prestataire: "Bâtir Plus", date: "18 mai 2024", statut: "En attente", montant: "500 000 FCFA" },
  { id: 9, service: "Frigoriste (Réparation)", prestataire: "Froid Service", date: "20 mai 2024", statut: "Finalisés", montant: "95 000 FCFA" },
  { id: 10, service: "Peinture intérieure", prestataire: "Déco Maison", date: "22 mai 2024", statut: "En cours", montant: "300 000 FCFA" },
  { id: 11, service: "Réparation smartphone", prestataire: "Tech Fix", date: "24 mai 2024", statut: "Annulés", montant: "50 000 FCFA" },
  { id: 12, service: "Installation climatiseur", prestataire: "Clim Fast", date: "25 mai 2024", statut: "Confirmés", montant: "150 000 FCFA" },
];

const getStatusColor = (statut: string) => {
  switch (statut) {
    case "Confirmés": return "bg-green-500/10 text-green-500 border-green-500/20";
    case "En cours": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "Finalisés": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "Annulés": return "bg-red-500/10 text-red-500 border-red-500/20";
    case "En attente": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export default function Services() {
  const [activeTab, setActiveTab] = useState("Tous");
  const tabs = ["Tous", "En attente", "Confirmés", "En cours", "Finalisés", "Annulés"];

  // Logique de filtrage
const filteredData =
  activeTab === "Tous"
    ? allServices
    : allServices.filter(item => item.statut === activeTab);

return (



    <div className="min-h-screen bg-[#0f0f0f] p-4 lg:p-10 text-white">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#E53E3E] flex items-center justify-center font-bold text-sm">5</div>
          <h1 className="text-xl font-bold uppercase tracking-wider">Client - Services demandés</h1>
        </div>

        <div className="flex space-x-6 border-b border-white/10 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm whitespace-nowrap transition-all duration-200 ${activeTab === tab ? "text-[#E53E3E] border-b-2 border-[#E53E3E] font-bold" : "text-white/50 hover:text-white"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-white/40 text-xs uppercase border-b border-white/5">
                <th className="p-4">Service</th>
                <th className="p-4">Prestataire</th>
                <th className="p-4">Date</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors text-sm">
                    <td className="p-4 font-medium">{item.service}</td>
                    <td className="p-4 text-white/60">{item.prestataire}</td>
                    <td className="p-4 text-white/60">{item.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] border ${getStatusColor(item.statut)}`}>
                        {item.statut}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{item.montant}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-white/30">Aucun service trouvé pour ce statut.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { Search, Download, Upload, User, Eye, Power, Trash2, X } from "lucide-react";
import { freelancersMock } from "../../constants";
import type { Freelancers } from "../../Type";

export default function Freelancers() {
  const [freelancers, setFreelancers] = useState<Freelancers[]>(freelancersMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancers | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fonction pour déterminer un statut (simulé, basé sur l'ID)
  const getStatus = (id: number): "Actif" | "Suspendu" => {
    return id % 2 === 0 ? "Actif" : "Suspendu";
  };

  // Filtrer par nom complet
  const filteredData = freelancers.filter((f) =>
    `${f.prenom} ${f.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Gestion des actions ---
  const handleViewDetails = (freelancer: Freelancers) => {
    setSelectedFreelancer(freelancer);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: number) => {
    // On ne modifie pas vraiment le statut ici car il est calculé.
    // Pour une vraie implémentation, il faudrait ajouter un champ `status` dans les données.
    // On simule un changement d'état en inversant la logique de getStatus via un état local.
    // Pour l'exemple, on va modifier un statut fictif en utilisant un Map.
    // Comme le statut est calculé, on le transforme en champ stocké.
    // On va créer un nouvel état avec un statut explicite.
    // Pour simplifier, on affiche une alerte.
    alert(`Changement de statut pour l'ID ${id} (non implémenté complètement).`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Supprimer définitivement ce prestataire ?")) {
      setFreelancers((prev) => prev.filter((f) => f.id_freelancer !== id));
    }
  };

  // --- Import / Export ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Fichier "${file.name}" importé avec succès. (Simulation)`);
      // Ici, on pourrait implémenter un vrai parsing CSV/JSON et ajouter les nouveaux freelancers
    }
  };

  const handleExport = () => {
    const csvRows = [
      ["ID", "Nom complet", "Email", "Téléphone", "Date d'inscription", "Statut"],
      ...filteredData.map((f) => [
        f.id_freelancer,
        `${f.prenom} ${f.nom}`,
        f.email,
        f.Telephone,
        f.date_creation,
        getStatus(f.id_freelancer),
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "liste_freelancers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-white text-xl font-bold uppercase tracking-wider">
            Gestion des prestataires
          </h1>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 text-[#8886BE] w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1B1B1D] border border-[#2d2d31] text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:border-[#FF6257] outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-[#1B1B1D] border border-[#2d2d31] rounded-lg hover:bg-[#2d2d31] transition-colors"
              title="Importer"
            >
              <Upload size={18} className="text-[#8886BE]" />
            </button>
            <button
              onClick={handleExport}
              className="bg-[#FF6257] hover:bg-[#E04D4D] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              <Download size={16} /> Exporter CSV
            </button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto rounded-xl border border-[#2d2d31] bg-[#0f0f0f]">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#1B1B1D] border-b border-[#2d2d31]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8886BE] uppercase tracking-wider">Prestataire</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8886BE] uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8886BE] uppercase tracking-wider">Téléphone</th>
                
                <th className="px-4 py-3 text-right text-xs font-medium text-[#8886BE] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2d31]/50">
              {filteredData.map((f) => (
                <tr
                  key={f.id_freelancer}
                  className="group transition-all duration-200 hover:bg-[#1B1B1D] hover:border-l-4 hover:border-l-[#FF6257]"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2d2d31] flex items-center justify-center">
                        <User size={14} className="text-[#8886BE]" />
                      </div>
                      <span className="text-white font-medium">{f.prenom} {f.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{f.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{f.Telephone}</td>
               
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(f)}
                        className="p-1.5 rounded-md hover:bg-[#2d2d31] transition-colors"
                        title="Voir détails"
                      >
                        <Eye size={16} className="text-[#8886BE] hover:text-white" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(f.id_freelancer)}
                        className="p-1.5 rounded-md hover:bg-[#2d2d31] transition-colors"
                        title="Suspendre / Activer"
                      >
                        <Power size={16} className="text-[#8886BE] hover:text-yellow-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(f.id_freelancer)}
                        className="p-1.5 rounded-md hover:bg-[#2d2d31] transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} className="text-[#8886BE] hover:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 bg-[#1B1B1D] rounded-xl border border-[#2d2d31] mt-4">
            <p className="text-gray-400">Aucun prestataire trouvé.</p>
          </div>
        )}
      </div>

      {/* Modal Détails */}
      {isModalOpen && selectedFreelancer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1B1B1D] rounded-xl max-w-md w-full border border-[#2d2d31] shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-[#2d2d31]">
              <h2 className="text-white font-bold">Détails du prestataire</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8886BE] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs text-[#8886BE] uppercase">Nom complet</label>
                <p className="text-white">{selectedFreelancer.prenom} {selectedFreelancer.nom}</p>
              </div>
              <div>
                <label className="text-xs text-[#8886BE] uppercase">Email</label>
                <p className="text-white">{selectedFreelancer.email}</p>
              </div>
              <div>
                <label className="text-xs text-[#8886BE] uppercase">Téléphone</label>
                <p className="text-white">{selectedFreelancer.Telephone}</p>
              </div>
              
            
            </div>
            <div className="p-4 border-t border-[#2d2d31] flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-[#FF6257] hover:bg-[#E04D4D] text-white px-4 py-2 rounded-lg text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
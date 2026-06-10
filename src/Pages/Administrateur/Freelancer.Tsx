import { useState, useRef } from "react";
import { Search, Download, Upload, User } from "lucide-react";

// Liste manuelle des freelancers
const allFreelancers = [
  { id_freelancer: 1, nom: "Mavoungou Jean", email: "jean@gmail.com", Telephone: "066654321", status: "Actif" },
  { id_freelancer: 2, nom: "Kouassi William", email: "william@gmail.com", Telephone: "066123456", status: "Suspendu" },
  { id_freelancer: 3, nom: "Diallo Moussa", email: "diallo@gmail.com", Telephone: "066987654", status: "Actif" },
  { id_freelancer: 4, nom: "Bamba Sarah", email: "sarah@gmail.com", Telephone: "066554433", status: "Actif" },
  { id_freelancer: 5, nom: "Ouedraogo Ali", email: "ali@gmail.com", Telephone: "066221100", status: "Actif" },
  { id_freelancer: 6, nom: "Zongo Marc", email: "zongo@gmail.com", Telephone: "066778899", status: "Suspendu" },
  { id_freelancer: 7, nom: "Traore Fatou", email: "fatou@gmail.com", Telephone: "066332211", status: "Actif" },
  { id_freelancer: 8, nom: "Sow Ibrahim", email: "sow@gmail.com", Telephone: "066445566", status: "Actif" },
  { id_freelancer: 9, nom: "Mavoungou Paul", email: "paul@gmail.com", Telephone: "066112233", status: "Actif" },
  { id_freelancer: 10, nom: "Kouassi Marie", email: "marie@gmail.com", Telephone: "066998877", status: "Actif" },
  { id_freelancer: 11, nom: "Diallo Oumar", email: "oumar@gmail.com", Telephone: "066556677", status: "Suspendu" },
  { id_freelancer: 12, nom: "Bamba Awa", email: "awa@gmail.com", Telephone: "066443322", status: "Actif" },
  { id_freelancer: 13, nom: "Ouedraogo Issa", email: "issa@gmail.com", Telephone: "066223344", status: "Actif" },
  { id_freelancer: 14, nom: "Zongo Luc", email: "luc@gmail.com", Telephone: "066887766", status: "Actif" },
  { id_freelancer: 15, nom: "Traore Aminata", email: "amina@gmail.com", Telephone: "066110099", status: "Actif" },
  { id_freelancer: 16, nom: "Sow Moussa", email: "moussa@gmail.com", Telephone: "066554488", status: "Suspendu" },
];

export default function Freelancer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [freelancers] = useState(allFreelancers);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredData = freelancers.filter((f) =>
    f.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Fichier "${file.name}" importé avec succès.`);
    }
  };

  const handleExport = () => {
    const csvRows = [
      ["ID", "Nom", "Email", "Telephone", "Statut"],
      ...filteredData.map(f => [f.id_freelancer, f.nom, f.email, f.Telephone, f.status])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "liste_freelancers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]  p-4 md:p-6 text-[#8886BE]">
      <div className="max-w-6xl mx-auto bg-[#0f0f0f]  border border-[#2d2d31] rounded-xl shadow-2xl">
        
        <div className="p-6 border-b border-[#2d2d31] flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-white font-bold uppercase tracking-wider flex items-center gap-3">
            <span className="text-white px-3 py-1 rounded-md text-xs"></span>
            Gestion Freelancers
          </h1>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative grow">
              <Search className="absolute left-3 top-2.5 " size={16} />
              <input 
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom..." 
                className="bg-[#181810] border border-[#2d2d31] text-white text-sm rounded-lg pl-10 pr-4 py-2 w-full focus:border-[#FF6257] outline-none"
              />
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-[#2d2d31] rounded-lg hover:bg-[#3d3d41] transition-all">
              <Upload size={18} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            <button onClick={handleExport} className="bg-[#FF6257] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#E04D4D] transition-all">
              <Download size={16} /> Exporter
            </button>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-[#181810] sticky top-0 z-10">
            <tr>
              <th className="p-4 text-[10px] uppercase tracking-widest border-b border-[#2d2d31]">Client</th>
              <th className="p-4 text-[10px] uppercase tracking-widest border-b border-[#2d2d31]">E-mail</th>
              <th className="p-4 text-[10px] uppercase tracking-widest border-b border-[#2d2d31]">Téléphone</th>
              <th className="p-4 text-[10px] uppercase tracking-widest border-b border-[#2d2d31]">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((f) => (
              <tr key={f.id_freelancer}   className="group border-b border-[#2d2d31]/50 transition-all duration-300 hover:bg-[#FF6257]/5 hover:border-l-4 hover:border-l-[#FF6257]">
                <td className="p-4 flex items-center gap-3 text-white font-medium">
                  <div className="w-8 h-8 rounded-full bg-[#2d2d31] flex items-center justify-center"><User size={14} /></div>
                  {f.nom}
                </td>
                <td className="p-4 text-sm">{f.email}</td>
                <td className="p-4 text-sm">{f.Telephone}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${f.status === "Actif" ? "bg-green-900/20 text-green-500" : "bg-red-900/20 text-[#FF6257]"}`}>
                    {f.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

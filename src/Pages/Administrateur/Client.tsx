import React, { useState } from "react";
import {
  Search,
  Download,
  Eye,
  MoreVertical,
  X,
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
} from "lucide-react";

type ClientType = {
  id: number;
  photo: string;
  nom: string;
  email: string;
  telephone: string;
  statut: string;
  inscription: string;
  commandes: number;
  depenses: string;
  avertissements: string[];
};


export default function Client() {
const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [clientToDelete, setClientToDelete] =
  useState<ClientType | null>(null);
  const [warningClient, setWarningClient] =
  useState<ClientType | null>(null);

const [warningMessage, setWarningMessage] =
  useState("");
  const [orderClient, setOrderClient] =
  useState<ClientType | null>(null);

  const [clientsData, setClientsData] = useState<ClientType[]>([
    {
      id: 1,
      photo: "https://i.pravatar.cc/150?img=1",
      nom: "Alain Dev",
      email: "alain.dev@gmail.com",
      telephone: "+243 81 123 45 67",
      statut: "Actif",
      inscription: "12 Mai 2025",
      commandes: 25,
      depenses: "$450",
      avertissements: ["Aucun avertissement"],
    },
    {
      id: 2,
      photo: "https://i.pravatar.cc/150?img=1",
      nom: "Marie L.",
      email: "marie@gmail.com",
      telephone: "+243 99 456 78 90",
      statut: "Sous surveillance",
      inscription: "03 Avril 2025",
      commandes: 12,
      depenses: "$210",
      avertissements: [
        "Retard de paiement",
        "Signalement reçu",
      ],
    },
    {
      id: 3,
      photo: "https://i.pravatar.cc/150?img=1",
      nom: "Paul T.",
      email: "paul@gmail.com",
      telephone: "+243 81 000 00 00",
      statut: "Suspendu",
      inscription: "22 Mars 2025",
      commandes: 8,
      depenses: "$95",
      avertissements: [
        "Comportement inapproprié",
      ],
    },
    {
      id: 4,
      photo: "https://i.pravatar.cc/150?img=1",
      nom: "Jean M.",
      email: "jean@gmail.com",
      telephone: "+243 82 555 66 77",
      statut: "Bloqué",
      inscription: "10 Février 2025",
      commandes: 4,
      depenses: "$30",
      avertissements: [
        "Fraude détectée",
        "Compte bloqué",
      ],
    },
  ]);

  const stats = [
    {
      title: "Clients",
      value: "1245",
      icon: <Users size={22} />,
    },
    {
      title: "Actifs",
      value: "1102",
      icon: <UserCheck size={22} />,
    },
    {
      title: "Suspendus",
      value: "98",
      icon: <ShieldAlert size={22} />,
    },
    {
      title: "Bloqués",
      value: "45",
      icon: <UserX size={22} />,
    },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-500/20 text-green-400 border border-green-500/20";

      case "Sous surveillance":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20";

      case "Suspendu":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/20";

      default:
        return "bg-red-500/20 text-red-400 border border-red-500/20";
    }
  };

  const updateStatus = (
  id: number,
  newStatus: string
) => {
  setClientsData(
    clientsData.map((client) =>
      client.id === id
        ? { ...client, statut: newStatus }
        : client
    )
  );
};

const exportClients = () => {
  const headers = [
    "Nom",
    "Email",
    "Téléphone",
    "Statut",
    "Inscription",
    "Commandes",
    "Dépenses",
  ];

  const rows = clientsData.map((client) => [
    client.nom,
    client.email,
    client.telephone,
    client.statut,
    client.inscription,
    client.commandes,
    client.depenses,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `clients-${new Date()
    .toISOString()
    .split("T")[0]}.csv`;

  link.click();

  URL.revokeObjectURL(url);
};

  const filteredClients = clientsData.filter((client) =>
  client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
  client.email.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-4 md:p-6">

      {/* Recherche + Export */}

 {/* Header */}
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

  {/* Search */}
  <div className="relative w-full md:max-w-md pl-14">
    <Search
      size={18}
      className="absolute left-17 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type="text"
      placeholder="Rechercher un client"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full bg-[#111827] border border-[#1f2937] text-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-red-500 transition"
    />
  </div>

  {/* Right buttons */}
  <div className="flex items-center gap-3">

    {/* Export button */}
    <button
      onClick={exportClients}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2a3441] text-gray-300 hover:bg-[#111c2e] transition"
    >
      <Download size={16} />
      Exporter
    </button>

  </div>

</div>

      {/* Statistiques */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 ">

        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-[#0D1321] border border-[#1A2233] rounded-2xl p-4 cursor-pointer transition-all duration-200 ease-out hover:border-red-500/40 hover:bg-[#101827]"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">
                {item.title}
              </span>

              <div className="text-[#FF5B57]">
                {item.icon}
              </div>
            </div>

            <h2 className="text-3xl font-bold">
              {item.value}
            </h2>
          </div>
        ))}

      </div>

      {/* Tableau */}

      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left px-6 py-4">Client</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Téléphone</th>
                <th className="text-left px-6 py-4">Statut</th>
                <th className="text-center px-6 py-4">Actions</th>
              </tr>
            </thead>

            {filteredClients.length === 0 && (
  <div className="text-center py-8 text-slate-400">
    Aucun résultat trouvé
  </div>
)}

            <tbody>
                            {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-slate-800 hover:bg-slate-800/30 transition"
                >
                  {/* Client */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">

<img
  src={client.photo}
  alt={client.nom}
  onClick={() => setSelectedImage(client.photo)}
  className="h-11 w-11 rounded-full object-cover border border-slate-700 cursor-pointer hover:scale-110 hover:ring-2 hover:ring-[#FF5B57] transition"
/>

                      <div>
                        <p className="font-medium text-white">
                          {client.nom}
                        </p>

                        <p className="text-xs text-slate-400">
                          Client Mboka
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* Email */}

                  <td className="px-6 py-4 text-slate-300">
                    {client.email}
                  </td>

                  {/* Téléphone */}

                  <td className="px-6 py-4 text-slate-300">
                    {client.telephone}
                  </td>

                  {/* Statut */}

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        client.statut
                      )}`}
                    >
                      {client.statut === "Actif" && "🟢 Actif"}
                      {client.statut === "Sous surveillance" &&
                        "🟡 Sous surveillance"}
                      {client.statut === "Suspendu" &&
                        "🟠 Suspendu"}
                      {client.statut === "Bloqué" &&
                        "🔴 Bloqué"}
                    </span>

                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-2 relative">

                      {/* Voir */}

                   <button
  onClick={() => setSelectedClient(client)}
  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300"
>
  <Eye size={16} />
  <span className="font-medium">Voir</span>
</button>

                      {/* Menu */}

                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === client.id
                              ? null
                              : client.id
                          )
                        }
                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {/* Dropdown */}

                      {openMenu === client.id && (
                        <div className="absolute right-0 top-12 z-50 w-64 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl overflow-hidden">

                          <button
  onClick={() => {
    setOrderClient(client);
    setOpenMenu(null);
  }}
  className="w-full text-left px-4 py-3 hover:bg-slate-700/50 transition"
>
  📦 Voir les commandes
</button>

                        <button
  onClick={() => {
    setWarningClient(client);
    setOpenMenu(null);
  }}
  className="w-full text-left px-4 py-3 text-yellow-400 hover:bg-yellow-500/10 transition"
>
  ⚠️ Envoyer un avertissement
</button>

                          <button
  onClick={() => {
    updateStatus(client.id, "Suspendu");
    setOpenMenu(null);
  }}
  className="w-full text-left px-4 py-3 text-orange-400 hover:bg-orange-500/10 transition"
>
  ⏸️ Suspendre le compte
</button>
{client.statut !== "Bloqué" ? (
  <button
    onClick={() => {
      updateStatus(client.id, "Bloqué");
      setOpenMenu(null);
    }}
    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition"
  >
    🚫 Bloquer le compte
  </button>
) : (
  <button
    onClick={() => {
      updateStatus(client.id, "Actif");
      setOpenMenu(null);
    }}
    className="w-full text-left px-4 py-3 text-green-400 hover:bg-green-500/10 transition"
  >
    🔓 Débloquer le compte
  </button>
)}

                         <button
  onClick={() => {
    setClientToDelete(client);
    setOpenMenu(null);
  }}
  className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition"
>
  🗑️ Supprimer le compte
</button>

                        </div>
                      )}

                    </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>

      {selectedImage && (
  <>
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
      onClick={() => setSelectedImage(null)}
    />

    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">

      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 rounded-full p-3"
      >
        <X size={24} />
      </button>

      <img
        src={selectedImage}
        alt="Photo du client"
        className="max-w-full md:max-w-[700px] max-h-[85vh] rounded-3xl shadow-2xl object-cover"
      />

    </div>
  </>
)}

{/* Confirmation suppression */}
{clientToDelete && (
  <div className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4">

    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 w-full max-w-md">

      <h3 className="text-xl font-semibold mb-4">
        Confirmation
      </h3>

      <p className="text-slate-300 mb-6">
        Voulez-vous vraiment supprimer le client
        <span className="font-bold">
          {" "}{clientToDelete.nom}
        </span> ?
      </p>

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setClientToDelete(null)}
          className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
        >
          Annuler
        </button>

        <button
          onClick={() => {
            setClientsData(
              clientsData.filter(
                (c) => c.id !== clientToDelete.id
              )
            );

            setClientToDelete(null);
          }}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
        >
          Supprimer
        </button>

      </div>

    </div>

  </div>
)}

{/* Modal Avertissement */}
{warningClient && (
  <div className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4">

    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 w-full max-w-lg">

      <h3 className="text-xl font-semibold mb-4">
        Envoyer un avertissement
      </h3>

      <p className="text-slate-400 mb-4">
        Client : {warningClient.nom}
      </p>

      <textarea
        value={warningMessage}
        onChange={(e) => setWarningMessage(e.target.value)}
        placeholder="Saisissez votre message..."
        className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:border-yellow-500 resize-none"
      />

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => {
            setWarningClient(null);
            setWarningMessage("");
          }}
          className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
        >
          Annuler
        </button>

        <button
          onClick={() => {

            if (!warningMessage.trim()) return;

            setClientsData(
              clientsData.map((c) =>
                c.id === warningClient.id
                  ? {
                      ...c,
                      avertissements: [
                        ...c.avertissements,
                        warningMessage,
                      ],
                    }
                  : c
              )
            );

            setWarningMessage("");
            setWarningClient(null);
          }}
          className="px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
        >
          Envoyer
        </button>

      </div>

    </div>

  </div>
)}

{/* Modal Commandes */}
{orderClient && (
  <div className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4">

    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 w-full max-w-lg">

      <h3 className="text-xl font-semibold mb-4">
        Commandes du client
      </h3>

      <div className="space-y-4">

        <div className="bg-slate-800/40 rounded-xl p-4">
          <p className="text-slate-400 text-sm">
            Client
          </p>

          <p className="mt-1 font-semibold">
            {orderClient.nom}
          </p>
        </div>

        <div className="bg-slate-800/40 rounded-xl p-4">
          <p className="text-slate-400 text-sm">
            Nombre total de commandes
          </p>

          <p className="mt-1 text-2xl font-bold text-[#FF5B57]">
            {orderClient.commandes}
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-blue-300">
            Cette section sera connectée à l'API des commandes lors de l'intégration backend.
          </p>
        </div>

      </div>

      <div className="flex justify-end mt-6">

        <button
          onClick={() => setOrderClient(null)}
          className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
        >
          Fermer
        </button>

      </div>

    </div>

  </div>
)}
            {/* Drawer Client */}

      {selectedClient && (
        <>
          {/* Overlay */}

          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setSelectedClient(null)}
          />

          {/* Drawer */}

          <div className="fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-[#0F172A] border-l border-slate-800 z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">

            {/* Header */}

            <div className="flex items-center justify-between p-6 border-b border-slate-800">

              <h2 className="text-xl font-bold">
                Détails du client
              </h2>

              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-lg hover:bg-slate-800 transition"
              >
                <X size={20} />
              </button>

            </div>

            {/* Contenu */}

            <div className="p-6">

              {/* Avatar */}

              <div className="flex flex-col items-center mb-8">

<div className="h-28 w-28 rounded-full overflow-hidden border-4 border-[#FF5B57] shadow-lg">
  <img
    src={selectedClient.photo}
    alt={selectedClient.nom}
    className="w-full h-full object-cover"
  />
</div>

                <h3 className="mt-4 text-xl font-semibold">
                  {selectedClient.nom}
                </h3>

                <span
                  className={`mt-2 px-3 py-1 rounded-full text-xs ${getStatusClass(
                    selectedClient.statut
                  )}`}
                >
                  {selectedClient.statut}
                </span>

              </div>

              {/* Informations */}

              <div className="space-y-4">

                <div className="bg-slate-800/40 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="mt-1">
                    {selectedClient.email}
                  </p>
                </div>

                <div className="bg-slate-800/40 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Téléphone</p>
                  <p className="mt-1">
                    {selectedClient.telephone}
                  </p>
                </div>

                <div className="bg-slate-800/40 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">
                    Date d'inscription
                  </p>
                  <p className="mt-1">
                    {selectedClient.inscription}
                  </p>
                </div>

                <div className="bg-slate-800/40 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">
                    Nombre de commandes
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {selectedClient.commandes}
                  </p>
                </div>

                <div className="bg-slate-800/40 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">
                    Montant total dépensé
                  </p>
                  <p className="mt-1 text-lg font-semibold text-green-400">
                    {selectedClient.depenses}
                  </p>
                </div>

              </div>

              {/* Historique */}

              <div className="mt-8">

                <h4 className="font-semibold text-lg mb-4">
                  Historique des avertissements
                </h4>

                <div className="space-y-3">

                  {selectedClient.avertissements.map(
                    (item: string, index: number) => (
                      <div
                        key={index}
                        className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4"
                      >
                        <p className="text-yellow-300">
                          {item}
                        </p>
                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

          </div>
        </>
      )}
    </div>
  );
}
import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Calendar,
  Download,
  Eye,
  Mail,
  MoreVertical,
  Phone,
  Search,
  ShieldAlert,
  ShoppingBag,
  Trash2,
  UserCheck,
  Users,
  UserX,
  Wallet,
  X,
} from "lucide-react";

import type { Avertissements, Clients } from "../../Type";

import {
  avertissementsMock,
  clientsMock,
  paiementsMock,
  servicesMock,
  signalementsMock,
  walletsMock,
} from "../../constants";

type StatutClient = "Actif" | "Sous surveillance" | "Suspendu" | "Bloqué";

export default function Client() {
  const [clients, setClients] = useState<Clients[]>(clientsMock);
  const [recherche, setRecherche] = useState("");
  const [menuOuvert, setMenuOuvert] = useState<number | null>(null);

  const [clientSelectionne, setClientSelectionne] = useState<Clients | null>(
    null
  );
  const [imageSelectionnee, setImageSelectionnee] = useState<string | null>(
    null
  );
  const [clientASupprimer, setClientASupprimer] = useState<Clients | null>(
    null
  );
  const [clientAvertir, setClientAvertir] = useState<Clients | null>(null);
  const [messageAvertissement, setMessageAvertissement] = useState("");
  const [clientCommandes, setClientCommandes] = useState<Clients | null>(null);

  const [avertissements, setAvertissements] =
    useState<Avertissements[]>(avertissementsMock);

  const [statutsModifies, setStatutsModifies] = useState<
    Record<number, StatutClient>
  >({});

  const clientsFiltres = useMemo(() => {
    const texte = recherche.toLowerCase();

    return clients.filter((client) => {
      const nomComplet = `${client.prenom} ${client.nom}`.toLowerCase();

      return (
        nomComplet.includes(texte) ||
        client.email.toLowerCase().includes(texte) ||
        client.Telephone.toLowerCase().includes(texte)
      );
    });
  }, [clients, recherche]);

  const statistiques = [
    {
      titre: "Clients",
      valeur: clients.length,
      icone: <Users size={20} />,
    },
    {
      titre: "Actifs",
      valeur: clients.filter((client) => obtenirStatutClient(client) === "Actif")
        .length,
      icone: <UserCheck size={20} />,
    },
    {
      titre: "Suspendus",
      valeur: clients.filter(
        (client) => obtenirStatutClient(client) === "Suspendu"
      ).length,
      icone: <ShieldAlert size={20} />,
    },
    {
      titre: "Bloqués",
      valeur: clients.filter((client) => obtenirStatutClient(client) === "Bloqué")
        .length,
      icone: <UserX size={20} />,
    },
  ];

  function obtenirStatutClient(client: Clients): StatutClient {
    if (statutsModifies[client.id_client]) {
      return statutsModifies[client.id_client];
    }

    const nombreAvertissements = obtenirAvertissementsClient(
      client.id_client
    ).length;

    const nombreSignalements = obtenirSignalementsClient(client.id_client).length;

    if (nombreSignalements >= 2) return "Suspendu";
    if (nombreAvertissements > 0 || nombreSignalements > 0) {
      return "Sous surveillance";
    }

    return "Actif";
  }

  function modifierStatut(idClient: number, statut: StatutClient) {
    setStatutsModifies((anciensStatuts) => ({
      ...anciensStatuts,
      [idClient]: statut,
    }));
  }

  function obtenirServicesClient(idClient: number) {
    return servicesMock.filter((service) => service.id_client === idClient);
  }

  function obtenirDepensesClient(idClient: number) {
    return paiementsMock
      .filter((paiement) => paiement.id_client === idClient)
      .reduce((total, paiement) => total + paiement.montant_ajoute, 0);
  }

  function obtenirWalletClient(idClient: number) {
    return walletsMock.find((wallet) => wallet.id_client === idClient);
  }

  function obtenirAvertissementsClient(idClient: number) {
    return avertissements.filter(
      (avertissement) => avertissement.id_client === idClient
    );
  }

  function obtenirSignalementsClient(idClient: number) {
    return signalementsMock.filter(
      (signalement) =>
        signalement.signaleur_type === "freelancer" &&
        signalement.id_signalé === idClient
    );
  }

  function exporterClients() {
    const lignes = clients.map((client) => {
      const statut = obtenirStatutClient(client);
      const commandes = obtenirServicesClient(client.id_client).length;
      const depenses = obtenirDepensesClient(client.id_client);

      return [
        `${client.prenom} ${client.nom}`,
        client.email,
        client.Telephone,
        statut,
        client.date_creation,
        commandes,
        depenses,
      ];
    });

    const contenuCsv = [
      [
        "Nom",
        "Email",
        "Téléphone",
        "Statut",
        "Inscription",
        "Commandes",
        "Dépenses",
      ].join(","),
      ...lignes.map((ligne) => ligne.join(",")),
    ].join("\n");

    const blob = new Blob([contenuCsv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");

    lien.href = url;
    lien.download = `clients-${new Date().toISOString().split("T")[0]}.csv`;
    lien.click();

    URL.revokeObjectURL(url);
  }

  function supprimerClient() {
    if (!clientASupprimer) return;

    setClients((anciensClients) =>
      anciensClients.filter(
        (client) => client.id_client !== clientASupprimer.id_client
      )
    );

    setClientASupprimer(null);
  }

  function envoyerAvertissement() {
    if (!clientAvertir || !messageAvertissement.trim()) return;

    const nouvelAvertissement: Avertissements = {
      id_avertissement: Date.now(),
      id_client: clientAvertir.id_client,
      id_freelancer: null,
      id_admin: 1,
      contenu_avertissement: messageAvertissement,
    };

    setAvertissements((anciensAvertissements) => [
      nouvelAvertissement,
      ...anciensAvertissements,
    ]);

    setMessageAvertissement("");
    setClientAvertir(null);
  }

  return (
    <main className="min-h-screen bg-[#111113] px-4 pb-10 pt-24 text-white md:px-6 lg:px-8">
      <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#FF6257]">
            Admin - Gestion clients
          </p>

          <h1 className="mt-2 text-2xl font-bold md:text-3xl">Clients</h1>

          <p className="mt-1 text-sm text-[#B8B8BE]">
            Suivez les comptes clients, leurs commandes, leurs paiements et les
            avertissements.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="relative w-full lg:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B8BE]"
            />

            <input
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un client..."
              className="w-full rounded-xl border border-[#2D2D31] bg-[#1B1B1D] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-[#B8B8BE]/60 transition focus:border-[#FF6257]"
            />
          </div>

          <button
            onClick={exporterClients}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#2D2D31] bg-[#1B1B1D] px-4 py-3 text-sm font-semibold text-[#B8B8BE] transition hover:border-[#FF6257]/40 hover:text-white"
          >
            <Download size={16} />
            Exporter
          </button>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statistiques.map((item) => (
          <CarteStatistique
            key={item.titre}
            titre={item.titre}
            valeur={item.valeur}
            icone={item.icone}
          />
        ))}
      </section>

      <section className="space-y-3 md:hidden">
        {clientsFiltres.length === 0 && (
          <MessageVide texte="Aucun client trouvé." />
        )}

        {clientsFiltres.map((client) => (
          <CarteClientMobile
            key={client.id_client}
            client={client}
            statut={obtenirStatutClient(client)}
            commandes={obtenirServicesClient(client.id_client).length}
            depenses={obtenirDepensesClient(client.id_client)}
            getStatusClass={getStatusClass}
            menuOuvert={menuOuvert}
            setMenuOuvert={setMenuOuvert}
            setClientSelectionne={setClientSelectionne}
            setImageSelectionnee={setImageSelectionnee}
            modifierStatut={modifierStatut}
            setClientCommandes={setClientCommandes}
            setClientAvertir={setClientAvertir}
            setClientASupprimer={setClientASupprimer}
          />
        ))}
      </section>

      <section className="hidden overflow-hidden rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#2D2D31] text-sm text-[#B8B8BE]">
                <th className="px-6 py-4 text-left font-semibold">Client</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Téléphone
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Commandes
                </th>
                <th className="px-6 py-4 text-left font-semibold">Statut</th>
                <th className="px-6 py-4 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {clientsFiltres.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-[#B8B8BE]"
                  >
                    Aucun client trouvé.
                  </td>
                </tr>
              )}

              {clientsFiltres.map((client) => {
                const statut = obtenirStatutClient(client);
                const commandes = obtenirServicesClient(client.id_client).length;

                return (
                  <tr
                    key={client.id_client}
                    className="border-b border-[#2D2D31] transition last:border-b-0 hover:bg-[#111113]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={client.photo}
                          alt={`${client.prenom} ${client.nom}`}
                          onClick={() => setImageSelectionnee(client.photo)}
                          className="h-11 w-11 cursor-pointer rounded-full border border-[#2D2D31] object-cover transition hover:scale-105 hover:ring-2 hover:ring-[#FF6257]"
                        />

                        <div>
                          <p className="font-semibold text-white">
                            {client.prenom} {client.nom}
                          </p>

                          <p className="text-xs text-[#B8B8BE]">
                            Client MBOKA
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#B8B8BE]">
                      {client.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#B8B8BE]">
                      {client.Telephone}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-white">
                      {commandes}
                    </td>

                    <td className="px-6 py-4">
                      <BadgeStatut
                        statut={statut}
                        className={getStatusClass(statut)}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="relative flex justify-center gap-2">
                        <button
                          onClick={() => setClientSelectionne(client)}
                          className="flex items-center gap-2 rounded-xl border border-[#FF6257]/40 bg-[#FF6257]/10 px-4 py-2 text-sm font-semibold text-[#FF6257] transition hover:bg-[#FF6257] hover:text-white"
                        >
                          <Eye size={16} />
                          Voir
                        </button>

                        <button
                          onClick={() =>
                            setMenuOuvert(
                              menuOuvert === client.id_client
                                ? null
                                : client.id_client
                            )
                          }
                          className="rounded-xl border border-[#2D2D31] bg-[#111113] p-2 text-[#B8B8BE] transition hover:border-[#FF6257]/40 hover:text-white"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {menuOuvert === client.id_client && (
                          <MenuActions
                            client={client}
                            statut={statut}
                            modifierStatut={modifierStatut}
                            setClientCommandes={setClientCommandes}
                            setClientAvertir={setClientAvertir}
                            setClientASupprimer={setClientASupprimer}
                            setMenuOuvert={setMenuOuvert}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {imageSelectionnee && (
        <ImageModal
          image={imageSelectionnee}
          onClose={() => setImageSelectionnee(null)}
        />
      )}

      {clientASupprimer && (
        <ConfirmationModal
          client={clientASupprimer}
          onClose={() => setClientASupprimer(null)}
          onConfirm={supprimerClient}
        />
      )}

      {clientAvertir && (
        <AvertissementModal
          client={clientAvertir}
          message={messageAvertissement}
          setMessage={setMessageAvertissement}
          onClose={() => {
            setClientAvertir(null);
            setMessageAvertissement("");
          }}
          onSend={envoyerAvertissement}
        />
      )}

      {clientCommandes && (
        <CommandesModal
          client={clientCommandes}
          services={obtenirServicesClient(clientCommandes.id_client)}
          depenses={obtenirDepensesClient(clientCommandes.id_client)}
          onClose={() => setClientCommandes(null)}
        />
      )}

      {clientSelectionne && (
        <ClientDrawer
          client={clientSelectionne}
          statut={obtenirStatutClient(clientSelectionne)}
          wallet={obtenirWalletClient(clientSelectionne.id_client)}
          commandes={obtenirServicesClient(clientSelectionne.id_client).length}
          depenses={obtenirDepensesClient(clientSelectionne.id_client)}
          avertissements={obtenirAvertissementsClient(
            clientSelectionne.id_client
          )}
          signalements={obtenirSignalementsClient(clientSelectionne.id_client)}
          getStatusClass={getStatusClass}
          onClose={() => setClientSelectionne(null)}
        />
      )}
    </main>
  );
}

function CarteStatistique({
  titre,
  valeur,
  icone,
}: {
  titre: string;
  valeur: number;
  icone: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-3 transition hover:border-[#FF6257]/40 hover:shadow-[0_8px_30px_rgba(255,98,87,0.10)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-[#B8B8BE]">{titre}</span>

        <div className="rounded-xl bg-[#FF6257]/10 p-2 text-[#FF6257]">
          {icone}
        </div>
      </div>

      <h2 className="text-sm font-bold">{valeur}</h2>
    </div>
  );
}

function CarteClientMobile({
  client,
  statut,
  commandes,
  depenses,
  getStatusClass,
  menuOuvert,
  setMenuOuvert,
  setClientSelectionne,
  setImageSelectionnee,
  modifierStatut,
  setClientCommandes,
  setClientAvertir,
  setClientASupprimer,
}: {
  client: Clients;
  statut: StatutClient;
  commandes: number;
  depenses: number;
  getStatusClass: (statut: StatutClient) => string;
  menuOuvert: number | null;
  setMenuOuvert: (id: number | null) => void;
  setClientSelectionne: (client: Clients) => void;
  setImageSelectionnee: (image: string) => void;
  modifierStatut: (idClient: number, statut: StatutClient) => void;
  setClientCommandes: (client: Clients) => void;
  setClientAvertir: (client: Clients) => void;
  setClientASupprimer: (client: Clients) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={client.photo}
            alt={`${client.prenom} ${client.nom}`}
            onClick={() => setImageSelectionnee(client.photo)}
            className="h-12 w-12 shrink-0 cursor-pointer rounded-full border border-[#2D2D31] object-cover"
          />

          <div className="min-w-0">
            <p className="truncate font-semibold">
              {client.prenom} {client.nom}
            </p>

            <p className="truncate text-xs text-[#B8B8BE]">{client.email}</p>
          </div>
        </div>

        <BadgeStatut statut={statut} className={getStatusClass(statut)} />
      </div>

      <div className="mb-4 grid gap-2 text-sm text-[#B8B8BE]">
        <p className="flex items-center gap-2">
          <Phone size={14} className="text-[#FF6257]" />
          {client.Telephone}
        </p>

        <p className="flex items-center gap-2">
          <ShoppingBag size={14} className="text-[#FF6257]" />
          {commandes} commande{commandes > 1 ? "s" : ""}
        </p>

        <p className="flex items-center gap-2">
          <Wallet size={14} className="text-[#FF6257]" />
          {formatMontant(depenses)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setClientSelectionne(client)}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#FF6257]/40 bg-[#FF6257]/10 px-3 py-2 text-sm font-semibold text-[#FF6257]"
        >
          <Eye size={15} />
          Voir
        </button>

        <button
          onClick={() =>
            setMenuOuvert(menuOuvert === client.id_client ? null : client.id_client)
          }
          className="flex items-center justify-center gap-2 rounded-xl border border-[#2D2D31] px-3 py-2 text-sm font-semibold text-[#B8B8BE]"
        >
          <MoreVertical size={15} />
          Actions
        </button>
      </div>

      {menuOuvert === client.id_client && (
        <MenuActions
          client={client}
          statut={statut}
          modifierStatut={modifierStatut}
          setClientCommandes={setClientCommandes}
          setClientAvertir={setClientAvertir}
          setClientASupprimer={setClientASupprimer}
          setMenuOuvert={setMenuOuvert}
        />
      )}
    </div>
  );
}

function MenuActions({
  client,
  statut,
  modifierStatut,
  setClientCommandes,
  setClientAvertir,
  setClientASupprimer,
  setMenuOuvert,
}: {
  client: Clients;
  statut: StatutClient;
  modifierStatut: (idClient: number, statut: StatutClient) => void;
  setClientCommandes: (client: Clients) => void;
  setClientAvertir: (client: Clients) => void;
  setClientASupprimer: (client: Clients) => void;
  setMenuOuvert: (id: number | null) => void;
}) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[#2D2D31] bg-[#111113] shadow-2xl md:absolute md:right-0 md:top-12 md:z-[100] md:mt-0 md:w-64">
      <BoutonMenu
        onClick={() => {
          setClientCommandes(client);
          setMenuOuvert(null);
        }}
      >
        📦 Voir les commandes
      </BoutonMenu>

      <BoutonMenu
        className="text-yellow-400 hover:bg-yellow-500/10"
        onClick={() => {
          setClientAvertir(client);
          setMenuOuvert(null);
        }}
      >
        ⚠️ Envoyer un avertissement
      </BoutonMenu>

      <BoutonMenu
        className="text-orange-400 hover:bg-orange-500/10"
        onClick={() => {
          modifierStatut(client.id_client, "Suspendu");
          setMenuOuvert(null);
        }}
      >
        ⏸️ Suspendre le compte
      </BoutonMenu>

      {statut !== "Bloqué" ? (
        <BoutonMenu
          className="text-red-400 hover:bg-red-500/10"
          onClick={() => {
            modifierStatut(client.id_client, "Bloqué");
            setMenuOuvert(null);
          }}
        >
          🚫 Bloquer le compte
        </BoutonMenu>
      ) : (
        <BoutonMenu
          className="text-green-400 hover:bg-green-500/10"
          onClick={() => {
            modifierStatut(client.id_client, "Actif");
            setMenuOuvert(null);
          }}
        >
          🔓 Débloquer le compte
        </BoutonMenu>
      )}

      <BoutonMenu
        className="text-red-400 hover:bg-red-500/10"
        onClick={() => {
          setClientASupprimer(client);
          setMenuOuvert(null);
        }}
      >
        🗑️ Supprimer le compte
      </BoutonMenu>
    </div>
  );
}

function BoutonMenu({
  children,
  onClick,
  className = "text-[#B8B8BE] hover:bg-[#FF6257]/10 hover:text-white",
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 text-left text-sm transition ${className}`}
    >
      {children}
    </button>
  );
}

function BadgeStatut({
  statut,
  className,
}: {
  statut: StatutClient;
  className: string;
}) {
  return (
    <span
      className={`w-fit rounded-full border px-3 py-1 text-[11px] font-semibold ${className}`}
    >
      {statut}
    </span>
  );
}

function ImageModal({ image, onClose }: { image: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute right-6 top-6 rounded-full border border-[#2D2D31] bg-[#1B1B1D] p-3 text-white"
      >
        <X size={24} />
      </button>

      <img
        src={image}
        alt="Photo du client"
        className="max-h-[85vh] max-w-full rounded-3xl object-cover shadow-2xl md:max-w-[700px]"
      />
    </div>
  );
}

function ConfirmationModal({
  client,
  onClose,
  onConfirm,
}: {
  client: Clients;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-6">
        <div className="mb-4 flex items-center gap-3 text-red-400">
          <Trash2 />
          <h3 className="text-xl font-semibold text-white">Confirmation</h3>
        </div>

        <p className="mb-6 text-sm text-[#B8B8BE]">
          Voulez-vous vraiment supprimer le client{" "}
          <span className="font-bold text-white">
            {client.prenom} {client.nom}
          </span>{" "}
          ?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#2D2D31] px-4 py-2 text-[#B8B8BE] hover:text-white"
          >
            Annuler
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

function AvertissementModal({
  client,
  message,
  setMessage,
  onClose,
  onSend,
}: {
  client: Clients;
  message: string;
  setMessage: (message: string) => void;
  onClose: () => void;
  onSend: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-6">
        <div className="mb-4 flex items-center gap-3 text-yellow-400">
          <AlertTriangle />

          <h3 className="text-xl font-semibold text-white">
            Envoyer un avertissement
          </h3>
        </div>

        <p className="mb-4 text-sm text-[#B8B8BE]">
          Client : {client.prenom} {client.nom}
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Saisissez votre message..."
          className="h-32 w-full resize-none rounded-xl border border-[#2D2D31] bg-[#111113] p-4 text-white outline-none placeholder:text-[#B8B8BE]/60 focus:border-yellow-500"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#2D2D31] px-4 py-2 text-[#B8B8BE] hover:text-white"
          >
            Annuler
          </button>

          <button
            onClick={onSend}
            className="rounded-xl bg-yellow-600 px-4 py-2 font-semibold text-white hover:bg-yellow-700"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

function CommandesModal({
  client,
  services,
  depenses,
  onClose,
}: {
  client: Clients;
  services: ReturnType<typeof servicesMock.filter>;
  depenses: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-6">
        <h3 className="mb-1 text-xl font-semibold">Commandes du client</h3>

        <p className="mb-5 text-sm text-[#B8B8BE]">
          {client.prenom} {client.nom}
        </p>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <InfoBloc label="Total commandes" value={String(services.length)} />

          <InfoBloc label="Total dépensé" value={formatMontant(depenses)} />
        </div>

        <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
          {services.length > 0 ? (
            services.map((service) => {
              const paiement = paiementsMock.find(
                (item) => item.id_service === service.id_service
              );

              return (
                <div
                  key={service.id_service}
                  className="rounded-xl border border-[#2D2D31] bg-[#111113] p-4"
                >
                  <p className="font-semibold text-white">{service.intitule}</p>

                  <p className="mt-1 text-sm text-[#B8B8BE]">
                    {service.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-[#B8B8BE]">
                      {service.date_creation}
                    </span>

                    <span className="font-semibold text-white">
                      {formatMontant(paiement?.montant_ajoute ?? 0)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <MessageVide texte="Aucune commande pour ce client." />
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#2D2D31] px-4 py-2 text-[#B8B8BE] hover:border-[#FF6257]/40 hover:text-white"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function ClientDrawer({
  client,
  statut,
  wallet,
  commandes,
  depenses,
  avertissements,
  signalements,
  getStatusClass,
  onClose,
}: {
  client: Clients;
  statut: StatutClient;
  wallet?: { montant: number; devise: string };
  commandes: number;
  depenses: number;
  avertissements: Avertissements[];
  signalements: ReturnType<typeof signalementsMock.filter>;
  getStatusClass: (statut: StatutClient) => string;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 z-[9999] h-screen w-full overflow-y-auto border-l border-[#2D2D31] bg-[#1B1B1D] shadow-2xl sm:w-[450px]">
        <div className="flex items-center justify-between border-b border-[#2D2D31] p-5">
          <h2 className="text-xl font-bold">Détails du client</h2>

          <button
            onClick={onClose}
            className="rounded-xl border border-[#2D2D31] p-2 text-[#B8B8BE] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-8 flex flex-col items-center text-center">
            <img
              src={client.photo}
              alt={`${client.prenom} ${client.nom}`}
              className="h-28 w-28 rounded-full border-4 border-[#FF6257] object-cover shadow-lg"
            />

            <h3 className="mt-4 text-xl font-semibold">
              {client.prenom} {client.nom}
            </h3>

            <span
              className={`mt-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                statut
              )}`}
            >
              {statut}
            </span>
          </div>

          <div className="space-y-4">
            <InfoBloc icon={<Mail size={15} />} label="Email" value={client.email} />
            <InfoBloc
              icon={<Phone size={15} />}
              label="Téléphone"
              value={client.Telephone}
            />
            <InfoBloc
              icon={<Calendar size={15} />}
              label="Date d'inscription"
              value={client.date_creation}
            />
            <InfoBloc
              icon={<ShoppingBag size={15} />}
              label="Nombre de commandes"
              value={String(commandes)}
            />
            <InfoBloc
              icon={<Wallet size={15} />}
              label="Montant total dépensé"
              value={formatMontant(depenses)}
            />
            <InfoBloc
              icon={<Wallet size={15} />}
              label="Solde wallet"
              value={formatMontant(wallet?.montant ?? 0)}
            />
          </div>

          <div className="mt-8">
            <h4 className="mb-4 text-lg font-semibold">
              Historique des avertissements
            </h4>

            <div className="space-y-3">
              {avertissements.length > 0 ? (
                avertissements.map((item) => (
                  <div
                    key={item.id_avertissement}
                    className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4"
                  >
                    <p className="text-sm text-yellow-300">
                      {item.contenu_avertissement}
                    </p>
                  </div>
                ))
              ) : (
                <MessageVide texte="Aucun avertissement." />
              )}
            </div>
          </div>

          <div className="mt-8">
            <h4 className="mb-4 text-lg font-semibold">
              Signalements reçus
            </h4>

            <div className="space-y-3">
              {signalements.length > 0 ? (
                signalements.map((item) => (
                  <div
                    key={item.id_signalement}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 p-4"
                  >
                    <p className="text-sm font-semibold text-red-300">
                      {item.categorie}
                    </p>

                    <p className="mt-1 text-sm text-[#B8B8BE]">
                      {item.Signalement}
                    </p>
                  </div>
                ))
              ) : (
                <MessageVide texte="Aucun signalement." />
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function InfoBloc({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#2D2D31] bg-[#111113] p-4">
      <p className="flex items-center gap-2 text-sm text-[#B8B8BE]">
        {icon && <span className="text-[#FF6257]">{icon}</span>}
        {label}
      </p>

      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function MessageVide({ texte }: { texte: string }) {
  return (
    <div className="rounded-xl border border-[#2D2D31] bg-[#111113] p-6 text-center text-sm text-[#B8B8BE]">
      {texte}
    </div>
  );
}

function getStatusClass(statut: StatutClient) {
  switch (statut) {
    case "Actif":
      return "border-green-500/30 bg-green-500/10 text-green-400";
    case "Sous surveillance":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    case "Suspendu":
      return "border-orange-500/30 bg-orange-500/10 text-orange-400";
    case "Bloqué":
      return "border-red-500/30 bg-red-500/10 text-red-400";
  }
}

function formatMontant(montant: number) {
  return `${montant.toLocaleString("fr-FR")} FCFA`;
}
import { useMemo, useRef, useState, type ReactNode } from "react";
import type React from "react";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Camera,
  CheckCircle2,
  Save,
  ShoppingBag,
  UserRound,
  Wallet,
} from "lucide-react";

import type { Clients, Service } from "../../Type";

import { useUser } from "../../Context/UtilisateurContext";

import {
  avertissementsMock,
  clientsMock,
  freelancersMock,
  notificationsMock,
  paiementsMock,
  profilsFreelancersMock,
  servicesMock,
  walletsMock,
} from "../../constants";

type OngletCompte = "informations" | "activite" | "wallet" | "notifications";

export default function MonCompte() {
  const { user, setUser } = useUser();

  const clientInitial: Clients =
    user && "id_client" in user ? user : clientsMock[0];

  const [ongletActif, setOngletActif] =
    useState<OngletCompte>("informations");

  const [clientLocal, setClientLocal] = useState<Clients>(clientInitial);

  const [messageSucces, setMessageSucces] = useState(false);

  const inputPhotoRef = useRef<HTMLInputElement>(null);

  const servicesClient = useMemo(
    () =>
      servicesMock.filter(
        (service) => service.id_client === clientLocal.id_client
      ),
    [clientLocal.id_client]
  );

  const paiementsClient = useMemo(
    () =>
      paiementsMock.filter(
        (paiement) => paiement.id_client === clientLocal.id_client
      ),
    [clientLocal.id_client]
  );

  const walletClient = walletsMock.find(
    (wallet) => wallet.id_client === clientLocal.id_client
  );

  const notificationsClient = notificationsMock.filter(
    (notification) => notification.id_client === clientLocal.id_client
  );

  const avertissementsClient = avertissementsMock.filter(
    (avertissement) => avertissement.id_client === clientLocal.id_client
  );

  const totalDepense = paiementsClient.reduce(
    (total, paiement) => total + paiement.montant_ajoute,
    0
  );

  function modifierChamp(champ: keyof Clients, valeur: string) {
    setClientLocal((ancienClient) => ({
      ...ancienClient,
      [champ]: valeur,
    }));
  }

  function modifierPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];

    if (!fichier) return;

    const nouvellePhoto = URL.createObjectURL(fichier);

    setClientLocal((ancienClient) => ({
      ...ancienClient,
      photo: nouvellePhoto,
    }));
  }

  function enregistrer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (user && "id_client" in user) {
      setUser(clientLocal);
    }

    setMessageSucces(true);

    setTimeout(() => {
      setMessageSucces(false);
    }, 2500);
  }

  return (
    <main className="min-h-screen bg-[#111113] px-4 pb-10 pt-24 text-white md:px-6 lg:px-8">
      <input
        ref={inputPhotoRef}
        type="file"
        accept="image/*"
        onChange={modifierPhoto}
        className="hidden"
      />

      <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#FF6257]">
            Client - Mon compte
          </p>

          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            Bonjour {clientLocal.prenom}
          </h1>

          <p className="mt-1 text-sm text-[#B8B8BE]">
            Gérez vos informations personnelles, vos demandes et votre wallet.
          </p>
        </div>

        {messageSucces && (
          <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-400">
            <CheckCircle2 size={17} />
            Modifications enregistrées
          </div>
        )}
      </section>

      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <CarteStatistique
          titre="Demandes"
          valeur={String(servicesClient.length)}
          detail="Services demandés"
          icone={<ShoppingBag size={20} />}
        />

        <CarteStatistique
          titre="Dépenses"
          valeur={formatMontant(totalDepense)}
          detail="Total payé"
          icone={<Wallet size={20} />}
        />

        <CarteStatistique
          titre="Solde wallet"
          valeur={formatMontant(walletClient?.montant ?? 0)}
          detail={walletClient?.devise ?? "XAF"}
          icone={<Wallet size={20} />}
        />

        <CarteStatistique
          titre="Notifications"
          valeur={String(notificationsClient.length)}
          detail="Messages reçus"
          icone={<Bell size={20} />}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-5">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={clientLocal.photo}
                  alt={`${clientLocal.prenom} ${clientLocal.nom}`}
                  className="h-28 w-28 rounded-full border-4 border-[#FF6257] object-cover shadow-lg"
                />

                <button
                  type="button"
                  onClick={() => inputPhotoRef.current?.click()}
                  className="absolute bottom-1 right-1 rounded-full border-2 border-[#1B1B1D] bg-[#FF6257] p-2 text-white transition hover:bg-[#E84D4D]"
                >
                  <Camera size={15} />
                </button>
              </div>

              <h2 className="mt-4 text-xl font-bold">
                {clientLocal.prenom} {clientLocal.nom}
              </h2>

              <p className="mt-1 text-sm text-[#B8B8BE]">
                Client MBOKA depuis {formatDate(clientLocal.date_creation)}
              </p>

              <span className="mt-3 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                Compte actif
              </span>
            </div>

            <nav className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-1">
              <BoutonOnglet
                actif={ongletActif === "informations"}
                icone={<UserRound size={17} />}
                label="Informations"
                onClick={() => setOngletActif("informations")}
              />

              <BoutonOnglet
                actif={ongletActif === "activite"}
                icone={<ShoppingBag size={17} />}
                label="Mes demandes"
                onClick={() => setOngletActif("activite")}
              />

              <BoutonOnglet
                actif={ongletActif === "wallet"}
                icone={<Wallet size={17} />}
                label="Wallet"
                onClick={() => setOngletActif("wallet")}
              />

              <BoutonOnglet
                actif={ongletActif === "notifications"}
                icone={<Bell size={17} />}
                label="Notifications"
                onClick={() => setOngletActif("notifications")}
              />
            </nav>
          </div>
        </aside>

        <section className="lg:col-span-8 xl:col-span-9">
          {ongletActif === "informations" && (
            <BlocInformations
              client={clientLocal}
              modifierChamp={modifierChamp}
              enregistrer={enregistrer}
            />
          )}

          {ongletActif === "activite" && (
            <BlocActivite services={servicesClient} />
          )}

          {ongletActif === "wallet" && (
            <BlocWallet
              solde={walletClient?.montant ?? 0}
              devise={walletClient?.devise ?? "XAF"}
              totalDepense={totalDepense}
              paiements={paiementsClient}
            />
          )}

          {ongletActif === "notifications" && (
            <BlocNotifications
              notifications={notificationsClient}
              avertissements={avertissementsClient}
            />
          )}
        </section>
      </section>
    </main>
  );
}

function BlocInformations({
  client,
  modifierChamp,
  enregistrer,
}: {
  client: Clients;
  modifierChamp: (champ: keyof Clients, valeur: string) => void;
  enregistrer: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Informations personnelles</h2>

        <p className="mt-1 text-sm text-[#B8B8BE]">
          Ces informations sont utilisées pour identifier votre compte client.
        </p>
      </div>

      <form onSubmit={enregistrer} className="grid gap-4 md:grid-cols-2">
        <ChampFormulaire
          label="Prénom"
          value={client.prenom}
          onChange={(valeur) => modifierChamp("prenom", valeur)}
        />

        <ChampFormulaire
          label="Nom"
          value={client.nom}
          onChange={(valeur) => modifierChamp("nom", valeur)}
        />

        <ChampFormulaire
          label="Email"
          type="email"
          value={client.email}
          onChange={(valeur) => modifierChamp("email", valeur)}
        />

        <ChampFormulaire
          label="Téléphone"
          value={client.Telephone}
          onChange={(valeur) => modifierChamp("Telephone", valeur)}
        />

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-[#B8B8BE]">
            Date de création
          </label>

          <div className="flex items-center gap-2 rounded-xl border border-[#2D2D31] bg-[#111113] px-4 py-3 text-sm text-[#B8B8BE]">
            <Calendar size={16} className="text-[#FF6257]" />
            {formatDate(client.date_creation)}
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6257] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#E84D4D] sm:w-auto"
          >
            <Save size={17} />
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}

function BlocActivite({ services }: { services: Service[] }) {
  return (
    <div className="rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Mes demandes de services</h2>

        <p className="mt-1 text-sm text-[#B8B8BE]">
          Retrouvez les services que vous avez demandés sur MBOKA.
        </p>
      </div>

      <div className="space-y-3">
        {services.length > 0 ? (
          services.map((service) => (
            <CarteService key={service.id_service} service={service} />
          ))
        ) : (
          <MessageVide texte="Vous n’avez encore demandé aucun service." />
        )}
      </div>
    </div>
  );
}

function BlocWallet({
  solde,
  devise,
  totalDepense,
  paiements,
}: {
  solde: number;
  devise: string;
  totalDepense: number;
  paiements: { id_paiement: number; id_service: number; montant_ajoute: number }[];
}) {
  return (
    <div className="rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Wallet</h2>

        <p className="mt-1 text-sm text-[#B8B8BE]">
          Aperçu de votre solde et de vos paiements.
        </p>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[#2D2D31] bg-gradient-to-br from-[#B52D3A]/30 via-[#111113] to-[#111113] p-5">
          <p className="text-sm text-[#B8B8BE]">Solde disponible</p>

          <h3 className="mt-2 text-2xl font-bold">{formatMontant(solde)}</h3>

          <p className="mt-1 text-xs text-[#B8B8BE]">Devise : {devise}</p>
        </div>

        <div className="rounded-2xl border border-[#2D2D31] bg-[#111113] p-5">
          <p className="text-sm text-[#B8B8BE]">Total dépensé</p>

          <h3 className="mt-2 text-2xl font-bold">{formatMontant(totalDepense)}</h3>

          <p className="mt-1 text-xs text-[#B8B8BE]">
            Paiements enregistrés : {paiements.length}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {paiements.length > 0 ? (
          paiements.map((paiement) => {
            const service = servicesMock.find(
              (item) => item.id_service === paiement.id_service
            );

            return (
              <div
                key={paiement.id_paiement}
                className="flex flex-col gap-2 rounded-xl border border-[#2D2D31] bg-[#111113] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">
                    {service?.intitule ?? "Paiement service"}
                  </p>

                  <p className="mt-1 text-sm text-[#B8B8BE]">
                    {service?.date_creation
                      ? formatDate(service.date_creation)
                      : "Date non définie"}
                  </p>
                </div>

                <p className="font-bold text-[#FF6257]">
                  {formatMontant(paiement.montant_ajoute)}
                </p>
              </div>
            );
          })
        ) : (
          <MessageVide texte="Aucun paiement enregistré." />
        )}
      </div>
    </div>
  );
}

function BlocNotifications({
  notifications,
  avertissements,
}: {
  notifications: { id_notification: number; notification: string; date?: string }[];
  avertissements: { id_avertissement: number; contenu_avertissement: string }[];
}) {
  return (
    <div className="rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Notifications</h2>

        <p className="mt-1 text-sm text-[#B8B8BE]">
          Vos notifications et avertissements liés à votre compte.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">
            Notifications récentes
          </h3>

          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id_notification}
                  className="rounded-xl border border-[#2D2D31] bg-[#111113] p-4"
                >
                  <div className="flex gap-3">
                    <Bell size={18} className="mt-0.5 shrink-0 text-[#FF6257]" />

                    <div>
                      <p className="text-sm text-white">
                        {notification.notification}
                      </p>

                      <p className="mt-1 text-xs text-[#B8B8BE]">
                        {notification.date ?? "Date non définie"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <MessageVide texte="Aucune notification pour le moment." />
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">
            Avertissements
          </h3>

          <div className="space-y-3">
            {avertissements.length > 0 ? (
              avertissements.map((avertissement) => (
                <div
                  key={avertissement.id_avertissement}
                  className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4"
                >
                  <div className="flex gap-3">
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 shrink-0 text-yellow-400"
                    />

                    <p className="text-sm text-yellow-200">
                      {avertissement.contenu_avertissement}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <MessageVide texte="Aucun avertissement sur votre compte." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CarteService({ service }: { service: Service }) {
  const freelancer = freelancersMock.find(
    (item) => item.id_freelancer === service.id_freelancer
  );

  const profil = profilsFreelancersMock.find(
    (item) => item.id_freelancer === service.id_freelancer
  );

  const paiement = paiementsMock.find(
    (item) => item.id_service === service.id_service
  );

  return (
    <div className="rounded-xl border border-[#2D2D31] bg-[#111113] p-4 transition hover:border-[#FF6257]/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-white">{service.intitule}</p>

          <p className="mt-1 text-sm text-[#B8B8BE]">{service.description}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-[#2D2D31] px-3 py-1 text-[#B8B8BE]">
              {formatDate(service.date_creation)}
            </span>

            <span className="rounded-full border border-[#FF6257]/20 bg-[#FF6257]/10 px-3 py-1 text-[#FF6257]">
              {profil?.profession ?? "Freelancer"}
            </span>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="font-bold text-white">
            {formatMontant(paiement?.montant_ajoute ?? 0)}
          </p>

          <p className="mt-1 text-sm text-[#B8B8BE]">
            Par {freelancer?.prenom ?? "Freelancer"} {freelancer?.nom ?? ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function CarteStatistique({
  titre,
  valeur,
  detail,
  icone,
}: {
  titre: string;
  valeur: string;
  detail: string;
  icone: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#2D2D31] bg-[#1B1B1D] p-4 transition hover:border-[#FF6257]/40 hover:shadow-[0_8px_30px_rgba(255,98,87,0.10)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm text-[#B8B8BE]">{titre}</span>

        <div className="rounded-xl bg-[#FF6257]/10 p-2 text-[#FF6257]">
          {icone}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="mt-1 text-sm text-[#B8B8BE]">{detail}</p>
        <h2 className="text-sm font-semibold">{valeur}</h2>
      </div>
    </div>
  );
}

function BoutonOnglet({
  actif,
  icone,
  label,
  onClick,
}: {
  actif: boolean;
  icone: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition lg:justify-start ${
        actif
          ? "bg-[#FF6257] text-white"
          : "border border-[#2D2D31] bg-[#111113] text-[#B8B8BE] hover:border-[#FF6257]/40 hover:text-white"
      }`}
    >
      {icone}
      <span className="truncate">{label}</span>
    </button>
  );
}

function ChampFormulaire({
  label,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (valeur: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#B8B8BE]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#2D2D31] bg-[#111113] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#B8B8BE]/60 focus:border-[#FF6257]"
      />
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

function formatMontant(montant: number) {
  return `${montant.toLocaleString("fr-FR")} FCFA`;
}

function formatDate(date: string) {
  const valeur = new Date(date);

  if (Number.isNaN(valeur.getTime())) return date;

  return valeur.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
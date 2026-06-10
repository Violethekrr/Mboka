import { BriefcaseBusiness, CheckCircle, Clock, Star, TrendingUp, Wallet, } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import type { ReactNode } from "react";
import type { Service } from "../../Type";
import { clientsMock, freelancersMock, paiementsMock, servicesMock, walletsMock, } from "../../constants";
import { useUser } from "../../Context/UtilisateurContext";
import { Link } from "react-router";

type StatutDemande = "En attente" | "En cours" | "Finalisé" | "Refusé";

const revenusParMois = [
  { mois: "Jan", revenus: 80000 },
  { mois: "Fév", revenus: 130000 },
  { mois: "Mar", revenus: 110000 },
  { mois: "Avr", revenus: 170000 },
  { mois: "Mai", revenus: 150000 },
  { mois: "Juin", revenus: 220000 },
];

export default function Accueil() {
  const { user } = useUser();
  const freelancer = user && "id_freelancer" in user ? user : freelancersMock[0];
  const wallet = walletsMock.find(
    (wallet) => wallet.id_freelancer === freelancer.id_freelancer
  );
  const servicesDuFreelancer = servicesMock.filter(
    (service) => service.id_freelancer === freelancer.id_freelancer
  );
  const demandesRecentes =
    servicesDuFreelancer.length >= 2
      ? servicesDuFreelancer.slice(0, 2)
      : servicesDuFreelancer;

  const revenusTotal = paiementsMock
    .filter((paiement) =>
      demandesRecentes.some(
        (service) => service.id_service === paiement.id_service
      )
    )
    .reduce((total, paiement) => total + paiement.montant_ajoute, 0);

  const demandesFinalisees = demandesRecentes.filter(
    (service) => obtenirStatut(service) === "Finalisé"
  ).length;

  return (
    <main className="min-h-screen bg-[#111113] px-4 pb-10 pt-24 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#FF6257]">
              Freelancer - Accueil
            </p>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Bonjour {freelancer.prenom}
            </h1>

            <p className="mt-2 text-sm text-[#B8B8BE]">
              Voici un aperçu de votre activité sur MBOKA.
            </p>
          </div>

          <Link to="/freelancer/compte" className="w-fit rounded-lg border border-white/10 bg-[#1B1B1D] px-4 py-2 text-sm text-[#B8B8BE] transition hover:border-[#FF6257] hover:text-white">
            Mes profils
          </Link>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <CarteStatistique
            titre="Revenus ce mois"
            valeur={formatMontant(revenusTotal)}
            evolution="+12%"
            icone={<Wallet size={18} />}
          />

          <CarteStatistique
            titre="Commandes"
            valeur={demandesRecentes.length.toString()}
            evolution="+2"
            icone={<BriefcaseBusiness size={18} />}
          />

          <CarteStatistique
            titre="Taux de réponse"
            valeur="95%"
            evolution="Excellent"
            icone={<CheckCircle size={18} />}
          />

          <CarteStatistique
            titre="Note moyenne"
            valeur="4.9"
            evolution="Très bien"
            icone={<Star size={18} />}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-[#1B1B1D] p-3 lg:col-span-2 mb-auto">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Revenus</h2>
                <p className="text-sm text-[#B8B8BE]">
                  Évolution des revenus récents
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                <TrendingUp size={13} />
                +18%
              </div>
            </div>
            <CourbeRevenus />
          </div>

          <div className="rounded-lg border border-white/10 bg-[#1B1B1D] p-3">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Demandes récentes</h2>
                <p className="text-sm text-[#B8B8BE]">
                  Les dernières demandes reçues
                </p>
              </div>

              <Link to="/freelancer/services" className="text-xs font-semibold text-[#FF6257]">
                Voir tout
              </Link>
            </div>

            <div className="space-y-4">
              {demandesRecentes.map((service) => (
                <CarteDemande key={service.id_service} service={service} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <CarteInfo
            titre="Solde disponible"
            valeur={formatMontant(wallet?.montant ?? 0)}
          />

          <CarteInfo
            titre="Commandes finalisées"
            valeur={demandesFinalisees.toString()}
          />

          <CarteInfo titre="Rang actuel" valeur="Freelancer vérifié" />
        </section>
      </div>
    </main>
  );
}

function CarteStatistique({
  titre,
  valeur,
  evolution,
  icone,
}: {
  titre: string;
  valeur: string;
  evolution: string;
  icone: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#1B1B1D] p-3">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg bg-[#FF6257]/10 p-2 text-[#FF6257]">
          {icone}
        </div>

        <span className="text-xs text-green-400">{evolution}</span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[#B8B8BE]">{titre}</p>
        <h2 className="text-sm font-bold">{valeur}</h2>
      </div>
    </div>
  );
}

function CourbeRevenus() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenusParMois}>
          <CartesianGrid stroke="#2D2D31" strokeDasharray="3 3" />

          <XAxis dataKey="mois" stroke="#B8B8BE" tick={{ fontSize: 12 }} />

          <YAxis
            stroke="#B8B8BE"
            tick={{ fontSize: 12 }}
            tickFormatter={(valeur) => `${valeur / 1000}k`}
          />

          <Tooltip
            cursor={{ stroke: "#FF6257", strokeWidth: 1 }}
            formatter={(valeur) => formatMontant(Number(valeur))}
            contentStyle={{
              backgroundColor: "#1B1B1D",
              border: "1px solid #2D2D31",
              borderRadius: "12px",
              color: "#FFFFFF",
            }}
            labelStyle={{ color: "#FFFFFF" }}
            itemStyle={{ color: "#FF6257" }}
          />

          <Area
            type="monotone"
            dataKey="revenus"
            stroke="#FF6257"
            fill="#FF6257"
            fillOpacity={0.18}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CarteDemande({ service }: { service: Service }) {
  const client = clientsMock.find(
    (client) => client.id_client === service.id_client
  );

  const paiement = paiementsMock.find(
    (paiement) => paiement.id_service === service.id_service
  );

  const statut = obtenirStatut(service);

  return (
    <div className="rounded-xl border border-white/10 bg-[#202023] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">
            {service.intitule}
          </h3>

          <p className="mt-1 text-xs text-[#B8B8BE]">
            Par {client ? `${client.prenom} ${client.nom}` : "Client inconnu"}
          </p>
        </div>

        <BadgeStatut statut={statut} />
      </div>

      <p className="mb-3 line-clamp-2 text-xs text-[#B8B8BE]">
        {service.description}
      </p>

      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-[#B8B8BE]">
          <Clock size={12} />
          {service.date_creation}
        </span>

        <span className="font-semibold text-white">
          {formatMontant(paiement?.montant_ajoute ?? 0)}
        </span>
      </div>
    </div>
  );
}

function BadgeStatut({ statut }: { statut: StatutDemande }) {
  const couleur =
    statut === "Finalisé"
      ? "bg-green-500/10 text-green-400"
      : statut === "En cours"
      ? "bg-yellow-500/10 text-yellow-400"
      : statut === "Refusé"
      ? "bg-red-500/10 text-red-400"
      : "bg-blue-500/10 text-blue-400";

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] ${couleur}`}>
      {statut}
    </span>
  );
}

function CarteInfo({ titre, valeur }: { titre: string; valeur: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#1B1B1D] p-3">
      <p className="text-sm text-[#B8B8BE]">{titre}</p>
      <h3 className="mt-2 text-xl font-bold">{valeur}</h3>
    </div>
  );
}

function obtenirStatut(service: Service): StatutDemande {
  if (service.id_service % 4 === 0) return "Refusé";
  if (service.id_service % 3 === 0) return "En cours";
  if (service.id_service % 2 === 0) return "Finalisé";

  return "En attente";
}

function formatMontant(montant: number) {
  return `${montant.toLocaleString("fr-FR")} FCFA`;
}
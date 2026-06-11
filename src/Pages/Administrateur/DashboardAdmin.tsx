import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  MessageSquareWarning,
  Search,
  ShieldAlert,
  Star,
  Users,
} from "lucide-react";

import type { Freelancers, ProfilFreelancers, Signalement } from "../../Type";

import {
  clientsMock,
  commentairesMock,
  freelancersMock,
  paiementsMock,
  profilsFreelancersMock,
  rangsMock,
  servicesMock,
  signalementsMock,
} from "../../constants";

type FreelancerStat = Freelancers & {
  profil?: ProfilFreelancers;
  rang: string;
  commandes: number;
  revenus: number;
  avis: number;
  note: number;
};

const couleursGraphique = [
  "#FF6257",
  "#FF7B6B",
  "#E84D4D",
  "#B52D3A",
  "#F59E0B",
  "#22C55E",
  "#38BDF8",
];

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [recherche, setRecherche] = useState("");

  const totalUtilisateurs = clientsMock.length + freelancersMock.length;

  const revenuTotal = paiementsMock.reduce(
    (total, paiement) => total + paiement.montant_ajoute,
    0
  );

  const signalementsEnAttente = signalementsMock.filter(
    (signalement) => signalement.statut === "en_attente"
  ).length;

  const activiteParDate = useMemo(() => {
    return servicesMock.map((service) => {
      const paiement = paiementsMock.find(
        (item) => item.id_service === service.id_service
      );

      return {
        date: formaterDateCourte(service.date_creation),
        revenus: paiement?.montant_ajoute ?? 0,
        commandes: 1,
      };
    });
  }, []);

  const repartitionServices = useMemo(() => {
    const secteurs = profilsFreelancersMock.reduce<Record<string, number>>(
      (resultat, profil) => {
        resultat[profil.secteur_activite] =
          (resultat[profil.secteur_activite] ?? 0) + 1;

        return resultat;
      },
      {}
    );

    return Object.entries(secteurs).map(([name, value]) => ({
      name,
      value,
    }));
  }, []);

  const freelancersAvecStats = useMemo<FreelancerStat[]>(() => {
    return freelancersMock
      .map((freelancer) => {
        const profil = profilsFreelancersMock.find(
          (item) => item.id_freelancer === freelancer.id_freelancer
        );

        const rang = rangsMock.find(
          (item) => item.id_freelancer === freelancer.id_freelancer
        );

        const commandes = servicesMock.filter(
          (service) => service.id_freelancer === freelancer.id_freelancer
        ).length;

        const revenus = paiementsMock
          .filter((paiement) => paiement.id_freelancer === freelancer.id_freelancer)
          .reduce((total, paiement) => total + paiement.montant_ajoute, 0);

        const commentaires = commentairesMock.filter(
          (commentaire) =>
            commentaire.id_freelancer === freelancer.id_freelancer
        );

        return {
          ...freelancer,
          profil,
          rang: rang?.rang ?? "niveau_débutant",
          commandes,
          revenus,
          avis: commentaires.length,
          note: obtenirNoteMoyenne(freelancer.id_freelancer),
        };
      })
      .sort((a, b) => b.revenus - a.revenus || b.note - a.note);
  }, []);

  const freelancersAffiches = freelancersAvecStats
    .filter((freelancer) => {
      const texte = recherche.toLowerCase();

      return (
        `${freelancer.prenom} ${freelancer.nom}`.toLowerCase().includes(texte) ||
        freelancer.profil?.profession.toLowerCase().includes(texte) ||
        freelancer.profil?.secteur_activite.toLowerCase().includes(texte)
      );
    })
    .slice(0, 6);

  const derniersSignalements = [...signalementsMock]
    .sort((a, b) => b.id_signalement - a.id_signalement)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#0f0f0f]  px-4 pb-10 pt-5 text-white md:px-6 lg:px-8">
      <section className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#FF6257] ml-7">
            Admin - Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            Bonjour Admin
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-[#B8B8BE]">
            Suivez l’activité de MBOKA : utilisateurs, commandes, revenus,
            prestataires et signalements.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/administrateur/clients")}
            className="rounded-lg border border-[#2D2D31] bg-[#1B1B1D] px-4 py-3 text-sm font-semibold text-[#B8B8BE] transition hover:border-[#FF6257]/40 hover:text-white"
          >
            Gestion clients
          </button>

          <button
            onClick={() => navigate("/administrateur/freelancers")}
            className="rounded-lg bg-[#FF6257] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#E84D4D]"
          >
            Gestion prestataires
          </button>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <CarteStatistique
          titre="Utilisateurs"
          valeur={totalUtilisateurs.toString()}
          icone={<Users size={20} />}
        />

        <CarteStatistique
          titre="Services"
          valeur={servicesMock.length.toString()}
          icone={<BriefcaseBusiness size={20} />}
        />

        <CarteStatistique
          titre="Revenus"
          valeur={formatMontant(revenuTotal)}
          icone={<CircleDollarSign size={20} />}
        />

        <CarteStatistique
          titre="Signalements"
          valeur={signalementsEnAttente.toString()}
          icone={<ShieldAlert size={20} />}
        />
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-lg border border-[#2D2D31] bg-[#1B1B1D] p-5 xl:col-span-2">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Évolution des commandes
              </h2>

              <p className="text-sm text-[#B8B8BE]">
                Revenus générés par service enregistré.
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
              + activité récente
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activiteParDate}>
                <defs>
                  <linearGradient id="revenusMboka" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6257" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#FF6257" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#2D2D31" strokeDasharray="3 3" />

                <XAxis dataKey="date" stroke="#B8B8BE" tick={{ fontSize: 12 }} />

                <YAxis
                  stroke="#B8B8BE"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(valeur) => `${Number(valeur) / 1000}k`}
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
                  strokeWidth={3}
                  fill="url(#revenusMboka)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-[#2D2D31] bg-[#1B1B1D] p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              Répartition des profils
            </h2>

            <p className="text-sm text-[#B8B8BE]">
              Catégories professionnelles des freelancers.
            </p>
          </div>

          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={repartitionServices}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  stroke="#1B1B1D"
                  strokeWidth={4}
                >
                  {repartitionServices.map((_, index) => (
                    <Cell
                      key={index}
                      fill={couleursGraphique[index % couleursGraphique.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1B1B1D",
                    border: "1px solid #2D2D31",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {freelancersMock.length}
              </span>
              <span className="text-xs text-[#B8B8BE]">Freelancers</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {repartitionServices.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      couleursGraphique[index % couleursGraphique.length],
                  }}
                />
                <span className="truncate text-[#B8B8BE]">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-lg border border-[#2D2D31] bg-[#1B1B1D] p-5 xl:col-span-2">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Top freelancers
              </h2>

              <p className="text-sm text-[#B8B8BE]">
                Classement basé sur les revenus, commandes et avis.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B8BE]"
              />

              <input
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher..."
                className="w-full rounded-xl border border-[#2D2D31] bg-[#111113] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-[#B8B8BE]/60 focus:border-[#FF6257]"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {freelancersAffiches.map((freelancer) => (
              <CarteFreelancerDashboard
                key={freelancer.id_freelancer}
                freelancer={freelancer}
              />
            ))}

            {freelancersAffiches.length === 0 && (
              <div className="rounded-xl border border-[#2D2D31] bg-[#111113] p-6 text-center text-sm text-[#B8B8BE] sm:col-span-2 2xl:col-span-3">
                Aucun freelancer trouvé.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-[#2D2D31] bg-[#1B1B1D] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Signalements récents
              </h2>

              <p className="text-sm text-[#B8B8BE]">
                Dernières alertes à traiter.
              </p>
            </div>

            <button
              onClick={() => navigate("/administrateur/signales")}
              className="text-sm font-semibold text-[#FF6257] hover:text-[#FF7B6B]"
            >
              Voir tout
            </button>
          </div>

          <div className="space-y-3">
            {derniersSignalements.map((signalement) => (
              <CarteSignalement
                key={signalement.id_signalement}
                signalement={signalement}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <BoutonRapide
          titre="Clients"
          description="Consulter et gérer les comptes clients."
          icone={<Users size={20} />}
          onClick={() => navigate("/administrateur/clients")}
        />

        <BoutonRapide
          titre="Freelancers"
          description="Gérer les prestataires et leurs profils."
          icone={<UserCheckIcon />}
          onClick={() => navigate("/administrateur/freelancers")}
        />

        <BoutonRapide
          titre="Commentaires"
          description="Modérer les avis et commentaires."
          icone={<MessageSquareWarning size={20} />}
          onClick={() => navigate("/administrateur/commentaires")}
        />

        <BoutonRapide
          titre="Signalements"
          description="Traiter les comptes signalés."
          icone={<ShieldAlert size={20} />}
          onClick={() => navigate("/administrateur/signales")}
        />
      </section>
    </main>
  );
}

function CarteStatistique({
  titre,
  valeur,
  icone,
}: {
  titre: string;
  valeur: string;
  icone: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#2D2D31] bg-[#1B1B1D] p-3 transition hover:border-[#FF6257]/40 hover:shadow-[0_8px_30px_rgba(255,98,87,0.10)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="rounded-xl bg-[#FF6257]/10 p-2 text-[#FF6257]">
          {icone}
        </div>

        <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-400">
          actif
        </span>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-[#B8B8BE]">{titre}</p>
        <h2 className="mt-2 text-sm font-semibold">{valeur}</h2>
      </div>
    </div>
  );
}

function CarteFreelancerDashboard({
  freelancer,
}: {
  freelancer: FreelancerStat;
}) {
  return (
    <div className="rounded-lg border border-[#2D2D31] bg-[#111113] p-4 transition hover:border-[#FF6257]/40 hover:bg-[#18181A]">
      <div className="mb-4 flex items-center gap-3">
        <img
          src={freelancer.photo}
          alt={`${freelancer.prenom} ${freelancer.nom}`}
          className="h-12 w-12 rounded-xl border border-[#2D2D31] object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">
            {freelancer.prenom} {freelancer.nom}
          </p>

          <p className="truncate text-xs text-[#FF6257]">
            {freelancer.profil?.profession ?? "Freelancer"}
          </p>
        </div>

        <div className="flex items-center gap-1 text-sm text-amber-400">
          <Star size={14} fill="currentColor" />
          {freelancer.note.toFixed(1)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <MiniStat label="Cmd" value={String(freelancer.commandes)} />
        <MiniStat label="Avis" value={String(freelancer.avis)} />
        <MiniStat label="Revenus" value={formatMontantCourt(freelancer.revenus)} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full border border-[#2D2D31] px-3 py-1 text-xs text-[#B8B8BE]">
          {formatRang(freelancer.rang)}
        </span>

        <button className="flex items-center gap-1 text-xs font-semibold text-[#FF6257]">
          <Eye size={14} />
          Profil
        </button>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#2D2D31] bg-[#1B1B1D] p-2">
      <p className="text-[10px] text-[#B8B8BE]">{label}</p>
      <p className="mt-1 text-xs font-bold text-white">{value}</p>
    </div>
  );
}

function CarteSignalement({ signalement }: { signalement: Signalement }) {
  return (
    <div className="rounded-xl border border-[#2D2D31] bg-[#111113] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">
            {signalement.categorie ?? "Signalement"}
          </p>

          <p className="mt-1 text-xs text-[#B8B8BE]">
            {signalement.signaleur_type} #{signalement.id_signaleur}
          </p>
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${couleurStatutSignalement(
            signalement.statut
          )}`}
        >
          {formatStatutSignalement(signalement.statut)}
        </span>
      </div>

      <p className="line-clamp-2 text-sm text-[#B8B8BE]">
        {signalement.Signalement}
      </p>

      <p className="mt-3 text-xs text-[#B8B8BE]/70">
        {signalement.date ?? "Date non définie"}
      </p>
    </div>
  );
}

function BoutonRapide({
  titre,
  description,
  icone,
  onClick,
}: {
  titre: string;
  description: string;
  icone: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-lg border border-[#2D2D31] bg-[#1B1B1D] p-5 text-left transition hover:border-[#FF6257]/40 hover:bg-[#18181A]"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6257]/10 text-[#FF6257] transition group-hover:bg-[#FF6257] group-hover:text-white">
        {icone}
      </div>

      <h3 className="font-semibold text-white">{titre}</h3>

      <p className="mt-1 text-sm text-[#B8B8BE]">{description}</p>

      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#FF6257]">
        Ouvrir
        <ArrowRight size={14} />
      </div>
    </button>
  );
}

function UserCheckIcon() {
  return <CheckCircle2 size={20} />;
}

function obtenirNoteMoyenne(idFreelancer: number) {
  const commentaires = commentairesMock.filter(
    (commentaire) => commentaire.id_freelancer === idFreelancer
  );

  if (commentaires.length === 0) return 4.5;

  const total = commentaires.reduce(
    (somme, commentaire) => somme + obtenirNote(commentaire.id_commentaire),
    0
  );

  return total / commentaires.length;
}

function obtenirNote(idCommentaire: number) {
  const notes = [5, 4, 5, 3, 4, 2, 5, 4, 1, 5];

  return notes[(idCommentaire - 1) % notes.length];
}

function couleurStatutSignalement(statut?: string) {
  switch (statut) {
    case "resolu":
      return "border-green-500/30 bg-green-500/10 text-green-400";
    case "en_cours":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    case "rejete":
      return "border-red-500/30 bg-red-500/10 text-red-400";
    default:
      return "border-[#FF6257]/30 bg-[#FF6257]/10 text-[#FF6257]";
  }
}

function formatStatutSignalement(statut?: string) {
  switch (statut) {
    case "resolu":
      return "Résolu";
    case "en_cours":
      return "En cours";
    case "rejete":
      return "Rejeté";
    default:
      return "En attente";
  }
}

function formatRang(rang: string) {
  if (rang === "expert") return "Expert";
  if (rang === "intermédiaire") return "Intermédiaire";
  return "Débutant";
}

function formatMontant(montant: number) {
  return `${montant.toLocaleString("fr-FR")} FCFA`;
}

function formatMontantCourt(montant: number) {
  if (montant >= 1000000) return `${(montant / 1000000).toFixed(1)}M`;
  if (montant >= 1000) return `${Math.round(montant / 1000)}k`;
  return montant.toString();
}

function formaterDateCourte(date: string) {
  const valeur = new Date(date);

  if (Number.isNaN(valeur.getTime())) return date;

  return valeur.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
}
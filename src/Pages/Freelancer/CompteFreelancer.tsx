import { useState, type ReactNode } from "react";
import type React from "react";
import { Briefcase, FileText, Mail, Phone, Plus, Star, Trash2, User, Wallet, } from "lucide-react";
import type { ProfilFreelancers } from "../../Type";
import { freelancersMock, profilsFreelancersMock, rangsMock, servicesMock, walletsMock, } from "../../constants";
import { useUser } from "../../Context/UtilisateurContext";

export default function CompteFreelancer() {
  const { user } = useUser();
  const freelancer =
    user && "id_freelancer" in user ? user : freelancersMock[0];

  const rang = rangsMock.find(
    (rang) => rang.id_freelancer === freelancer.id_freelancer
  );

  const wallet = walletsMock.find(
    (wallet) => wallet.id_freelancer === freelancer.id_freelancer
  );

  const services = servicesMock.filter(
    (service) => service.id_freelancer === freelancer.id_freelancer
  );

  const [profils, setProfils] = useState<ProfilFreelancers[]>(() =>
    profilsFreelancersMock.filter(
      (profil) => profil.id_freelancer === freelancer.id_freelancer
    )
  );

  const [nouveauProfil, setNouveauProfil] = useState({
    secteur_activite: "",
    profession: "",
    descritpion: "",
    document: "",
  });

  function ajouterProfil(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      nouveauProfil.secteur_activite.trim() === "" ||
      nouveauProfil.profession.trim() === ""
    ) {
      return;
    }

    const profil: ProfilFreelancers = {
      id_profil: Date.now(),
      id_freelancer: freelancer.id_freelancer,
      secteur_activite: nouveauProfil.secteur_activite,
      profession: nouveauProfil.profession,
      descritpion: nouveauProfil.descritpion,
      document: nouveauProfil.document || "Aucun document",
    };

    setProfils((anciensProfils) => [profil, ...anciensProfils]);

    setNouveauProfil({
      secteur_activite: "",
      profession: "",
      descritpion: "",
      document: "",
    });
  }

  function supprimerProfil(idProfil: number) {
    setProfils((anciensProfils) =>
      anciensProfils.filter((profil) => profil.id_profil !== idProfil)
    );
  }

  return (
    <main className="min-h-screen bg-[#111113] px-4 pb-10 pt-24 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-6 rounded-2xl border border-white/10 bg-[#1B1B1D] p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <img
                src={freelancer.photo}
                alt={freelancer.prenom}
                className="h-24 w-24 rounded-2xl object-cover"
              />

              <div>
                <h1 className="text-2xl font-bold">
                  {freelancer.prenom} {freelancer.nom}
                </h1>

                <p className="mt-2 text-sm text-[#B8B8BE]">
                  Freelancer MBOKA • {formatRang(rang?.rang ?? "niveau_débutant")}
                </p>

                <p className="mt-2 max-w-2xl text-sm text-[#B8B8BE]">
                  Gérez vos informations personnelles et vos différents profils
                  professionnels.
                </p>
              </div>
            </div>

            <button className="w-fit rounded-lg bg-[#FF6257] px-5 py-3 text-sm font-semibold text-white hover:bg-[#E84D4D]">
              Modifier le compte
            </button>
          </div>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <CarteStatistique
            titre="Solde disponible"
            valeur={formatMontant(wallet?.montant ?? 0)}
            icone={<Wallet size={18} />}
          />

          <CarteStatistique
            titre="Profils"
            valeur={profils.length.toString()}
            icone={<User size={18} />}
          />

          <CarteStatistique
            titre="Services"
            valeur={services.length.toString()}
            icone={<Briefcase size={18} />}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Carte titre="Informations personnelles">
              <div className="grid gap-4 md:grid-cols-2">
                <LigneInfo
                  icone={<User size={16} />}
                  label="Nom complet"
                  valeur={`${freelancer.prenom} ${freelancer.nom}`}
                />

                <LigneInfo
                  icone={<Mail size={16} />}
                  label="Email"
                  valeur={freelancer.email}
                />

                <LigneInfo
                  icone={<Phone size={16} />}
                  label="Téléphone"
                  valeur={freelancer.Telephone}
                />

                <LigneInfo
                  icone={<Star size={16} />}
                  label="Rang"
                  valeur={formatRang(rang?.rang ?? "niveau_débutant")}
                />
              </div>
            </Carte>

            <Carte titre="Mes profils professionnels">
              <div className="grid gap-4 md:grid-cols-2">
                {profils.map((profil) => (
                  <div
                    key={profil.id_profil}
                    className="rounded-lg border border-white/10 bg-[#202023] p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">
                          {profil.profession}
                        </h3>

                        <p className="mt-1 text-sm text-[#FF6257]">
                          {profil.secteur_activite}
                        </p>
                      </div>

                      <button
                        onClick={() => supprimerProfil(profil.id_profil)}
                        className="rounded-lg border border-red-500/20 p-2 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <p className="text-sm text-[#B8B8BE]">
                      {profil.descritpion || "Aucune description."}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs text-[#B8B8BE]">
                      <FileText size={14} />
                      {profil.document}
                    </div>
                  </div>
                ))}

                {profils.length === 0 && (
                  <p className="text-sm text-[#B8B8BE]">
                    Aucun profil professionnel ajouté.
                  </p>
                )}
              </div>
            </Carte>
          </div>

          <div className="space-y-6">
            <Carte titre="Ajouter un profil">
              <form onSubmit={ajouterProfil} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-[#B8B8BE]">
                    Secteur d'activité
                  </label>

                  <input
                    value={nouveauProfil.secteur_activite}
                    onChange={(e) =>
                      setNouveauProfil({
                        ...nouveauProfil,
                        secteur_activite: e.target.value,
                      })
                    }
                    placeholder="Ex : Design, Informatique..."
                    className="w-full rounded-lg border border-white/10 bg-[#202023] px-4 py-3 text-sm text-white outline-none placeholder:text-[#B8B8BE] focus:border-[#FF6257]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#B8B8BE]">
                    Profession
                  </label>

                  <input
                    value={nouveauProfil.profession}
                    onChange={(e) =>
                      setNouveauProfil({
                        ...nouveauProfil,
                        profession: e.target.value,
                      })
                    }
                    placeholder="Ex : Graphiste, développeur..."
                    className="w-full rounded-lg border border-white/10 bg-[#202023] px-4 py-3 text-sm text-white outline-none placeholder:text-[#B8B8BE] focus:border-[#FF6257]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#B8B8BE]">
                    Description
                  </label>

                  <textarea
                    value={nouveauProfil.descritpion}
                    onChange={(e) =>
                      setNouveauProfil({
                        ...nouveauProfil,
                        descritpion: e.target.value,
                      })
                    }
                    placeholder="Décrivez vos compétences..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-white/10 bg-[#202023] px-4 py-3 text-sm text-white outline-none placeholder:text-[#B8B8BE] focus:border-[#FF6257]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#B8B8BE]">
                    Document
                  </label>

                  <input
                    value={nouveauProfil.document}
                    onChange={(e) =>
                      setNouveauProfil({
                        ...nouveauProfil,
                        document: e.target.value,
                      })
                    }
                    placeholder="Ex : portfolio.pdf"
                    className="w-full rounded-lg border border-white/10 bg-[#202023] px-4 py-3 text-sm text-white outline-none placeholder:text-[#B8B8BE] focus:border-[#FF6257]"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF6257] px-4 py-3 text-sm font-semibold text-white hover:bg-[#E84D4D]"
                >
                  <Plus size={17} />
                  Ajouter le profil
                </button>
              </form>
            </Carte>
          </div>
        </section>
      </div>
    </main>
  );
}

function Carte({
  titre,
  children,
}: {
  titre: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#1B1B1D] p-3">
      <h2 className="mb-5 text-lg font-semibold">{titre}</h2>
      {children}
    </section>
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
    <div className="rounded-lg border border-white/10 bg-[#1B1B1D] p-3">
      <div className="flex justify-between items-center">
        <div className="mb-4 w-fit rounded-lg bg-[#FF6257]/10 p-2 text-[#FF6257]">
          {icone}
        </div>
        <h3 className="mt-2 text-sm font-bold my-auto">Total</h3>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-[#B8B8BE]">{titre}</p>
        <p className="mt-2 text-sm font-bold">{valeur}</p>
      </div>
    </div>
  );
}

function LigneInfo({
  icone,
  label,
  valeur,
}: {
  icone: ReactNode;
  label: string;
  valeur: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#202023] p-3">
      <div className="mb-2 flex items-center gap-2 text-[#FF6257]">
        {icone}
        <span className="text-xs font-semibold uppercase">{label}</span>
      </div>

      <p className="text-sm text-white">{valeur}</p>
    </div>
  );
}

function formatMontant(montant: number) {
  return `${montant.toLocaleString("fr-FR")} FCFA`;
}

function formatRang(rang: string) {
  if (rang === "niveau_débutant") return "Niveau débutant";
  if (rang === "intermédiaire") return "Intermédiaire";
  return "Expert";
}
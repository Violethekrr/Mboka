import { useNavigate } from "react-router-dom";
import Carte from "../../Composant/Administrateur/CartStat";
import GrapheDash from "../../Composant/Administrateur/GrapheDash";
import Cercle from "../../Composant/Administrateur/Cercle";
import CarteFreelancer from "../../Composant/Administrateur/CarteFreelancer";
import jean from "../../assets/jean.jpeg";
import patrick from "../../assets/patrick.jpeg";
import mia from "../../assets/mia.jpeg";
import alex from "../../assets/alex.jpg";

export default function DashboardAdmin(){
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-[#1B1B1D]">
      <aside className="hidden lg:flex lg:w-64 flex-col">
        <nav>
          <div onClick={() => navigate("/dashboard")}>Dashboard</div>
          <div onClick={() => navigate("/freelancers")}>Freelancers</div>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col p-6">
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Carte titre="Utilisateurs" valeur="1256" />
            <Carte titre="Projets" valeur="84" />
            <Carte titre="Revenus" valeur="45k€" />
            <Carte titre="Support" valeur="12" />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <GrapheDash />
            <Cercle />
        </section>
        <section className="mt-8 border border-[#FF7B6B] rounded-2xl bg-red-500/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">TOP FREELANCERS</h3>
            <div className="flex flex-wrap gap-6 justify-between">
                <CarteFreelancer nom="Jean Mabiala" profession="Plombier" note="4.9" image={jean} />
                <CarteFreelancer nom="Patrick Ngoma" profession="Menuisier" note="5" image={patrick} />
                <CarteFreelancer nom="Mia Makosso" profession="Designer web" note="4.9" image={mia} />
                <CarteFreelancer nom="Alex Taty" profession="Architecte" note="4" image={alex} />
            </div>
        </section>
      </main>
    </div>
  );
}

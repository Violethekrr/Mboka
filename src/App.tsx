import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, useLocation,} from "react-router-dom";

import ScrollTop from "./Composant/ScrollTop";
import Layout from "./Composant/Layout";

// Admin
import AccueilAdmin from "./Pages/Administrateur/Accueil";
import Client from "./Pages/Administrateur/Client";
import Freelancer from "./Pages/Administrateur/Freelancer";
import CommentaireAvis from "./Pages/Administrateur/CommentaireAvis";
import CompteSignal from "./Pages/Administrateur/CompteSignal";

// Client
import AccueilClient from "./Pages/Client/Accueil";
import Messagerie from "./Pages/General/Messagerie";
import CompteClient from "./Pages/Client/CompteClient";
import ServicesClient from "./Pages/Client/ServicesClient";

// Freelancer
import AccueilFreelancer from "./Pages/Freelancer/Accueil";
import CompteFreelancer from "./Pages/Freelancer/CompteFreelancer";
import ServicesFreelancers from "./Pages/Freelancer/ServicesFreelancers";
import AvisEtCommentaires from "./Pages/Freelancer/AvisEtCommentaires";

// Général
import Connexion from "./Pages/General/Connexion";
import Inscription from "./Pages/General/Inscription";
import Wallet from "./Pages/General/Wallet";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/wallet" element={<Wallet />} />

        {/* Client */}
        <Route path="/client" element={<AccueilClient />} />
        <Route path="/client/services" element={<ServicesClient />} />
        <Route path="/client/messagerie" element={<Messagerie />} />
        <Route path="/client/compte" element={<CompteClient />} />

        {/* Freelancer */}
        <Route path="/freelancer" element={<AccueilFreelancer />} />
        <Route path="/freelancer/services" element={<ServicesFreelancers />} />
        <Route path="/freelancer/compte" element={<CompteFreelancer />} />
        <Route path="/freelancer/messagerie" element={<Messagerie />} />
        <Route path="/freelancer/avisetcommentaires" element={<AvisEtCommentaires />} />

        {/* Admin */}
        <Route path="/administrateur" element={<AccueilAdmin />} />
        <Route path="/administrateur/clients" element={<Client />} />
        <Route path="/administrateur/freelancers" element={<Freelancer />} />
        <Route path="/administrateur/commentaires" element={<CommentaireAvis />} />
        <Route path="/administrateur/signales" element={<CompteSignal />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="overflow-x-hidden">
      <Router>
        <ScrollTop />

        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Router>
    </div>
  );
}
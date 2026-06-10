import { useState } from "react";
import { motion } from "framer-motion";

import HeroSection from "../../Composant/Client/HeroSection";
import SearchBar from "../../Composant/Client/SearchBar";
import CategoryGrid from "../../Composant/Client/CategoryGrid";
import FeaturedArtisans from "../../Composant/Client/FeaturedArtisans";
import RecommendedSection from "../../Composant/Client/RecommendedSection";
import TrustBanner from "../../Composant/Client/TrustBanner";
import RecentActivity from "../../Composant/Client/RecentActivity";
import PromoBanner from "../../Composant/Client/PromoBanner";
import ReviewsSection from "../../Composant/Client/ReviewsSection";
import CommentairesModal from "../../Composant/Client/CommentairesModal";
import FormulaireDeDemande from "../../Composant/Client/FormulaireDeDemande";

import type { FormModalData, ModalState } from "../../Type";
import { useUser } from "../../Context/UtilisateurContext";

const animationPage = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function Accueil() {
  const { user } = useUser();

  const [recherche, setRecherche] = useState("");
  const [categorieSelectionnee, setCategorieSelectionnee] = useState<
    string | null
  >(null);

  const [modalState, setModalState] = useState<ModalState>({
    comments: {
      isOpen: false,
      freelancerId: 0,
      freelancerNom: "",
      freelancerPhoto: "",
      freelancerMetier: "",
    },
    form: {
      isOpen: false,
      artisan: null,
    },
  });

  const idClientConnecte = user && "id_client" in user ? user.id_client : 1;

  function ouvrirCommentaires(
    freelancerId: number,
    nom: string,
    photo: string,
    metier: string
  ) {
    setModalState({
      comments: {
        isOpen: true,
        freelancerId,
        freelancerNom: nom,
        freelancerPhoto: photo,
        freelancerMetier: metier,
      },
      form: {
        isOpen: false,
        artisan: null,
      },
    });
  }

  function ouvrirFormulaire(artisan: FormModalData["artisan"]) {
    setModalState({
      comments: {
        isOpen: false,
        freelancerId: 0,
        freelancerNom: "",
        freelancerPhoto: "",
        freelancerMetier: "",
      },
      form: {
        isOpen: true,
        artisan,
      },
    });
  }

  function fermerModals() {
    setModalState({
      comments: {
        isOpen: false,
        freelancerId: 0,
        freelancerNom: "",
        freelancerPhoto: "",
        freelancerMetier: "",
      },
      form: {
        isOpen: false,
        artisan: null,
      },
    });
  }

  return (
    <motion.main
      variants={animationPage}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-[#111113]"
    >
      <div className="w-full px-4 pb-10 pt-20 md:px-8 lg:px-12">
        <HeroSection />

        <SearchBar onSearch={setRecherche} />

        <CategoryGrid onSelectCategory={setCategorieSelectionnee} />

        <PromoBanner />

        <FeaturedArtisans
          searchQuery={recherche}
          selectedCategory={categorieSelectionnee}
          onOpenComments={ouvrirCommentaires}
          onOpenForm={ouvrirFormulaire}
        />

        <RecommendedSection
          onOpenComments={ouvrirCommentaires}
          onOpenForm={ouvrirFormulaire}
        />

        <RecentActivity />

        <TrustBanner />

        <ReviewsSection />
      </div>

      {modalState.comments.isOpen && (
        <CommentairesModal
          freelancerId={modalState.comments.freelancerId}
          freelancerNom={modalState.comments.freelancerNom}
          freelancerPhoto={modalState.comments.freelancerPhoto}
          freelancerMetier={modalState.comments.freelancerMetier}
          currentClientId={idClientConnecte}
          onClose={fermerModals}
        />
      )}

      {modalState.form.isOpen && modalState.form.artisan && (
        <FormulaireDeDemande
          artisan={modalState.form.artisan}
          onClose={fermerModals}
        />
      )}
    </motion.main>
  );
}
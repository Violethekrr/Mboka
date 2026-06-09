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
import type { FormModalData ,   ModalState } from "../../Type"

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function Accueil() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // États pour les modals
  const [modalState, setModalState] = useState<ModalState>({
    comments: { isOpen: false, freelancerId: 0, freelancerNom: "", freelancerPhoto: "", freelancerMetier: "" },
    form: { isOpen: false, artisan: null }
  });

  const openCommentsModal = (freelancerId: number, nom: string, photo: string, metier: string) => {
    setModalState({
      comments: { isOpen: true, freelancerId, freelancerNom: nom, freelancerPhoto: photo, freelancerMetier: metier },
      form: { isOpen: false, artisan: null }
    });
  };

  const openFormModal = (artisan: FormModalData["artisan"]) => {
    setModalState({
      comments: { isOpen: false, freelancerId: 0, freelancerNom: "", freelancerPhoto: "", freelancerMetier: "" },
      form: { isOpen: true, artisan }
    });
  };

  const closeModals = () => {
    setModalState({
      comments: { isOpen: false, freelancerId: 0, freelancerNom: "", freelancerPhoto: "", freelancerMetier: "" },
      form: { isOpen: false, artisan: null }
    });
  };

  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="min-h-screen bg-[#1e1e22]"
      >
        <div className="pt-17.5 pb-10 px-4 md:px-8 lg:px-12 w-full max-w-none">
          <HeroSection />
          <SearchBar onSearch={setSearchQuery} />
          <CategoryGrid onSelectCategory={setSelectedCategory} />
          <PromoBanner />
          <FeaturedArtisans 
            searchQuery={searchQuery} 
            selectedCategory={selectedCategory}
            onOpenComments={openCommentsModal}
            onOpenForm={openFormModal}
          />
          <RecommendedSection 
            onOpenComments={openCommentsModal}
            onOpenForm={openFormModal}
          />
          <RecentActivity />
          <TrustBanner />
          <ReviewsSection />
        </div>

        {modalState.comments.isOpen && (
          <CommentairesModal
            key={`comments-${modalState.comments.freelancerId}`}
            freelancerId={modalState.comments.freelancerId}
            freelancerNom={modalState.comments.freelancerNom}
            freelancerPhoto={modalState.comments.freelancerPhoto}
            freelancerMetier={modalState.comments.freelancerMetier}
            currentClientId={1}
            onClose={closeModals}
          />
        )}

        {modalState.form.isOpen && modalState.form.artisan && (
          <FormulaireDeDemande
            key={`form-${modalState.form.artisan.nom}`}
            artisan={modalState.form.artisan}
            onClose={closeModals}
          />
        )}
      </motion.div>
      
    </>
  );
}
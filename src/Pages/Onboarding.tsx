import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Hammer,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
const slides = [
  {
    id: 1,
    accentColor: "#E53E3E",
    icon: Hammer,
    title: "Des artisans qualifiés près de chez vous",
    description:
      "Trouvez rapidement des professionnels fiables pour tous vos besoins à Pointe-Noire.",
  },

  {
    id: 2,
    accentColor: "#E53E3E",
    icon: ClipboardList,
    title: "Publiez votre projet en quelques minutes",
    description:
      "Décrivez votre besoin et recevez rapidement des propositions d'artisans vérifiés.",
  },

  {
    id: 3,
    accentColor: "#E53E3E",
    icon: ShieldCheck,
    title: "Paiement sécurisé et transparent",
    description:
      "Votre argent reste protégé jusqu'à la validation complète du travail réalisé.",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const goTo = (index: number, dir: "next" | "prev" = "next") => {
    if (animating || index === currentStep) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(index);
      setAnimating(false);
    }, 280);
  };

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      goTo(currentStep + 1, "next");
    } else {
      localStorage.setItem("onboardingCompleted", "true");
      navigate("/connexion");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("onboardingCompleted", "true");
    navigate("/connexion");
  };

  const slide = slides[currentStep];
  const Icon = slide.icon;
  return (
    <div className="min-h-screen w-full bg-[#111111] flex items-center justify-center">
      {/* Mobile / petite écran */}
      <div className="w-full max-w-[430px] min-h-screen flex flex-col bg-[#111111] relative overflow-hidden">
      

        {/* Skip button */}
        <div className="relative z-10 flex justify-end px-6 pt-14">
          <button  onClick={handleSkip}  className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors duration-200 px-2 py-1"> Passer</button>
        </div>

        {/* Content area */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-4">

          {/* Image d' Illustration */}
          <div
            className={` mb-10 transition-all duration-280   ${animating ? direction === "next" ? "opacity-0 -translate-x-8 scale-95" : "opacity-0 translate-x-8 scale-95" : "opacity-100 translate-x-0 scale-100"
             }
            `}   >
            <div className="w-64 h-64 rounded-3xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center overflow-hidden relative">
            
              
             <div className="absolute inset-0 flex items-center justify-center">
              <Icon  size={80} strokeWidth={1.8}color={slide.accentColor} />
</div>
            </div>
          </div>

          {/* Text */}
          <div
            className={`
              text-center transition-all duration-280
              ${animating
                ? direction === "next"
                  ? "opacity-0 translate-x-6"
                  : "opacity-0 -translate-x-6"
                : "opacity-100 translate-x-0"
              }
            `}
          >
            <h2 className="text-white font-bold text-2xl leading-tight mb-4 tracking-tight">
              {slide.title}
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-xs mx-auto">
              {slide.description}
            </p>
          </div>
        </div>

        {/* Dots */}
        <div className="relative z-10 flex justify-center items-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index, index > currentStep ? "next" : "prev")}
              className="flex items-center justify-center transition-all duration-300"
            >
              <span
                className={`  block rounded-full transition-all duration-300   ${currentStep === index
                    ? "w-8 h-2 bg-[#E53E3E]"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }
                `}
              />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-10 px-6 pb-10">
          <button  onClick={handleNext}  className=" w-full bg-[#E84D4D] hover:bg-[#E84D4D] active:scale-[0.98] text-white font-bold py-4 rounded-2xl   text-base   transition-all duration-200   shadow-lg shadow-[#E53E3E]/20 " >
            {currentStep === slides.length - 1 ? "Commencer" : "Suivant"}  </button>
            
          <p className="text-center text-xs text-white/25 mt-4">
            {currentStep + 1} sur {slides.length}
          </p>
        </div>
      </div>
    </div>
  );
}
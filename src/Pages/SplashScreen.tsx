import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Zap, LockKeyhole, BadgeCheck, MapPin,Headset, WalletCards, Award,} from "lucide-react";
import logo from "../assets/Mboka.png";

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="min-h-screen w-full relative over flow-hidden flex items-center justify-center
    bg-[#1B1B1D] text-white ">


      {/* CONTENT */}

      <section className=" relativez-10 flex flex-col items-center justify-center text-center px-6 ">

        <div className="logo-animation">
          <img src={logo} alt="logo" className=" w-32 h-auto md:w-40 lg:w-52   "/>

        </div>

       <div className=" flex items-center justify-center gap-3 mt-6 ">
  <h1 className=" text-4xl font-serif md:text-5xl lg:text-6xl font-extrabold "> MBOKA</h1>

  <span className=" px-3 py-1 rounded-xl text-sm md:text-base font-bold bg-[#FF7B6B]  " > PRO</span>
</div>

        {/* SLOGAN */}

        <div className=" mt-8 text-center max-w-md ">

  <h2 className=" text-xl md:text-2xl font-semibold"> TROUVER LE BON ARTISAN</h2>

  <p className=" mt-3 text-base md:text-lg ">VOTRE PLATEFORME LOCALE DE MISEEN RELATION</p>

</div>

<section className=" mt-10 w-full max-w-xl ">
  <div className=" grid grid-cols-4 gap-4  ">

    {/* Item 1 */}

    <div className=" flex flex-col items-center gap-2 ">

       <div className="text-[#FF7B6B]"><ShieldCheck /> </div>
       <span className="text-[#B8B8BE]"> Fiable</span>
    </div>

    {/* Item 2 */}

    <div className=" flex flex-col items-center gap-2" >
      <div className="text-[#FF7B6B]"> <Zap /></div>

      <span className="text-[#B8B8BE]"> Rapide</span>
    </div>

    {/* Item 3 */}

    <div className=" flex flex-col items-center gap-2 ">
      <div className="text-[#FF7B6B]"><LockKeyhole /> </div>

      <span className="text-[#B8B8BE]"> Sécurisé </span>
    </div>

      {/* Item 4 */}

     <div className=" flex flex-col items-center gap-2 " >
      <div className="text-[#FF7B6B]"> <MapPin /> </div>

      <span className="text-[#B8B8BE]"> Proximité</span>
    </div>

      {/* Item 5 */}

     <div
      className=" flex flex-col items-center  gap-2  ">
      <div className="text-[#FF7B6B]"> <Award /></div>

      <span className="text-[#B8B8BE]"> Qualité </span>
    </div>

      {/* Item 6 */}

     <div className=" flex flex-col items-center gap-2 " >
      <div className="text-[#FF7B6B]"> <BadgeCheck /></div>

      <span className="text-[#B8B8BE]">  Vérifié</span>
    </div>

      {/* Item 7 */}

     <div className=" flex flex-col items-center gap-2 " >
      <div className="text-[#FF7B6B]"> <WalletCards /></div>

      <span className="text-[#B8B8BE]">Paiement sécurisé </span>
    </div>

      {/* Item 8 */}

     <div className=" flex flex-col items-center gap-2 " >
      <div className="text-[#FF7B6B]"><Headset /></div>

      <span className="text-[#B8B8BE]">Support </span>
    </div>
  </div>
</section>

        {/* chargement */}
        <div   className="   mt-12 ">
          <div className=" loader-animation w-10 h-10 rounded-full border-4  " />
        </div>

        {/* Texte de chargement*/}

        <div  className=" mt-4 ">
          <span> Chargement...</span>
        </div>
      </section>
    </main>
  );
}

export default SplashScreen;
type CarteFreelancerProps = {
  nom: string;
  profession: string;
  note: string;
  image: string;
};

export default function CarteFreelancer({ nom, profession, note, image }: CarteFreelancerProps) {
  return (
    <div className="flex flex-col items-center p-4 rounded-2xl border border-red-500/10 bg-red-500/5 min-w-[220px]">
      <img src={image} alt={nom} className="w-16 h-16 rounded-full object-cover" />
      <h3 className="text-white font-semibold mt-3">{nom}</h3>
      <p className="text-gray-400 text-sm">{profession}</p>
      <span className="mt-2 text-green-400">⭐ {note}</span>
    </div>
  );
}

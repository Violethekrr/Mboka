import { motion } from "framer-motion";

type Props = {
    titre : string;
    valeur : string;
}

export default function CarteStat({ titre, valeur }: Props) {
  return(
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 border border-[#FF7B6B] rounded-2xl p-2 backdrop-blur-md shadow-lg hover:scale-105 transition">
        <h3 className="text-white text-sm mb-2">{titre}</h3>
        <p className="text-4xl font-bold text-white">{valeur}</p>
    </motion.div>
  )
}

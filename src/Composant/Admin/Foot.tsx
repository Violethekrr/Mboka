

export default function Foot() {
  return (
    <div>
          {/* Footer */}
        <footer className="bg-[#0f0f0f]  border-t border-[#22222c] px-7 py-3.5 flex justify-between items-center flex-wrap gap-2">
          <span className={`font-extrabold text-white text-sm`}>MBO<span className="text-[#FE6864]">KA</span> <span className="text-[#55555e] font-normal text-xs">— Panneau d'administration</span></span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span className={`text-xs text-[#55555e]`}>Système opérationnel · © 2026 MBOKA</span>
          </div>
        </footer>
    </div>
  )
}

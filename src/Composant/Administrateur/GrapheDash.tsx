import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const donnees = [
  { mois: "Jan", activites: 45 }, { mois: "Fev", activites: 52 },
  { mois: "Mar", activites: 70 }, { mois: "Avr", activites: 61 },
  { mois: "Mai", activites: 45 }, { mois: "Juin", activites: 60 },
  { mois: "Juil", activites: 100 },
];

export default function GrapheDash() {
  return (
    <div className="h-80 mt-6 bg-red-500/5 border border-[#FF7B6B] rounded-2xl p-6 backdrop-blur-md shadow-lg">
      <h2 className="text-white text-xl font-bold mb-5">Activité globale</h2>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={donnees}>
          <defs>
            <linearGradient id="colorActivites" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF7B6B" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#FF7B6B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="mois" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip />
          <Area type="monotone" dataKey="activites" stroke="#FF7B6B" strokeWidth={3} fill="url(#colorActivites)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

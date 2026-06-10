import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Développement", value: 35 },
  { name: "Design", value: 20 },
  { name: "Marketing", value: 15 },
  { name: "Support", value: 20 },
  { name: "Autres", value: 10 },
];

const COLORS = ["#DC2626", "#F87171", "#6D28D9", "#A78BFA", "#22C55E"];

export default function Cercle() {
  return (
    <div className="h-80 mt-6 border-[#FF7B6B] rounded-2xl bg-red-500/5 border p-6 flex flex-col">
      <div><h3 className="text-lg font-semibold text-white">Répartition des activités</h3></div>
      <div className="relative flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} stroke="#1B1B1D" strokeWidth={4}>
              {data.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-white">1 256</span>
          <span className="text-sm text-gray-400">Freelancers actifs</span>
          <span className="text-xs text-green-400 mt-1">+12% ce mois</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
            <span className="text-xs text-gray-300">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

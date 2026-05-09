import { trpc } from "@/providers/trpc";
import {
  Globe,
  Database,
  Activity,
  Shield,
} from "lucide-react";

export default function StatsBar() {
  const sourcesQuery = trpc.harvester.sources.useQuery();
  const historyQuery = trpc.harvester.scanHistory.useQuery();
  const pingQuery = trpc.ping.useQuery(undefined, {
    refetchInterval: 10000,
  });

  const totalSources = sourcesQuery.data?.sources.length || 0;
  const totalScans = historyQuery.data?.length || 0;
  const completedScans = historyQuery.data?.filter((s) => s.status === "completed").length || 0;
  const isOnline = pingQuery.data?.ok;

  const stats = [
    {
      label: "OSINT SOURCES",
      value: totalSources,
      icon: <Database className="w-5 h-5" />,
      color: "text-green-400",
    },
    {
      label: "TOTAL SCANS",
      value: totalScans,
      icon: <Globe className="w-5 h-5" />,
      color: "text-cyan-400",
    },
    {
      label: "COMPLETED",
      value: completedScans,
      icon: <Shield className="w-5 h-5" />,
      color: "text-emerald-400",
    },
    {
      label: "SYSTEM STATUS",
      value: isOnline ? "ONLINE" : "OFFLINE",
      icon: <Activity className={`w-5 h-5 ${isOnline ? "animate-pulse" : ""}`} />,
      color: isOnline ? "text-green-400" : "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="border-glow rounded-lg p-4 bg-black/40 hover-glow transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`${stat.color}`}>{stat.icon}</span>
            <span className="text-[10px] font-mono-code text-green-700 tracking-wider">
              {stat.label}
            </span>
          </div>
          <div className={`text-2xl font-cyber ${stat.color} glow-green-sm`}>
            {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}

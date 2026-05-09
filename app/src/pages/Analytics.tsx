import { Link } from "react-router";
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import MatrixRain from "@/components/hacker/MatrixRain";
import Header from "@/components/hacker/Header";
import ScanHistory from "@/components/hacker/ScanHistory";
import { trpc } from "@/providers/trpc";

export default function Analytics() {
  const historyQuery = trpc.harvester.scanHistory.useQuery();
  const scans = historyQuery.data || [];

  // Calculate statistics
  const totalScans = scans.length;
  const completedScans = scans.filter((s) => s.status === "completed").length;
  const failedScans = scans.filter((s) => s.status === "failed").length;
  const runningScans = scans.filter((s) => s.status === "running").length;

  const successRate = totalScans > 0 ? ((completedScans / totalScans) * 100).toFixed(1) : 0;

  // Get unique domains
  const uniqueDomains = new Set(scans.map((s) => s.domain)).size;

  // Get most scanned domain
  const domainCounts = scans.reduce(
    (acc, scan) => {
      acc[scan.domain] = (acc[scan.domain] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const mostScannedDomain = Object.entries(domainCounts).sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-x-hidden">
      <MatrixRain />
      <div className="scanline fixed inset-0 z-[5] pointer-events-none" />

      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono-code text-green-600">
            <Link to="/" className="hover:text-green-400">Home</Link>
            <span>/</span>
            <span className="text-green-400">Analytics</span>
          </div>

          {/* Page Title */}
          <div className="border-glow rounded-lg p-6 bg-black/50">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-green-400" />
              <h1 className="text-3xl font-cyber text-green-400 tracking-wider">
                SCAN ANALYTICS
              </h1>
            </div>
            <p className="text-sm font-mono-code text-green-700">
              Real-time statistics and insights from your OSINT scans.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="TOTAL SCANS"
              value={totalScans}
              color="green"
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              label="COMPLETED"
              value={completedScans}
              color="emerald"
            />
            <StatCard
              icon={<AlertCircle className="w-5 h-5" />}
              label="FAILED"
              value={failedScans}
              color="red"
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              label="RUNNING"
              value={runningScans}
              color="yellow"
            />
          </div>

          {/* Detailed Stats */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Success Rate */}
            <div className="border-glow rounded-lg p-6 bg-black/50">
              <h3 className="text-lg font-cyber text-green-400 tracking-wider mb-4">
                SUCCESS RATE
              </h3>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="rgba(34, 197, 94, 0.2)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="8"
                      strokeDasharray={`${(Number(successRate) / 100) * 314} 314`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-cyber text-green-400">{successRate}%</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs font-mono-code text-green-700">
                {completedScans} of {totalScans} scans completed successfully
              </p>
            </div>

            {/* Unique Domains */}
            <div className="border-glow rounded-lg p-6 bg-black/50">
              <h3 className="text-lg font-cyber text-green-400 tracking-wider mb-4">
                INVESTIGATION SCOPE
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-mono-code text-green-600 mb-1">
                    Unique Domains Scanned
                  </div>
                  <div className="text-3xl font-cyber text-green-400">{uniqueDomains}</div>
                </div>
                {mostScannedDomain && (
                  <div>
                    <div className="text-sm font-mono-code text-green-600 mb-1">
                      Most Investigated Domain
                    </div>
                    <div className="text-lg font-cyber text-green-300 truncate">
                      {mostScannedDomain[0]}
                    </div>
                    <div className="text-xs font-mono-code text-green-700">
                      Scanned {mostScannedDomain[1]} times
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scan History */}
          <div>
            <ScanHistory />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-green-500/10 mt-12 py-6 bg-black/60 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="text-[10px] font-mono-code text-green-800">
              THE HARVESTER OSINT GUI v1.0 | Built with React + tRPC + FastAPI
            </div>
            <div className="text-[10px] font-mono-code text-green-800">
              © 2025 | For authorized security testing only
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: "green" | "emerald" | "red" | "yellow";
}) {
  const colorMap = {
    green: "text-green-400 border-green-500/20 bg-green-500/5",
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    red: "text-red-400 border-red-500/20 bg-red-500/5",
    yellow: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
  };

  return (
    <div className={`border-glow rounded-lg p-4 border ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <span className="text-[10px] font-mono-code uppercase tracking-wider opacity-70">
          {label}
        </span>
      </div>
      <div className="text-3xl font-cyber font-bold">{value}</div>
    </div>
  );
}

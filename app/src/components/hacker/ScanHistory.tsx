import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  Clock,
  Globe,
  Server,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export default function ScanHistory() {
  const [expandedScan, setExpandedScan] = useState<number | null>(null);

  const historyQuery = trpc.harvester.scanHistory.useQuery();
  // const utils = trpc.useUtils();

  const scans = historyQuery.data || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "running":
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "running":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "failed":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-green-600 bg-green-600/10 border-green-600/20";
    }
  };

  return (
    <div className="border-glow rounded-lg p-6 bg-black/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-cyber text-green-400 tracking-wide">
            SCAN HISTORY
          </h2>
        </div>
        <button
          onClick={() => historyQuery.refetch()}
          className="p-2 rounded hover:bg-green-400/10 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-green-400 ${historyQuery.isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {scans.length === 0 ? (
        <div className="text-center py-8 text-green-700 font-mono-code text-sm">
          No scans recorded yet. Start your first OSINT scan!
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="border border-green-500/10 rounded-lg overflow-hidden 
                       hover:border-green-500/20 transition-colors"
            >
              <button
                onClick={() =>
                  setExpandedScan(expandedScan === scan.id ? null : scan.id)
                }
                className="w-full flex items-center justify-between px-4 py-3 
                         hover:bg-green-400/5 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getStatusIcon(scan.status)}
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-sm font-mono-code text-green-300 truncate">
                      {scan.domain}
                    </div>
                    <div className="text-[10px] font-mono-code text-green-600">
                      {new Date(scan.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono-code px-2 py-0.5 rounded border capitalize ${getStatusColor(
                      scan.status
                    )}`}
                  >
                    {scan.status}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-green-600 transition-transform ${
                      expandedScan === scan.id ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </button>

              {expandedScan === scan.id && (
                <div className="px-4 pb-3 pt-1 border-t border-green-500/10 bg-black/20">
                  <div className="space-y-2 text-xs font-mono-code">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-500">Domain:</span>
                      <span className="text-green-300">{scan.domain}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-500">Sources:</span>
                      <span className="text-green-300 truncate">
                        {scan.sources}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-500">Limit:</span>
                      <span className="text-green-300">{scan.limit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-500">Created:</span>
                      <span className="text-green-300">
                        {new Date(scan.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

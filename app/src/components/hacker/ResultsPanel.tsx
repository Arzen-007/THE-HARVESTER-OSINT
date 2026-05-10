import { useState } from "react";
import DataVisualization from "./DataVisualization";
import ExportDialog from "./ExportDialog";
import {
  Mail,
  Globe,
  MapPin,
  Users,
  Link,
  FileText,
  Network,
  Tag,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Download,
  BarChart3,
} from "lucide-react";

interface ResultsData {
  emails?: string[];
  hosts?: string[];
  ips?: string[];
  linkedin_people?: Array<{ name: string; url?: string }>;
  twitter_people?: string[];
  interesting_urls?: string[];
  asns?: string[];
  linkedin_links?: string[];
  trello_urls?: string[];
  amass_discovery?: any[];
  sherlock_account?: any[];
  nuclei_vulnerability?: any[];
}

interface ResultsPanelProps {
  results: ResultsData | null;
  domain?: string;
}

const RESULT_CONFIGS: Array<{
  key: keyof ResultsData;
  label: string;
  icon: React.ReactNode;
  color: string;
}> = [
  { key: "emails", label: "Emails", icon: <Mail className="w-4 h-4" />, color: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5" },
  { key: "hosts", label: "Hosts / Subdomains", icon: <Globe className="w-4 h-4" />, color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5" },
  { key: "ips", label: "IP Addresses", icon: <MapPin className="w-4 h-4" />, color: "text-purple-400 border-purple-400/20 bg-purple-400/5" },
  { key: "linkedin_people", label: "LinkedIn People", icon: <Users className="w-4 h-4" />, color: "text-blue-400 border-blue-400/20 bg-blue-400/5" },
  { key: "twitter_people", label: "Twitter People", icon: <Tag className="w-4 h-4" />, color: "text-sky-400 border-sky-400/20 bg-sky-400/5" },
  { key: "interesting_urls", label: "Interesting URLs", icon: <Link className="w-4 h-4" />, color: "text-orange-400 border-orange-400/20 bg-orange-400/5" },
  { key: "asns", label: "ASNs", icon: <Network className="w-4 h-4" />, color: "text-pink-400 border-pink-400/20 bg-pink-400/5" },
  { key: "linkedin_links", label: "LinkedIn Links", icon: <FileText className="w-4 h-4" />, color: "text-indigo-400 border-indigo-400/20 bg-indigo-400/5" },
  { key: "trello_urls", label: "Trello URLs", icon: <FileText className="w-4 h-4" />, color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" },
  { key: "amass_discovery", label: "Amass Assets", icon: <Globe className="w-4 h-4" />, color: "text-red-400 border-red-400/20 bg-red-400/5" },
  { key: "sherlock_account", label: "Sherlock Accounts", icon: <Users className="w-4 h-4" />, color: "text-pink-400 border-pink-400/20 bg-pink-400/5" },
  { key: "nuclei_vulnerability", label: "Nuclei Vulns", icon: <Check className="w-4 h-4" />, color: "text-orange-400 border-orange-400/20 bg-orange-400/5" },
];

export default function ResultsPanel({ results, domain = "target-domain" }: ResultsPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["emails", "hosts"]);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"results" | "visualization">("visualization");
  const [showExportDialog, setShowExportDialog] = useState(false);

  if (!results) return null;

  const toggleSection = (key: string) => {
    setExpandedSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const copyItem = (item: string) => {
    navigator.clipboard.writeText(item);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const totalItems = Object.values(results).flat().length;

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-green-500/20">
        <button
          onClick={() => setActiveTab("visualization")}
          className={`px-4 py-2 font-cyber text-sm tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "visualization"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-green-700 hover:text-green-400"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          VISUALIZATION
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`px-4 py-2 font-cyber text-sm tracking-wider transition-all ${
            activeTab === "results"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-green-700 hover:text-green-400"
          }`}
        >
          DETAILED RESULTS
        </button>
      </div>

      {/* Visualization Tab */}
      {activeTab === "visualization" && (
        <DataVisualization results={results} />
      )}

      {/* Results Tab */}
      {activeTab === "results" && (
        <div className="space-y-4">
          {/* Results Summary */}
          <div className="border-glow rounded-lg p-6 bg-black/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-cyber text-green-400 tracking-wide">
                SCAN RESULTS
              </h2>
              <button
                onClick={() => setShowExportDialog(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono-code 
                         border border-green-500/30 rounded text-green-400
                         hover:bg-green-400/10 hover:border-green-400/50 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                EXPORT
              </button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {RESULT_CONFIGS.map(({ key, label, icon, color }) => {
                const items = (results[key] || []) as string[];
                return (
                  <div
                    key={key}
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all hover:scale-105 ${color}`}
                    onClick={() => toggleSection(key as string)}
                  >
                    <div className="flex justify-center mb-1">{icon}</div>
                    <div className="text-lg font-bold font-cyber">{items.length}</div>
                    <div className="text-[10px] font-mono-code opacity-70">{label}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-center text-xs font-mono-code text-green-600">
              TOTAL ITEMS DISCOVERED: <span className="text-green-400 font-bold text-sm">{totalItems}</span>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-2">
            {RESULT_CONFIGS.map(({ key, label, icon, color }) => {
              const items = (results[key] || []) as string[];
              if (items.length === 0) return null;

              const isExpanded = expandedSections.includes(key as string);

              return (
                <div
                  key={key}
                  className="border border-green-500/10 rounded-lg overflow-hidden bg-black/30"
                >
                  <button
                    onClick={() => toggleSection(key as string)}
                    className={`w-full flex items-center justify-between px-4 py-3 
                              ${color.split(" ")[2]} hover:brightness-125 transition-all`}
                  >
                    <div className="flex items-center gap-2">
                      {icon}
                      <span className="text-sm font-mono-code">{label}</span>
                      <span className="text-xs opacity-60">({items.length})</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 py-2 max-h-[300px] overflow-y-auto">
                      <div className="space-y-1">
                        {items.map((item: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-1.5 px-2 rounded
                                     hover:bg-white/5 group transition-colors"
                          >
                            <span className="text-xs font-mono-code text-green-300/80 truncate flex-1">
                              {typeof item === "string" ? item : JSON.stringify(item)}
                            </span>
                            <button
                              onClick={() =>
                                copyItem(typeof item === "string" ? item : JSON.stringify(item))
                              }
                              className="ml-2 p-1 rounded opacity-0 group-hover:opacity-100 
                                       hover:bg-green-400/10 transition-all"
                            >
                              {copiedItem === (typeof item === "string" ? item : JSON.stringify(item)) ? (
                                <Check className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-green-600" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Export Dialog */}
      <ExportDialog
        results={results}
        domain={domain}
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />
    </div>
  );
}

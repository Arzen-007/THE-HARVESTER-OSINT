import { useState, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import ProgressBar from "./ProgressBar";
import {
  Search,
  Zap,
  Globe,
  Database,
  Shield,
  Cpu,
  Radio,
  Layers,
  Code,
  Lock,
  Eye,
  Fingerprint,
  Server,
  Binary,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Settings2,
} from "lucide-react";

const SOURCE_CATEGORIES: Record<string, { icon: React.ReactNode; sources: string[] }> = {
  "Search Engines": {
    icon: <Search className="w-4 h-4" />,
    sources: ["baidu", "brave", "duckduckgo", "mojeek", "yahoo"],
  },
  "Certificates": {
    icon: <Lock className="w-4 h-4" />,
    sources: ["certspotter", "crtsh", "chaos"],
  },
  "Threat Intel": {
    icon: <Shield className="w-4 h-4" />,
    sources: ["threatcrowd", "otx", "virustotal"],
  },
  "DNS": {
    icon: <Globe className="w-4 h-4" />,
    sources: ["dnsdumpster", "hackertarget", "rapiddns", "robtex"],
  },
  "Code Repos": {
    icon: <Code className="w-4 h-4" />,
    sources: ["github-code", "gitlab"],
  },
  "Web Archives": {
    icon: <Database className="w-4 h-4" />,
    sources: ["waybackarchive", "commoncrawl"],
  },
  "Security": {
    icon: <Eye className="w-4 h-4" />,
    sources: ["securitytrails", "shodan", "censys", "fofa", "zoomeye"],
  },
  "Intelligence": {
    icon: <Fingerprint className="w-4 h-4" />,
    sources: ["intelx", "hunter", "rocketreach", "builtwith"],
  },
  "Network": {
    icon: <Radio className="w-4 h-4" />,
    sources: ["netlas", "onyphe", "criminalip"],
  },
  "Discovery": {
    icon: <Layers className="w-4 h-4" />,
    sources: ["subdomaincenter", "subdomainfinderc99", "projectdiscovery"],
  },
  "Other": {
    icon: <Cpu className="w-4 h-4" />,
    sources: ["bevigil", "fullhunt", "hudsonrock", "leakix", "tomba", "urlscan", "whoisxml"],
  },
};

interface ScannerFormProps {
  onScanComplete: (results: any) => void;
  onTerminalOutput: (line: string) => void;
}

export default function ScannerForm({ onScanComplete, onTerminalOutput }: ScannerFormProps) {
  const [domain, setDomain] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [limit, setLimit] = useState(500);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Search Engines"]);
  const [error, setError] = useState("");
  
  // Advanced Options
  const [dnsBrute, setDnsBrute] = useState(false);
  const [dnsLookup, setDnsLookup] = useState(false);
  const [shodan, setShodan] = useState(false);
  const [takeOver, setTakeOver] = useState(false);

  // Progress tracking
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  let progressInterval: NodeJS.Timeout | null = null;

  const sourcesQuery = trpc.harvester.sources.useQuery();
  const scanMutation = trpc.harvester.scan.useMutation({
    onSuccess: (data) => {
      setScanProgress(100);
      onTerminalOutput(`[✓] SUCCESS: Scan completed for ${domain}`);
      onTerminalOutput(`[+] Found ${Object.values(data.results).flat().length} total items`);
      onTerminalOutput(`[+] Emails: ${data.results.emails?.length || 0}`);
      onTerminalOutput(`[+] Hosts: ${data.results.hosts?.length || 0}`);
      onTerminalOutput(`[+] IPs: ${data.results.ips?.length || 0}`);
      onScanComplete(data.results);
      setIsScanning(false);
      setTimeout(() => setScanProgress(0), 2000);
    },
    onError: (err) => {
      onTerminalOutput(`[!] ERROR: ${err.message}`);
      setError(err.message);
      setIsScanning(false);
      setScanProgress(0);
    },
  });

  const allSources = sourcesQuery.data?.sources || [];

  const handleSelectAll = () => {
    if (selectedSources.length === allSources.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(allSources);
    }
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSource = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const handleScan = () => {
    if (!domain || domain.length < 3) {
      setError("Domain must be at least 3 characters");
      return;
    }
    if (selectedSources.length === 0) {
      setError("Select at least one source");
      return;
    }
    setError("");
    setIsScanning(true);
    setScanProgress(5);
    
    onTerminalOutput(`[*] ========================================`);
    onTerminalOutput(`[*] OSINT SCAN INITIATED`);
    onTerminalOutput(`[*] ========================================`);
    onTerminalOutput(`[+] Target: ${domain}`);
    onTerminalOutput(`[+] Sources: ${selectedSources.length} selected`);
    onTerminalOutput(`[+] Result Limit: ${limit}`);
    if (dnsBrute) onTerminalOutput("[+] DNS Brute Force: ENABLED");
    if (dnsLookup) onTerminalOutput("[+] DNS Lookup: ENABLED");
    if (shodan) onTerminalOutput("[+] Shodan Query: ENABLED");
    if (takeOver) onTerminalOutput("[+] Takeover Check: ENABLED");
    onTerminalOutput(`[*] Starting scan... this may take a while`);
    
    // Simulate progress updates
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 95) {
          if (progressInterval) clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 12;
      });
    }, 1500);

    scanMutation.mutate({
      domain,
      sources: selectedSources,
      limit,
      dnsBrute,
      dnsLookup,
      shodan,
      takeOver,
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Domain Input */}
      <div className="border-glow rounded-lg p-6 bg-black/50">
        <div className="flex items-center gap-3 mb-4">
          <Binary className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-cyber text-green-400 tracking-wide">
            TARGET CONFIGURATION
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
              Target Domain
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                disabled={isScanning}
                className="w-full bg-black/80 border border-green-500/30 rounded-md pl-10 pr-4 py-3 
                         text-green-400 font-mono-code text-sm placeholder:text-green-800
                         focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                         transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
              Result Limit
            </label>
            <div className="relative">
              <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                min={1}
                max={2000}
                disabled={isScanning}
                className="w-full bg-black/80 border border-green-500/30 rounded-md pl-10 pr-4 py-3 
                         text-green-400 font-mono-code text-sm
                         focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                         transition-all disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mt-6 border-t border-green-500/10 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="w-4 h-4 text-green-500" />
            <span className="text-xs font-cyber text-green-500 tracking-wider">ADVANCED OPTIONS</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={dnsBrute} 
                onChange={(e) => setDnsBrute(e.target.checked)}
                disabled={isScanning}
                className="hidden"
              />
              <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${dnsBrute ? 'bg-green-400 border-green-400' : 'border-green-600 group-hover:border-green-400'}`}>
                {dnsBrute && <Zap className="w-3 h-3 text-black" />}
              </div>
              <span className={`text-[10px] font-mono-code ${dnsBrute ? 'text-green-400' : 'text-green-700 group-hover:text-green-500'}`}>DNS BRUTE</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={dnsLookup} 
                onChange={(e) => setDnsLookup(e.target.checked)}
                disabled={isScanning}
                className="hidden"
              />
              <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${dnsLookup ? 'bg-green-400 border-green-400' : 'border-green-600 group-hover:border-green-400'}`}>
                {dnsLookup && <Zap className="w-3 h-3 text-black" />}
              </div>
              <span className={`text-[10px] font-mono-code ${dnsLookup ? 'text-green-400' : 'text-green-700 group-hover:text-green-500'}`}>DNS LOOKUP</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={shodan} 
                onChange={(e) => setShodan(e.target.checked)}
                disabled={isScanning}
                className="hidden"
              />
              <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${shodan ? 'bg-green-400 border-green-400' : 'border-green-600 group-hover:border-green-400'}`}>
                {shodan && <Zap className="w-3 h-3 text-black" />}
              </div>
              <span className={`text-[10px] font-mono-code ${shodan ? 'text-green-400' : 'text-green-700 group-hover:text-green-500'}`}>SHODAN</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={takeOver} 
                onChange={(e) => setTakeOver(e.target.checked)}
                disabled={isScanning}
                className="hidden"
              />
              <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${takeOver ? 'bg-green-400 border-green-400' : 'border-green-600 group-hover:border-green-400'}`}>
                {takeOver && <Zap className="w-3 h-3 text-black" />}
              </div>
              <span className={`text-[10px] font-mono-code ${takeOver ? 'text-green-400' : 'text-green-700 group-hover:text-green-500'}`}>TAKEOVER</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 px-4 py-2 border border-red-500/30 bg-red-500/10 rounded text-red-400 text-xs font-mono-code">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Progress Bar */}
        {isScanning && (
          <div className="mt-4 pt-4 border-t border-green-500/10">
            <ProgressBar 
              progress={scanProgress} 
              label="SCAN PROGRESS" 
              showPercentage={true}
              animated={true}
            />
          </div>
        )}
      </div>

      {/* Sources Selection */}
      <div className="border-glow rounded-lg p-6 bg-black/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-cyber text-green-400 tracking-wide">
              OSINT SOURCES
            </h2>
          </div>
          <button
            onClick={handleSelectAll}
            disabled={isScanning}
            className="text-xs font-mono-code px-3 py-1.5 border border-green-500/30 rounded
                     text-green-400 hover:bg-green-400/10 hover:border-green-400/50 transition-all
                     disabled:opacity-50"
          >
            {selectedSources.length === allSources.length ? "DESELECT ALL" : "SELECT ALL"}
          </button>
        </div>

        <div className="text-xs font-mono-code text-green-600 mb-3">
          {selectedSources.length} / {allSources.length} sources selected
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {Object.entries(SOURCE_CATEGORIES).map(([category, { icon, sources }]) => {
            const availableSources = sources.filter((s) =>
              allSources.some((as: string) => as.toLowerCase() === s.toLowerCase())
            );
            if (availableSources.length === 0) return null;

            const isExpanded = expandedCategories.includes(category);
            const selectedInCategory = availableSources.filter((s) =>
              selectedSources.some(as => as.toLowerCase() === s.toLowerCase())
            ).length;

            return (
              <div key={category} className="border border-green-500/10 rounded-md overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  disabled={isScanning}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-green-500/5
                           hover:bg-green-400/10 transition-colors text-left disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">{icon}</span>
                    <span className="text-sm font-mono-code text-green-300">{category}</span>
                    <span className="text-xs text-green-600">
                      ({selectedInCategory}/{availableSources.length})
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-green-500" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 py-2 grid grid-cols-2 md:grid-cols-3 gap-2 bg-black/30">
                    {availableSources.map((source) => {
                      const realSource = allSources.find(as => as.toLowerCase() === source.toLowerCase()) || source;
                      const isSelected = selectedSources.includes(realSource);
                      return (
                        <label
                          key={source}
                          className="flex items-center gap-3 py-1.5 px-2 rounded cursor-pointer
                                   hover:bg-green-400/5 transition-colors group"
                        >
                          <input 
                            type="checkbox" 
                            checked={isSelected} 
                            onChange={() => toggleSource(realSource)}
                            disabled={isScanning}
                            className="hidden"
                          />
                          <div
                            className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-green-400 border-green-400"
                                : "border-green-600 group-hover:border-green-400"
                            }`}
                          >
                            {isSelected && (
                              <Zap className="w-3 h-3 text-black" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-mono-code capitalize ${
                              isSelected
                                ? "text-green-300"
                                : "text-green-600 group-hover:text-green-400"
                            }`}
                          >
                            {source}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scan Button */}
      <button
        onClick={handleScan}
        disabled={scanMutation.isPending || isScanning}
        className="w-full relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-green-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <div
          className="relative flex items-center justify-center gap-3 py-4 border-2 border-green-400/50 
                   rounded-lg bg-green-400/5 hover:border-green-400 hover:bg-green-400/10
                   transition-all duration-300 glow-box-green disabled:opacity-50"
        >
          {scanMutation.isPending || isScanning ? (
            <>
              <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
              <span className="font-cyber text-green-400 tracking-wider animate-pulse">
                SCANNING TARGET... {Math.round(scanProgress)}%
              </span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
              <span className="font-cyber text-green-400 tracking-wider group-hover:glow-green transition-all">
                INITIATE OSINT SCAN
              </span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}

import { Link } from "react-router";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import Header from "@/components/hacker/Header";
import MatrixRain from "@/components/hacker/MatrixRain";

const SOURCES_BY_CATEGORY = {
  "Search Engines": [
    { name: "Google", description: "Web search engine" },
    { name: "Bing", description: "Microsoft search engine" },
    { name: "Baidu", description: "Chinese search engine" },
    { name: "Brave", description: "Privacy-focused search" },
    { name: "DuckDuckGo", description: "Privacy search engine" },
    { name: "Mojeek", description: "Independent search engine" },
    { name: "Yahoo", description: "Yahoo search engine" },
  ],
  "Certificates": [
    { name: "Certspotter", description: "Certificate transparency logs" },
    { name: "Crtsh", description: "CT log search" },
    { name: "Chaos", description: "ProjectDiscovery Chaos" },
  ],
  "Threat Intelligence": [
    { name: "ThreatCrowd", description: "Threat intelligence" },
    { name: "OTX", description: "Open Threat Exchange" },
    { name: "VirusTotal", description: "Malware analysis" },
  ],
  "DNS & Network": [
    { name: "DNSDumpster", description: "DNS reconnaissance" },
    { name: "HackerTarget", description: "DNS & network tools" },
    { name: "Rapiddns", description: "DNS history" },
    { name: "Robtex", description: "IP & DNS analysis" },
  ],
  "Code Repositories": [
    { name: "GitHub-Code", description: "GitHub code search" },
    { name: "GitLab", description: "GitLab search" },
  ],
  "Web Archives": [
    { name: "WaybackArchive", description: "Internet Archive" },
    { name: "CommonCrawl", description: "Common Crawl index" },
  ],
  "Security Platforms": [
    { name: "SecurityTrails", description: "DNS & IP intelligence" },
    { name: "Shodan", description: "IoT search engine" },
    { name: "Censys", description: "Internet-wide scanning" },
    { name: "FOFA", description: "Cyberspace search engine" },
    { name: "ZoomEye", description: "Cyberspace search" },
  ],
  "Intelligence": [
    { name: "IntelX", description: "Intelligence platform" },
    { name: "Hunter", description: "Email finder" },
    { name: "RocketReach", description: "Professional data" },
    { name: "BuiltWith", description: "Technology profiler" },
  ],
  "Network Intelligence": [
    { name: "Netlas", description: "Network intelligence" },
    { name: "Onyphe", description: "Cyber defense" },
    { name: "CriminalIP", description: "IP reputation" },
  ],
  "Discovery": [
    { name: "SubdomainCenter", description: "Subdomain discovery" },
    { name: "SubdomainFinderC99", description: "Subdomain finder" },
    { name: "ProjectDiscovery", description: "Security tools" },
  ],
  "Other": [
    { name: "BeVigil", description: "Security intelligence" },
    { name: "FullHunt", description: "Attack surface" },
    { name: "HudsonRock", description: "Breach intelligence" },
    { name: "LeakIX", description: "Leak search engine" },
    { name: "Tomba", description: "Email finder" },
    { name: "URLScan", description: "URL scanner" },
    { name: "WhoisXML", description: "WHOIS data" },
  ],
};

export default function Sources() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = Object.entries(SOURCES_BY_CATEGORY).reduce(
    (acc, [category, sources]) => {
      const filtered = sources.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {} as Record<string, typeof SOURCES_BY_CATEGORY[keyof typeof SOURCES_BY_CATEGORY]>
  );

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-x-hidden">
      <MatrixRain />
      <div className="scanline fixed inset-0 z-[5] pointer-events-none" />

      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-green-400/10 border border-green-400/30 
                     text-green-400 font-cyber tracking-wider rounded-lg hover:bg-green-400/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-cyber tracking-wider text-green-400 glow-green mb-2">
              OSINT SOURCES
            </h1>
            <p className="text-green-600 font-mono-code">
              Explore all 60+ available intelligence gathering sources
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-green-600" />
              <input
                type="text"
                placeholder="Search sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 bg-black/50 border border-green-500/20 rounded-lg 
                         text-green-400 placeholder-green-700 font-mono-code focus:outline-none 
                         focus:border-green-400/50 focus:bg-black/70 transition-all"
              />
            </div>
          </div>

          {/* Sources Grid */}
          <div className="space-y-8">
            {Object.entries(filteredCategories).map(([category, sources]) => (
              <div key={category}>
                <h2 className="text-xl font-cyber text-green-400 tracking-wider mb-4 border-b border-green-500/20 pb-2">
                  {category}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sources.map((source) => (
                    <div
                      key={source.name}
                      className="border-glow rounded-lg p-4 bg-black/50 border border-green-500/20 
                               hover:border-green-400/50 hover:bg-black/70 transition-all"
                    >
                      <h3 className="text-green-400 font-cyber tracking-wider mb-1">
                        {source.name}
                      </h3>
                      <p className="text-green-700 text-sm font-mono-code">
                        {source.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {Object.keys(filteredCategories).length === 0 && (
            <div className="text-center py-12">
              <p className="text-green-600 font-mono-code">
                No sources found matching "{searchTerm}"
              </p>
            </div>
          )}
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

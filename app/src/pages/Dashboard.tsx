import { useState, useCallback } from "react";
import MatrixRain from "@/components/hacker/MatrixRain";
import Header from "@/components/hacker/Header";
import StatsBar from "@/components/hacker/StatsBar";
import ScannerForm from "@/components/hacker/ScannerForm";
import Terminal from "@/components/hacker/Terminal";
import ResultsPanel from "@/components/hacker/ResultsPanel";
import ScanHistory from "@/components/hacker/ScanHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "$ theHarvester OSINT Suite v4.7 initialized",
    "$ Loaded 60+ OSINT sources",
    "$ FastAPI backend: http://127.0.0.1:5000",
    "$ Ready for intelligence gathering...",
    "",
  ]);
  const [scanResults, setScanResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("scanner");

  const addTerminalLine = useCallback((line: string) => {
    setTerminalLines((prev) => [...prev, line]);
  }, []);

  const handleScanComplete = useCallback(
    (results: any) => {
      setScanResults(results);
      setActiveTab("results");
    },
    []
  );

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-x-hidden">
      <MatrixRain />
      <div className="scanline fixed inset-0 z-[5] pointer-events-none" />

      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <StatsBar />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-black/60 border border-green-500/20 p-1 rounded-lg backdrop-blur">
              <TabsTrigger
                value="scanner"
                className="flex-1 font-cyber text-xs tracking-wider py-2.5 rounded-md
                         data-[state=active]:bg-green-400/10 data-[state=active]:text-green-400
                         data-[state=active]:border data-[state=active]:border-green-400/30
                         text-green-700 hover:text-green-400 transition-all"
              >
                OSINT SCANNER
              </TabsTrigger>
              <TabsTrigger
                value="results"
                className="flex-1 font-cyber text-xs tracking-wider py-2.5 rounded-md
                         data-[state=active]:bg-green-400/10 data-[state=active]:text-green-400
                         data-[state=active]:border data-[state=active]:border-green-400/30
                         text-green-700 hover:text-green-400 transition-all"
              >
                RESULTS
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex-1 font-cyber text-xs tracking-wider py-2.5 rounded-md
                         data-[state=active]:bg-green-400/10 data-[state=active]:text-green-400
                         data-[state=active]:border data-[state=active]:border-green-400/30
                         text-green-700 hover:text-green-400 transition-all"
              >
                HISTORY
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TabsContent value="scanner" className="mt-0">
                  <ScannerForm
                    onScanComplete={handleScanComplete}
                    onTerminalOutput={addTerminalLine}
                  />
                </TabsContent>

                <TabsContent value="results" className="mt-0">
                  {scanResults ? (
                    <ResultsPanel results={scanResults} />
                  ) : (
                    <div className="border-glow rounded-lg p-12 bg-black/50 text-center">
                      <div className="text-6xl mb-4 opacity-20">{"{ }"}</div>
                      <p className="font-cyber text-green-600 text-lg tracking-wider">
                        NO RESULTS YET
                      </p>
                      <p className="font-mono-code text-green-800 text-xs mt-2">
                        Run a scan to see results here
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <ScanHistory />
                </TabsContent>
              </div>

              <div className="lg:col-span-1">
                <Terminal lines={terminalLines} />

                {/* Quick Info Panel */}
                <div className="mt-4 border-glow rounded-lg p-4 bg-black/50">
                  <h3 className="text-xs font-cyber text-green-400 tracking-wider mb-3">
                    SYSTEM INFO
                  </h3>
                  <div className="space-y-2 text-[10px] font-mono-code">
                    <div className="flex justify-between">
                      <span className="text-green-700">Backend</span>
                      <span className="text-green-400">FastAPI + tRPC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Engine</span>
                      <span className="text-green-400">theHarvester</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Version</span>
                      <span className="text-green-400">v4.7.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">API Port</span>
                      <span className="text-green-400">5000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Database</span>
                      <span className="text-green-400">MySQL + Drizzle</span>
                    </div>
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="mt-4 border-glow rounded-lg p-4 bg-black/50">
                  <h3 className="text-xs font-cyber text-green-400 tracking-wider mb-3">
                    SHORTCUTS
                  </h3>
                  <div className="space-y-2 text-[10px] font-mono-code">
                    <div className="flex justify-between">
                      <span className="text-green-700">Ctrl + Enter</span>
                      <span className="text-green-400">Start Scan</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Ctrl + 1</span>
                      <span className="text-green-400">Scanner Tab</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Ctrl + 2</span>
                      <span className="text-green-400">Results Tab</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Ctrl + 3</span>
                      <span className="text-green-400">History Tab</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
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

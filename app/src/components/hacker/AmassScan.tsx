import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Search, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AmassScan() {
  const [target, setTarget] = useState("");
  const startScan = trpc.osint.startScan.useMutation({
    onSuccess: (data) => {
      toast.success(`Amass scan started! ID: ${data.scanId}`);
    },
    onError: (error) => {
      toast.error(`Failed to start scan: ${error.message}`);
    },
  });

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    startScan.mutate({ tool: "amass", target });
  };

  return (
    <div className="border-glow rounded-lg p-6 bg-black/40 border border-green-500/20">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-cyber tracking-wider text-green-400">OWASP AMASS DISCOVERY</h2>
      </div>

      <form onSubmit={handleScan} className="space-y-4">
        <div>
          <label className="block text-xs font-mono-code text-green-700 mb-2 uppercase tracking-widest">
            Target Domain
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-green-800" />
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="example.com"
              className="w-full bg-black/60 border border-green-900/50 rounded px-10 py-2 text-green-400 
                       font-mono-code focus:outline-none focus:border-green-500/50 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={startScan.isPending || !target}
          className="w-full py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-cyber 
                   tracking-widest hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-all flex items-center justify-center gap-2"
        >
          {startScan.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              INITIALIZING...
            </>
          ) : (
            "START AMASS SCAN"
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-green-950/10 border border-green-900/20 rounded text-[10px] font-mono-code text-green-700">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <p>
            Amass performs in-depth attack surface mapping. This process can take several minutes 
            depending on the target size and selected data sources.
          </p>
        </div>
      </div>
    </div>
  );
}

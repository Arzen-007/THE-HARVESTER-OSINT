import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { UserSearch, Loader2, Fingerprint, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function SherlockScan() {
  const [username, setUsername] = useState("");
  const startScan = trpc.osint.startScan.useMutation({
    onSuccess: (data) => {
      toast.success(`Sherlock scan started! ID: ${data.scanId}`);
    },
    onError: (error) => {
      toast.error(`Failed to start scan: ${error.message}`);
    },
  });

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    startScan.mutate({ tool: "sherlock", target: username });
  };

  return (
    <div className="border-glow rounded-lg p-6 bg-black/40 border border-green-500/20">
      <div className="flex items-center gap-3 mb-6">
        <Fingerprint className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-cyber tracking-wider text-green-400">SHERLOCK PERSONA HUNT</h2>
      </div>

      <form onSubmit={handleScan} className="space-y-4">
        <div>
          <label className="block text-xs font-mono-code text-green-700 mb-2 uppercase tracking-widest">
            Target Username
          </label>
          <div className="relative">
            <UserSearch className="absolute left-3 top-2.5 w-4 h-4 text-green-800" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe123"
              className="w-full bg-black/60 border border-green-900/50 rounded px-10 py-2 text-green-400 
                       font-mono-code focus:outline-none focus:border-green-500/50 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={startScan.isPending || !username}
          className="w-full py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-cyber 
                   tracking-widest hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-all flex items-center justify-center gap-2"
        >
          {startScan.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              HUNTING...
            </>
          ) : (
            "START SHERLOCK HUNT"
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-green-950/10 border border-green-900/20 rounded text-[10px] font-mono-code text-green-700">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <p>
            Sherlock searches for the username across 400+ social networks. This helps in 
            identifying the digital footprint of a target persona.
          </p>
        </div>
      </div>
    </div>
  );
}

import { Terminal, Activity, Shield } from "lucide-react";
import { Link } from "react-router";
import logo from "@/assets/logo.png";

export default function Header() {
  return (
    <header className="relative z-10 border-b border-green-500/20 backdrop-blur-md bg-black/60">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <img 
                src={logo} 
                alt="THE HARVESTER Logo" 
                className="w-10 h-10 object-contain drop-shadow-lg hover:drop-shadow-2xl transition-all"
              />
              <div className="absolute inset-0 w-10 h-10 bg-green-400/20 blur-lg rounded-full" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold font-cyber tracking-wider text-green-400 glow-green"
                data-text="THE HARVESTER"
              >
                THE HARVESTER
              </h1>
              <p className="text-[10px] font-mono-code text-green-600 tracking-[0.3em] uppercase">
                OSINT Intelligence Suite v4.7
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <StatusIndicator icon={<Shield className="w-4 h-4" />} label="SECURE" color="green" />
            <StatusIndicator icon={<Activity className="w-4 h-4" />} label="LIVE" color="green" />
            <StatusIndicator icon={<Terminal className="w-4 h-4" />} label="API READY" color="green" />
          </div>

          <div className="text-right hidden md:block">
            <div className="text-xs font-mono-code text-green-500">
              {new Date().toLocaleTimeString()}
            </div>
            <div className="text-[10px] font-mono-code text-green-700">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatusIndicator({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: "green" | "red" | "yellow";
}) {
  const colorMap = {
    green: "text-green-400 bg-green-400/10 border-green-400/30",
    red: "text-red-400 bg-red-400/10 border-red-400/30",
    yellow: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono-code ${colorMap[color]}`}>
      <span className="animate-pulse">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

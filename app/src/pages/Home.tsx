import { Link } from "react-router";
import { Zap, Shield, Globe, BarChart3, Settings, BookOpen } from "lucide-react";
import logo from "@/assets/logo.png";
import MatrixRain from "@/components/hacker/MatrixRain";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-x-hidden">
      <MatrixRain />
      <div className="scanline fixed inset-0 z-[5] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-green-500/20 backdrop-blur-md bg-black/60">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={logo} 
                  alt="THE HARVESTER Logo" 
                  className="w-10 h-10 object-contain drop-shadow-lg"
                />
                <h1 className="text-2xl font-bold font-cyber tracking-wider text-green-400 glow-green">
                  THE HARVESTER
                </h1>
              </div>
              <div className="text-xs font-mono-code text-green-500">
                OSINT Intelligence Suite v4.7
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="mb-8 flex justify-center">
              <img 
                src={logo} 
                alt="THE HARVESTER Logo" 
                className="w-32 h-32 object-contain drop-shadow-2xl hover:drop-shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all"
              />
            </div>
            <h2 className="text-5xl font-bold font-cyber tracking-wider text-green-400 mb-4 glow-green">
              THE HARVESTER
            </h2>
            <p className="text-xl font-mono-code text-green-600 mb-2">
              Advanced OSINT Intelligence Gathering Platform
            </p>
            <p className="text-sm text-green-700 max-w-2xl mx-auto">
              Harness the power of 60+ OSINT sources with a modern, intuitive interface. 
              Gather intelligence on domains, emails, hosts, and more with unprecedented ease.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <StatCard number="60+" label="OSINT Sources" />
            <StatCard number="Real-time" label="Results Processing" />
            <StatCard number="Persistent" label="Scan History" />
            <StatCard number="Advanced" label="DNS Tools" />
          </div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <NavCard
              icon={<Zap className="w-6 h-6" />}
              title="SCANNER"
              description="Start a new OSINT scan with 60+ sources"
              href="/dashboard"
              color="green"
            />
            <NavCard
              icon={<Globe className="w-6 h-6" />}
              title="SOURCES"
              description="Explore all available OSINT sources"
              href="/sources"
              color="green"
            />
            <NavCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="ANALYTICS"
              description="View scan history and statistics"
              href="/analytics"
              color="green"
            />
            <NavCard
              icon={<Shield className="w-6 h-6" />}
              title="SECURITY"
              description="API keys and security settings"
              href="/settings"
              color="green"
            />
            <NavCard
              icon={<BookOpen className="w-6 h-6" />}
              title="DOCUMENTATION"
              description="Learn how to use THE HARVESTER"
              href="/docs"
              color="green"
            />
            <NavCard
              icon={<Settings className="w-6 h-6" />}
              title="CONFIGURATION"
              description="Configure sources and preferences"
              href="/config"
              color="green"
            />
          </div>

          {/* Features Section */}
          <div className="border-glow rounded-lg p-8 bg-black/50 mb-16">
            <h3 className="text-2xl font-cyber text-green-400 tracking-wider mb-6">
              KEY FEATURES
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <FeatureItem title="Multi-Source Gathering" description="Query 60+ OSINT sources simultaneously" />
              <FeatureItem title="Real-time Processing" description="Live terminal feedback and progress tracking" />
              <FeatureItem title="Persistent Storage" description="MySQL database for scan history and results" />
              <FeatureItem title="Advanced Filtering" description="DNS brute force, Shodan queries, and takeover checks" />
              <FeatureItem title="Export Capabilities" description="Download results in JSON format" />
              <FeatureItem title="Hacker-Themed UI" description="Cyber-inspired dashboard with Matrix effects" />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center border-glow rounded-lg p-12 bg-black/50">
            <h3 className="text-3xl font-cyber text-green-400 tracking-wider mb-4">
              Ready to Start Harvesting?
            </h3>
            <p className="text-green-600 mb-8 font-mono-code">
              Launch the OSINT scanner and begin your intelligence gathering
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-8 py-3 bg-green-400/10 border border-green-400/30 text-green-400 
                       font-cyber tracking-wider rounded-lg hover:bg-green-400/20 hover:border-green-400/50 
                       transition-all duration-300 glow-green"
            >
              LAUNCH SCANNER
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-green-500/10 mt-20 py-6 bg-black/60 backdrop-blur">
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

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="border-glow rounded-lg p-4 bg-black/50 text-center hover:bg-black/70 transition-all">
      <div className="text-2xl font-bold font-cyber text-green-400 mb-2">{number}</div>
      <div className="text-xs font-mono-code text-green-600">{label}</div>
    </div>
  );
}

interface NavCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: "green" | "red" | "blue";
}

function NavCard({ icon, title, description, href, color }: NavCardProps) {
  const colorClass = color === "green" ? "hover:border-green-400/50 hover:bg-green-400/5" : "";
  
  return (
    <Link
      to={href}
      className={`border-glow rounded-lg p-6 bg-black/50 border border-green-500/20 
                 transition-all duration-300 hover:scale-105 ${colorClass}`}
    >
      <div className="text-green-400 mb-3">{icon}</div>
      <h4 className="text-lg font-cyber text-green-400 tracking-wider mb-2">{title}</h4>
      <p className="text-sm font-mono-code text-green-700">{description}</p>
    </Link>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-6 w-6 rounded-md bg-green-400/10 border border-green-400/30">
          <span className="text-green-400 text-sm">✓</span>
        </div>
      </div>
      <div>
        <h4 className="text-green-400 font-cyber tracking-wider mb-1">{title}</h4>
        <p className="text-green-700 text-sm font-mono-code">{description}</p>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Lock, Eye, EyeOff, Save, Trash2, Plus, Shield, AlertCircle, Network, Settings2 } from "lucide-react";
import MatrixRain from "@/components/hacker/MatrixRain";
import Header from "@/components/hacker/Header";
import ProxyConfig from "@/components/hacker/ProxyConfig";
import AdvancedSettings from "@/components/hacker/AdvancedSettings";

interface ApiKey {
  id: string;
  service: string;
  key: string;
  isVisible: boolean;
  createdAt: string;
}

type SettingsTab = "api-keys" | "proxy" | "advanced";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("api-keys");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newService, setNewService] = useState("");
  const [newKey, setNewKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load API keys from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("harvester_api_keys");
    if (stored) {
      try {
        setApiKeys(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load API keys:", e);
      }
    }
  }, []);

  // Save API keys to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("harvester_api_keys", JSON.stringify(apiKeys));
  }, [apiKeys]);

  const handleAddKey = () => {
    if (!newService.trim()) {
      setError("Service name is required");
      return;
    }
    if (!newKey.trim()) {
      setError("API key is required");
      return;
    }

    const duplicate = apiKeys.find(
      (k) => k.service.toLowerCase() === newService.toLowerCase()
    );
    if (duplicate) {
      setError("API key for this service already exists");
      return;
    }

    const newApiKey: ApiKey = {
      id: `${Date.now()}`,
      service: newService,
      key: newKey,
      isVisible: false,
      createdAt: new Date().toISOString(),
    };

    setApiKeys([...apiKeys, newApiKey]);
    setNewService("");
    setNewKey("");
    setError("");
    setSuccess("API key added successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
    setSuccess("API key removed");
    setTimeout(() => setSuccess(""), 3000);
  };

  const toggleVisibility = (id: string) => {
    setApiKeys(
      apiKeys.map((k) =>
        k.id === id ? { ...k, isVisible: !k.isVisible } : k
      )
    );
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return "*".repeat(key.length);
    return key.substring(0, 4) + "*".repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-x-hidden">
      <MatrixRain />
      <div className="scanline fixed inset-0 z-[5] pointer-events-none" />

      <div className="relative z-10">
        <Header />

        <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono-code text-green-600">
            <Link to="/" className="hover:text-green-400">Home</Link>
            <span>/</span>
            <span className="text-green-400">Settings</span>
          </div>

          {/* Page Title */}
          <div className="border-glow rounded-lg p-6 bg-black/50">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-green-400" />
              <h1 className="text-3xl font-cyber text-green-400 tracking-wider">
                CONFIGURATION PANEL
              </h1>
            </div>
            <p className="text-sm font-mono-code text-green-700">
              Manage API keys, proxy settings, and advanced configuration options.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-green-500/20 overflow-x-auto">
            <button
              onClick={() => setActiveTab("api-keys")}
              className={`px-4 py-3 font-cyber text-sm tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "api-keys"
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-green-700 hover:text-green-400"
              }`}
            >
              <Lock className="w-4 h-4" />
              API KEYS
            </button>
            <button
              onClick={() => setActiveTab("proxy")}
              className={`px-4 py-3 font-cyber text-sm tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "proxy"
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-green-700 hover:text-green-400"
              }`}
            >
              <Network className="w-4 h-4" />
              PROXY
            </button>
            <button
              onClick={() => setActiveTab("advanced")}
              className={`px-4 py-3 font-cyber text-sm tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "advanced"
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-green-700 hover:text-green-400"
              }`}
            >
              <Settings2 className="w-4 h-4" />
              ADVANCED
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="border-glow rounded-lg p-4 bg-red-500/10 border-red-500/30">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-mono-code text-red-400">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="border-glow rounded-lg p-4 bg-green-500/10 border-green-500/30">
              <span className="text-sm font-mono-code text-green-400">{success}</span>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "api-keys" && (
            <div className="space-y-6">
              {/* Add New API Key */}
              <div className="border-glow rounded-lg p-6 bg-black/50">
                <div className="flex items-center gap-3 mb-4">
                  <Plus className="w-5 h-5 text-green-400" />
                  <h2 className="text-lg font-cyber text-green-400 tracking-wider">
                    ADD NEW API KEY
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="e.g., Shodan, Hunter.io, Censys"
                      className="w-full bg-black/80 border border-green-500/30 rounded-md px-4 py-2 
                               text-green-400 font-mono-code text-sm placeholder:text-green-800
                               focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                               transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full bg-black/80 border border-green-500/30 rounded-md px-4 py-2 
                               text-green-400 font-mono-code text-sm placeholder:text-green-800
                               focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                               transition-all"
                    />
                  </div>

                  <button
                    onClick={handleAddKey}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 
                             bg-green-400/10 border border-green-400/30 rounded-md
                             text-green-400 font-mono-code text-sm
                             hover:bg-green-400/20 hover:border-green-400/50 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    SAVE API KEY
                  </button>
                </div>
              </div>

              {/* Stored API Keys */}
              <div className="border-glow rounded-lg p-6 bg-black/50">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-5 h-5 text-green-400" />
                  <h2 className="text-lg font-cyber text-green-400 tracking-wider">
                    STORED API KEYS ({apiKeys.length})
                  </h2>
                </div>

                {apiKeys.length === 0 ? (
                  <div className="text-center py-8 text-green-700 font-mono-code text-sm">
                    No API keys stored yet. Add one above to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {apiKeys.map((apiKey) => (
                      <div
                        key={apiKey.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-green-500/20 bg-black/30 hover:border-green-500/40 transition-all"
                      >
                        <div className="flex-1">
                          <div className="text-sm font-cyber text-green-300 mb-1">
                            {apiKey.service}
                          </div>
                          <div className="text-xs font-mono-code text-green-600">
                            {apiKey.isVisible ? apiKey.key : maskKey(apiKey.key)}
                          </div>
                          <div className="text-[10px] font-mono-code text-green-700 mt-1">
                            Added: {new Date(apiKey.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleVisibility(apiKey.id)}
                            className="p-2 rounded hover:bg-green-400/10 transition-colors"
                            title={apiKey.isVisible ? "Hide key" : "Show key"}
                          >
                            {apiKey.isVisible ? (
                              <EyeOff className="w-4 h-4 text-green-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-green-600" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteKey(apiKey.id)}
                            className="p-2 rounded hover:bg-red-400/10 transition-colors"
                            title="Delete key"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <div className="border-glow rounded-lg p-4 bg-yellow-500/10 border-yellow-500/30">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-cyber text-yellow-400 mb-1">Security Notice</h3>
                    <p className="text-xs font-mono-code text-yellow-700">
                      API keys are stored in your browser's local storage. For production use, consider using environment variables or a secure backend service. Never share your API keys.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "proxy" && (
            <ProxyConfig />
          )}

          {activeTab === "advanced" && (
            <AdvancedSettings />
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

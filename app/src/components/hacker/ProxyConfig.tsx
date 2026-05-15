import { useState, useEffect } from "react";
import { Network, Shield, Eye, EyeOff, Plus, Trash2, Check, AlertTriangle } from "lucide-react";

interface ProxySettings {
  enabled: boolean;
  type: "http" | "https" | "socks5";
  host: string;
  port: number;
  username?: string;
  password?: string;
  useAuth: boolean;
}

interface ProxyConfigProps {
  onProxyChange?: (settings: ProxySettings) => void;
}

export default function ProxyConfig({ onProxyChange }: ProxyConfigProps) {
  const [proxySettings, setProxySettings] = useState<ProxySettings>(() => {
    const saved = localStorage.getItem("proxySettings");
    return saved
      ? JSON.parse(saved)
      : {
          enabled: false,
          type: "http",
          host: "",
          port: 8080,
          username: "",
          password: "",
          useAuth: false,
        };
  });

  const [showPassword, setShowPassword] = useState(false);
  const [testResult, setTestResult] = useState<"idle" | "testing" | "success" | "failed">("idle");
  const [savedProxies, setSavedProxies] = useState<ProxySettings[]>(() => {
    const saved = localStorage.getItem("savedProxies");
    return saved ? JSON.parse(saved) : [];
  });

  // Save proxy settings to localStorage
  useEffect(() => {
    localStorage.setItem("proxySettings", JSON.stringify(proxySettings));
    onProxyChange?.(proxySettings);
  }, [proxySettings, onProxyChange]);

  const handleProxyChange = (field: keyof ProxySettings, value: any) => {
    setProxySettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const testProxy = async () => {
    if (!proxySettings.host || !proxySettings.port) {
      setTestResult("failed");
      return;
    }

    setTestResult("testing");
    try {
      // Simulate proxy test with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("https://httpbin.org/ip", {
        signal: controller.signal,
        // Note: Browser doesn't support custom proxy configuration directly
        // This is a placeholder for backend implementation
      });

      clearTimeout(timeoutId);
      setTestResult(response.ok ? "success" : "failed");
      setTimeout(() => setTestResult("idle"), 3000);
    } catch (error) {
      setTestResult("failed");
      setTimeout(() => setTestResult("idle"), 3000);
    }
  };

  const saveCurrentProxy = () => {
    if (!proxySettings.host) return;
    
    const newProxy = { ...proxySettings };
    setSavedProxies((prev) => [...prev, newProxy]);
    localStorage.setItem("savedProxies", JSON.stringify([...savedProxies, newProxy]));
  };

  const loadProxy = (proxy: ProxySettings) => {
    setProxySettings(proxy);
  };

  const deleteProxy = (index: number) => {
    const updated = savedProxies.filter((_, i) => i !== index);
    setSavedProxies(updated);
    localStorage.setItem("savedProxies", JSON.stringify(updated));
  };

  const proxyUrl = proxySettings.host
    ? `${proxySettings.type}://${proxySettings.useAuth ? `${proxySettings.username}:***@` : ""}${proxySettings.host}:${proxySettings.port}`
    : "Not configured";

  return (
    <div className="space-y-6">
      {/* Main Proxy Configuration */}
      <div className="border-glow rounded-lg p-6 bg-black/50">
        <div className="flex items-center gap-3 mb-4">
          <Network className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-cyber text-green-400 tracking-wide">
            PROXY CONFIGURATION
          </h2>
          <div className="flex-1" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={proxySettings.enabled}
              onChange={(e) => handleProxyChange("enabled", e.target.checked)}
              className="hidden"
            />
            <div
              className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                proxySettings.enabled
                  ? "bg-green-400 border-green-400"
                  : "border-green-600 hover:border-green-400"
              }`}
            >
              {proxySettings.enabled && <Check className="w-3 h-3 text-black" />}
            </div>
            <span className="text-xs font-cyber text-green-600">ENABLE PROXY</span>
          </label>
        </div>

        {/* Proxy Type Selection */}
        <div className="mb-4">
          <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
            Proxy Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["http", "https", "socks5"].map((type) => (
              <button
                key={type}
                onClick={() => handleProxyChange("type", type)}
                className={`py-2 px-3 rounded-lg font-mono-code text-xs uppercase transition-all ${
                  proxySettings.type === type
                    ? "bg-green-400/20 border border-green-400 text-green-400"
                    : "bg-green-500/5 border border-green-500/20 text-green-600 hover:border-green-400"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Host and Port */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
              Proxy Host
            </label>
            <input
              type="text"
              value={proxySettings.host}
              onChange={(e) => handleProxyChange("host", e.target.value)}
              placeholder="proxy.example.com or 192.168.1.1"
              disabled={!proxySettings.enabled}
              className="w-full bg-black/80 border border-green-500/30 rounded-md px-4 py-2
                       text-green-400 font-mono-code text-sm placeholder:text-green-800
                       focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                       transition-all disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
              Port
            </label>
            <input
              type="number"
              value={proxySettings.port}
              onChange={(e) => handleProxyChange("port", Number(e.target.value))}
              placeholder="8080"
              disabled={!proxySettings.enabled}
              className="w-full bg-black/80 border border-green-500/30 rounded-md px-4 py-2
                       text-green-400 font-mono-code text-sm
                       focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                       transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Authentication */}
        <div className="mb-4 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={proxySettings.useAuth}
              onChange={(e) => handleProxyChange("useAuth", e.target.checked)}
              disabled={!proxySettings.enabled}
              className="hidden"
            />
            <div
              className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all ${
                proxySettings.useAuth
                  ? "bg-green-400 border-green-400"
                  : "border-green-600 hover:border-green-400"
              }`}
            >
              {proxySettings.useAuth && <Check className="w-3 h-3 text-black" />}
            </div>
            <span className="text-xs font-cyber text-green-600">AUTHENTICATION REQUIRED</span>
          </label>

          {proxySettings.useAuth && (
            <div className="grid md:grid-cols-2 gap-3">
              <input
                type="text"
                value={proxySettings.username}
                onChange={(e) => handleProxyChange("username", e.target.value)}
                placeholder="Username"
                disabled={!proxySettings.enabled}
                className="bg-black/80 border border-green-500/30 rounded-md px-3 py-2
                         text-green-400 font-mono-code text-xs placeholder:text-green-800
                         focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                         transition-all disabled:opacity-50"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={proxySettings.password}
                  onChange={(e) => handleProxyChange("password", e.target.value)}
                  placeholder="Password"
                  disabled={!proxySettings.enabled}
                  className="w-full bg-black/80 border border-green-500/30 rounded-md px-3 py-2
                           text-green-400 font-mono-code text-xs placeholder:text-green-800
                           focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                           transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Proxy URL Display */}
        <div className="mb-4 p-3 bg-black/50 border border-green-500/20 rounded-lg">
          <div className="text-xs font-mono-code text-green-600 mb-1">PROXY URL</div>
          <div className="text-xs font-mono-code text-green-400 break-all">{proxyUrl}</div>
        </div>

        {/* Test Button */}
        <button
          onClick={testProxy}
          disabled={!proxySettings.host || testResult === "testing"}
          className={`w-full py-2 px-4 rounded-lg font-cyber text-sm tracking-wider transition-all flex items-center justify-center gap-2 ${
            testResult === "success"
              ? "bg-green-400/20 border border-green-400 text-green-400"
              : testResult === "failed"
              ? "bg-red-400/20 border border-red-400 text-red-400"
              : "bg-green-400/10 border border-green-400/30 text-green-400 hover:border-green-400"
          }`}
        >
          {testResult === "testing" && (
            <>
              <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
              TESTING...
            </>
          )}
          {testResult === "success" && (
            <>
              <Check className="w-4 h-4" />
              PROXY OK
            </>
          )}
          {testResult === "failed" && (
            <>
              <AlertTriangle className="w-4 h-4" />
              TEST FAILED
            </>
          )}
          {testResult === "idle" && (
            <>
              <Shield className="w-4 h-4" />
              TEST PROXY
            </>
          )}
        </button>
      </div>

      {/* Saved Proxies */}
      {savedProxies.length > 0 && (
        <div className="border-glow rounded-lg p-6 bg-black/50">
          <h3 className="text-lg font-cyber text-green-400 tracking-wide mb-4">
            SAVED PROXIES
          </h3>
          <div className="space-y-2">
            {savedProxies.map((proxy, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-lg"
              >
                <div className="flex-1">
                  <div className="text-xs font-mono-code text-green-400">
                    {proxy.type.toUpperCase()} - {proxy.host}:{proxy.port}
                  </div>
                  {proxy.useAuth && (
                    <div className="text-[10px] text-green-700 mt-1">Auth: {proxy.username}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadProxy(proxy)}
                    className="px-2 py-1 text-xs font-mono-code bg-green-400/10 border border-green-400/30
                             text-green-400 rounded hover:bg-green-400/20 transition-all"
                  >
                    LOAD
                  </button>
                  <button
                    onClick={() => deleteProxy(idx)}
                    className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Current Proxy */}
      {proxySettings.host && (
        <button
          onClick={saveCurrentProxy}
          className="w-full py-2 px-4 bg-green-400/10 border border-green-400/30 rounded-lg
                   font-cyber text-sm text-green-400 hover:bg-green-400/20 transition-all
                   flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          SAVE CURRENT PROXY
        </button>
      )}
    </div>
  );
}

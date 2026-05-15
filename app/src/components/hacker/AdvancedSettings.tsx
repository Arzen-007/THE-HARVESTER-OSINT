import { useState, useEffect } from "react";
import { Settings2, RotateCcw } from "lucide-react";

interface AdvancedSettingsConfig {
  timeout: number;
  retries: number;
  userAgent: string;
  rateLimit: number;
  tlsVerify: boolean;
  followRedirects: boolean;
  cacheResults: boolean;
  verboseLogging: boolean;
}

interface AdvancedSettingsProps {
  onSettingsChange?: (settings: AdvancedSettingsConfig) => void;
}

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
  "Custom User-Agent",
];

export default function AdvancedSettings({ onSettingsChange }: AdvancedSettingsProps) {
  const [settings, setSettings] = useState<AdvancedSettingsConfig>(() => {
    const saved = localStorage.getItem("advancedSettings");
    return saved
      ? JSON.parse(saved)
      : {
          timeout: 30,
          retries: 3,
          userAgent: USER_AGENTS[0],
          rateLimit: 10,
          tlsVerify: true,
          followRedirects: true,
          cacheResults: true,
          verboseLogging: false,
        };
  });

  const [customUserAgent, setCustomUserAgent] = useState("");

  useEffect(() => {
    localStorage.setItem("advancedSettings", JSON.stringify(settings));
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  const handleSettingChange = (key: keyof AdvancedSettingsConfig, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetToDefaults = () => {
    const defaults: AdvancedSettingsConfig = {
      timeout: 30,
      retries: 3,
      userAgent: USER_AGENTS[0],
      rateLimit: 10,
      tlsVerify: true,
      followRedirects: true,
      cacheResults: true,
      verboseLogging: false,
    };
    setSettings(defaults);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Settings2 className="w-5 h-5 text-green-400" />
        <h2 className="text-lg font-cyber text-green-400 tracking-wide">
          ADVANCED SETTINGS
        </h2>
        <div className="flex-1" />
        <button
          onClick={resetToDefaults}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono-code
                   border border-green-500/30 rounded text-green-400
                   hover:bg-green-400/10 hover:border-green-400/50 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          RESET
        </button>
      </div>

      {/* Request Settings */}
      <div className="border-glow rounded-lg p-6 bg-black/50">
        <h3 className="text-sm font-cyber text-green-400 tracking-wider mb-4">
          REQUEST SETTINGS
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Timeout */}
          <div>
            <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
              Request Timeout (seconds)
            </label>
            <input
              type="number"
              value={settings.timeout}
              onChange={(e) => handleSettingChange("timeout", Number(e.target.value))}
              min={5}
              max={300}
              className="w-full bg-black/80 border border-green-500/30 rounded-md px-4 py-2
                       text-green-400 font-mono-code text-sm
                       focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                       transition-all"
            />
            <div className="text-[10px] text-green-700 mt-1">
              Maximum time to wait for a response (5-300 seconds)
            </div>
          </div>

          {/* Retries */}
          <div>
            <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
              Retry Attempts
            </label>
            <input
              type="number"
              value={settings.retries}
              onChange={(e) => handleSettingChange("retries", Number(e.target.value))}
              min={0}
              max={10}
              className="w-full bg-black/80 border border-green-500/30 rounded-md px-4 py-2
                       text-green-400 font-mono-code text-sm
                       focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                       transition-all"
            />
            <div className="text-[10px] text-green-700 mt-1">
              Number of retries on failed requests (0-10)
            </div>
          </div>

          {/* Rate Limit */}
          <div>
            <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
              Rate Limit (requests/second)
            </label>
            <input
              type="number"
              value={settings.rateLimit}
              onChange={(e) => handleSettingChange("rateLimit", Number(e.target.value))}
              min={1}
              max={100}
              step={0.5}
              className="w-full bg-black/80 border border-green-500/30 rounded-md px-4 py-2
                       text-green-400 font-mono-code text-sm
                       focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                       transition-all"
            />
            <div className="text-[10px] text-green-700 mt-1">
              Limit requests to avoid rate limiting (1-100 req/s)
            </div>
          </div>

          {/* TLS Verification */}
          <div>
            <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
              SSL/TLS Verification
            </label>
            <select
              value={settings.tlsVerify ? "enabled" : "disabled"}
              onChange={(e) => handleSettingChange("tlsVerify", e.target.value === "enabled")}
              className="w-full bg-black/80 border border-green-500/30 rounded-md px-4 py-2
                       text-green-400 font-mono-code text-sm
                       focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                       transition-all"
            >
              <option value="enabled">Enabled (Recommended)</option>
              <option value="disabled">Disabled</option>
            </select>
            <div className="text-[10px] text-green-700 mt-1">
              Verify SSL/TLS certificates for HTTPS connections
            </div>
          </div>
        </div>
      </div>

      {/* Behavior Settings */}
      <div className="border-glow rounded-lg p-6 bg-black/50">
        <h3 className="text-sm font-cyber text-green-400 tracking-wider mb-4">
          BEHAVIOR SETTINGS
        </h3>

        <div className="space-y-3">
          {/* Follow Redirects */}
          <label className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg cursor-pointer hover:bg-green-500/10 transition-colors">
            <input
              type="checkbox"
              checked={settings.followRedirects}
              onChange={(e) => handleSettingChange("followRedirects", e.target.checked)}
              className="hidden"
            />
            <div
              className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                settings.followRedirects
                  ? "bg-green-400 border-green-400"
                  : "border-green-600 hover:border-green-400"
              }`}
            >
              {settings.followRedirects && <div className="w-2 h-2 bg-black rounded-full" />}
            </div>
            <div className="flex-1">
              <div className="text-xs font-cyber text-green-400">Follow HTTP Redirects</div>
              <div className="text-[10px] text-green-700">Automatically follow 301/302 redirects</div>
            </div>
          </label>

          {/* Cache Results */}
          <label className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg cursor-pointer hover:bg-green-500/10 transition-colors">
            <input
              type="checkbox"
              checked={settings.cacheResults}
              onChange={(e) => handleSettingChange("cacheResults", e.target.checked)}
              className="hidden"
            />
            <div
              className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                settings.cacheResults
                  ? "bg-green-400 border-green-400"
                  : "border-green-600 hover:border-green-400"
              }`}
            >
              {settings.cacheResults && <div className="w-2 h-2 bg-black rounded-full" />}
            </div>
            <div className="flex-1">
              <div className="text-xs font-cyber text-green-400">Cache Results</div>
              <div className="text-[10px] text-green-700">Cache scan results for faster repeated queries</div>
            </div>
          </label>

          {/* Verbose Logging */}
          <label className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg cursor-pointer hover:bg-green-500/10 transition-colors">
            <input
              type="checkbox"
              checked={settings.verboseLogging}
              onChange={(e) => handleSettingChange("verboseLogging", e.target.checked)}
              className="hidden"
            />
            <div
              className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                settings.verboseLogging
                  ? "bg-green-400 border-green-400"
                  : "border-green-600 hover:border-green-400"
              }`}
            >
              {settings.verboseLogging && <div className="w-2 h-2 bg-black rounded-full" />}
            </div>
            <div className="flex-1">
              <div className="text-xs font-cyber text-green-400">Verbose Logging</div>
              <div className="text-[10px] text-green-700">Enable detailed logging for debugging</div>
            </div>
          </label>
        </div>
      </div>

      {/* User Agent Settings */}
      <div className="border-glow rounded-lg p-6 bg-black/50">
        <h3 className="text-sm font-cyber text-green-400 tracking-wider mb-4">
          USER AGENT
        </h3>

        <div className="mb-4">
          <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
            Select User Agent
          </label>
          <select
            value={settings.userAgent}
            onChange={(e) => handleSettingChange("userAgent", e.target.value)}
            className="w-full bg-black/80 border border-green-500/30 rounded-md px-4 py-2
                     text-green-400 font-mono-code text-sm
                     focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                     transition-all"
          >
            {USER_AGENTS.map((ua) => (
              <option key={ua} value={ua}>
                {ua.length > 60 ? ua.substring(0, 60) + "..." : ua}
              </option>
            ))}
          </select>
        </div>

        {settings.userAgent === "Custom User-Agent" && (
          <div>
            <label className="block text-xs font-mono-code text-green-600 mb-2 uppercase tracking-wider">
              Custom User Agent
            </label>
            <textarea
              value={customUserAgent}
              onChange={(e) => {
                setCustomUserAgent(e.target.value);
                handleSettingChange("userAgent", e.target.value);
              }}
              placeholder="Enter custom user agent string"
              className="w-full bg-black/80 border border-green-500/30 rounded-md px-4 py-2
                       text-green-400 font-mono-code text-xs placeholder:text-green-800
                       focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/30
                       transition-all resize-none h-24"
            />
          </div>
        )}

        <div className="mt-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
          <div className="text-[10px] text-green-700">
            <strong>Current User Agent:</strong>
            <div className="mt-1 break-all font-mono-code text-green-400">
              {settings.userAgent.substring(0, 100)}
              {settings.userAgent.length > 100 ? "..." : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Info */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="text-xs font-mono-code text-blue-400">
          <strong>ℹ️ Note:</strong> These settings are stored locally in your browser. They will be applied to all future scans.
        </div>
      </div>
    </div>
  );
}

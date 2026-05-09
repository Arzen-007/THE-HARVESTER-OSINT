import { useEffect, useRef, useState } from "react";
import { Terminal as TerminalIcon, Copy, Check } from "lucide-react";

interface TerminalProps {
  lines: string[];
}

export default function Terminal({ lines }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const copyToClipboard = () => {
    const text = lines.join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLineColor = (line: string) => {
    if (line.startsWith("[!]")) return "text-red-400";
    if (line.startsWith("[+]")) return "text-green-300";
    if (line.startsWith("[*]")) return "text-green-500";
    if (line.startsWith("[~]")) return "text-yellow-400";
    return "text-green-400/80";
  };

  return (
    <div className="border-glow rounded-lg overflow-hidden bg-black/80 backdrop-blur">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-green-500/5 border-b border-green-500/20">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-green-400" />
          <span className="text-xs font-mono-code text-green-400 tracking-wider">
            TERMINAL_OUTPUT
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded hover:bg-green-400/10 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-green-600 hover:text-green-400" />
            )}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="h-[300px] overflow-y-auto p-4 font-mono-code text-xs space-y-1"
      >
        {lines.length === 0 ? (
          <div className="text-green-800 italic">
            <span className="text-green-600">$</span> Ready for OSINT operations...
          </div>
        ) : (
          lines.map((line, i) => (
            <div key={i} className={`${getLineColor(line)} leading-relaxed`}>
              {line.startsWith("$") ? (
                <>
                  <span className="text-green-600">$</span>{" "}
                  <span className="typing-cursor">{line.slice(2)}</span>
                </>
              ) : (
                line
              )}
            </div>
          ))
        )}
        <div className="text-green-600 animate-pulse">_</div>
      </div>
    </div>
  );
}

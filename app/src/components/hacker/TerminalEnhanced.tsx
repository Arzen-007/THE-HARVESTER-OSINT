import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TerminalLine {
  text: string;
  type: "info" | "success" | "error" | "warning" | "debug";
}

interface TerminalEnhancedProps {
  lines: (string | TerminalLine)[];
}

export default function TerminalEnhanced({ lines }: TerminalEnhancedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const getLineStyles = (line: string | TerminalLine) => {
    if (typeof line === "string") {
      // Auto-detect type from content
      if (line.includes("[+]") || line.includes("[*]")) return "text-green-400";
      if (line.includes("[!]") || line.includes("ERROR")) return "text-red-400";
      if (line.includes("[?]") || line.includes("WARNING")) return "text-yellow-400";
      if (line.includes("[✓]") || line.includes("SUCCESS")) return "text-emerald-400";
      return "text-green-300";
    }

    const typeMap = {
      info: "text-green-300",
      success: "text-emerald-400",
      error: "text-red-400",
      warning: "text-yellow-400",
      debug: "text-cyan-400",
    };
    return typeMap[line.type];
  };

  const getLineText = (line: string | TerminalLine) => {
    return typeof line === "string" ? line : line.text;
  };

  return (
    <div className="border-glow rounded-lg p-4 bg-black/50 font-mono-code text-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-400 font-cyber tracking-wider">TERMINAL OUTPUT</span>
      </div>

      <ScrollArea className="h-[300px] w-full rounded-md border border-green-500/20 bg-black/80 p-3">
        <div ref={scrollRef} className="space-y-1">
          {lines.length === 0 ? (
            <div className="text-green-700 opacity-50">
              $ Waiting for scan initialization...
            </div>
          ) : (
            lines.map((line, idx) => (
              <div
                key={idx}
                className={`${getLineStyles(line)} break-words whitespace-pre-wrap leading-relaxed`}
              >
                {getLineText(line)}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="mt-2 text-[10px] text-green-700">
        $ Total lines: {lines.length}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Download, FileJson, FileText, File, X } from "lucide-react";
import { exportJSON, exportCSV, exportHTML } from "@/utils/exportManager";

interface ExportDialogProps {
  results: any;
  domain: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportDialog({ results, domain, isOpen, onClose }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<"json" | "csv" | "html">("json");
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filename = `harvester-${domain.replace(/[^a-z0-9]/gi, "-")}`;
      
      switch (selectedFormat) {
        case "json":
          exportJSON(results, filename);
          break;
        case "csv":
          exportCSV(results, filename);
          break;
        case "html":
          exportHTML(results, domain, filename);
          break;
      }

      // Close dialog after successful export
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="border-glow rounded-lg p-6 bg-black/90 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-cyber text-green-400 tracking-wider">
              EXPORT RESULTS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-green-400/10 rounded transition-colors"
          >
            <X className="w-5 h-5 text-green-400" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-mono-code text-green-600 uppercase tracking-wider mb-3">
            Select Export Format
          </div>

          <label className="flex items-center gap-3 p-3 border border-green-500/20 rounded-lg cursor-pointer hover:bg-green-500/5 transition-colors group">
            <input
              type="radio"
              name="format"
              value="json"
              checked={selectedFormat === "json"}
              onChange={(e) => setSelectedFormat(e.target.value as "json")}
              className="hidden"
            />
            <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-all ${
              selectedFormat === "json" ? "border-green-400 bg-green-400" : "border-green-600 group-hover:border-green-400"
            }`}>
              {selectedFormat === "json" && <div className="w-2 h-2 bg-black rounded-full" />}
            </div>
            <FileJson className="w-5 h-5 text-green-400" />
            <div>
              <div className="font-cyber text-green-400 text-sm">JSON Format</div>
              <div className="text-xs text-green-700">Structured data, best for parsing</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-green-500/20 rounded-lg cursor-pointer hover:bg-green-500/5 transition-colors group">
            <input
              type="radio"
              name="format"
              value="csv"
              checked={selectedFormat === "csv"}
              onChange={(e) => setSelectedFormat(e.target.value as "csv")}
              className="hidden"
            />
            <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-all ${
              selectedFormat === "csv" ? "border-green-400 bg-green-400" : "border-green-600 group-hover:border-green-400"
            }`}>
              {selectedFormat === "csv" && <div className="w-2 h-2 bg-black rounded-full" />}
            </div>
            <FileText className="w-5 h-5 text-green-400" />
            <div>
              <div className="font-cyber text-green-400 text-sm">CSV Format</div>
              <div className="text-xs text-green-700">Spreadsheet compatible</div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border border-green-500/20 rounded-lg cursor-pointer hover:bg-green-500/5 transition-colors group">
            <input
              type="radio"
              name="format"
              value="html"
              checked={selectedFormat === "html"}
              onChange={(e) => setSelectedFormat(e.target.value as "html")}
              className="hidden"
            />
            <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-all ${
              selectedFormat === "html" ? "border-green-400 bg-green-400" : "border-green-600 group-hover:border-green-400"
            }`}>
              {selectedFormat === "html" && <div className="w-2 h-2 bg-black rounded-full" />}
            </div>
            <File className="w-5 h-5 text-green-400" />
            <div>
              <div className="font-cyber text-green-400 text-sm">HTML Report</div>
              <div className="text-xs text-green-700">Professional formatted report</div>
            </div>
          </label>
        </div>

        {/* Format Info */}
        <div className="mb-6 p-3 bg-green-500/5 border border-green-500/20 rounded-lg text-xs font-mono-code text-green-700">
          {selectedFormat === "json" && "JSON format preserves all data structure and is ideal for further processing or integration with other tools."}
          {selectedFormat === "csv" && "CSV format is compatible with Excel, Google Sheets, and other spreadsheet applications."}
          {selectedFormat === "html" && "HTML format creates a professional, printable report with charts and formatted data."}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-green-500/30 rounded-lg text-green-400
                     font-mono-code text-sm hover:bg-green-500/5 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-lg
                     text-green-400 font-mono-code text-sm hover:bg-green-400/20 transition-colors
                     disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                EXPORTING...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                EXPORT
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

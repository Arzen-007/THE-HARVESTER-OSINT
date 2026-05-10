/**
 * Export Manager - Handles multiple export formats for OSINT scan results
 */

interface ResultsData {
  emails?: string[];
  hosts?: string[];
  ips?: string[];
  linkedin_people?: Array<{ name: string; url?: string }>;
  twitter_people?: string[];
  interesting_urls?: string[];
  asns?: string[];
  linkedin_links?: string[];
  trello_urls?: string[];
  [key: string]: any;
}

/**
 * Export results as JSON
 */
export const exportJSON = (results: ResultsData, filename: string = "harvester-results") => {
  const dataStr = JSON.stringify(results, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  downloadFile(blob, `${filename}-${Date.now()}.json`);
};

/**
 * Export results as CSV
 */
export const exportCSV = (results: ResultsData, filename: string = "harvester-results") => {
  let csv = "Type,Value,Source\n";

  Object.entries(results).forEach(([key, values]) => {
    if (Array.isArray(values)) {
      values.forEach((value: any) => {
        const val = typeof value === "string" ? value : JSON.stringify(value);
        const escaped = val.replace(/"/g, '""');
        csv += `"${key}","${escaped}","theHarvester"\n`;
      });
    }
  });

  const blob = new Blob([csv], { type: "text/csv" });
  downloadFile(blob, `${filename}-${Date.now()}.csv`);
};

/**
 * Export results as HTML report
 */
export const exportHTML = (results: ResultsData, domain: string = "unknown", filename: string = "harvester-report") => {
  const timestamp = new Date().toLocaleString();
  const totalItems = Object.values(results).flat().length;

  const emailCount = results.emails?.length || 0;
  const hostCount = results.hosts?.length || 0;
  const ipCount = results.ips?.length || 0;
  const peopleCount = results.linkedin_people?.length || 0;

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OSINT Report - ${domain}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Courier New', monospace;
            background: #000;
            color: #22c55e;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            border-bottom: 2px solid #22c55e;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }
        .meta {
            font-size: 0.9em;
            color: #16a34a;
            margin-top: 10px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        .stat-box {
            border: 1px solid #22c55e;
            padding: 15px;
            background: rgba(34, 197, 94, 0.05);
            border-radius: 5px;
        }
        .stat-box h3 {
            font-size: 0.8em;
            color: #16a34a;
            margin-bottom: 5px;
        }
        .stat-box .value {
            font-size: 2em;
            font-weight: bold;
            color: #22c55e;
        }
        .section {
            margin-bottom: 30px;
            border: 1px solid #22c55e;
            border-radius: 5px;
            overflow: hidden;
        }
        .section-header {
            background: rgba(34, 197, 94, 0.1);
            padding: 15px;
            border-bottom: 1px solid #22c55e;
            font-weight: bold;
        }
        .section-content {
            padding: 15px;
            max-height: 400px;
            overflow-y: auto;
        }
        .item {
            padding: 8px;
            border-bottom: 1px solid rgba(34, 197, 94, 0.2);
            word-break: break-all;
        }
        .item:last-child {
            border-bottom: none;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th {
            background: rgba(34, 197, 94, 0.1);
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #22c55e;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid rgba(34, 197, 94, 0.2);
        }
        footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #22c55e;
            font-size: 0.8em;
            color: #16a34a;
            text-align: center;
        }
        @media print {
            body { background: white; color: #000; }
            .section { border-color: #000; }
            .section-header { background: #f0f0f0; border-color: #000; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🔍 OSINT Intelligence Report</h1>
            <div class="meta">
                <p><strong>Target Domain:</strong> ${escapeHtml(domain)}</p>
                <p><strong>Generated:</strong> ${timestamp}</p>
                <p><strong>Tool:</strong> THE-HARVESTER OSINT GUI v1.0</p>
            </div>
        </header>

        <div class="stats">
            <div class="stat-box">
                <h3>Total Findings</h3>
                <div class="value">${totalItems}</div>
            </div>
            <div class="stat-box">
                <h3>Email Addresses</h3>
                <div class="value">${emailCount}</div>
            </div>
            <div class="stat-box">
                <h3>Hosts/Subdomains</h3>
                <div class="value">${hostCount}</div>
            </div>
            <div class="stat-box">
                <h3>IP Addresses</h3>
                <div class="value">${ipCount}</div>
            </div>
            <div class="stat-box">
                <h3>People Identified</h3>
                <div class="value">${peopleCount}</div>
            </div>
        </div>

        ${generateHTMLSections(results)}

        <footer>
            <p>This report was generated by THE-HARVESTER OSINT GUI for authorized security testing only.</p>
            <p>For more information, visit: <a href="https://github.com/Arzen-007/THE-HARVESTER-OSINT">GitHub Repository</a></p>
        </footer>
    </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  downloadFile(blob, `${filename}-${Date.now()}.html`);
};

/**
 * Generate HTML sections for each result type
 */
function generateHTMLSections(results: ResultsData): string {
  let html = "";

  const sections = [
    { key: "emails", label: "Email Addresses", icon: "📧" },
    { key: "hosts", label: "Hosts & Subdomains", icon: "🌐" },
    { key: "ips", label: "IP Addresses", icon: "🔗" },
    { key: "linkedin_people", label: "LinkedIn People", icon: "👥" },
    { key: "twitter_people", label: "Twitter People", icon: "🐦" },
    { key: "interesting_urls", label: "Interesting URLs", icon: "🔗" },
    { key: "asns", label: "ASNs", icon: "🌍" },
    { key: "linkedin_links", label: "LinkedIn Links", icon: "📄" },
    { key: "trello_urls", label: "Trello URLs", icon: "📋" },
  ];

  sections.forEach(({ key, label, icon }) => {
    const items = results[key as keyof ResultsData];
    if (items && Array.isArray(items) && items.length > 0) {
      html += `
        <div class="section">
            <div class="section-header">${icon} ${label} (${items.length})</div>
            <div class="section-content">
                ${items
                  .map((item: any) => {
                    const val = typeof item === "string" ? item : JSON.stringify(item);
                    return `<div class="item">${escapeHtml(val)}</div>`;
                  })
                  .join("")}
            </div>
        </div>
      `;
    }
  });

  return html;
}

/**
 * Download file helper
 */
function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Generate summary statistics
 */
export const generateSummary = (results: ResultsData) => {
  return {
    totalItems: Object.values(results).flat().length,
    emailCount: results.emails?.length || 0,
    hostCount: results.hosts?.length || 0,
    ipCount: results.ips?.length || 0,
    peopleCount: results.linkedin_people?.length || 0,
    urlCount: results.interesting_urls?.length || 0,
    asnCount: results.asns?.length || 0,
  };
};

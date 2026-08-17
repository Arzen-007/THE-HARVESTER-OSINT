import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataVisualizationProps {
  results: {
    emails?: string[];
    hosts?: string[];
    ips?: string[];
    people?: any[];
    [key: string]: any;
  };
}

export default function DataVisualization({ results }: DataVisualizationProps) {
  // Prepare data for visualizations
  const emailCount = results.emails?.length || 0;
  const hostCount = results.hosts?.length || 0;
  const ipCount = results.ips?.length || 0;
  const peopleCount = results.people?.length || 0;

  const summaryData = [
    { name: "Emails", value: emailCount, color: "#22c55e" },
    { name: "Hosts", value: hostCount, color: "#10b981" },
    { name: "IPs", value: ipCount, color: "#06b6d4" },
    { name: "People", value: peopleCount, color: "#8b5cf6" },
  ].filter((item) => item.value > 0);

  // Extract domain distribution from emails
  const emailDomains: Record<string, number> = {};
  results.emails?.forEach((email: string) => {
    const domain = email.split("@")[1];
    if (domain) {
      emailDomains[domain] = (emailDomains[domain] || 0) + 1;
    }
  });

  const domainData = Object.entries(emailDomains)
    .map(([domain, count]) => ({ name: domain, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Host type distribution
  const hostTypes: Record<string, number> = {};
  results.hosts?.forEach((host: string) => {
    const type = host.includes(".") ? "Subdomain" : "Host";
    hostTypes[type] = (hostTypes[type] || 0) + 1;
  });

  const hostTypeData = Object.entries(hostTypes).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="Emails" value={emailCount} color="green" />
        <StatBox label="Hosts" value={hostCount} color="emerald" />
        <StatBox label="IPs" value={ipCount} color="cyan" />
        <StatBox label="People" value={peopleCount} color="purple" />
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Summary Pie Chart */}
        {summaryData.length > 0 && (
          <div className="border-glow rounded-lg p-6 bg-black/50">
            <h3 className="text-lg font-cyber text-green-400 tracking-wider mb-4">
              DISCOVERY SUMMARY
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summaryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#22c55e"
                  dataKey="value"
                >
                  {summaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #22c55e",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "#22c55e" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Domain Distribution */}
        {domainData.length > 0 && (
          <div className="border-glow rounded-lg p-6 bg-black/50">
            <h3 className="text-lg font-cyber text-green-400 tracking-wider mb-4">
              TOP EMAIL DOMAINS
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={domainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#22c55e20" />
                <XAxis dataKey="name" stroke="#22c55e" fontSize={12} />
                <YAxis stroke="#22c55e" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #22c55e",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "#22c55e" }}
                />
                <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Host Type Distribution */}
        {hostTypeData.length > 0 && (
          <div className="border-glow rounded-lg p-6 bg-black/50">
            <h3 className="text-lg font-cyber text-green-400 tracking-wider mb-4">
              HOST TYPES
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hostTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#22c55e20" />
                <XAxis dataKey="name" stroke="#22c55e" fontSize={12} />
                <YAxis stroke="#22c55e" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #22c55e",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "#22c55e" }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Data Summary */}
        <div className="border-glow rounded-lg p-6 bg-black/50">
          <h3 className="text-lg font-cyber text-green-400 tracking-wider mb-4">
            INTELLIGENCE SUMMARY
          </h3>
          <div className="space-y-3">
            <SummaryItem label="Total Findings" value={emailCount + hostCount + ipCount + peopleCount} />
            <SummaryItem label="Unique Domains" value={domainData.length} />
            <SummaryItem label="Email Addresses" value={emailCount} />
            <SummaryItem label="Hosts Discovered" value={hostCount} />
            <SummaryItem label="IP Addresses" value={ipCount} />
            <SummaryItem label="People Identified" value={peopleCount} />
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      {results.emails && results.emails.length > 0 && (
        <DetailedTable title="EMAIL ADDRESSES" data={results.emails} />
      )}

      {results.hosts && results.hosts.length > 0 && (
        <DetailedTable title="HOSTS" data={results.hosts} />
      )}

      {results.ips && results.ips.length > 0 && (
        <DetailedTable title="IP ADDRESSES" data={results.ips} />
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "green" | "emerald" | "cyan" | "purple";
}) {
  const colorMap = {
    green: "text-green-400 border-green-500/20 bg-green-500/5",
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    cyan: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  };

  return (
    <div className={`border-glow rounded-lg p-4 border ${colorMap[color]}`}>
      <div className="text-3xl font-cyber font-bold mb-1">{value}</div>
      <div className="text-xs font-mono-code uppercase tracking-wider opacity-70">
        {label}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-green-500/10">
      <span className="text-xs font-mono-code text-green-600">{label}</span>
      <span className="text-lg font-cyber text-green-400">{value}</span>
    </div>
  );
}

function DetailedTable({ title, data }: { title: string; data: string[] }) {
  const displayData = data.slice(0, 20); // Show first 20 items
  const remaining = data.length - displayData.length;

  return (
    <div className="border-glow rounded-lg p-6 bg-black/50">
      <h3 className="text-lg font-cyber text-green-400 tracking-wider mb-4">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono-code">
          <thead>
            <tr className="border-b border-green-500/20">
              <th className="text-left py-2 px-3 text-green-600">#</th>
              <th className="text-left py-2 px-3 text-green-600">VALUE</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((item, idx) => (
              <tr key={idx} className="border-b border-green-500/10 hover:bg-green-500/5 transition-colors">
                <td className="py-2 px-3 text-green-700">{idx + 1}</td>
                <td className="py-2 px-3 text-green-400 break-all">{item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {remaining > 0 && (
        <div className="mt-3 text-xs font-mono-code text-green-700">
          ... and {remaining} more items
        </div>
      )}
    </div>
  );
}

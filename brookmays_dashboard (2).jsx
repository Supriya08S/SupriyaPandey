{
  "name": "my-dashboard",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "recharts": "^2.8.0",
    "framer-motion": "^10.16.4",
    "react-simple-maps": "^3.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}

// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// src/App.js
import React from "react";
import Dashboard from "./Dashboard";

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;

// src/index.css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #111827;
  color: #f3f4f6;
}

// src/Dashboard.jsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  PieChart,
  Pie,
  Cell,
  LineChart,
} from "recharts";
import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const qoQData = [
  { quarter: "Q1", impressions: 42000, conversions: 480, leads: 480, revenue: 18000 },
  { quarter: "Q2", impressions: 55500, conversions: 650, leads: 520, revenue: 23500 },
];

const data = [
  { channel: "Email Campaign", impressions: 6000, ctr: 11.5, conversions: 90 },
  { channel: "LinkedIn Post", impressions: 10000, ctr: 7.2, conversions: 70 },
  { channel: "Organic Social", impressions: 7500, ctr: 6.1, conversions: 40 },
  { channel: "Google Ads", impressions: 14000, ctr: 8.5, conversions: 160 },
  { channel: "Website Traffic", impressions: 18000, ctr: 14.2, conversions: 270 },
  { channel: "Lead Generation", impressions: 0, ctr: 0, conversions: 520 },
];

const trendData = [
  { week: "Apr 1", email: 180, linkedin: 140, google: 230, website: 280 },
  { week: "Apr 15", email: 220, linkedin: 160, google: 250, website: 320 },
  { week: "May 1", email: 260, linkedin: 170, google: 270, website: 350 },
  { week: "May 15", email: 300, linkedin: 200, google: 300, website: 400 },
  { week: "Jun 1", email: 320, linkedin: 210, google: 320, website: 420 },
  { week: "Jun 15", email: 350, linkedin: 230, google: 340, website: 450 },
];

const revenueData = [{ quarter: "Q2", marketplace: 15000, rentals: 5000, upsells: 3500 }];

const geoData = {
  california: 120,
  texas: 90,
  newyork: 80,
  florida: 70,
  illinois: 60,
};

const KPIs = [
  { label: "Total Sends", value: "2.6K", filter: "Email Campaign" },
  { label: "Total Opens", value: "2.0K", filter: "Email Campaign" },
  { label: "Total Leads", value: "520", filter: "Lead Generation" },
  { label: "New Accounts", value: "40", filter: null },
  { label: "Upsells to Schools", value: "+25", filter: null },
  { label: "Marketplace Sales", value: "$47K", filter: null },
  { label: "Rentals Revenue", value: "$16K", filter: null },
];

const COLORS = ["#4F46E5", "#F59E0B", "#10B981", "#EF4444", "#6366F1", "#14B8A6"];

function normalizeStateName(name = "") {
  return String(name).toLowerCase().replace(/[^a-z]/g, "");
}

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [mapTooltip, setMapTooltip] = useState("");

  const filteredData = selectedFilter ? data.filter((d) => d.channel === selectedFilter) : data;

  const safeQoQ = qoQData.map((d) => ({
    quarter: d.quarter || "-",
    impressions: Number(d.impressions) || 0,
    conversions: Number(d.conversions) || 0,
    leads: Number(d.leads) || 0,
    revenue: Number(d.revenue) || 0,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 p-6 bg-gray-900 text-gray-100 min-h-screen">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {KPIs.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedFilter(kpi.filter)}
            className="cursor-pointer"
          >
            <Card className={`shadow-md rounded-2xl text-center ${selectedFilter === kpi.filter ? "bg-indigo-800" : "bg-gray-800"}`}>
              <CardContent>
                <h2 className="text-2xl font-bold text-indigo-300">{kpi.value}</h2>
                <p className="text-gray-300 text-sm">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="shadow-xl rounded-2xl bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-white">Quarter over Quarter Comparison (Q1 vs Q2)</h2>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={safeQoQ}>
                <XAxis dataKey="quarter" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <ReTooltip />
                <Legend />
                <Bar dataKey="impressions" barSize={20} fill="#4F46E5" name="Impressions" />
                <Line type="monotone" dataKey="conversions" stroke="#10B981" name="Conversions" />
                <Line type="monotone" dataKey="revenue" stroke="#F59E0B" name="Revenue ($)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="shadow-xl rounded-2xl bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-white">User Distribution - US Heatmap (Q2)</h2>
            <div style={{ width: "100%", height: 360 }}>
              <ComposableMap projection="geoAlbersUsa" style={{ width: "100%", height: "100%" }}>
                <Geographies geography={"https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const stateKey = normalizeStateName(geo.properties.name);
                      const users = geoData[stateKey] || 0;
                      const color = users >= 100 ? "#4F46E5" : users >= 80 ? "#10B981" : users >= 60 ? "#F59E0B" : "#374151";
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => setMapTooltip(`${geo.properties.name}: ${users} users`)}
                          onMouseLeave={() => setMapTooltip("")}
                          style={{
                            default: { fill: color, outline: "none" },
                            hover: { fill: "#EF4444", outline: "none" },
                            pressed: { fill: "#6366F1", outline: "none" },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
            <div className="mt-3 text-sm text-gray-300">{mapTooltip || "Hover a state to see user count"}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="shadow-xl rounded-2xl bg-gray-800">
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Impressions by Channel</h2>
              {selectedFilter && (
                <button className="text-sm text-red-400" onClick={() => setSelectedFilter(null)}>
                  Clear Filter
                </button>
              )}
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData}>
                <XAxis dataKey="channel" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <ReTooltip />
                <Bar dataKey="impressions" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="shadow-xl rounded-2xl bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-white">Click-Through Rate %</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={filteredData} dataKey="ctr" nameKey="channel" outerRadius={100} label>
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="shadow-xl rounded-2xl bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-white">Conversions by Channel</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData}>
                <XAxis dataKey="channel" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <ReTooltip />
                <Bar dataKey="conversions" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="shadow-xl rounded-2xl bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-white">Q2 Weekly Performance Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <XAxis dataKey="week" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <ReTooltip />
                <Legend />
                <Line type="monotone" dataKey="email" stroke="#4F46E5" />
                <Line type="monotone" dataKey="linkedin" stroke="#F59E0B" />
                <Line type="monotone" dataKey="google" stroke="#10B981" />
                <Line type="monotone" dataKey="website" stroke="#EF4444" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="shadow-xl rounded-2xl bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-white">Q2 Revenue Trends (Average)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <XAxis dataKey="quarter" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <ReTooltip />
                <Legend />
                <Line type="monotone" dataKey="marketplace" stroke="#6366F1" name="Marketplace Sales" />
                <Line type="monotone" dataKey="rentals" stroke="#10B981" name="Instrument Rentals" />
                <Line type="monotone" dataKey="upsells" stroke="#F59E0B" name="School Upsells" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="shadow-xl rounded-2xl bg-gray-800">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-white">Q2 Performance Overview & Insights</h2>
            <ul className="space-y-2 text-gray-300">
              <li>📧 Email Delivery Rate: 96.1% — templates performing well.</li>
              <li>📊 LinkedIn Engagement: 7.2% — improved vs Q1.</li>
              <li>🌱 Organic Conversion: 6.1% — content refresh recommended.</li>
              <li>🔍 Google Ads: strong ROI with 160 conversions — consider scaling.</li>
              <li>🌐 Website Leads: 270 — landing pages performing better in Q2.</li>
              <li>🎯 Total Leads: 520 — solid top-of-funnel growth.</li>
              <li>🏫 40 new school accounts — continued expansion.</li>
              <li>🎵 Trials & upsells drove +25 upsells to existing schools in Q2.</li>
              <li>🛒 Marketplace sales: $47K — expanded distribution on Amazon & eBay.</li>
              <li>🎻 Rentals revenue: $16K — recurring revenue trend strengthening.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

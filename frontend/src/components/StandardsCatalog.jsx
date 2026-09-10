import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, ShieldCheck, ExternalLink, Tag } from 'lucide-react';

export default function StandardsCatalog({ onSelectStandard }) {
  const [standards, setStandards] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [loading, setLoading] = useState(false);

  const departments = [
    "All", "Civil Engineering", "Metallurgical Engineering", 
    "Electronics & IT", "Chemical & Plastic", "Mechanical Engineering", "Food & Agriculture"
  ];

  const fetchStandards = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/api/standards?`;
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (selectedDept !== "All") url += `dept=${encodeURIComponent(selectedDept)}`;

      const response = await fetch(url);
      const data = await response.json();
      setStandards(data.standards || []);
    } catch (err) {
      console.error("Fetch standards error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, [search, selectedDept]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Database className="w-3.5 h-3.5 text-indigo-400" /> BIS Official Knowledge Repository
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
          Indian Standards Catalog
        </h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto text-sm">
          Browse verified Indian Standards (IS), mandatory certification schemes (ISI/CRS/FSSAI), and normative test methods.
        </p>
      </div>

      {/* Filter & Search Controls */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by IS code (e.g. IS 1786), keyword (rebar, HDPE, cement), or grade..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-indigo-400 mr-1" />
          {departments.map((dept, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedDept === dept
                  ? 'bg-indigo-500 text-slate-950 border-indigo-400 font-bold shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-indigo-500/40'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Standard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {standards.map((std, idx) => (
          <div
            key={idx}
            className="glass-panel glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
                  {std.is_number}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  {std.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                {std.title}
              </h3>

              <div className="text-xs text-slate-400 font-semibold mb-3">
                🏢 {std.department}
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                {std.scope}
              </p>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-900 text-[11px] space-y-1 text-slate-300 mb-4">
                <div><strong className="text-slate-400">Tech Specs:</strong> {std.technical_specifications}</div>
                <div><strong className="text-slate-400">Certification:</strong> <span className="text-amber-400 font-bold">{std.mandatory_certification}</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">
                {std.latest_version}
              </span>
              <button
                onClick={() => onSelectStandard && onSelectStandard(std.is_number)}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-xs font-semibold flex items-center gap-1 transition-all border border-indigo-500/30"
              >
                Graph <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

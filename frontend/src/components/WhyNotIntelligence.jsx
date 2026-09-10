import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, XCircle, Search, Sparkles } from 'lucide-react';

export default function WhyNotIntelligence() {
  const [query, setQuery] = useState("Seismic steel reinforcement bars for concrete building");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWhyNot = async (qToUse = query) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/why-not?query=${encodeURIComponent(qToUse)}`);
      const resData = await response.json();
      setData(resData);
    } catch (err) {
      console.error("Why NOT error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhyNot(query);
  }, []);

  const sampleQueries = [
    "Seismic steel reinforcement bars for concrete building",
    "Potable HDPE pipes for drinking water PE100",
    "Structural steel I-beams for bridge welded joint",
    "Packaged drinking water purification guidelines"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Clean Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
          "Why NOT?" Intelligence Matrix
        </h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto text-sm">
          Our platform explains why recommended standards fit and explicitly justifies why lower-ranked or superseded standards are not suitable.
        </p>
      </div>

      {/* Query Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Test requirement for 'Why NOT?' intelligence..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => fetchWhyNot(query)}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4" /> Run Matrix Audit
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span className="font-semibold">Try Queries:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(q);
                fetchWhyNot(q);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-800 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {data?.primary && (
        <div className="space-y-6">
          
          {/* Winner Selected Standard */}
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-500 border-slate-800 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">
                Primary Match (SELECTED)
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-0.5">
                {data.primary.is_number} — <span className="text-slate-200 font-medium text-lg">{data.primary.title}</span>
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                <strong>Matching Rationale:</strong> Meets all structural, chemical, and ductility criteria. Status: <span className="text-emerald-400 font-bold">{data.primary.status}</span>.
              </p>
            </div>
          </div>

          {/* Rejected / Disqualified Matrix Table */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Disqualified / Lower-Ranked Standards Rationale Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Standard Code</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-rose-400">"Why NOT?" Disqualification Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.why_not_list.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-all">
                      <td className="p-3 font-mono font-bold text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-400" />
                          {item.is_number}
                        </div>
                      </td>
                      <td className="p-3">{item.title}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] border border-slate-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-amber-300 bg-rose-500/5 rounded">
                        {item.reason_why_not}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

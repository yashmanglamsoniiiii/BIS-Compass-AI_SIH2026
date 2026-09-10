import React, { useState } from 'react';
import { 
  FileText, Upload, Sparkles, CheckCircle2, 
  Search, GitMerge, ShieldCheck, FileCheck2, Copy, RefreshCw
} from 'lucide-react';

const PRESET_QUERIES = [
  {
    label: "Seismic Steel Rebar (Civil)",
    query: "High strength thermo-mechanically treated Fe 500D steel rebar for seismic RCC building reinforcement IS 1786."
  },
  {
    label: "Potable HDPE Water Pipe (Chemical)",
    query: "High density polyethylene HDPE pipe PE100 PN16 rating for municipal drinking water supply lines IS 4984."
  },
  {
    label: "Structural Steel I-Beams (Metallurgy)",
    query: "Hot rolled medium and high tensile structural steel plates and beams Grade E250 welded construction IS 2062."
  },
  {
    label: "Packaged Drinking Water (Food/FSSAI)",
    query: "Packaged drinking water mineral specifications TDS limits micro-biological criteria FSSAI license IS 14543."
  },
  {
    label: "Concrete Mix Proportioning (Civil)",
    query: "High strength concrete mix design guidelines M40 grade with fly ash and superplasticizer IS 10262."
  }
];

export default function ProcurementWorkflow({ onSelectGraphNode }) {
  const [inputText, setInputText] = useState(PRESET_QUERIES[0].query);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleRecommend = async (queryToUse = inputText) => {
    if (!queryToUse.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToUse })
      });
      const data = await response.json();
      setResult(data);
      setActiveStep(5);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/parse-pdf', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.recommendation) {
        setResult(data.recommendation);
        setInputText(data.extraction_details?.extracted_text || file.name);
        setActiveStep(5);
      }
    } catch (err) {
      console.error("PDF Parse error:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyClause = () => {
    if (!result?.suggested_tender_clause) return;
    navigator.clipboard.writeText(result.suggested_tender_clause);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { num: 1, title: "Input Processing", desc: "Extract requirements & PDF specs", icon: FileText, color: "text-amber-400" },
    { num: 2, title: "Semantic Search", desc: "BM25 + Vector Embeddings", icon: Search, color: "text-cyan-400" },
    { num: 3, title: "Relationship Mapping", desc: "Normative & allied graph", icon: GitMerge, color: "text-indigo-400" },
    { num: 4, title: "Verification", desc: "Latest version & amendments", icon: ShieldCheck, color: "text-emerald-400" },
    { num: 5, title: "Final Specification", desc: "Compliant tender output", icon: CheckCircle2, color: "text-yellow-400" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" /> End-to-End Recommendation Engine
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
          AI Procurement Studio
        </h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto text-sm">
          Select a sample preset, enter technical specifications, or upload a tender PDF to retrieve verified Indian Standards.
        </p>
      </div>

      {/* Workflow Progress Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.num;
          const isDone = activeStep > s.num || (activeStep === 5 && result);
          return (
            <div
              key={s.num}
              onClick={() => { if (result) setActiveStep(s.num); }}
              className={`p-3 rounded-2xl glass-panel text-left cursor-pointer transition-all border ${
                isActive 
                  ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20 scale-105' 
                  : isDone 
                  ? 'border-slate-700 bg-slate-900/60 opacity-90' 
                  : 'border-slate-800 bg-slate-950/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {s.num}
                </span>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="font-semibold text-xs text-white truncate">{s.title}</div>
              <div className="text-[10px] text-slate-400 truncate">{s.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Main Studio Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Preset Buttons */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <label className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-3">
              Sample Technical Specifications
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(preset.query);
                    handleRecommend(preset.query);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-xs font-medium border border-slate-800 hover:border-amber-500/40 transition-all text-left truncate max-w-full"
                >
                  ⚡ {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area Input */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Technical Specification Input</span>
              <span className="text-[10px] text-slate-400 font-normal">NLP Entity Parser Active</span>
            </label>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste product description, technical parameters, grade requirement, or material specification..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-all placeholder:text-slate-600"
            />

            {/* PDF File Upload Zone */}
            <div className="relative border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-4 text-center transition-all bg-slate-950/40">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <div className="text-xs text-slate-300 font-semibold">
                {selectedFile ? selectedFile.name : 'Upload Tender Specification PDF (PyMuPDF)'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Extracts text, grades, and IS codes automatically</div>
            </div>

            {/* Run Button */}
            <button
              onClick={() => handleRecommend()}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing Recommendation Engine...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Indian Standard Recommendation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output & Details Column */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6">
              
              {/* Primary Recommendation Banner */}
              <div className="glass-panel-gold p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Primary Recommendation
                </div>

                <div className="text-xs text-amber-400 font-bold tracking-wider uppercase mb-1">
                  Department: {result.primary_recommendation.department}
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                  {result.primary_recommendation.is_number}
                </h3>
                <p className="text-base text-slate-200 font-medium mt-1">
                  {result.primary_recommendation.title}
                </p>

                {/* Score Pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                    Hybrid Score: {result.primary_recommendation.scores.hybrid_score}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                    BM25 Raw: {result.primary_recommendation.scores.bm25_raw}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    Semantic Similarity: {result.primary_recommendation.scores.vector_semantic}
                  </span>
                </div>

                {/* Technical Specs & Version */}
                <div className="mt-4 pt-4 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Technical Specifications:</span>
                    <span className="text-slate-200">{result.primary_recommendation.technical_specifications}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Certification Requirement:</span>
                    <span className="text-amber-400 font-bold">{result.primary_recommendation.mandatory_certification}</span>
                  </div>
                </div>

                {/* Normative References */}
                <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 font-semibold">Normative References:</span>
                  {result.primary_recommendation.normative_references.map((ref, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectGraphNode && onSelectGraphNode(ref)}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all font-mono"
                    >
                      🔗 {ref}
                    </button>
                  ))}
                </div>
              </div>

              {/* Version & Compliance Intelligence Banner */}
              <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Version & Compliance Intelligence Audit</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                      STATUS: ACTIVE & REAFFIRMED
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Latest Version: <strong className="text-white">{result.version_compliance.latest_version}</strong> • 
                    Amendments: <span className="text-amber-300">{result.version_compliance.amendments}</span>
                  </p>
                </div>
              </div>

              {/* Suggested Tender Clause Output */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-amber-400" />
                    Generated Ready-to-Use Tender Specification Clause
                  </span>
                  <button
                    onClick={copyClause}
                    className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all border border-amber-500/30"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied to Clipboard!' : 'Copy Clause'}
                  </button>
                </div>

                <pre className="w-full bg-slate-950 p-4 rounded-xl text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed border border-slate-900 overflow-x-auto">
                  {result.suggested_tender_clause}
                </pre>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Studio Ready</h3>
              <p className="text-slate-400 text-sm max-w-md mt-2">
                Click one of the sample presets or enter custom technical specifications on the left to start the recommendation engine.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

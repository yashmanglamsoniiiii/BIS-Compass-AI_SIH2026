import React from 'react';
import { Layers, Box } from 'lucide-react';

export default function TechArchitectureView() {
  const stackItems = [
    { title: "Frontend", tech: "React.js + Tailwind CSS", desc: "Fast, clean, 3D responsive user interface & recommendations view", color: "border-amber-500 bg-amber-500/10 text-amber-300" },
    { title: "Backend", tech: "Python + FastAPI", desc: "High-performance API handling & AI service orchestration", color: "border-emerald-500 bg-emerald-500/10 text-emerald-300" },
    { title: "Document Processing", tech: "PyMuPDF (fitz)", desc: "Extract text, tables & entities from tender specification PDFs", color: "border-cyan-500 bg-cyan-500/10 text-cyan-300" },
    { title: "NLP / LLM", tech: "LLM + Hugging Face / Ollama", desc: "Understands intent & extracts key technical entities", color: "border-yellow-500 bg-yellow-500/10 text-yellow-300" },
    { title: "Embeddings", tech: "Sentence Transformers", desc: "Converts requirements to high-density dense vectors", color: "border-teal-500 bg-teal-500/10 text-teal-300" },
    { title: "Vector DB", tech: "ChromaDB / FAISS", desc: "Fast & scalable vector search for semantic similarity", color: "border-rose-500 bg-rose-500/10 text-rose-300" },
    { title: "Keyword Search", tech: "BM25 (rank_bm25)", desc: "Exact term and IS Standard number code matching", color: "border-indigo-500 bg-indigo-500/10 text-indigo-300" },
    { title: "Reranking", tech: "Cross-Encoder", desc: "Reorders candidate standards by deep contextual relevance", color: "border-purple-500 bg-purple-500/10 text-purple-300" },
    { title: "Knowledge Graph", tech: "Neo4j / Network Graph", desc: "Maps relationships between standards, tests & amendments", color: "border-violet-500 bg-violet-500/10 text-violet-300" },
    { title: "Database", tech: "PostgreSQL / SQLite", desc: "Structured & reliable storage for standards metadata & versions", color: "border-amber-600 bg-amber-600/10 text-amber-300" },
    { title: "RAG Pipeline", tech: "LangChain / LlamaIndex", desc: "Accurate, grounded generation with strict citations", color: "border-blue-500 bg-blue-500/10 text-blue-300" },
    { title: "Deployment", tech: "Docker & Compose", desc: "Reproducible containerized multi-service packaging", color: "border-pink-500 bg-pink-500/10 text-pink-300" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" /> Enterprise System Architecture
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
          Technology Stack & Pipeline Architecture
        </h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto text-sm">
          Right Technology → Right Function → Better Recommendations
        </p>
      </div>

      {/* Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stackItems.map((item, idx) => (
          <div key={idx} className={`p-5 rounded-2xl glass-panel border ${item.color} flex flex-col justify-between`}>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                {item.title}
              </span>
              <h4 className="text-base font-extrabold text-white font-mono">{item.tech}</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ingestion & RAG Flow Diagram */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
          <Box className="w-5 h-5 text-amber-400" /> Complete System Architecture & Processing Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-4 text-center">
          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40">
            <div className="text-amber-400 font-bold text-xs mb-1">1. User Spec</div>
            <div className="text-[11px] text-slate-300">Text or PDF Tender Document</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40">
            <div className="text-cyan-400 font-bold text-xs mb-1">2. Extraction</div>
            <div className="text-[11px] text-slate-300">PyMuPDF Text & Tables</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40">
            <div className="text-indigo-400 font-bold text-xs mb-1">3. Hybrid Search</div>
            <div className="text-[11px] text-slate-300">BM25 + Sentence Transformers</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40">
            <div className="text-purple-400 font-bold text-xs mb-1">4. Reranker</div>
            <div className="text-[11px] text-slate-300">Cross-Encoder Relevance</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40">
            <div className="text-emerald-400 font-bold text-xs mb-1">5. Graph Audit</div>
            <div className="text-[11px] text-slate-300">Neo4j Relationships & Version</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-yellow-500/40">
            <div className="text-yellow-400 font-bold text-xs mb-1">6. Output RAG</div>
            <div className="text-[11px] text-slate-300">Grounded Spec + Why NOT?</div>
          </div>
        </div>
      </div>
    </div>
  );
}

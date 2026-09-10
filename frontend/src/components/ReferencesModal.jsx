import React from 'react';
import { X, ExternalLink, FolderGit2, BookOpen, ShieldCheck } from 'lucide-react';

export default function ReferencesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const officialSources = [
    { name: "Bureau of Indian Standards — Standards Portal", url: "https://standards.bis.gov.in/" },
    { name: "BIS — Know Your Standard", url: "https://www.bis.gov.in/know-your-standard/" },
    { name: "BIS — Standards Formulation Manual PDF", url: "https://www.bis.gov.in/wp-content/uploads/2022/12/Revised-SFM.pdf" },
    { name: "BIS — Electronics & IT Technical Department (LITD)", url: "https://standards.bis.gov.in/website/technicaldepartments/department-details" },
    { name: "BIS — Compulsory Registration Standards (CRS)", url: "https://www.bis.gov.in/product-certification/products-under-compulsory-certification/scheme-ii-registration-scheme/" },
    { name: "FSSAI — Food & Regulatory Ecosystem Standards", url: "https://www.fssai.gov.in/standards/product-standards" }
  ];

  const githubRepos = [
    {
      title: "1. BIS Standard Discovery",
      url: "https://github.com/sazzsara/BIS-Standard-Discovery",
      desc: "AI system for finding relevant BIS standards from user requirements using RAG, semantic search, and embeddings."
    },
    {
      title: "2. BIS-COMPASS",
      url: "https://github.com/SaudSatopay/BIS-COMPASS",
      desc: "BIS standards recommendation using keyword + semantic search + cross-encoder reranking and Hit@3 / MRR evaluation."
    },
    {
      title: "3. Microsoft RAG-Knowledge",
      url: "https://github.com/microsoft/RAG-Knowledge",
      desc: "Demonstrates RAG for PDF/document knowledge systems covering chunking, embeddings retrieval, and generation."
    },
    {
      title: "4. AWS RAG + Knowledge Graph",
      url: "https://github.com/aws-samples/rag-with-knowledge-graph-using-sparql",
      desc: "Combines Knowledge Graphs + RAG to understand relationships between connected data and improve AI retrieval."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel p-6 rounded-3xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-7 h-7 text-amber-400" />
          <div>
            <h3 className="text-2xl font-extrabold text-white">Official Regulatory Research & References</h3>
            <p className="text-xs text-slate-400">Bureau of Indian Standards (BIS) & Regulatory Research References</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Official Sources */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Primary Government Portals
            </h4>
            <div className="space-y-2">
              {officialSources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-200 flex items-center justify-between transition-all group"
                >
                  <span className="truncate pr-2 font-medium">{src.name}</span>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-amber-400 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* GitHub Repos */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4" /> Referenced GitHub Repositories
            </h4>
            <div className="space-y-3">
              {githubRepos.map((repo, idx) => (
                <a
                  key={idx}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-xs flex flex-col gap-1 transition-all group"
                >
                  <div className="flex items-center justify-between font-bold text-white group-hover:text-cyan-300">
                    <span>{repo.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">{repo.desc}</div>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Network, Database, BookOpen } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenReferences }) {
  const [apiStatus, setApiStatus] = useState('connecting');

  useEffect(() => {
    fetch('http://localhost:8000/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'Healthy') setApiStatus('online');
        else setApiStatus('offline');
      })
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand (Clean & Concise on One Single Line) */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('hero')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-extrabold text-xl text-white tracking-wide">BIS <span className="text-amber-400">COMPASS</span> AI</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">ENTERPRISE</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'studio' 
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Procurement Studio
            </button>

            <button
              onClick={() => setActiveTab('graph')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'graph' 
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Network className="w-4 h-4" />
              Knowledge Graph
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'catalog' 
                  ? 'bg-indigo-500 text-slate-950 shadow-md font-bold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-4 h-4" />
              BIS Catalog
            </button>
          </div>

          {/* Right Status & References */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenReferences}
              className="px-3 py-2 rounded-xl glass-panel text-amber-400 text-xs font-semibold border border-amber-500/30 hover:bg-amber-500/10 flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden lg:inline">Official References</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-slate-300 font-medium">{apiStatus === 'online' ? 'API Online' : 'Connecting'}</span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}

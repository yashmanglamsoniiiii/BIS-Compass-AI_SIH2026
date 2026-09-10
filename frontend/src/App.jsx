import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import ProcurementWorkflow from './components/ProcurementWorkflow';
import KnowledgeGraphView from './components/KnowledgeGraphView';
import StandardsCatalog from './components/StandardsCatalog';
import ReferencesModal from './components/ReferencesModal';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');
  const [selectedGraphNode, setSelectedGraphNode] = useState('IS 1786:2008');
  const [isReferencesOpen, setIsReferencesOpen] = useState(false);

  const handleSelectGraphNode = (nodeId) => {
    setSelectedGraphNode(nodeId);
    setActiveTab('graph');
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReferences={() => setIsReferencesOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'hero' && (
          <>
            <Hero3D onGetStarted={() => setActiveTab('studio')} />
            <ProcurementWorkflow onSelectGraphNode={handleSelectGraphNode} />
          </>
        )}

        {activeTab === 'studio' && (
          <ProcurementWorkflow onSelectGraphNode={handleSelectGraphNode} />
        )}

        {activeTab === 'graph' && (
          <KnowledgeGraphView
            selectedNode={selectedGraphNode}
            onSelectNode={setSelectedGraphNode}
          />
        )}

        {activeTab === 'catalog' && (
          <StandardsCatalog onSelectStandard={handleSelectGraphNode} />
        )}
      </main>

      {/* References Modal */}
      <ReferencesModal
        isOpen={isReferencesOpen}
        onClose={() => setIsReferencesOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white">Bureau of Indian Standards (BIS) AI System</span>
          </div>

          {/* Core Engineering Team */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-slate-500 font-semibold">Core Engineering Team:</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">Aastha Aggrawal</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Yashmanglam Soni</span>
            <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">Saniya Gupta</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Sreyash Banzal</span>
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">Mitali Mehra</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">Akshat Gupta</span>
          </div>

          <div>
            Official Bureau of Indian Standards AI Procurement Platform
          </div>
        </div>
      </footer>

    </div>
  );
}

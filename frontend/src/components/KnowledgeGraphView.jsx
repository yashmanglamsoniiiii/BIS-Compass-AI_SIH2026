import React, { useState, useEffect, useRef } from 'react';
import { Network, ShieldCheck, CheckCircle2, Search, ArrowRight, Database, RefreshCcw } from 'lucide-react';

export default function KnowledgeGraphView({ selectedNode, onSelectNode }) {
  const [graphData, setGraphData] = useState(null);
  const [currentStandard, setCurrentStandard] = useState(selectedNode || 'IS 1786:2008');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const fetchGraph = async (isNum) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/graph/${encodeURIComponent(isNum)}`);
      const data = await response.json();
      setGraphData(data);
    } catch (err) {
      console.error("Graph fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph(currentStandard);
  }, [currentStandard]);

  useEffect(() => {
    if (selectedNode) {
      setCurrentStandard(selectedNode);
    }
  }, [selectedNode]);

  // Render Interactive Node Graph on Canvas
  useEffect(() => {
    if (!graphData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || 500);

    ctx.clearRect(0, 0, width, height);

    const nodes = graphData.nodes || [];
    const edges = graphData.edges || [];
    const cx = width / 2;
    const cy = height / 2;

    // Calculate node coordinates around central node
    const nodeCoords = {};
    nodeCoords[graphData.center_node] = { x: cx, y: cy };

    const outerNodes = nodes.filter(n => n.id !== graphData.center_node);
    const radius = Math.min(width, height) * 0.32;

    outerNodes.forEach((node, idx) => {
      const angle = (idx / outerNodes.length) * Math.PI * 2;
      nodeCoords[node.id] = {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
      };
    });

    // Draw Edges
    edges.forEach(edge => {
      const s = nodeCoords[edge.source];
      const t = nodeCoords[edge.target];
      if (s && t) {
        ctx.strokeStyle = edge.relation === 'NORMATIVE_REFERENCE' ? '#f59e0b' : edge.relation === 'VERIFIED_BY_TEST' ? '#06b6d4' : '#6366f1';
        ctx.lineWidth = 2;
        ctx.setLineDash(edge.relation === 'NORMATIVE_REFERENCE' ? [] : [5, 5]);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw relationship label along edge
        const mx = (s.x + t.x) / 2;
        const my = (s.y + t.y) / 2;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(edge.relation, mx, my - 4);
      }
    });

    // Draw Nodes
    nodes.forEach(node => {
      const pos = nodeCoords[node.id] || { x: cx, y: cy };
      const isCenter = node.id === graphData.center_node;

      // Outer glow
      ctx.shadowBlur = isCenter ? 25 : 12;
      ctx.shadowColor = isCenter ? '#f59e0b' : node.type === 'Standard' ? '#06b6d4' : '#10b981';

      ctx.fillStyle = isCenter ? '#f59e0b' : node.type === 'Standard' ? '#0f172a' : node.type === 'Certification' ? '#064e3b' : '#1e1b4b';
      ctx.strokeStyle = isCenter ? '#fbbf24' : node.type === 'Standard' ? '#38bdf8' : '#34d399';
      ctx.lineWidth = isCenter ? 3 : 2;

      const nodeRadius = isCenter ? 35 : 24;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Node Label
      ctx.fillStyle = isCenter ? '#090d16' : '#ffffff';
      ctx.font = isCenter ? 'bold 11px sans-serif' : '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label.length > 14 ? node.label.substring(0, 12) + '..' : node.label, pos.x, pos.y + 3);
    });

  }, [graphData]);

  const quickStandards = ['IS 1786:2008', 'IS 456:2000', 'IS 2062:2011', 'IS 4984:2016', 'IS 10262:2019', 'IS 14543:2016'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Network className="w-3.5 h-3.5" /> Neo4j / Knowledge Graph Integration
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
          AI Standards Knowledge Graph
        </h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto text-sm">
          Discover non-obvious relationships, normative references, mandatory certifications, and test methods across Indian Standards.
        </p>
      </div>

      {/* Selector & Quick Chips */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 uppercase">Select Target Standard:</span>
          {quickStandards.map((std, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStandard(std)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                currentStandard === std
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              {std}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentStandard}
            onChange={(e) => setCurrentStandard(e.target.value)}
            placeholder="e.g. IS 1786"
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          />
          <button
            onClick={() => fetchGraph(currentStandard)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-cyan-400 transition-all"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Reload Graph
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Canvas Visualizer Column */}
        <div className="lg:col-span-8 glass-panel p-4 rounded-2xl border border-slate-800 relative min-h-[500px] flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 animate-spin" /> Querying Neo4j Graph Engine...
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="w-full h-[500px]" />

          {/* Graph Legend */}
          <div className="absolute bottom-4 left-4 glass-panel p-3 rounded-xl border border-slate-800 text-[11px] flex gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Center Standard
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-500" /> Normative Standard
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600" /> Certification
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600" /> Test Method
            </div>
          </div>
        </div>

        {/* Connected Node Details List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" /> Connected Graph Entities ({graphData?.nodes?.length || 0})
            </h3>
            
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {graphData?.nodes?.map((node, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (node.type === 'Standard') setCurrentStandard(node.id);
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    node.id === graphData.center_node
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-bold">
                    <span>{node.id}</span>
                    <span className="px-2 py-0.5 text-[9px] rounded bg-slate-900 border border-slate-800 text-cyan-400">
                      {node.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{node.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

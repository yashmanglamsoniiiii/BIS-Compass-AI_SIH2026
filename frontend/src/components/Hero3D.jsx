import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function Hero3D({ onGetStarted }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Particles & Orbiting Nodes System
    const particles = [];
    const particleCount = 70;

    const nodeLabels = ["IS 1786", "IS 456", "IS 2062", "IS 4984", "IS 10262", "IS 13920", "IS 14543", "IS 12345:2024", "FSSAI 1.01"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: Math.random() * width,
        radius: Math.random() * 2.5 + 1,
        color: i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#06b6d4' : '#6366f1',
        label: i < nodeLabels.length ? nodeLabels[i] : null,
        angle: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.008,
        distance: 120 + Math.random() * 220
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw glowing central orb
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.15)');
      grad.addColorStop(1, 'rgba(7, 9, 19, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 200, 0, Math.PI * 2);
      ctx.fill();

      // Render connected 3D floating nodes
      particles.forEach((p, idx) => {
        p.angle += p.speed;
        const x3d = Math.cos(p.angle) * p.distance;
        const z3d = Math.sin(p.angle) * p.distance;
        const y3d = Math.sin(time + idx) * 40;

        // Perspective projection with positive scale guard
        const rawScale = 300 / (300 + z3d);
        const scale = Math.max(0.2, rawScale);
        const px = cx + x3d * scale;
        const py = cy + y3d * scale;

        // Draw connections between close nodes
        particles.forEach((p2, idx2) => {
          if (idx < idx2) {
            const x3d2 = Math.cos(p2.angle) * p2.distance;
            const z3d2 = Math.sin(p2.angle) * p2.distance;
            const y3d2 = Math.sin(time + idx2) * 40;
            const scale2 = Math.max(0.2, 300 / (300 + z3d2));
            const px2 = cx + x3d2 * scale2;
            const py2 = cy + y3d2 * scale2;

            const dist = Math.hypot(px - px2, py - py2);
            if (dist < 110) {
              ctx.strokeStyle = `rgba(245, 158, 11, ${0.35 * (1 - dist / 110)})`;
              ctx.lineWidth = Math.max(0.5, 1 * scale);
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(px2, py2);
              ctx.stroke();
            }
          }
        });

        // Draw node point with strictly positive radius guard
        const safeRadius = Math.max(0.5, p.radius * scale * 1.5);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(px, py, safeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw standard label badge for featured nodes
        if (p.label && scale > 0.8) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          const txtWidth = ctx.measureText(p.label).width + 12;
          ctx.beginPath();
          ctx.roundRect(px - txtWidth / 2, py - 24, txtWidth, 18, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f8fafc';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(p.label, px, py - 12);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-12 pb-16">
      {/* Background 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Glow Orbs */}
      <div className="glow-orb-gold top-10 left-1/4" />
      <div className="glow-orb-cyan bottom-10 right-1/4" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Enterprise Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-8 shadow-lg shadow-amber-500/10 animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Bureau of Indian Standards • AI-Powered Compliance Engine
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          AI-Powered Indian Standards <br />
          <span className="text-gradient-gold">(BIS) Recommendation</span> & Compliance Platform
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          Empowering government procurement officers and engineers with semantic search, 
          AI + Knowledge Graph mapping, and up-to-date version & amendment verification.
        </p>

        {/* Call to Action Button */}
        <div className="flex justify-center mb-16">
          <button
            onClick={onGetStarted}
            className="px-10 py-4.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-1"
          >
            Launch AI Procurement Studio
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Key Metrics / Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="glass-panel p-4 rounded-2xl text-center border-t-2 border-t-amber-500">
            <div className="text-2xl md:text-3xl font-extrabold text-amber-400">40,000+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">BIS Standards Indexed</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center border-t-2 border-t-cyan-500">
            <div className="text-2xl md:text-3xl font-extrabold text-cyan-400">100%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Amendment Verification</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center border-t-2 border-t-indigo-500">
            <div className="text-2xl md:text-3xl font-extrabold text-indigo-400">Hybrid Search</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">BM25 + Vector Rerank</div>
          </div>
        </div>
      </div>
    </div>
  );
}

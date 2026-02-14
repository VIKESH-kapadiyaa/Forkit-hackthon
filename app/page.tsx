'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, ShieldCheck, ShieldX, Clock, Zap, Eye, Leaf, Flame, RefreshCw, AlertTriangle, ChevronRight, Crosshair } from 'lucide-react';
import Image from 'next/image';

type ScanPhase = 'idle' | 'collecting' | 'analyzing' | 'result';
type PhotoSlot = { name: string; angle: string; data: string; status: 'empty' | 'uploading' | 'verified' };
type ScanResult = {
  isFood: boolean; freshness: 'fresh' | 'caution' | 'spoiled'; score: number;
  ingredients: string[]; calories: number; refundApproved: boolean; refundAmount: number; notes: string;
};

const ANGLES: { name: string; angle: string }[] = [
  { name: 'Top', angle: '0°' }, { name: 'Side', angle: '45°' },
  { name: 'Close Up', angle: 'Macro' }, { name: 'Inside', angle: 'Cross' }, { name: 'Seal', angle: 'Label' },
];

export default function FoodScanPage() {
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [photos, setPhotos] = useState<PhotoSlot[]>(ANGLES.map(a => ({ ...a, data: '', status: 'empty' })));
  const [timer, setTimer] = useState(300);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (phase === 'collecting' || phase === 'analyzing') {
      timerRef.current = setInterval(() => setTimer(p => (p <= 1 ? (clearInterval(timerRef.current!), 0) : p - 1)), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const start = () => { setPhase('collecting'); setTimer(300); setResult(null); setPhotos(ANGLES.map(a => ({ ...a, data: '', status: 'empty' }))); };

  const upload = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotos(prev => { const n = [...prev]; n[i] = { ...n[i], data: ev.target?.result as string, status: 'uploading' }; return n; });
      setTimeout(() => setPhotos(prev => { const n = [...prev]; n[i] = { ...n[i], status: 'verified' }; return n; }), 1400);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    setPhase('analyzing'); setProgress(0);

    // Fake progress to keep UI alive during fetch
    const iv = setInterval(() => setProgress(p => {
      if (p >= 90) return 90;
      return p + Math.random() * 8;
    }), 350);

    try {
      // Collect evidence
      const evidencePayload = {
        orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date().toISOString(),
        photoUrls: photos.filter(p => p.status === 'verified').map(p => p.data)
      };

      const response = await fetch('/api/audit-dish', {
        method: 'POST',
        body: JSON.stringify(evidencePayload),
        headers: { 'Content-Type': 'application/json' }
      });

      const json = await response.json();

      clearInterval(iv);
      setProgress(100);

      if (json.status === 'success' || json.isMock) {
        const d = json.data;
        setResult({
          isFood: d.isFood,
          freshness: d.freshness,
          score: d.score,
          ingredients: d.ingredients,
          calories: d.calories,
          refundApproved: d.freshness !== 'fresh',
          refundAmount: d.refundAmount || (d.freshness !== 'fresh' ? 120 : 0),
          notes: json.message
        });
      } else {
        // Handle explicit failure from backend logic
        setResult({
          isFood: true,
          freshness: 'spoiled',
          score: 35,
          ingredients: ['Unidentified'],
          calories: 0,
          refundApproved: true,
          refundAmount: json.refundAmount || 50,
          notes: json.reason || 'Verification failed. Manual review triggered.'
        });
      }

    } catch (e) {
      console.error("Analysis failed", e);
      clearInterval(iv);
      // Fallback in case of network error
      setResult({
        isFood: true,
        freshness: 'caution',
        score: 50,
        ingredients: ['Network Error'],
        calories: 0,
        refundApproved: false,
        refundAmount: 0,
        notes: 'Connection to verification server lost. Please retry.'
      });
    }

    setPhase('result');
  };

  const reset = () => { setPhase('idle'); setResult(null); };
  const ready = photos.filter(p => p.status === 'verified').length;

  return (
    <div className="min-h-screen bg-[#e2e5b3] pl-0 md:pl-[72px]">

      {/* ═══ HEADER ═══ */}
      <header className="px-6 md:px-10 pt-8 md:pt-10 max-w-[1300px] mx-auto flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-blink" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/30 font-[family-name:var(--font-mono)]">
              foodoscope v2.1 — live
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[0.88] tracking-tight">
            Lab<br />Protocol
          </h1>
          <p className="text-black/30 text-sm mt-3 max-w-xs leading-relaxed">
            Collect. Analyze. Verify. Your 5-minute evidence window starts on initiation.
          </p>
        </div>

        {(phase === 'collecting' || phase === 'analyzing') && (
          <div className="text-right flex flex-col items-end">
            <div className={`font-[family-name:var(--font-mono)] text-3xl md:text-4xl font-bold tabular-nums ${timer < 60 ? 'text-red-500 animate-count-tick' : 'text-black/70'}`}>
              {fmt(timer)}
            </div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-black/25 font-bold mt-1">claim window</span>
            {/* Mini progress bar for timer */}
            <div className="w-24 h-1 bg-black/5 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-black/20 rounded-full transition-all duration-1000" style={{ width: `${(timer / 300) * 100}%` }} />
            </div>
          </div>
        )}
      </header>

      <main className="px-6 md:px-10 max-w-[1300px] mx-auto pb-36 mt-8">

        {/* ═══ IDLE ═══ */}
        {phase === 'idle' && (
          <div className="mt-8 md:mt-16 animate-reveal">
            {/* Hero card — asymmetric layout */}
            <div className="relative bg-black text-white rounded-[2rem] md:rounded-[3rem] overflow-hidden">
              {/* Dot grid texture */}
              <div className="absolute inset-0 dot-grid opacity-30" />

              <div className="relative z-10 p-8 md:p-14 flex flex-col md:flex-row items-start gap-10">
                {/* Left: Big message */}
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-white/[0.06] px-3 py-1.5 rounded-full mb-6">
                    <AlertTriangle size={12} className="text-[#ff6b35]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Issue with your order?</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold leading-[1.05] mb-4 max-w-lg">
                    Scan your meal.<br />
                    Get instant<br />
                    <span className="text-[#10b981]">justice.</span>
                  </h2>
                  <p className="text-white/30 text-sm leading-relaxed max-w-sm mb-8">
                    Our AI engine analyzes food quality in real-time. Spoilage detected? Get an automatic refund credited to your VeriWallet.
                  </p>
                  <button
                    onClick={start}
                    className="group bg-[#10b981] text-white px-8 py-4 rounded-xl font-bold text-base flex items-center gap-3 hover:brightness-110 active:scale-[0.97] transition-all shadow-lg shadow-[#10b981]/20"
                  >
                    <Zap size={20} className="group-hover:rotate-12 transition-transform" />
                    Begin Scan
                    <ChevronRight size={18} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Right: Decorative cross-hatch card */}
                <div className="hidden md:block w-64 shrink-0">
                  <div className="crosshatch bg-white/[0.03] rounded-2xl p-6 border border-white/[0.06]">
                    <div className="space-y-4">
                      {['Spoilage Detection', 'Ingredient Scan', 'Calorie Estimation', 'Refund Processing'].map((item, i) => (
                        <div key={item} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-white/30">
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <span className="text-xs text-white/30 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 text-[9px] text-white/15 font-[family-name:var(--font-mono)] text-center uppercase tracking-[0.3em]">
                    pipeline stages
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Ticker strip ─── */}
            <div className="mt-6 overflow-hidden rounded-xl bg-black/[0.03] py-2">
              <div className="flex animate-ticker whitespace-nowrap">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="flex gap-8 pr-8">
                    {['12,400+ scans processed', '₹4.8L refunded this month', '94% detection accuracy', 'Avg response: 3.2 seconds', 'Active in 14 cities'].map(t => (
                      <span key={t} className="text-[11px] font-bold text-black/25 uppercase tracking-[0.15em] flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-black/15" />
                        {t}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ COLLECTING ═══ */}
        {phase === 'collecting' && (
          <div className="animate-reveal">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <Crosshair size={16} className="text-[#ff6b35]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">Evidence Grid — {ready}/5 captured</span>
              <div className="flex-1 h-px bg-black/5" />
            </div>

            {/* Photo upload — mixed sizing for visual interest */}
            <div className="grid grid-cols-6 gap-3 md:gap-4 mb-6">
              {photos.map((photo, i) => {
                const isLarge = i === 0 || i === 2;
                return (
                  <div
                    key={i}
                    className={`relative rounded-[1.5rem] overflow-hidden transition-all duration-500 ${isLarge ? 'col-span-3 md:col-span-2 aspect-square' : 'col-span-2 aspect-[4/5]'
                      } ${photo.status === 'verified' ? 'ring-2 ring-[#10b981] ring-offset-2 ring-offset-[#e2e5b3]'
                        : photo.status === 'uploading' ? 'ring-2 ring-[#ff6b35] ring-offset-2 ring-offset-[#e2e5b3]'
                          : 'ring-1 ring-black/5'
                      }`}
                  >
                    {photo.data ? (
                      <>
                        <Image src={photo.data} fill className="object-cover" alt={photo.name} sizes="(max-width:768px) 50vw, 250px" />
                        <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${photo.status === 'verified' ? 'bg-[#10b981] text-white' : 'bg-[#ff6b35] text-white'
                          }`}>
                          {photo.status === 'verified' ? <><ShieldCheck size={10} /> Locked</> : <><Eye size={10} /> Checking...</>}
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center stripe-accent cursor-pointer hover:bg-white/70 transition-colors group">
                        <Camera size={22} className="text-black/15 mb-2 group-hover:text-black/30 group-hover:scale-110 transition-all" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/25">{photo.name}</span>
                        <span className="text-[8px] text-black/15 font-[family-name:var(--font-mono)] mt-0.5">{photo.angle}</span>
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => upload(i, e)} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={reset} className="px-5 py-4 rounded-xl bg-black/[0.04] text-black/40 font-bold text-sm hover:bg-black/[0.08] transition-colors">
                Discard
              </button>
              <button
                onClick={analyze}
                disabled={ready < 5}
                className="flex-1 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-sm disabled:opacity-20 disabled:cursor-not-allowed hover:bg-black/85 active:scale-[0.99] transition-all"
              >
                Run Analysis <span className="bg-white/10 px-2 py-0.5 rounded-md text-xs ml-1">{ready}/5</span>
              </button>
            </div>
          </div>
        )}

        {/* ═══ ANALYZING ═══ */}
        {phase === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[55vh] text-center animate-reveal">
            {/* Custom progress ring */}
            <div className="relative w-44 h-44 mb-10">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="4" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${Math.min(100, progress) * 3.267} 999`}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-6 bg-white/60 backdrop-blur-xl rounded-full flex flex-col items-center justify-center">
                <span className="text-4xl font-bold font-[family-name:var(--font-mono)] tabular-nums">{Math.min(100, Math.round(progress))}</span>
                <span className="text-[9px] text-black/30 uppercase tracking-[0.25em] font-bold">percent</span>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2">Processing Evidence</h2>
            <p className="text-sm text-black/30 max-w-xs font-[family-name:var(--font-mono)] leading-relaxed">
              Comparing against 14,000+ food profiles in our database...
            </p>

            {/* Pipeline steps */}
            <div className="mt-8 flex flex-col gap-2 text-left w-full max-w-xs">
              {['Detecting food object', 'Spoilage vector analysis', 'Ingredient identification', 'Calorie estimation'].map((step, i) => {
                const done = progress > (i + 1) * 25;
                const active = !done && progress > i * 25;
                return (
                  <div key={step} className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-300 ${done ? 'bg-[#10b981]/5' : active ? 'bg-[#ff6b35]/5' : ''}`}>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${done ? 'bg-[#10b981] text-white' : active ? 'bg-[#ff6b35] text-white animate-blink' : 'bg-black/5 text-black/20'
                      }`}>
                      {done ? '✓' : String(i + 1)}
                    </div>
                    <span className={`text-xs font-medium ${done ? 'text-[#10b981]' : active ? 'text-[#ff6b35]' : 'text-black/20'}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ RESULT ═══ */}
        {phase === 'result' && result && (
          <div className="space-y-5 animate-reveal">

            {/* ─ Verdict Banner ─ */}
            <div className={`relative rounded-[2rem] p-8 overflow-hidden grain ${result.refundApproved ? 'bg-red-500' : 'bg-[#10b981]'
              } text-white`}>
              <div className="absolute inset-0 dot-grid opacity-10" />
              <div className="relative z-10 flex items-start gap-5">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  {result.refundApproved ? <ShieldX size={28} /> : <ShieldCheck size={28} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-1">
                    {result.refundApproved ? 'Spoilage Confirmed' : 'Quality Verified'}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed max-w-xl">{result.notes}</p>
                </div>
                <span className="text-6xl md:text-7xl font-bold opacity-15 shrink-0 leading-none font-[family-name:var(--font-mono)]">
                  {result.score}
                </span>
              </div>
            </div>

            {/* ─ Metrics row — uneven widths for character ─ */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-5 border border-white/20 min-w-[130px] flex-shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 block mb-1">Score</span>
                <span className={`text-3xl font-bold font-[family-name:var(--font-mono)] ${result.score > 70 ? 'text-[#10b981]' : result.score > 40 ? 'text-[#ff6b35]' : 'text-red-500'}`}>
                  {result.score}
                </span>
                <span className="text-sm text-black/15 font-bold">/100</span>
              </div>
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-5 border border-white/20 min-w-[130px] flex-shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 block mb-1">Calories</span>
                <div className="flex items-baseline gap-1">
                  <Flame size={16} className="text-[#ff6b35]" />
                  <span className="text-3xl font-bold font-[family-name:var(--font-mono)]">{result.calories}</span>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-5 border border-white/20 min-w-[120px] flex-shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 block mb-1">Status</span>
                <span className={`text-sm font-bold uppercase tracking-wider px-2 py-1 rounded-md ${result.freshness === 'fresh' ? 'bg-[#10b981]/10 text-[#10b981]' : result.freshness === 'caution' ? 'bg-[#ff6b35]/10 text-[#ff6b35]' : 'bg-red-500/10 text-red-500'
                  }`}>{result.freshness}</span>
              </div>
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-5 border border-white/20 min-w-[120px] flex-shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 block mb-1">Items</span>
                <span className="text-3xl font-bold font-[family-name:var(--font-mono)]">{result.ingredients.length}</span>
              </div>
            </div>

            {/* ─ Refund block ─ */}
            {result.refundApproved && (
              <div className="bg-black text-white rounded-[2rem] p-7 flex items-center justify-between relative overflow-hidden grain">
                <div className="absolute inset-0 crosshatch opacity-50" />
                <div className="relative z-10">
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/25 block mb-1">auto-refund approved</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">₹{result.refundAmount}</span>
                    <span className="text-white/20 text-sm font-bold ml-1">→ VeriWallet</span>
                  </div>
                </div>
                <button className="relative z-10 bg-[#10b981] text-white px-6 py-3 rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all">
                  Claim
                </button>
              </div>
            )}

            {/* ─ Ingredients ─ */}
            <div className="bg-white/40 rounded-2xl p-6 border border-white/20">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 block mb-4">Detected Ingredients</span>
              <div className="flex flex-wrap gap-2">
                {result.ingredients.map((ing, i) => (
                  <span key={ing} className="flex items-center gap-1.5 bg-[#e2e5b3] border border-black/[0.04] px-3 py-1.5 rounded-lg text-xs font-bold animate-reveal" style={{ animationDelay: `${i * 0.08}s` }}>
                    <Leaf size={12} className="text-[#10b981]" /> {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* New Scan */}
            <button onClick={reset} className="w-full py-4 rounded-xl bg-black/[0.04] text-black/30 font-bold text-sm flex items-center justify-center gap-2 hover:bg-black/[0.07] transition-colors">
              <RefreshCw size={14} /> New Scan
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

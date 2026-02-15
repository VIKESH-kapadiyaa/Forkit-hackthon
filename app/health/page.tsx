'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, ChevronDown, ChevronUp, Thermometer, ShieldAlert, FileText, Flame, Droplets, Leaf, Zap, ArrowLeft, Utensils, ScanLine } from 'lucide-react';
import Link from 'next/link';

type HistoryItem = {
    id: string; date: string; time: string; name: string; score: number; status: string; calories: number;
    ingredients?: string[];
    protein?: number;
    fat?: number;
    category?: string;
    freshness?: string;
    details: { temp: string; allergens: string[]; notes: string; };
};

const scoreColor = (s: number) => s > 70 ? 'text-[#10b981]' : s > 40 ? 'text-[#ff6b35]' : 'text-red-500';
const statusBg = (s: string) => s === 'Safe' ? 'bg-[#10b981]/10 text-[#10b981]' : s === 'Caution' ? 'bg-[#ff6b35]/10 text-[#ff6b35]' : 'bg-red-500/10 text-red-500';
const freshnessColor = (f?: string) => f === 'fresh' ? 'text-[#10b981]' : f === 'caution' ? 'text-[#ff6b35]' : 'text-red-500';

export default function HealthPage() {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [latestScan, setLatestScan] = useState<HistoryItem | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let hist: HistoryItem[] = [];
        let latest: HistoryItem | null = null;
        let exp: string | null = null;

        try {
            const saved = localStorage.getItem('foodoscope_history');
            if (saved) {
                const parsed: HistoryItem[] = JSON.parse(saved);
                // Filter out stale dummy entries from earlier dev runs
                hist = parsed.filter(h => !h.name.includes('Test Food') && !h.name.includes('Key Missing'));
                // Persist the cleaned list back
                if (hist.length !== parsed.length) {
                    localStorage.setItem('foodoscope_history', JSON.stringify(hist));
                }
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }

        try {
            const latestStr = localStorage.getItem('foodoscope_latest_scan');
            if (latestStr) {
                latest = JSON.parse(latestStr);
                exp = latest?.id ?? null;
                localStorage.removeItem('foodoscope_latest_scan');
            }
        } catch (e) {
            console.error("Failed to load latest scan", e);
        }

        // eslint-disable-next-line
        setHistory(hist);
        setLatestScan(latest);
        setExpanded(exp);
        setLoaded(true);
    }, []);

    // Compute real stats from history
    const avgCalories = history.length > 0 ? Math.round(history.reduce((s, h) => s + h.calories, 0) / history.length) : 0;
    const avgScore = history.length > 0 ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length) : 0;
    const safeCount = history.filter(h => h.status === 'Safe').length;
    const safePercent = history.length > 0 ? Math.round((safeCount / history.length) * 100) : 0;

    if (!loaded) return null; // Avoid hydration mismatch

    return (
        <div className="min-h-screen bg-[#e2e5b3] pl-0 md:pl-[72px]">
            <header className="px-6 md:px-10 pt-8 md:pt-10 max-w-[1300px] mx-auto">
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/" className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors">
                        <ArrowLeft size={16} className="text-black/40" />
                    </Link>
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-blink" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/30 font-[family-name:var(--font-mono)]">
                        community_node // health
                    </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-[0.88] tracking-tight">
                    Health<br />Report
                </h1>
            </header>

            <main className="px-6 md:px-10 max-w-[1300px] mx-auto pb-36 mt-8 space-y-6">

                {/* ─── Latest Scan Spotlight ─── */}
                {latestScan && (
                    <div className="animate-reveal">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap size={16} className="text-[#10b981]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">Latest Scan Result</span>
                            <div className="flex-1 h-px bg-black/5" />
                        </div>

                        {/* Hero Card */}
                        <div className={`relative rounded-[2rem] p-7 md:p-9 overflow-hidden grain text-white ${latestScan.status === 'Safe' ? 'bg-[#10b981]' : latestScan.status === 'Caution' ? 'bg-[#ff6b35]' : 'bg-red-500'}`}>
                            <div className="absolute inset-0 dot-grid opacity-10" />
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">{latestScan.name}</h2>
                                        <p className="text-white/50 text-sm mt-1 font-[family-name:var(--font-mono)]">
                                            {latestScan.date} · {latestScan.time} · {latestScan.category || 'General Food'}
                                        </p>
                                    </div>
                                    <span className="text-7xl font-bold opacity-20 font-[family-name:var(--font-mono)] leading-none">{latestScan.score}</span>
                                </div>

                                {/* Nutrition Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <Flame size={16} className="opacity-60 mb-2" />
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 block">Calories</span>
                                        <span className="text-2xl font-bold font-[family-name:var(--font-mono)]">{latestScan.calories}</span>
                                        <span className="text-xs text-white/30 ml-1">kcal</span>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <Utensils size={16} className="opacity-60 mb-2" />
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 block">Protein</span>
                                        <span className="text-2xl font-bold font-[family-name:var(--font-mono)]">{latestScan.protein || 0}</span>
                                        <span className="text-xs text-white/30 ml-1">g</span>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <Droplets size={16} className="opacity-60 mb-2" />
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 block">Fat</span>
                                        <span className="text-2xl font-bold font-[family-name:var(--font-mono)]">{latestScan.fat || 0}</span>
                                        <span className="text-xs text-white/30 ml-1">g</span>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <Activity size={16} className="opacity-60 mb-2" />
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 block">Freshness</span>
                                        <span className="text-lg font-bold capitalize">{latestScan.freshness || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Ingredients */}
                                {latestScan.ingredients && latestScan.ingredients.length > 0 && (
                                    <div className="mt-5 pt-5 border-t border-white/10">
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 block mb-3">Detected Ingredients</span>
                                        <div className="flex flex-wrap gap-2">
                                            {latestScan.ingredients.map((ing, k) => (
                                                <span key={k} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[11px] font-bold text-white/80">
                                                    <Leaf size={10} className="text-white/50" /> {ing}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Lab Notes */}
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 block mb-2">Analysis Notes</span>
                                    <p className="text-sm text-white/60 leading-relaxed">{latestScan.details.notes}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Insight Banner ─── */}
                {history.length > 0 ? (
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-[2] bg-[#10b981] text-white rounded-[2rem] p-7 relative overflow-hidden grain">
                            <div className="absolute inset-0 dot-grid opacity-10" />
                            <div className="relative z-10">
                                <TrendingUp size={28} className="mb-4 opacity-60" />
                                <h3 className="text-2xl font-bold leading-tight mb-2">
                                    {safePercent}% safe scans<br />overall
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                                    Your average safety score is <strong className="text-white">{avgScore}/100</strong> across {history.length} {history.length === 1 ? 'scan' : 'scans'}.
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-4">
                            <div className="bg-white/50 rounded-2xl p-5 border border-white/20 flex items-center gap-4">
                                <Flame size={20} className="text-[#ff6b35]" />
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 block">Avg Calories</span>
                                    <span className="text-2xl font-bold font-[family-name:var(--font-mono)]">{avgCalories}</span>
                                </div>
                            </div>
                            <div className="bg-white/50 rounded-2xl p-5 border border-white/20 flex items-center gap-4">
                                <Droplets size={20} className="text-blue-400" />
                                <div>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 block">Total Scans</span>
                                    <span className="text-2xl font-bold font-[family-name:var(--font-mono)]">{history.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ─── Empty State ─── */
                    <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/20 p-10 md:p-14 text-center animate-reveal">
                        <div className="w-20 h-20 rounded-2xl bg-black/[0.03] flex items-center justify-center mx-auto mb-6">
                            <ScanLine size={32} className="text-black/15" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No scans yet</h3>
                        <p className="text-sm text-black/30 max-w-sm mx-auto leading-relaxed mb-6">
                            Scan your first meal to start building your health profile. All results will appear here.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black/85 active:scale-[0.97] transition-all"
                        >
                            <Zap size={16} /> Start First Scan
                        </Link>
                    </div>
                )}

                {/* ─── Scan History Log ─── */}
                {history.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <Activity size={16} className="text-[#10b981]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">Scan Log</span>
                            <div className="flex-1 h-px bg-black/5" />
                            <span className="text-[10px] text-black/25 font-[family-name:var(--font-mono)]">{history.length} {history.length === 1 ? 'entry' : 'entries'}</span>
                        </div>

                        <div className="space-y-3">
                            {history.map((item, i) => (
                                <div
                                    key={item.id}
                                    className={`bg-white/50 backdrop-blur-xl rounded-2xl border overflow-hidden transition-all duration-300 hover:border-black/10 animate-reveal ${latestScan && item.id === latestScan.id ? 'border-[#10b981]/30 ring-1 ring-[#10b981]/20' : 'border-white/20'
                                        }`}
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                >
                                    <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="w-full text-left p-5 flex items-center gap-4">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold font-[family-name:var(--font-mono)] ${scoreColor(item.score)} bg-black/[0.03]`}>
                                            {item.score}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-sm truncate">{item.name}</h4>
                                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${statusBg(item.status)}`}>{item.status}</span>
                                                {latestScan && item.id === latestScan.id && (
                                                    <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#10b981]/10 text-[#10b981]">NEW</span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-black/30 font-[family-name:var(--font-mono)] mt-0.5">
                                                {item.date} · {item.time} · {item.calories} kcal
                                                {item.category && <span> · {item.category}</span>}
                                            </p>
                                        </div>

                                        {expanded === item.id ? <ChevronUp size={16} className="text-black/20 shrink-0" /> : <ChevronDown size={16} className="text-black/20 shrink-0" />}
                                    </button>

                                    {expanded === item.id && (
                                        <div className="px-5 pb-5 pt-0 border-t border-black/[0.04] animate-reveal">
                                            {/* Nutrition quick stats */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                                                <div className="bg-black/[0.03] p-3 rounded-xl text-center">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/30 block">Calories</span>
                                                    <span className="text-xl font-bold font-[family-name:var(--font-mono)] text-[#ff6b35]">{item.calories}</span>
                                                    <span className="text-[10px] text-black/20 ml-1">kcal</span>
                                                </div>
                                                <div className="bg-black/[0.03] p-3 rounded-xl text-center">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/30 block">Protein</span>
                                                    <span className="text-xl font-bold font-[family-name:var(--font-mono)] text-[#10b981]">{item.protein || 0}</span>
                                                    <span className="text-[10px] text-black/20 ml-1">g</span>
                                                </div>
                                                <div className="bg-black/[0.03] p-3 rounded-xl text-center">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/30 block">Fat</span>
                                                    <span className="text-xl font-bold font-[family-name:var(--font-mono)] text-blue-500">{item.fat || 0}</span>
                                                    <span className="text-[10px] text-black/20 ml-1">g</span>
                                                </div>
                                                <div className="bg-black/[0.03] p-3 rounded-xl text-center">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/30 block">Freshness</span>
                                                    <span className={`text-lg font-bold capitalize ${freshnessColor(item.freshness)}`}>{item.freshness || 'N/A'}</span>
                                                </div>
                                            </div>

                                            {/* Details row */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                                                {[
                                                    { icon: Thermometer, color: 'text-[#ff6b35]', label: 'Temperature', value: item.details.temp },
                                                    { icon: ShieldAlert, color: 'text-red-400', label: 'Allergens', value: item.details.allergens.join(', ') },
                                                    { icon: FileText, color: 'text-black/30', label: 'Lab Notes', value: item.details.notes },
                                                ].map(d => (
                                                    <div key={d.label} className="flex items-start gap-3 bg-black/[0.03] p-4 rounded-xl">
                                                        <d.icon size={15} className={`${d.color} mt-0.5 shrink-0`} />
                                                        <div>
                                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 block mb-1">{d.label}</span>
                                                            <span className="text-xs font-medium text-black/60 leading-relaxed">{d.value}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Ingredients */}
                                            {item.ingredients && item.ingredients.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-black/[0.04]">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 block mb-3">Detected Ingredients</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.ingredients.map((ing, k) => (
                                                            <span key={k} className="flex items-center gap-1.5 bg-[#10b981]/5 border border-[#10b981]/10 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#10b981]">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> {ing}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ─── Scan Again CTA ─── */}
                <Link
                    href="/"
                    className="block w-full py-4 rounded-xl bg-black text-white font-bold text-sm text-center hover:bg-black/85 active:scale-[0.99] transition-all"
                >
                    ← Scan Another Item
                </Link>
            </main>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { ChefHat, Leaf, Timer, Heart, Sparkles, AlertTriangle, Save } from 'lucide-react';

type Recipe = {
    name: string;
    ingredients: string | string[];
    twist: string;
    time: string;
    benefits: string;
    sustainability: string;
};

export default function SustainableKitchenPage() {
    const [pantry, setPantry] = useState('');
    const [expiring, setExpiring] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateRecipes = async () => {
        if (!pantry && !expiring) return;

        setLoading(true);
        setError('');
        setRecipes([]);

        try {
            const res = await fetch('/api/kitchen-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pantry, expiring }),
            });

            if (!res.ok) {
                console.error(`Fetch failed with status: ${res.status} ${res.statusText}`);
                const errorText = await res.text();
                console.error('Error response body:', errorText);
                throw new Error(`Failed to fetch recipes: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            // Ensure array format for robust rendering
            let recs = data.recipes;
            if (!Array.isArray(recs)) {
                // simple heuristic cleanup if needed or just wrap
                recs = [recs];
            }
            // Normalize ingredients to string if array
            recs = recs.map((r: { ingredients: string | string[];[key: string]: unknown }) => ({
                ...r,
                ingredients: Array.isArray(r.ingredients) ? r.ingredients.join(', ') : r.ingredients
            }));

            setRecipes(recs);
        } catch (err) {
            console.error(err);
            setError('The lab is experiencing high traffic. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#e2e5b3] pl-0 md:pl-[72px]">
            <header className="px-6 md:px-10 pt-8 md:pt-10 max-w-[1300px] mx-auto">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-blink" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/30 font-[family-name:var(--font-mono)]">
                        lab // assistant
                    </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-[0.88] tracking-tight">
                    Sustainable<br />Kitchen
                </h1>
                <p className="text-black/30 text-sm mt-4 max-w-md leading-relaxed">
                    Minimize waste. Maximize flavor. Our AI assistant crafts scientifically paired recipes from your expiring ingredients.
                </p>
            </header>

            <main className="px-6 md:px-10 max-w-[1300px] mx-auto pb-36 mt-8 space-y-8">

                {/* ─── INPUT SECTION ─── */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Pantry Input */}
                    <div className="bg-white/50 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white/20 flex flex-col h-full focus-within:ring-2 ring-black/5 transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 rounded-lg bg-black/[0.04] flex items-center justify-center">
                                <ChefHat size={16} className="text-black/40" />
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">Pantry Inventory</span>
                        </div>
                        <textarea
                            value={pantry}
                            onChange={(e) => setPantry(e.target.value)}
                            placeholder="Detailed list of items (e.g., Rice, Pasta, Canned Beans, Spices...)"
                            className="flex-1 w-full bg-transparent resize-none text-sm placeholder:text-black/20 focus:outline-none leading-relaxed"
                        />
                    </div>

                    {/* Expiring Input (Priority) */}
                    <div className="bg-[#ff6b35]/5 backdrop-blur-xl rounded-[1.5rem] p-6 border border-[#ff6b35]/10 flex flex-col h-full focus-within:ring-2 ring-[#ff6b35]/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center">
                                    <AlertTriangle size={16} className="text-[#ff6b35]" />
                                </span>
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff6b35]">Expiring Soon</span>
                            </div>
                            <span className="text-[9px] font-bold bg-[#ff6b35] text-white px-2 py-0.5 rounded uppercase tracking-wider">Priority</span>
                        </div>
                        <textarea
                            value={expiring}
                            onChange={(e) => setExpiring(e.target.value)}
                            placeholder="Items spoiling within 48h (e.g., Wilted Spinach, Spotted Bananas, Milk...)"
                            className="flex-1 w-full bg-transparent resize-none text-sm placeholder:text-[#ff6b35]/30 focus:outline-none leading-relaxed"
                        />
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-end">
                    <button
                        onClick={generateRecipes}
                        disabled={loading || (!pantry && !expiring)}
                        className="bg-black text-white px-8 py-4 rounded-xl font-bold text-sm flex items-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-black/85 active:scale-[0.98] transition-all shadow-xl shadow-black/10"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Synthesizing...
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} /> Generate Protocols
                            </>
                        )}
                    </button>
                </div>

                {/* ─── OUTPUT SECTION ─── */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {recipes.map((recipe, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-[2rem] p-6 border border-black/[0.04] shadow-sm hover:shadow-xl hover:shadow-black/[0.04] hover:-translate-y-1 transition-all duration-300 flex flex-col group animate-reveal"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        >
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30 font-[family-name:var(--font-mono)]">
                                        Formula {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <div className="flex gap-2">
                                        <button title="Save Recipe" className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/30 hover:text-black">
                                            <Save size={14} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold leading-tight group-hover:text-[#10b981] transition-colors">
                                    {recipe.name}
                                </h3>
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-4 flex-1">
                                {/* Ingredients */}
                                <div className="bg-[#e2e5b3]/30 p-4 rounded-xl">
                                    <span className="block text-[10px] font-bold uppercase tracking-wider text-black/40 mb-1">Ingredients</span>
                                    <p className="text-sm leading-relaxed text-black/70">{recipe.ingredients}</p>
                                </div>

                                {/* Flavor Twist */}
                                <div className="flex items-start gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                                        <Sparkles size={14} className="text-purple-600" />
                                    </span>
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-black/40">Flavor Twist</span>
                                        <p className="text-sm font-medium">{recipe.twist}</p>
                                    </div>
                                </div>

                                {/* Timer */}
                                <div className="flex items-start gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <Timer size={14} className="text-blue-600" />
                                    </span>
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-black/40">Time</span>
                                        <p className="text-sm font-medium tabular-nums">{recipe.time}</p>
                                    </div>
                                </div>

                                {/* Health */}
                                <div className="flex items-start gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                        <Heart size={14} className="text-red-500" />
                                    </span>
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-black/40">Health Benefit</span>
                                        <p className="text-sm font-medium">{recipe.benefits}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sustainability Footer */}
                            <div className="mt-6 pt-4 border-t border-black/[0.04]">
                                <div className="flex items-start gap-2.5 bg-[#10b981]/10 p-3 rounded-lg">
                                    <Leaf size={14} className="text-[#10b981] mt-0.5 shrink-0" />
                                    <p className="text-xs font-medium text-[#047857] leading-relaxed">
                                        <span className="font-bold uppercase text-[9px] tracking-wider block mb-0.5 opacity-70">Sustainability Tip</span>
                                        {recipe.sustainability}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {!loading && recipes.length === 0 && !error && (
                    <div className="text-center py-20 border-2 border-dashed border-black/[0.04] rounded-[2rem]">
                        <div className="w-16 h-16 bg-black/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ChefHat size={32} className="text-black/20" />
                        </div>
                        <h3 className="text-lg font-bold text-black/40 mb-2">Lab is Idle</h3>
                        <p className="text-sm text-black/30 max-w-xs mx-auto">
                            Input your pantry data above to initiate the recipe synthesis protocol.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

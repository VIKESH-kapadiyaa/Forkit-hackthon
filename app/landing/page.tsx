'use client';

import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { ArrowRight, ChevronDown, Activity, ShieldCheck, Search, Repeat, Star, Zap, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- ULTRA REALISTIC ASSETS ---
const HERO_FOOD = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2680&auto=format&fit=crop"; // High-res Pokebowl
const PHONE_MOCKUP_BG = "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2670&auto=format&fit=crop"; // Kitchen/Lab Abstract
const METRIC_BG = "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2574&auto=format&fit=crop"; // Lab Glassware

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

    return (
        <div ref={containerRef} className="relative bg-[#030303] text-white selection:bg-[#10b981]/30 overflow-x-hidden font-sans">

            {/* ─── ACT 1: The Bio-Scan (Hero) ─── */}
            <ActOne progress={smoothProgress} />

            {/* ─── ACT 2: The Neural Core (Product) ─── */}
            <ActTwo progress={smoothProgress} />

            {/* ─── ACT 3: The Protocol (Workflow) ─── */}
            <ActThree />

            {/* ─── ACT 4: The Collective (Social Proof) ─── */}
            <ActFour />

            {/* ─── ACT 5: The Initiation (CTA) ─── */}
            <ActFive />

            {/* Global Progress Line */}
            <motion.div
                style={{ scaleX: smoothProgress }}
                className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#10b981] to-[#34d399] origin-left z-[100] pointer-events-none shadow-[0_0_20px_#10b981]"
            />
        </div>
    );
}

// -----------------------------------------------------------------------------
// ACT 1: THE BIO-SCAN
// -----------------------------------------------------------------------------
function ActOne({ progress }: { progress: MotionValue<number> }) {
    const y = useTransform(progress, [0, 0.4], ["0%", "30%"]);
    const textY = useTransform(progress, [0, 0.3], [0, 150]);
    const scanLineTop = useTransform(progress, [0, 0.15], ["5%", "95%"]);
    const opacity = useTransform(progress, [0.1, 0.25], [1, 0]);

    return (
        <div className="h-[180vh] relative z-10 sticky top-0 bg-[#030303]">
            <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center perspective-[1000px]">

                {/* Background Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#10b981]/5 via-[#030303] to-[#030303] opacity-30 pointer-events-none" />

                <motion.div style={{ y, opacity }} className="relative w-full h-full max-w-[1920px] mx-auto">

                    {/* --- LAYER 1: The 'Pristine' Image --- */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center">
                        <div className="relative w-full h-full md:w-[90vw] md:h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl grayscale-[0.2]">
                            <Image
                                src={HERO_FOOD}
                                alt="Culinary Masterpiece"
                                fill
                                priority
                                className="object-cover scale-105"
                                quality={100}
                                sizes="90vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/40" />
                        </div>
                    </div>

                    {/* --- LAYER 2: The 'X-Ray' Scan Effect --- */}
                    <motion.div
                        style={{ clipPath: useTransform(scanLineTop, (v: any) => `inset(0 0 ${100 - parseFloat(v)}% 0)`) }}
                        className="absolute inset-0 z-10 flex items-center justify-center"
                    >
                        <div className="relative w-full h-full md:w-[90vw] md:h-[90vh] rounded-[3rem] overflow-hidden bg-[#0a0a0a]">
                            {/* Inverted / Analyzed Image */}
                            <Image
                                src={HERO_FOOD}
                                alt="Analyzed Structure"
                                fill
                                priority
                                className="object-cover scale-105 filter invert-[1] hue-rotate-[180deg] contrast-[1.2] brightness-[0.8] saturate-50"
                                sizes="90vw"
                            />

                            {/* Digital Overlays */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-[#10b981]/10 mix-blend-color-dodge" />

                            {/* Floating Data Points */}
                            <div className="absolute top-[35%] left-[25%] flex items-center gap-2 animate-pulse">
                                <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]" />
                                <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] font-mono text-red-500 border border-red-500/30">
                                    PATHOGEN_VECTOR: DETECTED
                                </span>
                            </div>
                            <div className="absolute bottom-[40%] right-[20%] flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_orange]" />
                                <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[9px] font-mono text-yellow-500 border border-yellow-500/30">
                                    TEMP_GRADIENT: UNSTABLE
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- LAYER 3: The Scanner Beam --- */}
                    <motion.div
                        style={{ top: scanLineTop }}
                        className="absolute left-0 right-0 h-[2px] bg-[#10b981] z-20 shadow-[0_0_80px_4px_#10b981]"
                    >
                        <div className="absolute right-[10%] -top-10 flex flex-col items-end">
                            <span className="text-[#10b981] font-mono text-xs font-bold tracking-widest bg-black/80 px-2 py-0.5 rounded">
                                SCANNING :: 98.4%
                            </span>
                            <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#10b981] to-transparent" />
                        </div>
                    </motion.div>

                    {/* --- HERO TEXT --- */}
                    <motion.div
                        style={{ y: textY }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
                    >
                        <div className="overflow-hidden">
                            <motion.span
                                initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: "circOut" }}
                                className="block text-[#10b981] font-mono text-xs md:text-sm tracking-[0.4em] uppercase mb-4"
                            >
                                Gastronomy Trust Engine v2.0
                            </motion.span>
                        </div>
                        <h1 className="text-6xl md:text-[10rem] font-bold tracking-tighter text-white drop-shadow-2xl leading-[0.9] mix-blend-overlay">
                            TRUST<br />NOTHING.
                        </h1>
                        <p className="mt-6 text-sm md:text-xl text-white/70 font-light tracking-wide max-w-lg mx-auto bg-black/20 backdrop-blur-xl p-4 rounded-full border border-white/5">
                            Verify the molecular integrity of your food.<br />
                            <span className="text-[#10b981] font-bold">Before you take the first bite.</span>
                        </p>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 text-center"
                    >
                        <span className="text-[9px] uppercase tracking-[0.2em] opacity-40">Initialize Protocol</span>
                        <ChevronDown className="w-5 h-5 mx-auto mt-2 text-[#10b981]/60" />
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// ACT 2: THE NEURAL CORE (Product Showcase)
// -----------------------------------------------------------------------------
function ActTwo({ progress }: { progress: MotionValue<number> }) {
    const rotateX = useTransform(progress, [0.15, 0.45], [30, 5]);
    const rotateY = useTransform(progress, [0.15, 0.45], [-30, -5]);
    const scale = useTransform(progress, [0.15, 0.45], [0.85, 1]);
    const opacity = useTransform(progress, [0.15, 0.25], [0, 1]);

    // Physics-based smoothing
    const smoothRX = useSpring(rotateX, { stiffness: 40, damping: 15 });
    const smoothRY = useSpring(rotateY, { stiffness: 40, damping: 15 });

    return (
        <div className="min-h-[120vh] bg-[#030303] flex items-center justify-center relative z-20 py-24 overflow-hidden perspective-[2000px]">

            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto w-full px-6 flex flex-col md:flex-row items-center gap-24">

                {/* Left: Info Panel */}
                <div className="flex-1 space-y-12 z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-3 h-3 bg-[#10b981] rounded-full shadow-[0_0_10px_#10b981]" />
                            <h3 className="text-[#10b981] font-mono text-sm tracking-[0.3em] uppercase">
                                Neural Processing Unit
                            </h3>
                        </div>

                        <h2 className="text-5xl md:text-8xl font-bold leading-[0.9] tracking-tight mb-8">
                            Pocket<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">
                                Spectrometer.
                            </span>
                        </h2>

                        <p className="text-white/50 text-xl leading-relaxed max-w-lg font-light border-l-2 border-[#10b981]/30 pl-6">
                            Analyzing visual data across <span className="text-white font-medium">14 distinct spectrums</span> to detect spoilage signatures invisible to the human eye.
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Processing", value: "34ms", icon: Zap },
                            { label: "Accuracy", value: "99.2%", icon: Activity },
                        ].map((stat, i) => (
                            <div key={i} className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 p-6 rounded-2xl transition-all duration-300">
                                <stat.icon className="text-[#10b981] mb-4 group-hover:scale-110 transition-transform" size={24} />
                                <div className="text-3xl font-bold font-mono tracking-tighter mb-1">{stat.value}</div>
                                <div className="text-[10px] text-white/30 uppercase tracking-[0.2em]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: The Device */}
                <motion.div
                    style={{ rotateX: smoothRX, rotateY: smoothRY, scale, opacity }}
                    className="flex-1 w-full flex justify-center perspective-[3000px] origin-center"
                >
                    <div className="relative w-[320px] md:w-[380px] aspect-[9/19] bg-[#050505] rounded-[3.5rem] p-4 shadow-2xl border-[6px] border-[#1a1a1a] ring-1 ring-white/10 preserve-3d">

                        {/* Device Gloss/Reflection */}
                        <div className="absolute inset-0 rounded-[3.2rem] bg-gradient-to-tr from-white/10 to-transparent opacity-40 pointer-events-none z-50" />

                        {/* Screen Area */}
                        <div className="relative w-full h-full bg-black rounded-[2.8rem] overflow-hidden">
                            {/* Simulate Camera Feed */}
                            <Image
                                src={PHONE_MOCKUP_BG}
                                alt="Camera Feed"
                                fill
                                className="object-cover opacity-80"
                                sizes="(max-width: 768px) 100vw, 400px"
                            />

                            {/* AR Overlay UI */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                {/* Top AR Bar */}
                                <div className="flex justify-between items-start">
                                    <div className="text-[9px] font-mono text-[#10b981] bg-black/60 backdrop-blur px-2 py-1 rounded border border-[#10b981]/20">
                                        ISO 0400 :: f/1.8
                                    </div>
                                    <Activity className="text-white/60 animate-pulse" size={16} />
                                </div>

                                {/* Central Focus Ring */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 rounded-full flex items-center justify-center">
                                    <div className="w-40 h-40 border border-[#10b981]/60 rounded-full animate-[spin_10s_linear_infinite]" />
                                    <div className="w-2 h-2 bg-[#10b981] rounded-full" />
                                    <div className="absolute -bottom-8 bg-black/80 text-white text-[10px] font-mono px-3 py-1 rounded-full border border-white/10">
                                        ANALYZING TEXTURE...
                                    </div>
                                </div>

                                {/* Bottom AR Panel */}
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-white mb-0.5">Risk Detected</div>
                                            <div className="text-[9px] text-white/50 uppercase tracking-wider">Refund Eligibility: 100%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// ACT 3: THE PROTOCOL (Sticky Cards)
// -----------------------------------------------------------------------------
function ActThree() {
    return (
        <div className="bg-[#030303] relative z-20 pb-40">
            <div className="max-w-[1400px] mx-auto px-6 py-32">
                <div className="text-center mb-40">
                    <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
                        The Justice Protocol
                    </h2>
                    <div className="w-24 h-1 bg-[#10b981] mx-auto rounded-full" />
                </div>

                <div className="flex flex-col items-center gap-40">
                    <StickyCard
                        index={1}
                        title="Analyze"
                        subtitle="Molecular Verification"
                        desc="Point your camera. Our rapid-spectrum analysis identifies bacterial growth and spoilage signatures instantly."
                        color="text-[#10b981]"
                        gradient="from-[#10b981]/20"
                        icon={Search}
                    />
                    <StickyCard
                        index={2}
                        title="Claim"
                        subtitle="Automated Dispute"
                        desc="We generate a forensic report and interface directly with the delivery platform to process your refund."
                        color="text-blue-400"
                        gradient="from-blue-500/20"
                        icon={ShieldCheck}
                    />
                    <StickyCard
                        index={3}
                        title="Replace"
                        subtitle=" instant Fulfillment"
                        desc="Funds are credited to your wallet immediately. Order a verified safe replacement in one tap."
                        color="text-orange-400"
                        gradient="from-orange-500/20"
                        icon={Repeat}
                    />
                </div>
            </div>
        </div>
    );
}

function StickyCard({ index, title, subtitle, desc, color, gradient, icon: Icon }: any) {
    return (
        <div className="sticky top-[25vh] w-full max-w-4xl perspective-[1000px]">
            <motion.div
                initial={{ opacity: 0, y: 100, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ margin: "-20%" }}
                transition={{ duration: 0.8 }}
                className={`relative bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-12 md:p-16 overflow-hidden group hover:border-white/10 transition-colors shadow-2xl`}
            >
                {/* Background Glow */}
                <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br ${gradient} to-transparent blur-[120px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity`} />

                <div className="flex flex-col md:flex-row items-start justify-between gap-12 relative z-10">
                    <div className="space-y-8 flex-1">
                        <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${color} border border-white/5`}>
                            <Icon size={32} />
                        </div>
                        <div>
                            <span className={`block text-xs font-mono font-bold tracking-[0.2em] uppercase mb-4 opacity-70 ${color}`}>{subtitle}</span>
                            <h3 className="text-4xl md:text-6xl font-bold leading-[0.95] mb-6">{title}</h3>
                            <p className="text-lg text-white/50 leading-relaxed font-light">{desc}</p>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <span className="text-[10rem] leading-none font-bold text-white/[0.02] font-mono">0{index}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// ACT 4: THE COLLECTIVE (Testimonials)
// -----------------------------------------------------------------------------
function ActFour() {
    return (
        <div className="relative z-30 bg-[#e2e5b3] text-black py-40 rounded-t-[5rem] -mt-20">
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 px-4 md:px-10">
                    <div>
                        <span className="text-[#10b981] font-mono text-xs font-bold uppercase tracking-[0.3em] block mb-6">
                            Verified Reports
                        </span>
                        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
                            The Trust<br />Collective.
                        </h2>
                    </div>
                    <div className="hidden md:block text-right">
                        <div className="text-4xl font-bold font-mono">12,402</div>
                        <div className="text-sm uppercase tracking-widest opacity-40">Active Agents</div>
                    </div>
                </div>

                {/* Infinite Scroll Marquee Effect */}
                <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar snap-x snap-mandatory px-4 md:px-10">
                    {[
                        { name: "Sarah J.", city: "New York", text: "Saved me from food poisoning twice this week.", tag: "Health" },
                        { name: "David L.", city: "London", text: "Refund land in my wallet before I even threw the food away.", tag: "Speed" },
                        { name: "Elena R.", city: "Berlin", text: "The texture analysis is frighteningly accurate.", tag: "Tech" },
                        { name: "Marcus K.", city: "Toronto", text: "Finally, I can order sushi without anxiety.", tag: "Trust" },
                        { name: "Priya M.", city: "Mumbai", text: "Every restaurant needs to know we use this.", tag: "Justice" },
                    ].map((t, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="min-w-[340px] md:min-w-[480px] bg-white/50 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] border border-black/5 snap-center shadow-lg cursor-grab active:cursor-grabbing"
                        >
                            <div className="flex gap-1 mb-10">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} fill="black" className="text-black" />)}
                            </div>
                            <p className="text-2xl md:text-4xl font-bold leading-[1.1] mb-12 tracking-tight opacity-90">&quot;{t.text}&quot;</p>
                            <div className="flex justify-between items-end border-t border-black/10 pt-8">
                                <div>
                                    <div className="font-bold text-lg">{t.name}</div>
                                    <div className="text-xs text-black/40 uppercase tracking-wider">{t.city}</div>
                                </div>
                                <span className="text-[10px] uppercase font-bold bg-black text-[#e2e5b3] px-4 py-2 rounded-full tracking-wider">
                                    {t.tag}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                    <div className="min-w-[20vw]" />
                </div>
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// ACT 5: THE INITIATION
// -----------------------------------------------------------------------------
function ActFive() {
    return (
        <div className="h-[90vh] bg-[#030303] text-white flex flex-col items-center justify-center relative z-20 overflow-hidden">
            {/* Background Video/Gif Replacement with CSS Mesh */}
            <div className="absolute inset-0 bg-[#030303]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#10b981_0%,_transparent_40%)] opacity-10 blur-[100px] animate-pulse" />
            </div>

            <div className="relative z-10 text-center max-w-5xl px-6">
                <h2 className="text-6xl md:text-[9rem] font-bold tracking-tighter mb-12 leading-[0.85] mix-blend-overlay opacity-90">
                    DEMAND<br />BETTER.
                </h2>

                <Link href="/" className="inline-block group relative">
                    <div className="absolute inset-0 bg-[#10b981] rounded-full blur-2xl opacity-20 group-hover:opacity-60 transition-opacity duration-500" />
                    <button className="relative bg-[#10b981] text-[#030303] px-14 py-8 rounded-full font-bold text-xl md:text-2xl flex items-center gap-6 hover:scale-105 transition-transform active:scale-95 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                        <Zap size={24} className="fill-black" />
                        Init Scan Protocol
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                </Link>

                <div className="mt-16 flex items-center justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="font-mono text-xs font-bold">SECURED BY</span>
                    <div className="flex gap-6">
                        <div className="text-sm font-bold tracking-widest">VERCEL</div>
                        <div className="text-sm font-bold tracking-widest">OPENAI</div>
                        <div className="text-sm font-bold tracking-widest">STRIPE</div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
        </div>
    );
}

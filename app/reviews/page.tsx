'use client';

import { useState, useRef, useEffect } from 'react';
import { Star, Send, Award, MessageCircle, Sparkles, ArrowUpRight, ImagePlus, X, ChevronUp, Camera, TrendingUp, Users, Clock } from 'lucide-react';
import Image from 'next/image';

const INITIAL_REVIEWS = [
    { id: 'r1', user: 'Priya S.', initial: 'P', bg: 'bg-[#10b981]', rating: 5, text: 'Green Bowl knocked it out today. The avocado was perfectly ripe. Dressing was insane — chef-kiss level. Already ordering for tomorrow.', tags: ['Fresh', 'Premium'], time: '2h ago', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80' as string | null },
    { id: 'r2', user: 'Arjun M.', initial: 'A', bg: 'bg-[#ff6b35]', rating: 3, text: 'Pizza was okay-ish. Arrived lukewarm, cheese had started to solidify. Taste-wise fine but they need better thermal packaging honestly.', tags: ['Lukewarm', 'Packaging Issue'], time: '5h ago', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80' as string | null },
    { id: 'r3', user: 'Sara K.', initial: 'S', bg: 'bg-red-500', rating: 1, text: 'Found. Hair. In. My. Biryani. Filed a claim through VeriFood scan and got refund in 12 seconds. At least the platform works even if the restaurant doesn\'t.', tags: ['Contaminated', 'Auto-Refunded'], time: '1d ago', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80' as string | null },
    { id: 'r4', user: 'Dev R.', initial: 'D', bg: 'bg-blue-500', rating: 4, text: 'Ocean Bites sushi was legit. Fish was cold and fresh, rice was well-seasoned. One piece was a little warm but I\'d still give them a solid 4.', tags: ['Fresh', 'Reliable'], time: '1d ago', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80' as string | null },
];

const AVATAR_COLORS = ['bg-[#10b981]', 'bg-[#ff6b35]', 'bg-red-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-cyan-500'];

const RATING_LABELS = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Amazing'];
const RATING_COLORS = ['', 'text-red-500', 'text-[#ff6b35]', 'text-amber-500', 'text-[#10b981]', 'text-[#10b981]'];
const RATING_BG = ['', 'bg-red-500/10', 'bg-[#ff6b35]/10', 'bg-amber-500/10', 'bg-[#10b981]/10', 'bg-[#10b981]/10'];

export default function ReviewsPage() {
    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [points, setPoints] = useState(350);
    const [reviews, setReviews] = useState(INITIAL_REVIEWS);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image must be under 5 MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePost = () => {
        if (!text || rating === 0) return;

        const newReview = {
            id: `r${Date.now()}`,
            user: 'You',
            initial: 'Y',
            bg: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
            rating,
            text,
            tags: [] as string[],
            time: 'Just now',
            image: imagePreview,
        };

        setReviews(prev => [newReview, ...prev]);
        setPoints(prev => prev + 50);
        setText('');
        setRating(0);
        removeImage();

        // Show success toast
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const activeRating = hoveredStar || rating;

    return (
        <div className="min-h-screen bg-[#e2e5b3] pl-0 md:pl-[72px]">

            {/* ═══ HEADER ═══ */}
            <header className="px-6 md:px-10 pt-8 md:pt-10 max-w-[1300px] mx-auto">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-blink" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/30 font-[family-name:var(--font-mono)]">
                        community_feed // live
                    </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-[0.88] tracking-tight">
                    Live<br />Reviews
                </h1>
                <p className="text-black/30 text-sm mt-3 max-w-sm leading-relaxed">
                    Real experiences from real people. Share your honest food review and earn reward points.
                </p>
            </header>

            {/* ═══ STATS TICKER ═══ */}
            <div className="px-6 md:px-10 max-w-[1300px] mx-auto mt-6">
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {[
                        { icon: <Users size={14} />, label: 'Reviewers', value: '2.4K' },
                        { icon: <MessageCircle size={14} />, label: 'Reviews', value: `${reviews.length}` },
                        { icon: <TrendingUp size={14} />, label: 'Avg Rating', value: '4.2' },
                        { icon: <Clock size={14} />, label: 'Last Review', value: reviews[0]?.time || '—' },
                    ].map((stat) => (
                        <div key={stat.label} className="flex items-center gap-2.5 bg-black/[0.04] rounded-xl px-4 py-2.5 shrink-0">
                            <span className="text-[#10b981]">{stat.icon}</span>
                            <div>
                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-black/25 block leading-none">{stat.label}</span>
                                <span className="text-sm font-bold font-[family-name:var(--font-mono)]">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══ MAIN CONTENT ═══ */}
            <main className="px-6 md:px-10 max-w-[1300px] mx-auto pb-36 mt-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ─── LEFT SIDEBAR: Compose + Points ─── */}
                    <div className="lg:w-[400px] shrink-0 space-y-5 lg:sticky lg:top-8 lg:self-start">

                        {/* Points Card */}
                        <div className="bg-black rounded-[1.5rem] p-6 text-white relative overflow-hidden grain">
                            <div className="absolute inset-0 crosshatch opacity-40" />
                            <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#ff6b35]/10 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#ff6b35]/20 flex items-center justify-center">
                                            <Award size={20} className="text-[#ff6b35]" />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 block">Reward Points</span>
                                            <span className="text-3xl font-bold font-[family-name:var(--font-mono)] tabular-nums">{points}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] text-white/20 font-bold uppercase tracking-wider block">Per Review</span>
                                        <span className="text-lg font-bold text-[#10b981] font-[family-name:var(--font-mono)]">+50</span>
                                    </div>
                                </div>
                                {/* Progress bar to next reward */}
                                <div className="bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#ff6b35] to-[#10b981] rounded-full transition-all duration-700"
                                        style={{ width: `${(points % 500) / 500 * 100}%` }}
                                    />
                                </div>
                                <span className="text-[8px] text-white/15 mt-1.5 block font-[family-name:var(--font-mono)] uppercase tracking-[0.2em]">
                                    {500 - (points % 500)} pts to next reward
                                </span>
                            </div>
                        </div>

                        {/* Compose Card */}
                        <div className="bg-white/60 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white/30 shadow-lg shadow-black/[0.03] relative overflow-hidden">
                            {/* Subtle accent glow */}
                            <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#10b981]/[0.06] rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-5">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40 flex items-center gap-2">
                                        <Sparkles size={14} className="text-[#ff6b35]" /> New Review
                                    </span>
                                    <span className={`text-[10px] font-[family-name:var(--font-mono)] tabular-nums ${text.length > 240 ? 'text-[#ff6b35]' : 'text-black/20'}`}>
                                        {text.length}/280
                                    </span>
                                </div>

                                {/* Star Rating */}
                                <div className="flex items-center gap-1 mb-5">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <button
                                                key={i}
                                                onClick={() => setRating(i)}
                                                onMouseEnter={() => setHoveredStar(i)}
                                                onMouseLeave={() => setHoveredStar(0)}
                                                className="transition-all duration-200 hover:scale-125 active:scale-90 p-0.5"
                                            >
                                                <Star
                                                    size={26}
                                                    fill={i <= activeRating ? '#ff6b35' : 'transparent'}
                                                    className={`transition-colors duration-200 ${i <= activeRating ? 'text-[#ff6b35] drop-shadow-sm' : 'text-black/10'}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {activeRating > 0 && (
                                        <span className={`text-xs font-bold ml-3 px-2.5 py-1 rounded-lg ${RATING_BG[activeRating]} ${RATING_COLORS[activeRating]} transition-all duration-200`}>
                                            {RATING_LABELS[activeRating]}
                                        </span>
                                    )}
                                </div>

                                {/* Textarea */}
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value.slice(0, 280))}
                                    placeholder="What was your honest experience?"
                                    className="w-full bg-white/80 rounded-xl p-4 h-32 resize-none text-sm focus:outline-none focus:ring-2 ring-[#10b981]/30 placeholder:text-black/20 leading-relaxed border border-black/[0.04] transition-shadow"
                                />

                                {/* ─── Photo Upload ─── */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    id="review-photo-input"
                                />

                                {imagePreview ? (
                                    <div className="mt-3 relative group/img rounded-xl overflow-hidden border border-black/[0.06]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={imagePreview}
                                            alt="Review photo preview"
                                            className="w-full rounded-xl"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                        <button
                                            onClick={removeImage}
                                            className="absolute top-2.5 right-2.5 bg-black/60 hover:bg-red-500 text-white rounded-full p-1.5 transition-all backdrop-blur-sm hover:scale-110"
                                            aria-label="Remove photo"
                                        >
                                            <X size={14} />
                                        </button>
                                        <span className="absolute bottom-2.5 left-2.5 text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg bg-black/50 text-white/90 backdrop-blur-sm flex items-center gap-1.5">
                                            <Camera size={10} /> Photo attached
                                        </span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full mt-3 py-3.5 rounded-xl border-2 border-dashed border-black/[0.06] hover:border-[#10b981]/40 bg-white/40 hover:bg-[#10b981]/[0.05] text-black/25 hover:text-[#10b981] flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.15em] transition-all active:scale-[0.98] group/photo"
                                    >
                                        <ImagePlus size={18} className="group-hover/photo:scale-110 transition-transform" />
                                        Add Photo
                                    </button>
                                )}

                                {/* Post Button */}
                                <button
                                    disabled={!text || rating === 0}
                                    onClick={handlePost}
                                    className="w-full mt-4 bg-black text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 disabled:opacity-10 disabled:cursor-not-allowed hover:bg-black/85 active:scale-[0.98] transition-all shadow-lg shadow-black/10 disabled:shadow-none"
                                >
                                    <Send size={15} /> Post Review
                                </button>
                            </div>
                        </div>

                        {/* Guidelines */}
                        <div className="text-center space-y-1">
                            <p className="text-[10px] text-black/20 font-[family-name:var(--font-mono)] uppercase tracking-[0.2em]">
                                honest reviews only · community moderated
                            </p>
                        </div>
                    </div>

                    {/* ─── RIGHT: Feed ─── */}
                    <div className="flex-1 min-w-0 space-y-4" ref={feedRef}>
                        {/* Feed Header */}
                        <div className="flex items-center gap-3 mb-2">
                            <MessageCircle size={16} className="text-[#10b981]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/40">Feed</span>
                            <span className="text-[10px] font-[family-name:var(--font-mono)] text-black/15 tabular-nums">{reviews.length} reviews</span>
                            <div className="flex-1 h-px bg-black/5" />
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#10b981]">
                                <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-blink" />
                                Live
                            </div>
                        </div>

                        {/* Review Cards */}
                        {reviews.map((r, i) => (
                            <div
                                key={r.id}
                                className="bg-white/55 backdrop-blur-xl rounded-2xl border border-white/25 p-5 md:p-6 hover:border-black/[0.08] hover:shadow-lg hover:shadow-black/[0.03] hover:-translate-y-0.5 transition-all duration-300 group animate-reveal"
                                style={{ animationDelay: `${i * 0.08}s` }}
                            >
                                <div className="flex gap-4">
                                    {/* Avatar */}
                                    <div className={`w-11 h-11 ${r.bg} text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-black/10`}>
                                        {r.initial}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* User info row */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-sm">{r.user}</span>
                                            <span className="text-[10px] text-black/15">·</span>
                                            <span className="text-[10px] text-black/25 font-[family-name:var(--font-mono)]">{r.time}</span>
                                            <div className="flex-1" />
                                            {/* Rating badge */}
                                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg ${RATING_BG[r.rating] || 'bg-black/[0.03]'}`}>
                                                <Star size={11} fill="#ff6b35" className="text-[#ff6b35]" />
                                                <span className={`text-xs font-bold ${RATING_COLORS[r.rating] || 'text-black/40'}`}>{r.rating}</span>
                                            </div>
                                        </div>

                                        {/* Review text */}
                                        <p className="text-[13px] text-black/55 leading-relaxed mb-3">{r.text}</p>

                                        {/* Review image */}
                                        {r.image && (
                                            <div className="mb-3 rounded-xl overflow-hidden border border-black/[0.06]">
                                                {r.image && (
                                                    <Image
                                                        src={r.image}
                                                        alt={`Photo by ${r.user}`}
                                                        width={600}
                                                        height={400}
                                                        className="w-full rounded-xl hover:scale-[1.02] transition-transform duration-500"
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {/* Tags */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {r.tags.map(tag => (
                                                <span key={tag} className="text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg bg-black/[0.03] text-black/30 border border-black/[0.04] hover:bg-black/[0.06] transition-colors">
                                                    {tag}
                                                </span>
                                            ))}
                                            <div className="flex-1" />
                                            <ArrowUpRight size={14} className="text-black/10 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* End of feed */}
                        <div className="text-center py-8">
                            <span className="text-[10px] text-black/15 font-[family-name:var(--font-mono)] uppercase tracking-[0.25em]">
                                · end of feed ·
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* ═══ SUCCESS TOAST ═══ */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-2xl shadow-black/20 z-50 transition-all duration-500 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
                <div className="w-8 h-8 bg-[#10b981] rounded-lg flex items-center justify-center shrink-0">
                    <Sparkles size={16} />
                </div>
                <div>
                    <span className="block text-sm">Review posted!</span>
                    <span className="text-[10px] text-white/40 font-[family-name:var(--font-mono)]">+50 points earned</span>
                </div>
            </div>

            {/* ═══ SCROLL TO TOP ═══ */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-8 right-8 w-11 h-11 bg-black/80 backdrop-blur-sm text-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10 z-50 hover:bg-black hover:scale-110 active:scale-95 transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
                <ChevronUp size={18} />
            </button>
        </div>
    );
}

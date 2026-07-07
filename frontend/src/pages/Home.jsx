import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    
    return (
        <div className="bg-background text-on-background font-body-md overflow-x-hidden min-h-screen">
            
{/* Top Navigation Bar */}
<header className="fixed top-0 w-full bg-surface/80 backdrop-blur-xl z-50 border-b border-white/10 shadow-xl flex justify-between items-center px-grid-margin h-20">
<div className="flex items-center gap-md">
<img alt="ARENA LIVE Logo" className="h-10 w-auto" src="https://lh3.googleusercontent.com/aida/AP1WRLst0x-SB4csEk5JAf5eD432xAQfY7iMQ7LUwaz8QL5qvsK-gEN-S1LAIDINbxayHdgtLCGxxrDCuTePYMEWns9PQLaBid0oCv9k836pLKdI09x96V3nMPOfewcTdjL7H4vJTdjxCMmdgsOniAD2Gpp29CMB2wlrYDBjFWO98Xu9weVo6zfQ6v-WO_AKNKP0FcHMF6CVIHAYwtzDq2cov3079mXOhse1VJ3WbV9eKv-xbAu68mssYvpSXLQ"/>
<span className="font-display-lg text-headline-md tracking-tighter text-secondary">ARENA LIVE</span>
</div>
<nav className="hidden md:flex items-center gap-lg">
<Link to="/" className="font-headline-md text-headline-md text-secondary border-b-2 border-secondary pb-1 transition-all duration-300">Home</Link>
<Link to="/dashboard" className="font-headline-md text-headline-md text-on-surface-variant hover:text-on-surface transition-all duration-300">Dashboard</Link>
</nav>
<div className="flex items-center gap-md">
<button className="material-symbols-outlined text-on-surface-variant hover:text-secondary cursor-pointer">search</button>
<button onClick={() => navigate('/login')} className="bg-secondary text-on-secondary px-lg py-sm font-headline-md rounded-lg active:scale-95 transition-all duration-300">Login</button>
</div>
</header>
<main className="pt-20">
{/* Hero Section */}
<section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-grid-margin py-xl">
{/* Atmospheric Background */}
<div className="absolute inset-0 bg-surface-container-lowest z-0">
<div className="w-full h-full object-cover opacity-40 mix-blend-overlay" data-alt="A cinematic low-angle stadium shot at night with intense blue and lime green floodlights cutting through a misty atmosphere. High-contrast athletic textures and deep shadows create a dramatic sports broadcasting environment with a futuristic tech-aesthetic." style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaFGo9O9K99gs4YB71htbRFp9xs0I4CjMzvwNd4g8T2Z9voETtrmVgZ81J1G9InmB8yQYzujANgOkjF7i2H0EnHpPenFbePPHSbSgDQK19AbO97ki2XQANwrYfL5FIxwlqjZlA4sSXM0ZBBSuK77Yj8DlkMuPupl7bljBFOfQ2af1LxjZJUG7nsfMKsRdxgqPtsHwRa8Zx9wzD2eQhgkSkd4SfCx8sTFRW2eOaD76O84xd-KqIKJOBzpNM8iLbBmbvMGtgwei4ZcMf')` }}></div>
<div className="absolute inset-0 broadcast-mesh opacity-60"></div>
<div className="kinetic-scanline"></div>
</div>
{/* Content */}
<div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
<div className="flex items-center gap-sm mb-md px-md py-xs rounded-full bg-surface-container-highest border border-tertiary/30 animate-pulse">
<span className="w-2 h-2 rounded-full bg-tertiary pulse-live"></span>
<span className="font-label-mono text-label-mono text-tertiary tracking-widest uppercase">LIVE NOW</span>
</div>
<h2 className="font-display-lg text-headline-lg md:text-display-lg text-on-background mb-lg max-w-4xl">
                    National Throwball Championship Final
                </h2>
{/* Match Score Banner */}
<div className="flex flex-col md:flex-row items-center gap-xl md:gap-32 mb-xl">
{/* Team Hawks */}
<div className="flex flex-col items-center gap-md">
<div className="w-24 h-24 md:w-32 md:h-32 rounded-full glass-panel flex items-center justify-center p-md border-2 border-secondary/50">
<span className="material-symbols-outlined text-6xl text-secondary">flash_on</span>
</div>
<span className="font-headline-md text-on-background uppercase tracking-wider">Team Hawks</span>
</div>
{/* Score */}
<div className="flex flex-col items-center">
<div className="flex items-center gap-lg">
<span className="font-display-lg text-7xl md:text-9xl text-on-surface">15</span>
<span className="font-display-lg text-4xl md:text-6xl text-outline-variant">:</span>
<span className="font-display-lg text-7xl md:text-9xl text-on-surface">12</span>
</div>
<div className="font-label-mono text-label-mono text-on-surface-variant bg-surface-container py-xs px-md rounded-sm mt-md">SET 2 - ONGOING</div>
</div>
{/* Team Falcons */}
<div className="flex flex-col items-center gap-md">
<div className="w-24 h-24 md:w-32 md:h-32 rounded-full glass-panel flex items-center justify-center p-md border-2 border-tertiary/50">
<span className="material-symbols-outlined text-6xl text-tertiary">air</span>
</div>
<span className="font-headline-md text-on-background uppercase tracking-wider">Team Falcons</span>
</div>
</div>
<button className="group flex items-center gap-md bg-tertiary text-on-tertiary font-headline-md text-headline-md px-xl py-md rounded-lg hover:shadow-[0_0_30px_rgba(145,219,42,0.4)] transition-all duration-500 active:scale-95">
                    Enter Match Center
                    <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward_ios</span>
</button>
</div>
</section>
{/* Match Grid Section */}
<section className="max-w-7xl mx-auto px-grid-margin py-xl">
<div className="flex items-center justify-between mb-lg border-l-4 border-secondary pl-md">
<h3 className="font-headline-lg text-headline-lg text-on-background">Today's Action</h3>
<div className="flex gap-sm">
<span className="bg-surface-container-high px-md py-sm rounded-full font-label-mono text-on-surface-variant cursor-pointer hover:bg-secondary hover:text-on-secondary transition-colors">All Sports</span>
<span className="bg-surface-container-high px-md py-sm rounded-full font-label-mono text-on-surface-variant cursor-pointer">Live</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
{/* Card 1: Badminton (Upcoming) */}
<div className="glass-panel rounded-xl overflow-hidden group hover:border-secondary/40 transition-all duration-300">
<div className="p-md border-b border-white/5 flex justify-between items-center bg-white/5">
<span className="font-label-mono text-label-mono text-secondary-fixed">BADMINTON</span>
<span className="font-label-mono text-label-mono text-on-surface-variant flex items-center gap-xs">
<span className="material-symbols-outlined text-sm">schedule</span> 14:00
                        </span>
</div>
<div className="p-lg flex flex-col gap-lg">
<div className="flex justify-between items-center">
<div className="flex flex-col gap-sm">
<div className="flex items-center gap-md">
<div className="w-2 h-2 rounded-full bg-outline-variant"></div>
<span className="font-headline-md text-on-surface">Lin Dan</span>
</div>
<div className="flex items-center gap-md">
<div className="w-2 h-2 rounded-full bg-outline-variant"></div>
<span className="font-headline-md text-on-surface">Lee Chong Wei</span>
</div>
</div>
<div className="bg-surface-container-low p-md rounded-lg flex flex-col items-center">
<span className="font-label-mono text-xs text-on-surface-variant">ODDS</span>
<span className="font-score-display text-secondary">2.10</span>
</div>
</div>
<button className="w-full py-md border border-white/10 rounded-lg font-headline-md text-on-surface-variant group-hover:bg-white/5 group-hover:text-on-surface transition-all">Set Reminder</button>
</div>
</div>
{/* Card 2: Throwball (Live) */}
<div className="glass-panel rounded-xl overflow-hidden group border-tertiary/20 border-2 transition-all duration-300 relative">
<div className="absolute top-0 right-0 p-xs bg-tertiary text-on-tertiary font-label-mono text-[10px] uppercase tracking-tighter">LIVE</div>
<div className="p-md border-b border-white/5 flex justify-between items-center bg-tertiary/5">
<span className="font-label-mono text-label-mono text-tertiary">THROWBALL</span>
<span className="font-label-mono text-label-mono text-tertiary animate-pulse">3RD SET</span>
</div>
<div className="p-lg flex flex-col gap-lg">
<div className="space-y-md">
<div className="flex justify-between items-center">
<span className="font-headline-md text-on-surface">City Lions</span>
<span className="font-score-display text-on-surface">20</span>
</div>
<div className="flex justify-between items-center opacity-90">
<span className="font-headline-md text-on-surface">Desert Storm</span>
<span className="font-score-display text-on-surface">18</span>
</div>
</div>
<div className="h-1 bg-surface-container-highest w-full rounded-full overflow-hidden">
<div className="h-full bg-tertiary w-3/4 shadow-[0_0_10px_rgba(145,219,42,0.5)]"></div>
</div>
<button className="w-full py-md bg-tertiary text-on-tertiary rounded-lg font-headline-md active:scale-95 transition-all">Watch Stream</button>
</div>
</div>
{/* Card 3: Badminton (Final) */}
<div className="glass-panel rounded-xl overflow-hidden group hover:border-white/20 transition-all duration-300">
<div className="p-md border-b border-white/5 flex justify-between items-center bg-white/5">
<span className="font-label-mono text-label-mono text-on-surface-variant">BADMINTON</span>
<span className="font-label-mono text-label-mono text-on-error">FINAL SCORE</span>
</div>
<div className="p-lg flex flex-col gap-lg">
<div className="space-y-md">
<div className="flex justify-between items-center bg-surface-container-highest/30 p-sm rounded-lg border-l-4 border-tertiary">
<span className="font-headline-md text-on-surface flex items-center gap-sm">
                                    PV Sindhu
                                    <span className="material-symbols-outlined text-tertiary text-sm">emoji_events</span>
</span>
<span className="font-score-display text-tertiary">2</span>
</div>
<div className="flex justify-between items-center p-sm">
<span className="font-headline-md text-on-surface-variant">Akane Yamaguchi</span>
<span className="font-score-display text-on-surface-variant">1</span>
</div>
</div>
<div className="flex gap-sm">
<div className="flex-1 text-center font-label-mono text-[10px] text-on-surface-variant py-xs bg-white/5 rounded">21-18</div>
<div className="flex-1 text-center font-label-mono text-[10px] text-on-surface-variant py-xs bg-white/5 rounded">15-21</div>
<div className="flex-1 text-center font-label-mono text-[10px] text-on-surface-variant py-xs bg-white/5 rounded">21-19</div>
</div>
<button className="w-full py-md border border-white/10 rounded-lg font-headline-md text-on-surface-variant hover:bg-white/5 transition-all">View Highlights</button>
</div>
</div>
</div>
</section>
{/* Stats Bento Section */}
<section className="max-w-7xl mx-auto px-grid-margin py-xl mb-xl">
<div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-lg h-auto md:h-[600px]">
<div className="md:col-span-2 md:row-span-2 glass-panel p-xl flex flex-col justify-between relative overflow-hidden rounded-xl">
<div className="relative z-10">
<h4 className="font-headline-lg text-headline-lg text-secondary mb-md">Hawk's Dominance</h4>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-sm">Current win streak of 8 games with an average point difference of +14.2 in the final sets.</p>
<div className="space-y-lg">
<div className="flex justify-between items-end border-b border-white/5 pb-sm">
<span className="font-label-mono text-on-surface-variant">Win Probability</span>
<span className="font-score-display text-headline-md text-on-surface">68%</span>
</div>
<div className="flex justify-between items-end border-b border-white/5 pb-sm">
<span className="font-label-mono text-on-surface-variant">Service Accuracy</span>
<span className="font-score-display text-headline-md text-on-surface">92%</span>
</div>
</div>
</div>
<div className="absolute bottom-0 right-0 w-64 h-64 opacity-20 transform translate-x-10 translate-y-10">
<span className="material-symbols-outlined text-[300px] text-secondary">trending_up</span>
</div>
</div>
<div className="md:col-span-2 glass-panel p-lg flex items-center justify-between rounded-xl">
<div>
<span className="font-label-mono text-tertiary block mb-sm">MVP CANDIDATE</span>
<h4 className="font-headline-md text-on-surface">James "The Bolt" Miller</h4>
<p className="text-on-surface-variant font-body-md">24 Assists | 12 Direct Goals</p>
</div>
<div className="w-24 h-24 rounded-full overflow-hidden border-2 border-tertiary">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a focused male athlete in a high-tech athletic uniform. Dramatic side lighting from a lime green source highlights his features. The background is a dark, abstract sports arena with cinematic depth of field." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiDhRx-R2qoxsvBDStsIYq2ExBnD9_on0xWPyENdl3o31B2l5f6ttATaQaSSKym6qnxiT8-zCV-T_u2X9Brp5_NG5guiMvrTAiQD_2WZrf6rpy2sU00nm1NRCSr_qWIdM5-ntSI3jT_-54GSO0XWxlr1BL72GItiE-kMxqzdI2a-B94wAA1eJrcEUeanjZ5le3oVoQYEIFYfTLtiZeO9YfzyUUeexIwvsd8v3Dwel07UWJ4zVVDZKHy4vLSIqY_sTy-YLawVDe6oee"/>
</div>
</div>
<div className="glass-panel p-lg rounded-xl flex flex-col justify-center items-center gap-md">
<span className="material-symbols-outlined text-4xl text-secondary">groups</span>
<div className="text-center">
<span className="block font-score-display text-headline-md text-on-surface">42K</span>
<span className="font-label-mono text-xs text-on-surface-variant">LIVE VIEWERS</span>
</div>
</div>
<div className="glass-panel p-lg rounded-xl flex flex-col justify-center items-center gap-md">
<span className="material-symbols-outlined text-4xl text-on-error">local_fire_department</span>
<div className="text-center">
<span className="block font-score-display text-headline-md text-on-surface">9.8</span>
<span className="font-label-mono text-xs text-on-surface-variant">INTENSITY INDEX</span>
</div>
</div>
</div>
</section>
</main>
{/* Footer */}
<footer className="bg-surface-container-lowest py-xl border-t border-white/5">
<div className="max-w-7xl mx-auto px-grid-margin flex flex-col md:flex-row justify-between items-center gap-md">
<div className="flex flex-col gap-sm">
<span className="font-display-lg text-headline-md text-secondary">ARENA LIVE</span>
<span className="font-body-md text-body-md text-on-surface-variant">© 2024 ARENA LIVE BROADCAST. ALL RIGHTS RESERVED.</span>
</div>
<div className="flex flex-wrap justify-center gap-lg">
<a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="#">Privacy Policy</a>
<a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="#">Terms of Service</a>
<a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="#">Contact Support</a>
<a className="font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors" href="#">Broadcast Rights</a>
</div>
<div className="flex gap-md">
<button className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:text-secondary transition-colors cursor-pointer">
<span className="material-symbols-outlined text-md">public</span>
</button>
<button className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:text-secondary transition-colors cursor-pointer">
<span className="material-symbols-outlined text-md">share</span>
</button>
</div>
</div>
</footer>


        </div>
    );
};

export default Home;

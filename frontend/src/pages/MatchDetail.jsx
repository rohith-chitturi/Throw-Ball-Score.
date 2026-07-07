import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { io } from 'socket.io-client';
import { Trophy, Shield, Clock, MapPin, ChevronLeft, Wifi, Share2, Activity, Medal, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const MatchDetail = () => {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const { width, height } = useWindowSize();

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const res = await axios.get(`/matches/${id}`);
                setMatch(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();

        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        const socket = io(socketUrl, {
            transports: ['websocket'],
            upgrade: false
        });
        socket.emit('joinMatch', id);

        socket.on('scoreUpdate', (updatedMatch) => {
            setMatch(updatedMatch);
        });

        socket.on('statusUpdate', (updatedMatch) => {
            setMatch(updatedMatch);
        });

        return () => {
            socket.emit('leaveMatch', id);
            socket.disconnect();
        };
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
            <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin shadow-[0_0_20px_theme(colors.primary)]"></div>
            <p className="text-slate-400 font-display font-bold uppercase tracking-[0.3em] animate-pulse">Establishing Link</p>
        </div>
    );

    if (!match) return <div className="flex items-center justify-center min-h-[80vh] text-red-500 font-bold uppercase tracking-widest">Feed Not Available</div>;

    const currentSet = match.sets[match.currentSet - 1] || match.sets[0];
    const teamASets = match.sets.filter(s => s.winner === match.teamA._id || (s.winner && s.winner._id === match.teamA._id)).length;
    const teamBSets = match.sets.filter(s => s.winner === match.teamB._id || (s.winner && s.winner._id === match.teamB._id)).length;
    
    const isBadminton = match.sport === 'badminton';

    
    return (
        <div className="bg-background text-on-background font-body-md overflow-x-hidden min-h-screen">
            
{/* TopNavBar */}
<header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-3 bg-surface/95 backdrop-blur-md border-b border-outline-variant shadow-md">
<div className="flex items-center gap-8">
<span className="text-xl font-black text-primary italic uppercase tracking-tighter">Throwball Live</span>
<nav className="hidden md:flex gap-6 items-center">
<Link to="/" className="font-label text-label-lg text-primary border-b-2 border-primary pb-1 hover:text-primary transition-colors active:scale-95 duration-150">Live</Link>
<Link to="/" className="font-label text-label-lg text-on-surface-variant hover:text-primary transition-colors active:scale-95 duration-150">Matches</Link>
<a className="font-label text-label-lg text-on-surface-variant hover:text-primary transition-colors active:scale-95 duration-150" href="#">Standings</a>
<a className="font-label text-label-lg text-on-surface-variant hover:text-primary transition-colors active:scale-95 duration-150" href="#">News</a>
</nav>
</div>
<div className="flex items-center gap-4">
<div className="relative hidden sm:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input className="bg-surface-container border border-outline-variant rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-48 lg:w-64" placeholder="Search matches..." type="text"/>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">person</span>
</button>
</div>
</header>
<main className="flex-grow pt-24 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto w-full">
{/* Main Grid Layout */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
{/* Left Sidebar: {match.teamA.name} Lineup */}
<aside className="hidden lg:flex lg:col-span-3 flex-col gap-6">
<div className="bg-surface-container-high rounded-xl p-5 border border-outline-variant/30">
<div className="flex items-center gap-3 mb-6">
<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary-container" style={{}}>cable</span>
</div>
<div>
<h3 className="font-headline font-bold text-on-surface">{match.teamA.name}</h3>
<p className="text-xs text-on-surface-variant font-label">Starters: 7/7</p>
</div>
</div>
<ul className="space-y-4">
<li className="flex items-center justify-between p-3 rounded-lg bg-surface-variant/40 border border-outline-variant/20">
<div className="flex items-center gap-3">
<span className="font-bold text-primary w-6">09</span>
<span className="font-medium text-sm">Marcus Chen</span>
</div>
<span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded uppercase font-bold">C</span>
</li>
<li className="flex items-center justify-between p-3">
<div className="flex items-center gap-3">
<span className="font-bold text-on-surface-variant w-6 text-sm">22</span>
<span className="font-medium text-sm">Sarah Jenkins</span>
</div>
</li>
<li className="flex items-center justify-between p-3">
<div className="flex items-center gap-3">
<span className="font-bold text-on-surface-variant w-6 text-sm">04</span>
<span className="font-medium text-sm">David Rossi</span>
</div>
</li>
<li className="flex items-center justify-between p-3">
<div className="flex items-center gap-3">
<span className="font-bold text-on-surface-variant w-6 text-sm">11</span>
<span className="font-medium text-sm">Elena Petrova</span>
</div>
</li>
<li className="flex items-center justify-between p-3">
<div className="flex items-center gap-3">
<span className="font-bold text-on-surface-variant w-6 text-sm">33</span>
<span className="font-medium text-sm">Samir Khan</span>
</div>
</li>
</ul>
</div>
{/* Live Stats Mini-Card */}
<div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30">
<h4 className="font-label text-xs uppercase font-bold text-on-surface-variant mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-sm">analytics</span>
                        Team Advantage
                    </h4>
<div className="space-y-3">
<div className="flex justify-between text-xs mb-1">
<span>Win Probability</span>
<span className="text-primary font-bold">64%</span>
</div>
<div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{}}></div>
</div>
</div>
</div>
</aside>
{/* Center Content: Massive Scoreboard & Timeline */}
<div className="lg:col-span-6 flex flex-col gap-8">
{/* Massive Central Scoreboard */}
<section className="scoreboard-gradient rounded-3xl border border-primary/20 p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
<div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
<div className="w-full h-full bg-cover" data-alt="A subtle, high-tech geometric grid pattern with glowing blue neon lines and data visualization elements, set against a deep navy blue background to create a premium sports broadcasting atmosphere." style={{}}></div>
</div>
<div className="relative z-10">
<div className="flex items-center justify-center gap-2 mb-8">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container/20 text-error text-xs font-bold uppercase tracking-wider animate-live">
<span className="w-2 h-2 rounded-full bg-error"></span>
                                Live
                            </span>
<span className="text-on-surface-variant text-sm font-label">• Pro League Week 8</span>
</div>
<div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 max-w-2xl mx-auto">
{/* Team A */}
<div className="flex-1 flex flex-col items-center gap-4">
<div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-primary-container/20 flex items-center justify-center border border-primary/30">
<span className="material-symbols-outlined text-5xl md:text-7xl text-primary" style={{}}>cable</span>
</div>
<h2 className="font-headline font-black text-xl md:text-2xl tracking-tight uppercase">{match.teamA.name}</h2>
</div>
{/* Score Display */}
<div className="flex flex-col items-center">
<div className="flex items-center gap-6 md:gap-10">
<span className="text-7xl md:text-9xl font-black glow-primary text-primary tracking-tighter">{currentSet?.teamAScore || 0}</span>
<span className="text-4xl md:text-6xl font-black text-on-surface-variant/40">—</span>
<span className="text-7xl md:text-9xl font-black text-on-surface tracking-tighter">{currentSet?.teamBScore || 0}</span>
</div>
</div>
{/* Team B */}
<div className="flex-1 flex flex-col items-center gap-4">
<div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-surface-variant/40 flex items-center justify-center border border-outline-variant">
<span className="material-symbols-outlined text-5xl md:text-7xl text-on-surface-variant" style={{}}>rocket_launch</span>
</div>
<h2 className="font-headline font-black text-xl md:text-2xl tracking-tight uppercase">{match.teamB.name}</h2>
</div>
</div>
<div className="mt-10 inline-flex flex-col items-center gap-2">
<span className="px-6 py-2 rounded-xl bg-surface-container-highest border border-outline-variant text-primary font-bold tracking-wide">
                                Set {match.currentSet} - {match.status === 'live' ? 'Ongoing' : 'Finished'}
                            </span>
<p className="text-on-surface-variant text-sm mt-2">Sets: {match.teamA.name} {teamASets} - {teamBSets} {match.teamB.name}</p>
</div>
</div>
</section>
{/* Match Timeline Section */}
<section className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
<div className="flex items-center justify-between mb-6">
<h3 className="font-headline font-bold text-lg flex items-center gap-2">
<span className="material-symbols-outlined text-primary">history</span>
                            Match Timeline
                        </h3>
<button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline transition-all">Filter Events</button>
</div>
<div className="space-y-4 max-h-[400px] overflow-y-auto timeline-scroll pr-2">
{/* Event 1 */}
<div className="flex gap-4 items-start group">
<div className="flex flex-col items-center pt-1">
<div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10"></div>
<div className="w-px h-16 bg-outline-variant mt-2 group-last:hidden"></div>
</div>
<div className="flex-grow bg-surface-container-high rounded-xl p-4 border border-outline-variant/20 group-hover:border-primary/40 transition-colors">
<div className="flex justify-between items-center mb-1">
<span className="text-[10px] font-bold text-primary-fixed uppercase">24:12</span>
<span className="text-[10px] font-bold bg-primary text-on-primary px-2 py-0.5 rounded-full">+1 Hawks</span>
</div>
<p className="text-on-surface font-medium">Hawks score via smash</p>
<p className="text-xs text-on-surface-variant mt-1">Marcus Chen executes a powerful downward throw past Falcons' front line.</p>
</div>
</div>
{/* Event 2 */}
<div className="flex gap-4 items-start group">
<div className="flex flex-col items-center pt-1">
<div className="w-2 h-2 rounded-full bg-on-surface-variant ring-4 ring-on-surface-variant/10"></div>
<div className="w-px h-16 bg-outline-variant mt-2 group-last:hidden"></div>
</div>
<div className="flex-grow bg-surface-container-high/60 rounded-xl p-4 border border-outline-variant/10">
<div className="flex justify-between items-center mb-1">
<span className="text-[10px] font-bold text-on-surface-variant uppercase">22:45</span>
<span className="text-[10px] font-bold bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full">+1 Falcons</span>
</div>
<p className="text-on-surface font-medium">Falcons score</p>
<p className="text-xs text-on-surface-variant mt-1">Line fault by Hawks defense gives Falcons the advantage point.</p>
</div>
</div>
{/* Event 3 */}
<div className="flex gap-4 items-start group">
<div className="flex flex-col items-center pt-1">
<div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10"></div>
<div className="w-px h-16 bg-outline-variant mt-2 group-last:hidden"></div>
</div>
<div className="flex-grow bg-surface-container-high rounded-xl p-4 border border-outline-variant/20">
<div className="flex justify-between items-center mb-1">
<span className="text-[10px] font-bold text-primary-fixed uppercase">21:30</span>
<span className="text-[10px] font-bold bg-primary text-on-primary px-2 py-0.5 rounded-full">+1 Hawks</span>
</div>
<p className="text-on-surface font-medium">Hawks service ace</p>
<p className="text-xs text-on-surface-variant mt-1">Elena Petrova's serve touches the top of the net and drops unreturned.</p>
</div>
</div>
</div>
</section>
</div>
{/* Right Sidebar: {match.teamB.name} Lineup */}
<aside className="lg:col-span-3 flex flex-col gap-6">
<div className="bg-surface-container-high rounded-xl p-5 border border-outline-variant/30">
<div className="flex items-center gap-3 mb-6">
<div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant" style={{}}>rocket_launch</span>
</div>
<div>
<h3 className="font-headline font-bold text-on-surface">{match.teamB.name}</h3>
<p className="text-xs text-on-surface-variant font-label">Starters: 7/7</p>
</div>
</div>
<ul className="space-y-4">
<li className="flex items-center justify-between p-3 rounded-lg bg-surface-variant/40 border border-outline-variant/20">
<div className="flex items-center gap-3">
<span className="font-bold text-on-surface w-6">01</span>
<span className="font-medium text-sm">Liam O'Connor</span>
</div>
<span className="text-[10px] bg-outline-variant text-on-surface px-2 py-0.5 rounded uppercase font-bold">C</span>
</li>
<li className="flex items-center justify-between p-3">
<div className="flex items-center gap-3">
<span className="font-bold text-on-surface-variant w-6 text-sm">07</span>
<span className="font-medium text-sm">Zoe Rodriguez</span>
</div>
</li>
<li className="flex items-center justify-between p-3">
<div className="flex items-center gap-3">
<span className="font-bold text-on-surface-variant w-6 text-sm">18</span>
<span className="font-medium text-sm">Kenji Tanaka</span>
</div>
</li>
<li className="flex items-center justify-between p-3">
<div className="flex items-center gap-3">
<span className="font-bold text-on-surface-variant w-6 text-sm">25</span>
<span className="font-medium text-sm">Maya Patel</span>
</div>
</li>
<li className="flex items-center justify-between p-3">
<div className="flex items-center gap-3">
<span className="font-bold text-on-surface-variant w-6 text-sm">03</span>
<span className="font-medium text-sm">Eric Dubois</span>
</div>
</li>
</ul>
</div>
{/* Match Venue Context */}
<div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/30">
<div className="h-32 bg-cover bg-center" data-alt="A high-angle architectural shot of a modern indoor sports arena, focusing on a brightly lit throwball court with blue and orange floor markings. The stadium seating is filled with a blurred crowd, and professional lighting rigs are visible on the ceiling, creating a vibrant, high-energy match day environment." style={{}}></div>
<div className="p-4">
<p className="text-xs font-bold text-primary uppercase mb-1">Venue</p>
<h4 className="font-bold text-sm">Apex Sports Arena</h4>
<p className="text-xs text-on-surface-variant">Metropolis City, NY</p>
<div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant">
<span className="material-symbols-outlined text-sm">group</span>
<span>Attendance: 4,200 (Full House)</span>
</div>
</div>
</div>
</aside>
</div>
</main>
{/* BottomNavBar (Mobile Only) */}
<nav className="lg:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface-container-highest dark:bg-surface-container-highest rounded-t-xl border-t border-outline-variant shadow-2xl">
<a className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-4 py-1" href="#">
<span className="material-symbols-outlined" style={{}}>live_tv</span>
<span className="font-label text-label-small">Live</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant active:scale-90 transition-transform" href="#">
<span className="material-symbols-outlined">history</span>
<span className="font-label text-label-small">Replays</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant active:scale-90 transition-transform" href="#">
<span className="material-symbols-outlined">analytics</span>
<span className="font-label text-label-small">Stats</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant active:scale-90 transition-transform" href="#">
<span className="material-symbols-outlined">account_circle</span>
<span className="font-label text-label-small">Profile</span>
</a>
</nav>
{/* Footer */}
<footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant">
<div className="flex flex-col items-center md:items-start gap-2">
<span className="text-on-surface font-bold">Throwball Pro League</span>
<p className="font-body text-body-small text-on-surface-variant">© 2024 Throwball Pro League. All Rights Reserved.</p>
</div>
<div className="flex flex-wrap justify-center gap-6">
<a className="font-body text-body-small text-on-surface-variant hover:text-primary underline transition-all opacity-100 hover:opacity-80" href="#">Terms of Service</a>
<a className="font-body text-body-small text-on-surface-variant hover:text-primary underline transition-all opacity-100 hover:opacity-80" href="#">Privacy Policy</a>
<a className="font-body text-body-small text-on-surface-variant hover:text-primary underline transition-all opacity-100 hover:opacity-80" href="#">Contact Support</a>
<a className="font-body text-body-small text-on-surface-variant hover:text-primary underline transition-all opacity-100 hover:opacity-80" href="#">Sponsorships</a>
</div>
</footer>


        </div>
    );
};
export default MatchDetail;

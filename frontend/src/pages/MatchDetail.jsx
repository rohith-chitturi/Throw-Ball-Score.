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

{/* Center Content: Massive Scoreboard & Timeline */}
<div className="lg:col-span-12 flex flex-col gap-8">
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
<span className="text-on-surface-variant text-sm font-label">• {match.tournament?.name || 'Tournament'} • {match.venue || 'Arena'}</span>
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
</div>
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

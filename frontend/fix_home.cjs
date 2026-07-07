const fs = require('fs');

let newHome = fs.readFileSync('src/pages/Home.jsx', 'utf8');

const logic = `import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { io } from 'socket.io-client';

const Home = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSport, setSelectedSport] = useState('throwball');

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await axios.get('/matches');
                setMatches(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();

        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        const socket = io(socketUrl, {
            transports: ['websocket'],
            upgrade: false
        });
        socket.emit('joinMatch', 'matches');

        const updateMatchList = (updatedMatch) => {
            setMatches(prev => prev.map(m => m._id === updatedMatch._id ? updatedMatch : m));
        };

        socket.on('scoreUpdate', updateMatchList);
        socket.on('statusUpdate', updateMatchList);

        return () => socket.disconnect();
    }, []);

    const filteredMatches = matches.filter(m => m.sport === selectedSport || (!m.sport && selectedSport === 'throwball'));
    const liveMatches = filteredMatches.filter(m => m.status === 'live');
    const recentMatches = filteredMatches.filter(m => m.status === 'completed' || m.status === 'scheduled');
`;

// Now we need to extract the JSX from newHome.
const match = newHome.match(/return \(\s*<div className="bg-background([\s\S]*)/);
if (!match) process.exit(1);

let returnJSX = `    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
            <p className="text-slate-400 font-display font-bold uppercase tracking-[0.3em] animate-pulse">Initializing Broadcast</p>
        </div>
    );

    return (
        <div className="bg-background${match[1]}`;

// We want to replace the hardcoded "Today's Action" grid with a dynamic map.
// The grid starts with: <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
// We will replace everything inside that grid with our map over liveMatches and recentMatches.

const gridStart = '<div className="grid grid-cols-1 md:grid-cols-3 gap-lg">';
const gridStartIdx = returnJSX.indexOf(gridStart);
const sectionEndIdx = returnJSX.indexOf('</section>', gridStartIdx);

const newGrid = gridStart + `
                    {liveMatches.map(m => (
                        <div key={m._id} onClick={() => navigate('/match/' + m._id)} className="glass-panel rounded-xl overflow-hidden group border-tertiary/20 border-2 transition-all duration-300 relative cursor-pointer">
                            <div className="absolute top-0 right-0 p-xs bg-tertiary text-on-tertiary font-label-mono text-[10px] uppercase tracking-tighter">LIVE</div>
                            <div className="p-md border-b border-white/5 flex justify-between items-center bg-tertiary/5">
                                <span className="font-label-mono text-label-mono text-tertiary">{m.sport.toUpperCase()}</span>
                                <span className="font-label-mono text-label-mono text-tertiary animate-pulse">SET {m.currentSet}</span>
                            </div>
                            <div className="p-lg flex flex-col gap-lg">
                                <div className="space-y-md">
                                    <div className="flex justify-between items-center">
                                        <span className="font-headline-md text-on-surface">{m.teamA.name}</span>
                                        <span className="font-score-display text-on-surface">{m.sets[m.currentSet - 1]?.teamAScore || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center opacity-90">
                                        <span className="font-headline-md text-on-surface">{m.teamB.name}</span>
                                        <span className="font-score-display text-on-surface">{m.sets[m.currentSet - 1]?.teamBScore || 0}</span>
                                    </div>
                                </div>
                                <button className="w-full py-md bg-tertiary text-on-tertiary rounded-lg font-headline-md active:scale-95 transition-all">Watch Stream</button>
                            </div>
                        </div>
                    ))}
                    
                    {recentMatches.map(m => (
                        <div key={m._id} onClick={() => navigate('/match/' + m._id)} className="glass-panel rounded-xl overflow-hidden group hover:border-white/20 transition-all duration-300 cursor-pointer">
                            <div className="p-md border-b border-white/5 flex justify-between items-center bg-white/5">
                                <span className="font-label-mono text-label-mono text-on-surface-variant">{m.sport.toUpperCase()}</span>
                                <span className="font-label-mono text-label-mono text-on-surface-variant flex items-center gap-xs">
                                    <span className="material-symbols-outlined text-sm">schedule</span> {new Date(m.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            <div className="p-lg flex flex-col gap-lg">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-sm">
                                        <div className="flex items-center gap-md">
                                            <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                                            <span className="font-headline-md text-on-surface">{m.teamA.name}</span>
                                        </div>
                                        <div className="flex items-center gap-md">
                                            <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                                            <span className="font-headline-md text-on-surface">{m.teamB.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full py-md border border-white/10 rounded-lg font-headline-md text-on-surface-variant group-hover:bg-white/5 group-hover:text-on-surface transition-all">View Details</button>
                            </div>
                        </div>
                    ))}
                    {filteredMatches.length === 0 && (
                        <div className="col-span-1 md:col-span-3 text-center py-20 text-on-surface-variant">
                            No matches found for {selectedSport}.
                        </div>
                    )}
                </div>
`;

returnJSX = returnJSX.substring(0, gridStartIdx) + newGrid + returnJSX.substring(sectionEndIdx);

returnJSX = returnJSX.replace(
    /<span className="bg-surface-container-high px-md py-sm rounded-full font-label-mono text-on-surface-variant cursor-pointer hover:bg-secondary hover:text-on-secondary transition-colors">All Sports<\/span>/,
    "<span onClick={() => setSelectedSport('throwball')} className={`px-md py-sm rounded-full font-label-mono cursor-pointer transition-colors ${selectedSport === 'throwball' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary/50'}`}>Throwball</span>"
);
returnJSX = returnJSX.replace(
    /<span className="bg-surface-container-high px-md py-sm rounded-full font-label-mono text-on-surface-variant cursor-pointer">Live<\/span>/,
    "<span onClick={() => setSelectedSport('badminton')} className={`px-md py-sm rounded-full font-label-mono cursor-pointer transition-colors ${selectedSport === 'badminton' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary/50'}`}>Badminton</span>"
);


// Hero banner dynamics
// If there's a live match, show it in the hero banner. Otherwise, default.
// The hero banner has "National Throwball Championship Final"
const heroTeamH = /<span className="font-headline-md text-on-background uppercase tracking-wider">Team Hawks<\/span>/;
const heroTeamF = /<span className="font-headline-md text-on-background uppercase tracking-wider">Team Falcons<\/span>/;
const scoreRegex = /<span className="font-display-lg text-7xl md:text-9xl text-on-surface">15<\/span>[\s\S]*?<span className="font-display-lg text-7xl md:text-9xl text-on-surface">12<\/span>/;
returnJSX = returnJSX.replace(heroTeamH, "<span className=\"font-headline-md text-on-background uppercase tracking-wider\">{liveMatches[0] ? liveMatches[0].teamA.name : 'Team Hawks'}</span>");
returnJSX = returnJSX.replace(heroTeamF, "<span className=\"font-headline-md text-on-background uppercase tracking-wider\">{liveMatches[0] ? liveMatches[0].teamB.name : 'Team Falcons'}</span>");
returnJSX = returnJSX.replace(/National Throwball Championship Final/, "{liveMatches[0] ? liveMatches[0].tournament?.name || 'Live Match' : 'National Throwball Championship Final'}");
returnJSX = returnJSX.replace(scoreRegex, `<span className="font-display-lg text-7xl md:text-9xl text-on-surface">{liveMatches[0] ? (liveMatches[0].sets[liveMatches[0].currentSet - 1]?.teamAScore || 0) : '0'}</span>
<span className="font-display-lg text-4xl md:text-6xl text-outline-variant">:</span>
<span className="font-display-lg text-7xl md:text-9xl text-on-surface">{liveMatches[0] ? (liveMatches[0].sets[liveMatches[0].currentSet - 1]?.teamBScore || 0) : '0'}</span>`);
returnJSX = returnJSX.replace(/SET 2 - ONGOING/, "{liveMatches[0] ? 'SET ' + liveMatches[0].currentSet + ' - ONGOING' : 'NO LIVE MATCHES'}");
returnJSX = returnJSX.replace(/<button className="group flex items-center gap-md bg-tertiary text-on-tertiary font-headline-md text-headline-md px-xl py-md rounded-lg hover:shadow-\[0_0_30px_rgba\(145,219,42,0\.4\)\] transition-all duration-500 active:scale-95">[\s\S]*?<\/button>/, 
`<button onClick={() => liveMatches[0] && navigate('/match/' + liveMatches[0]._id)} className="group flex items-center gap-md bg-tertiary text-on-tertiary font-headline-md text-headline-md px-xl py-md rounded-lg hover:shadow-[0_0_30px_rgba(145,219,42,0.4)] transition-all duration-500 active:scale-95">
    Enter Match Center
    <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward_ios</span>
</button>`);

fs.writeFileSync('src/pages/Home.jsx', logic + returnJSX);
console.log('Fixed Home.jsx');

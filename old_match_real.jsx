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
        <div className="max-w-7xl mx-auto space-y-8 pb-32">
            {match.matchWinner && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    <Confetti
                        width={width}
                        height={height}
                        recycle={false}
                        numberOfPieces={500}
                        gravity={0.15}
                        colors={isBadminton ? ['#8b5cf6', '#d946ef', '#fbbf24', '#ffffff'] : ['#10b981', '#3b82f6', '#fbbf24', '#ffffff']}
                    />
                </div>
            )}
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-[100px] z-40 bg-charcoal/80 backdrop-blur-lg py-4 px-4 rounded-3xl border border-white/5">
                <Link to="/" className="flex items-center text-slate-400 hover:text-white transition-colors group">
                    <div className="bg-white/5 p-2 rounded-xl mr-3 group-hover:bg-white/10 transition-colors border border-white/5">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-sm">Return to Hub</span>
                </Link>
                <div className="flex items-center space-x-4">
                    <button className="bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-xl transition-colors text-slate-400 hover:text-white group">
                        <Share2 size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <div className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border ${isBadminton ? 'bg-badminton/10 text-badminton border-badminton/20 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]'}`}>
                        <Wifi size={14} className="animate-pulse" />
                        <span>Live Sync Active</span>
                    </div>
                </div>
            </header>

            {/* FULL-SCREEN BROADCAST SCOREBOARD */}
            <div className="relative min-h-[70vh] flex flex-col items-center justify-center">
                {/* Ambient Broadcast Lighting */}
                <div className="absolute inset-0 overflow-hidden rounded-[4rem] pointer-events-none -z-10">
                    <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className={`absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[150px] rounded-full ${isBadminton ? 'bg-badminton/20' : 'bg-primary/20'}`} />
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full" />
                </div>

                <div className="w-full">
                    <div className="premium-glass-panel rounded-[3rem] md:rounded-[4rem] overflow-hidden relative border-t border-t-white/20">
                        {/* Status Header */}
                        <div className="bg-gradient-to-b from-white/5 to-transparent p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/5">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${isBadminton ? 'bg-badminton/20 text-badminton' : 'bg-primary/20 text-primary'}`}>
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <div className="text-white font-display font-black italic uppercase tracking-tighter text-xl md:text-2xl">{match.tournament?.name}</div>
                                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">{isBadminton ? 'Badminton Championship' : 'Throwball Championship'}</div>
                                </div>
                            </div>
                            
                            {match.status === 'live' && (
                                <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className="bg-red-500/20 text-red-500 border border-red-500/30 px-6 py-2 rounded-full flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Live Broadcast</span>
                                </motion.div>
                            )}

                            <div className="flex items-center space-x-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5"><MapPin size={14} className={isBadminton ? 'text-badminton' : 'text-primary'} /> {match.venue}</span>
                            </div>
                        </div>

                        {/* SCORE ARENA */}
                        <div className="p-4 sm:p-8 md:p-12 relative">
                            <div className="flex flex-col xl:flex-row justify-between items-center gap-12 xl:gap-4 relative z-10">
                                
                                {/* TEAM A */}
                                <div className="flex-1 flex flex-col xl:flex-row items-center gap-6 text-center xl:text-left w-full">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={`w-20 h-20 sm:w-32 sm:h-32 xl:w-40 xl:h-40 bg-gradient-to-br from-charcoal to-black rounded-full flex items-center justify-center font-display font-black text-4xl sm:text-6xl xl:text-7xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border-2 relative flex-shrink-0 group ${isBadminton ? 'border-badminton' : 'border-primary'}`}
                                    >
                                        <span className="text-white drop-shadow-lg">{match.teamA?.shortName?.[0] || 'A'}</span>
                                        <div className={`absolute -bottom-2 right-4 text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-black transition-transform group-hover:scale-110 ${isBadminton ? 'bg-badminton shadow-[0_0_20px_#8b5cf6]' : 'bg-primary shadow-[0_0_20px_#10b981]'}`}>
                                            {teamASets}
                                        </div>
                                    </motion.div>
                                    <div className="space-y-2 flex-1 w-full max-w-xs mx-auto xl:mx-0">
                                        <div className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase">Home Team</div>
                                        <h2 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-black uppercase tracking-tighter leading-none break-words">{match.teamA.name}</h2>
                                    </div>
                                    
                                    {/* Team A Score */}
                                    <div className="xl:w-1/3 flex justify-center xl:justify-end pr-0 xl:pr-4">
                                        <AnimatePresence mode="popLayout">
                                            <motion.div
                                                key={`teamA-score-${currentSet?.teamAScore}`}
                                                initial={{ y: -50, opacity: 0, scale: 0.5 }}
                                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                                className={`text-7xl sm:text-8xl md:text-9xl xl:text-[10rem] font-display font-black leading-none tracking-tighter tabular-nums ${isBadminton ? 'text-badminton drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]' : 'text-primary drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]'}`}
                                            >
                                                {currentSet?.teamAScore || 0}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* VS Divider */}
                                <div className="hidden xl:flex flex-col items-center justify-center px-8 relative">
                                    <div className="w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                                    <div className="my-6 text-slate-600 font-display font-black italic text-4xl">VS</div>
                                    <div className="w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                                </div>

                                {/* TEAM B */}
                                <div className="flex-1 flex flex-col xl:flex-row-reverse items-center gap-6 text-center xl:text-right w-full">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-20 h-20 sm:w-32 sm:h-32 xl:w-40 xl:h-40 bg-gradient-to-br from-charcoal to-black rounded-full flex items-center justify-center font-display font-black text-4xl sm:text-6xl xl:text-7xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border-2 border-slate-700 relative flex-shrink-0 group"
                                    >
                                        <span className="text-white drop-shadow-lg">{match.teamB?.shortName?.[0] || 'B'}</span>
                                        <div className="absolute -bottom-2 left-4 bg-slate-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-black shadow-lg transition-transform group-hover:scale-110">
                                            {teamBSets}
                                        </div>
                                    </motion.div>
                                    <div className="space-y-2 flex-1 w-full max-w-xs mx-auto xl:mx-0">
                                        <div className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase">Away Team</div>
                                        <h2 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-black uppercase tracking-tighter leading-none break-words">{match.teamB.name}</h2>
                                    </div>

                                    {/* Team B Score */}
                                    <div className="xl:w-1/3 flex justify-center xl:justify-start pl-0 xl:pl-4">
                                        <AnimatePresence mode="popLayout">
                                            <motion.div
                                                key={`teamB-score-${currentSet?.teamBScore}`}
                                                initial={{ y: 50, opacity: 0, scale: 0.5 }}
                                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                                className="text-7xl sm:text-8xl md:text-9xl xl:text-[10rem] font-display font-black text-white leading-none tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                            >
                                                {currentSet?.teamBScore || 0}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Set Tracker Indicator */}
                            <div className="mt-16 flex flex-col items-center">
                                <div className="text-slate-500 font-black text-xs uppercase tracking-[0.5em] mb-4">Set {match.currentSet} Progress</div>
                                <div className="flex gap-4">
                                    {match.sets.map((s, i) => {
                                        const isAWin = s.winner === match.teamA._id || s.winner?._id === match.teamA._id;
                                        const isBWin = s.winner === match.teamB._id || s.winner?._id === match.teamB._id;
                                        
                                        let dotClass = 'bg-slate-800 border-white/5';
                                        if (s.isCompleted) {
                                            if (isAWin) {
                                                dotClass = isBadminton ? 'bg-badminton shadow-[0_0_15px_#8b5cf6] border-badminton' : 'bg-primary shadow-[0_0_15px_#10b981] border-primary';
                                            }
                                            else if (isBWin) {
                                                dotClass = 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] border-white';
                                            }
                                        } else if (i + 1 === match.currentSet) {
                                            dotClass = 'bg-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.5)] border-orange-500 animate-pulse';
                                        }

                                        return (
                                            <div key={`summary-set-${i}`} className="flex flex-col items-center group">
                                                <div className={`w-12 h-4 rounded-full border transition-all duration-500 ${dotClass}`} />
                                                <span className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">SET {i + 1}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Match Conclusion */}
                            {match.matchWinner && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    className={`absolute inset-0 z-20 bg-charcoal/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 rounded-[inherit] border-4 border-gold shadow-[0_0_100px_theme(colors.gold/0.2)]`}
                                >
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gold/10 px-6 py-2 rounded-full border border-gold/30 text-xs font-black text-gold tracking-widest uppercase">Match Conclusion</div>
                                    <Medal className="text-gold mb-6 animate-float drop-shadow-[0_0_20px_theme(colors.gold/0.5)]" size={80} strokeWidth={1} />
                                    <h3 className="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter mb-4 text-center">
                                        <span className="text-gold block mb-2">Victory</span>
                                        {match.matchWinner === match.teamA._id || match.matchWinner?._id === match.teamA._id ? match.teamA.name : match.teamB.name}
                                    </h3>
                                    <p className="text-slate-400 font-bold tracking-[0.3em] uppercase text-sm mt-4">Tournament Match Decided</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* BROADCAST STATS PANELS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {match.sets.map((set, idx) => (
                    <div key={`set-stat-${idx}`} className="premium-glass p-8 rounded-[2.5rem] relative overflow-hidden group hover-lift">
                        {/* Glow effect based on completion */}
                        <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-500 ${set.isCompleted ? (set.winner === match.teamA._id || set.winner?._id === match.teamA._id ? (isBadminton ? 'bg-badminton shadow-[0_0_20px_#8b5cf6]' : 'bg-primary shadow-[0_0_20px_#10b981]') : 'bg-white shadow-[0_0_20px_rgba(255,255,255,1)]') : (idx + 1 === match.currentSet ? 'bg-orange-500 shadow-[0_0_20px_theme(colors.orange.500)]' : 'bg-transparent')}`} />

                        <div className="flex justify-between items-center mb-8">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Set {set.setNumber}
                            </span>
                            {set.isCompleted && <div className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5">Final</div>}
                            {idx + 1 === match.currentSet && !match.matchWinner && <div className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2 animate-pulse" /> Live</div>}
                        </div>

                        <div className="space-y-6 relative">
                            <div className="flex justify-between items-center relative z-10">
                                <span className="font-bold text-lg text-white">{match.teamA.shortName}</span>
                                <span className={`text-5xl font-display font-black tracking-tighter ${(set.winner === match.teamA._id || set.winner?._id === match.teamA._id) ? (isBadminton ? 'text-badminton' : 'text-primary') : 'text-slate-500'}`}>{set.teamAScore}</span>
                            </div>
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <div className="flex justify-between items-center relative z-10">
                                <span className="font-bold text-lg text-white">{match.teamB.shortName}</span>
                                <span className={`text-5xl font-display font-black tracking-tighter ${(set.winner === match.teamB._id || set.winner?._id === match.teamB._id) ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-slate-500'}`}>{set.teamBScore}</span>
                            </div>
                            
                            {/* Watermark winner */}
                            {set.isCompleted && (
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-8xl opacity-[0.03] pointer-events-none -rotate-12 whitespace-nowrap ${(set.winner === match.teamA._id || set.winner?._id === match.teamA._id) ? (isBadminton ? 'text-badminton' : 'text-primary') : 'text-white'}`}>
                                    WIN
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* SQUAD ROSTERS (Broadcast lower-thirds style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                {/* Team A Roster */}
                <div className="relative rounded-[3rem] overflow-hidden">
                    <div className={`absolute top-0 left-0 bottom-0 w-2 ${isBadminton ? 'bg-badminton' : 'bg-primary'}`} />
                    <div className="premium-glass h-full">
                        <div className={`p-8 flex justify-between items-center ${isBadminton ? 'bg-badminton/10' : 'bg-primary/10'}`}>
                            <div>
                                <h3 className={`font-display font-black uppercase tracking-tighter text-3xl ${isBadminton ? 'text-badminton' : 'text-primary'}`}>{match.teamA.name}</h3>
                                <p className={`text-[10px] font-bold tracking-widest uppercase mt-1 ${isBadminton ? 'text-badminton/70' : 'text-primary/70'}`}>Starting Roster</p>
                            </div>
                            <div className={`border font-black text-xl w-12 h-12 flex items-center justify-center rounded-2xl ${isBadminton ? 'bg-badminton/20 border-badminton/30 text-badminton' : 'bg-primary/20 border-primary/30 text-primary'}`}>
                                {match.teamA.players?.length || 0}
                            </div>
                        </div>
                        <div className="p-6">
                            {match.teamA.players?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {match.teamA.players.map(player => (
                                        <div key={player._id} className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                                            <div className="text-3xl font-display font-black text-slate-600 w-10 text-center">{player.jerseyNumber}</div>
                                            <div>
                                                <div className="font-bold text-white uppercase tracking-wider">{player.name}</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                                                    {player.isCaptain ? <><Shield size={10} className={`mr-1 ${isBadminton ? 'text-badminton' : 'text-primary'}`} /> Captain</> : 'Player'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-12 text-slate-600 font-bold uppercase tracking-widest text-sm">Roster Not Submitted</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Team B Roster */}
                <div className="relative rounded-[3rem] overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-2 bg-slate-400" />
                    <div className="premium-glass h-full">
                        <div className="bg-white/5 p-8 flex justify-between items-center">
                            <div>
                                <h3 className="font-display font-black uppercase tracking-tighter text-3xl text-white">{match.teamB.name}</h3>
                                <p className="text-[10px] font-bold tracking-widest uppercase mt-1 text-slate-400">Starting Roster</p>
                            </div>
                            <div className="bg-white/10 border border-white/20 text-white font-black text-xl w-12 h-12 flex items-center justify-center rounded-2xl">
                                {match.teamB.players?.length || 0}
                            </div>
                        </div>
                        <div className="p-6">
                            {match.teamB.players?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {match.teamB.players.map(player => (
                                        <div key={player._id} className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                                            <div className="text-3xl font-display font-black text-slate-600 w-10 text-center">{player.jerseyNumber}</div>
                                            <div>
                                                <div className="font-bold text-white uppercase tracking-wider">{player.name}</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                                                    {player.isCaptain ? <><Shield size={10} className="mr-1 text-slate-400" /> Captain</> : 'Player'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-12 text-slate-600 font-bold uppercase tracking-widest text-sm">Roster Not Submitted</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toss Info */}
            {match.tossWinner && (
                <div className="mt-8 flex justify-center">
                    <div className="premium-glass rounded-full pr-8 pl-2 py-2 flex items-center space-x-4 border border-white/10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isBadminton ? 'bg-badminton/20 text-badminton' : 'bg-primary/20 text-primary'}`}>
                            <Target size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase leading-none mb-1">Pre-Match Decision</p>
                            <p className="text-sm font-bold text-white">
                                <span className={isBadminton ? 'text-badminton' : 'text-primary'}>{match.teamA._id === match.tossWinner || match.tossWinner?._id === match.teamA._id ? match.teamA.name : match.teamB.name}</span> elected to {match.tossDecision}.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchDetail;

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { io } from 'socket.io-client';
import { Trophy, Info, Users, Clock, MapPin, ChevronLeft, Wifi, Share2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MatchDetail = () => {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

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
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Syncing Scoreboard</p>
        </div>
    );

    if (!match) return <div className="text-center mt-20 text-red-500 font-bold">Match not found.</div>;

    const currentSet = match.sets[match.currentSet - 1] || match.sets[0];
    const teamASets = match.sets.filter(s => s.winner === match.teamA._id || (s.winner && s.winner._id === match.teamA._id)).length;
    const teamBSets = match.sets.filter(s => s.winner === match.teamB._id || (s.winner && s.winner._id === match.teamB._id)).length;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Link to="/" className="flex items-center text-slate-400 hover:text-white transition-colors group">
                    <div className="bg-slate-800 p-2 rounded-xl mr-3 group-hover:bg-primary/20 transition-colors">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-sm">Back to Matches</span>
                </Link>
                <div className="flex items-center space-x-4">
                    <button className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-colors text-slate-400 hover:text-white">
                        <Share2 size={20} />
                    </button>
                    <div className="flex items-center space-x-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-xl text-xs font-bold border border-green-500/20">
                        <Wifi size={14} className="animate-pulse" />
                        <span>LIVE UPDATES ENABLED</span>
                    </div>
                </div>
            </header>

            {/* Main Stage */}
            <div className="relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[200px] bg-primary/20 blur-[120px] rounded-full -z-10" />

                <div className="glass-morphism rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
                    <div className="bg-white/5 p-4 md:p-6 text-center border-b border-white/5 flex flex-col md:flex-row justify-between items-center px-4 md:px-12 gap-4">
                        <div className="flex items-center space-x-2 text-primary font-black italic uppercase tracking-tighter text-xl">
                            <Trophy size={20} />
                            <span>{match.tournament?.name}</span>
                            <span className="ml-4 px-3 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30">
                                {match.sport === 'badminton' ? 'Badminton' : 'Throwball'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {match.venue}</span>
                            <span className="flex items-center gap-2"><Clock size={14} className="text-primary" /> {new Date(match.date).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="p-2 py-8 md:p-16">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4 text-center">
                            {/* Team A */}
                            <div className="flex-1 space-y-4 md:space-y-6 order-2 md:order-1">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-32 h-32 md:w-40 md:h-40 bg-slate-800 rounded-[2.5rem] mx-auto flex items-center justify-center font-black text-6xl shadow-inner border border-white/5 relative group"
                                >
                                    {match.teamA?.shortName?.[0] || 'A'}
                                    <div className="absolute -bottom-2 -right-2 bg-primary text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                                        {teamASets}
                                    </div>
                                </motion.div>
                                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none">{match.teamA.name}</h2>
                                <div className="text-xs text-slate-500 font-bold tracking-[0.3em] uppercase">TEAM A</div>
                            </div>

                            {/* Score Display */}
                            <div className="flex-shrink-0 order-1 md:order-2">
                                <div className="flex items-end justify-center gap-2 md:gap-12 min-h-[120px] md:min-h-[160px]">
                                    <div className="relative flex items-center justify-center">
                                        <AnimatePresence mode="popLayout">
                                            <motion.div
                                                key={`teamA-${match.currentSet}-${currentSet?.teamAScore}`}
                                                initial={{ y: 40, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -40, opacity: 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                className="text-8xl md:text-[10rem] font-black italic text-white leading-none"
                                            >
                                                {currentSet?.teamAScore || 0}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    <div className="pb-8 md:pb-12 text-4xl md:text-6xl font-black text-primary/30 italic self-center">VS</div>

                                    <div className="relative flex items-center justify-center">
                                        <AnimatePresence mode="popLayout">
                                            <motion.div
                                                key={`teamB-${match.currentSet}-${currentSet?.teamBScore}`}
                                                initial={{ y: 40, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -40, opacity: 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                className="text-8xl md:text-[10rem] font-black italic text-white leading-none"
                                            >
                                                {currentSet?.teamBScore || 0}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-col items-center">
                                    <div className={`px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest ${match.status === 'live' ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300'}`}>
                                        {match.status === 'live' ? 'LIVE NOW' : match.status}
                                    </div>
                                    <div className="mt-4 text-slate-500 font-black text-xs uppercase tracking-[0.5em]">SET {match.currentSet} OF 3</div>
                                    <div className="flex gap-4 mt-3">
                                        {match.sets.map((s, i) => (
                                            <div key={`summary-set-${i}`} className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all ${s.isCompleted ? (s.winner === match.teamA._id || s.winner?._id === match.teamA._id ? 'bg-primary/20 border-primary text-primary' : 'bg-purple-500/20 border-purple-500 text-purple-400') : (i + 1 === match.currentSet ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-800 border-white/5 text-slate-600')}`}>
                                                    {s.isCompleted ? ((s.winner === match.teamA._id || s.winner?._id === match.teamA._id) ? (match.teamA?.shortName?.[0] || 'A') : (match.teamB?.shortName?.[0] || 'B')) : i + 1}
                                                </div>
                                                <span className="text-[8px] font-black text-slate-600 mt-1 uppercase">SET {i + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Team B */}
                            <div className="flex-1 space-y-4 md:space-y-6 order-3 md:order-3">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-32 h-32 md:w-40 md:h-40 bg-slate-800 rounded-[2.5rem] mx-auto flex items-center justify-center font-black text-6xl shadow-inner border border-white/5 relative"
                                >
                                    {match.teamB?.shortName?.[0] || 'B'}
                                    <div className="absolute -bottom-2 -left-2 bg-purple-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                                        {teamBSets}
                                    </div>
                                </motion.div>
                                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none">{match.teamB.name}</h2>
                                <div className="text-xs text-slate-500 font-bold tracking-[0.3em] uppercase">TEAM B</div>
                            </div>
                        </div>

                        {match.matchWinner && (
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mt-16 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 p-10 rounded-[2.5rem] border border-primary/30 text-center relative"
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 px-6 py-2 rounded-full border border-primary/30 text-xs font-black text-primary tracking-widest uppercase">MATCH CONCLUSION</div>
                                <Trophy className="mx-auto text-primary mb-4 animate-bounce" size={48} />
                                <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter underline decoration-primary underline-offset-8">
                                    {match.matchWinner === match.teamA._id || match.matchWinner?._id === match.teamA._id ? match.teamA.name : match.teamB.name} WINS!
                                </h3>
                                <p className="text-primary/70 font-bold tracking-widest uppercase mt-6 text-sm">Championship Victory Secured</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detailed Set Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {match.sets.map((set, idx) => (
                    <div key={`set-stat-${idx}`} className={`glass-morphism p-8 rounded-[2rem] border-t-8 transition-all relative ${set.isCompleted ? (set.winner === match.teamA._id || set.winner?._id === match.teamA._id ? 'border-primary' : 'border-purple-600') : (idx + 1 === match.currentSet ? 'border-orange-500' : 'border-slate-800 opacity-50')}`}>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                SET {set.setNumber}
                                {set.isCompleted && (
                                    <span className={`ml-2 ${(set.winner === match.teamA._id || set.winner?._id === match.teamA._id) ? 'text-primary' : 'text-purple-400'}`}>
                                        • {(set.winner === match.teamA._id || set.winner?._id === match.teamA._id) ? match.teamA.shortName : match.teamB.shortName} WON
                                    </span>
                                )}
                            </span>
                            {set.isCompleted && <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase">Final</div>}
                            {idx + 1 === match.currentSet && !match.matchWinner && <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase animate-pulse">Live</div>}
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center group">
                                <span className={`font-bold transition-transform ${set.winner === match.teamA._id || set.winner?._id === match.teamA._id ? 'text-primary scale-110' : 'text-slate-300'}`}>{match.teamA.name}</span>
                                <span className={`text-3xl font-black ${set.winner === match.teamA._id || set.winner?._id === match.teamA._id ? 'text-primary' : 'text-slate-400'}`}>{set.teamAScore}</span>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="flex justify-between items-center group">
                                <span className={`font-bold transition-transform ${set.winner === match.teamB._id || set.winner?._id === match.teamB._id ? 'text-purple-500 scale-110' : 'text-slate-300'}`}>{match.teamB.name}</span>
                                <span className={`text-3xl font-black ${set.winner === match.teamB._id || set.winner?._id === match.teamB._id ? 'text-purple-500' : 'text-slate-400'}`}>{set.teamBScore}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Squad Rosters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                {/* Team A Roster */}
                <div className="glass-morphism rounded-[2.5rem] overflow-hidden border border-white/5">
                    <div className="bg-primary/10 p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-black italic uppercase tracking-tighter text-primary">Team A Squad</h3>
                        <span className="text-xs font-bold text-slate-500 uppercase">{match.teamA.players?.length || 0} Players</span>
                    </div>
                    <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {match.teamA.players?.length > 0 ? match.teamA.players.map(player => (
                            <div key={`player-a-${player._id}`} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-black text-primary border border-white/5 group-hover:scale-110 transition-transform">
                                        {player.jerseyNumber}
                                    </div>
                                    <div>
                                        <div className="font-bold flex items-center">
                                            {player.name}
                                            {player.isCaptain && <Shield size={12} className="ml-2 text-primary fill-primary/20" />}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{player.isCaptain ? 'Team Captain' : 'Regular'}</div>
                                    </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-primary/20" />
                            </div>
                        )) : <p className="text-center py-8 text-slate-600 font-bold uppercase tracking-widest text-xs italic">No Players Listed</p>}
                    </div>
                </div>

                {/* Team B Roster */}
                <div className="glass-morphism rounded-[2.5rem] overflow-hidden border border-white/5">
                    <div className="bg-purple-500/10 p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-black italic uppercase tracking-tighter text-purple-400">Team B Squad</h3>
                        <span className="text-xs font-bold text-slate-500 uppercase">{match.teamB.players?.length || 0} Players</span>
                    </div>
                    <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {match.teamB.players?.length > 0 ? match.teamB.players.map(player => (
                            <div key={`player-b-${player._id}`} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-black text-purple-500 border border-white/5 group-hover:scale-110 transition-transform">
                                        {player.jerseyNumber}
                                    </div>
                                    <div>
                                        <div className="font-bold flex items-center">
                                            {player.name}
                                            {player.isCaptain && <Shield size={12} className="ml-2 text-purple-500 fill-purple-500/20" />}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{player.isCaptain ? 'Team Captain' : 'Regular'}</div>
                                    </div>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-purple-500/20" />
                            </div>
                        )) : <p className="text-center py-8 text-slate-600 font-bold uppercase tracking-widest text-xs italic">No Players Listed</p>}
                    </div>
                </div>
            </div>

            {/* Toss Info */}
            {match.tossWinner && (
                <div className="glass-morphism p-8 rounded-[2rem] flex items-center space-x-6 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    <div className="bg-primary/20 p-4 rounded-2xl relative">
                        <Info className="text-primary" size={24} />
                    </div>
                    <div className="relative">
                        <p className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase mb-1">Pre-Match Flip</p>
                        <p className="text-lg font-bold">
                            <span className="text-primary underline">{match.teamA._id === match.tossWinner || match.tossWinner?._id === match.teamA._id ? match.teamA.name : match.teamB.name}</span> won the toss and elected to <span className="italic text-primary">{match.tossDecision}</span>.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchDetail;

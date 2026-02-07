import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Play, Calendar, MapPin, Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';

const Home = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

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
        socket.emit('joinMatch', 'matches'); // Join the global matches room

        const updateMatchList = (updatedMatch) => {
            setMatches(prev => prev.map(m => m._id === updatedMatch._id ? updatedMatch : m));
        };

        socket.on('scoreUpdate', updateMatchList);
        socket.on('statusUpdate', updateMatchList);

        return () => {
            socket.disconnect();
        };
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Loading Live Scores</p>
        </div>
    );

    const liveMatches = matches.filter(m => m.status === 'live');
    const upcomingMatches = matches.filter(m => m.status === 'upcoming');
    const completedMatches = matches.filter(m => m.status === 'completed');

    return (
        <div className="space-y-16 pb-20">
            {/* Hero Section */}
            <section className="relative h-[400px] rounded-[3rem] overflow-hidden flex items-center px-8 md:px-16 shadow-2xl">
                <img
                    src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2000&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                    alt="Throwball Match"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent z-10" />

                <div className="relative z-20 max-w-2xl space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center space-x-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/20"
                    >
                        <Trophy size={16} />
                        <span>PREMIUM LIVE SCORING</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black italic uppercase leading-tight tracking-tighter"
                    >
                        Ultimate <span className="text-primary">Throwball</span> Experience
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-lg font-medium"
                    >
                        Track every point, set, and victory in real-time. The most advanced digital scoreboard for Throwball tournaments.
                    </motion.p>
                </div>
            </section>

            {/* Live Matches */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3 text-red-500">
                        <div className="relative">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute inset-0" />
                            <div className="w-3 h-3 bg-red-500 rounded-full relative" />
                        </div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Live Arena</h2>
                    </div>
                </div>

                {liveMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {liveMatches.map(match => (
                            <MatchCard key={match._id} match={match} />
                        ))}
                    </div>
                ) : (
                    <div className="glass-morphism p-12 rounded-[2rem] text-center border border-white/5">
                        <p className="text-slate-500 font-bold uppercase tracking-widest">No active matches at this moment.</p>
                        <p className="text-slate-600 text-sm mt-2">Check back during tournament hours!</p>
                    </div>
                )}
            </section>

            {/* Upcoming & Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-300">Upcoming</h2>
                        <div className="h-px bg-white/10 flex-1 ml-6" />
                    </div>
                    <div className="space-y-6">
                        {upcomingMatches.length > 0 ? upcomingMatches.map(match => (
                            <SmallMatchCard key={match._id} match={match} />
                        )) : <p className="text-slate-500">No upcoming matches scheduled.</p>}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-300">Recent Results</h2>
                        <div className="h-px bg-white/10 flex-1 ml-6" />
                    </div>
                    <div className="space-y-6">
                        {completedMatches.length > 0 ? completedMatches.map(match => (
                            <SmallMatchCard key={match._id} match={match} />
                        )) : <p className="text-slate-500">No results found.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
};

const MatchCard = ({ match }) => {
    const currentSet = match.sets[match.currentSet - 1];

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="glass-morphism rounded-[2.5rem] relative overflow-hidden group border border-white/5 shadow-2xl"
        >
            <div className="absolute top-0 right-0 p-6">
                <div className="bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full animate-pulse">Live</div>
            </div>

            <Link to={`/match/${match._id}`} className="p-8 block">
                <div className="mb-8">
                    <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">
                        {match.tournament?.name || 'Tournament'}
                    </span>
                    <div className="flex items-center text-slate-500 text-xs mt-1 font-bold">
                        <MapPin size={12} className="mr-1" /> {match.venue}
                    </div>
                </div>

                <div className="flex justify-between items-center text-center gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center font-black text-3xl border border-white/5 group-hover:border-primary/50 transition-colors shadow-lg">
                            {match.teamA?.shortName?.[0] || 'A'}
                        </div>
                        <p className="font-extrabold text-sm uppercase tracking-tight">{match.teamA?.name || 'Deleted Team'}</p>
                        <div className="text-4xl font-black italic text-white">{currentSet?.teamAScore || 0}</div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="text-[10px] font-black text-slate-600 mb-1 uppercase tracking-widest">Set {match.currentSet}</div>
                        <div className="text-2xl font-black text-primary italic">VS</div>
                        <div className="mt-4 flex space-x-2">
                            {match.sets.map((s, i) => (
                                <div
                                    key={`set-dot-${match._id}-${i}`}
                                    className={`w-2.5 h-2.5 rounded-full flex items-center justify-center transition-all ${s.isCompleted ? (s.winner === match.teamA._id || s.winner?._id === match.teamA._id ? 'bg-primary ring-4 ring-primary/20' : 'bg-purple-500 ring-4 ring-purple-500/20') : 'bg-slate-700'}`}
                                    title={s.isCompleted ? `Set ${i + 1}: ${s.winner === match.teamA._id || s.winner?._id === match.teamA._id ? match.teamA.shortName : match.teamB.shortName} Won` : `Set ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center font-black text-3xl border border-white/5 group-hover:border-primary/50 transition-colors shadow-lg">
                            {match.teamB?.shortName?.[0] || 'B'}
                        </div>
                        <p className="font-extrabold text-sm uppercase tracking-tight">{match.teamB?.name || 'Deleted Team'}</p>
                        <div className="text-4xl font-black italic text-white">{currentSet?.teamBScore || 0}</div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex justify-center">
                    <span className="flex items-center space-x-2 text-primary group-hover:text-white transition-colors bg-primary/5 group-hover:bg-primary px-6 py-3 rounded-2xl w-full justify-center">
                        <span className="font-black uppercase tracking-widest text-xs">Enter Scoreboard</span>
                        <ArrowRight size={16} />
                    </span>
                </div>
            </Link>
        </motion.div>
    );
};

const SmallMatchCard = ({ match }) => (
    <motion.div whileHover={{ x: 5 }}>
        <Link to={`/match/${match._id}`} className="block glass-morphism p-6 rounded-3xl hover:bg-white/10 transition-all border border-white/5">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <div className="flex -space-x-3">
                        <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center font-black text-xs">{match.teamA?.shortName?.[0] || 'A'}</div>
                        <div className="w-10 h-10 bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center font-black text-xs">{match.teamB?.shortName?.[0] || 'B'}</div>
                    </div>
                    <div>
                        <div className="font-bold text-lg uppercase tracking-tight leading-none group-hover:text-primary transition-colors">
                            {match.teamA?.name || 'Deleted'} <span className="text-primary italic mx-2 underline decoration-2">VS</span> {match.teamB?.name || 'Deleted'}
                        </div>
                        <div className="text-slate-500 text-xs flex items-center mt-2 font-bold uppercase tracking-wider">
                            <Calendar size={12} className="mr-1" />
                            {new Date(match.date).toLocaleDateString()} • {match.venue}
                        </div>
                    </div>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-2 rounded-xl ${match.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                    {match.status}
                </div>
            </div>
        </Link>
    </motion.div>
);

export default Home;

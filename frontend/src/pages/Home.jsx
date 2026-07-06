import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Calendar, MapPin, Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';

const Home = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSport, setSelectedSport] = useState('throwball'); // Master Sport Toggle

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

    const filteredMatches = matches.filter(m => m.sport === selectedSport || (!m.sport && selectedSport === 'throwball'));
    const liveMatches = filteredMatches.filter(m => m.status === 'live');
    const upcomingMatches = filteredMatches.filter(m => m.status === 'upcoming');
    const completedMatches = filteredMatches.filter(m => m.status === 'completed');

    return (
        <div className="space-y-16 pb-20">
            {/* Professional Hero Section & Master Toggle */}
            <section className="relative min-h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden flex flex-col items-center justify-center px-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
                <img
                    src={selectedSport === 'badminton' 
                        ? "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2000&auto=format&fit=crop" 
                        : "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2000&auto=format&fit=crop"}
                    className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                    alt="Sport Background"
                />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] z-10" />

                <div className="relative z-20 flex flex-col items-center space-y-10 w-full max-w-4xl mt-8">
                    {/* Sport Toggle Switch */}
                    <div className="bg-black/50 backdrop-blur-md p-2 rounded-full flex items-center border border-white/10 shadow-2xl">
                        <button
                            onClick={() => setSelectedSport('throwball')}
                            className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs md:text-sm transition-all duration-300 ${selectedSport === 'throwball' ? 'bg-primary text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'text-slate-400 hover:text-white'}`}
                        >
                            Throwball
                        </button>
                        <button
                            onClick={() => setSelectedSport('badminton')}
                            className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs md:text-sm transition-all duration-300 ${selectedSport === 'badminton' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]' : 'text-slate-400 hover:text-white'}`}
                        >
                            Badminton
                        </button>
                    </div>

                    <div className="text-center space-y-4">
                        <motion.h1
                            key={selectedSport}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase leading-none tracking-tighter text-white drop-shadow-2xl"
                        >
                            {selectedSport === 'badminton' ? 'Elite ' : 'Ultimate '}<span className={selectedSport === 'badminton' ? 'text-purple-400' : 'text-primary'}>{selectedSport}</span>
                        </motion.h1>
                        <p className="text-slate-300 text-sm md:text-xl font-bold tracking-widest uppercase mt-4">Professional Live Scoring Hub</p>
                    </div>
                </div>
            </section>

            {/* Live Matches */}
            <section>
                <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex items-center space-x-3 text-red-500">
                        <div className="relative">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute inset-0" />
                            <div className="w-3 h-3 bg-red-500 rounded-full relative" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Live Arena</h2>
                    </div>
                </div>

                {liveMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {liveMatches.map(match => (
                            <MatchCard key={match._id} match={match} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#0a0a0a] p-12 rounded-[2rem] text-center border border-white/5 shadow-inner">
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No active matches at this moment.</p>
                        <p className="text-slate-700 text-xs mt-2 font-bold uppercase">Check back during tournament hours.</p>
                    </div>
                )}
            </section>

            {/* Upcoming & Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
                <section>
                    <div className="flex items-center justify-between mb-8 px-4">
                        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-slate-300">Upcoming</h2>
                        <div className="h-px bg-white/10 flex-1 ml-6" />
                    </div>
                    <div className="space-y-4 md:space-y-6">
                        {upcomingMatches.length > 0 ? upcomingMatches.map(match => (
                            <SmallMatchCard key={match._id} match={match} />
                        )) : <p className="text-slate-600 font-bold uppercase text-xs tracking-widest text-center py-8">No upcoming matches.</p>}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-8 px-4">
                        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-slate-300">Results</h2>
                        <div className="h-px bg-white/10 flex-1 ml-6" />
                    </div>
                    <div className="space-y-4 md:space-y-6">
                        {completedMatches.length > 0 ? completedMatches.map(match => (
                            <SmallMatchCard key={match._id} match={match} />
                        )) : <p className="text-slate-600 font-bold uppercase text-xs tracking-widest text-center py-8">No results found.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
};

const MatchCard = ({ match }) => {
    const currentSet = match.sets[match.currentSet - 1] || match.sets[0];
    const isBadminton = match.sport === 'badminton';
    const accentColor = isBadminton ? 'text-purple-400' : 'text-primary';

    return (
        <motion.div whileHover={{ y: -5 }} className="bg-[#0a0a0a] rounded-[2rem] relative overflow-hidden group border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.8)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-70" />
            
            <Link to={`/match/${match._id}`} className="block p-6 md:p-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <span className={`text-[10px] font-black ${accentColor} uppercase tracking-[0.3em] bg-white/5 px-3 py-1.5 rounded-full border border-white/5`}>
                            {match.tournament?.name || 'Tournament'}
                        </span>
                        <div className="flex items-center text-slate-500 text-[10px] md:text-xs mt-4 font-bold tracking-wider uppercase">
                            <MapPin size={12} className="mr-2 text-slate-400" /> {match.venue}
                        </div>
                    </div>
                    <div className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black uppercase px-3 py-1.5 rounded-full flex items-center tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 animate-pulse" /> LIVE
                    </div>
                </div>

                <div className="flex justify-between items-center text-center gap-2">
                    <div className="flex-1 space-y-4">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center font-black text-xl md:text-2xl border border-white/10 shadow-inner">
                            {match.teamA?.shortName?.[0] || 'A'}
                        </div>
                        <p className="font-black text-[10px] md:text-xs uppercase tracking-tight text-white line-clamp-1">{match.teamA?.name || 'Team A'}</p>
                        <div className="text-4xl md:text-5xl font-black italic text-white drop-shadow-lg">{currentSet?.teamAScore || 0}</div>
                    </div>

                    <div className="flex flex-col items-center px-2">
                        <div className={`text-lg md:text-xl font-black ${accentColor} italic mb-4 opacity-50`}>VS</div>
                        <div className="flex space-x-1.5">
                            {match.sets.map((s, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${s.isCompleted ? ((s.winner === match.teamA._id || s.winner?._id === match.teamA._id) ? (isBadminton ? 'bg-purple-400' : 'bg-primary') : 'bg-slate-400') : 'bg-white/10'}`}
                                />
                            ))}
                        </div>
                        <div className="text-[9px] font-black text-slate-600 mt-3 uppercase tracking-[0.2em]">Set {match.currentSet}</div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center font-black text-xl md:text-2xl border border-white/10 shadow-inner">
                            {match.teamB?.shortName?.[0] || 'B'}
                        </div>
                        <p className="font-black text-[10px] md:text-xs uppercase tracking-tight text-white line-clamp-1">{match.teamB?.name || 'Team B'}</p>
                        <div className="text-4xl md:text-5xl font-black italic text-white drop-shadow-lg">{currentSet?.teamBScore || 0}</div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const SmallMatchCard = ({ match }) => {
    const isBadminton = match.sport === 'badminton';
    const accentColor = isBadminton ? 'text-purple-400' : 'text-primary';
    const accentBg = isBadminton ? 'bg-purple-500/10' : 'bg-primary/10';
    const accentBorder = isBadminton ? 'border-purple-500/20' : 'border-primary/20';

    return (
        <motion.div whileHover={{ x: 5 }}>
            <Link to={`/match/${match._id}`} className="block bg-[#0a0a0a] p-4 md:p-6 rounded-3xl hover:bg-white/5 transition-all border border-white/5 shadow-lg">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 md:space-x-6">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center font-black text-xs shadow-inner">{match.teamA?.shortName?.[0] || 'A'}</div>
                            <div className="w-10 h-10 bg-slate-800 border border-white/10 rounded-xl flex items-center justify-center font-black text-xs shadow-inner">{match.teamB?.shortName?.[0] || 'B'}</div>
                        </div>
                        <div>
                            <div className="font-black text-sm md:text-base uppercase tracking-tight leading-none group-hover:text-white transition-colors text-slate-200">
                                {match.teamA?.name || 'Deleted'} <span className={`${accentColor} italic mx-2 opacity-50`}>VS</span> {match.teamB?.name || 'Deleted'}
                            </div>
                            <div className="text-slate-500 text-[10px] flex items-center mt-2 font-bold uppercase tracking-wider">
                                <Calendar size={12} className="mr-2 text-slate-600" />
                                {new Date(match.date).toLocaleDateString()} • {match.venue}
                            </div>
                        </div>
                    </div>
                    <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full ${match.status === 'completed' ? 'bg-slate-800 text-slate-400 border border-white/10' : `${accentBg} ${accentColor} border ${accentBorder}`}`}>
                        {match.status}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default Home;

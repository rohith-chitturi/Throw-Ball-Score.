import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Calendar, MapPin, Trophy, Activity, ArrowRight, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const Home = () => {
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

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
            <p className="text-slate-400 font-display font-bold uppercase tracking-[0.3em] animate-pulse">Initializing Broadcast</p>
        </div>
    );

    const filteredMatches = matches.filter(m => m.sport === selectedSport || (!m.sport && selectedSport === 'throwball'));
    const liveMatches = filteredMatches.filter(m => m.status === 'live');
    const upcomingMatches = filteredMatches.filter(m => m.status === 'upcoming');
    const completedMatches = filteredMatches.filter(m => m.status === 'completed');

    return (
        <div className="space-y-24 pb-32">
            {/* CINEMATIC HERO SECTION */}
            <section className="relative min-h-[85vh] rounded-[3rem] md:rounded-[4rem] overflow-hidden flex flex-col items-center justify-center px-6 md:px-12 mt-4 border border-white/5 shadow-2xl">
                {/* Dynamic Background */}
                <motion.div 
                    key={selectedSport}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute inset-0"
                >
                    <img
                        src={selectedSport === 'badminton' 
                            ? "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2000&auto=format&fit=crop" 
                            : "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2000&auto=format&fit=crop"}
                        className="w-full h-full object-cover object-center"
                        alt="Sport Arena"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-midnight-blue/90 via-transparent to-midnight-blue/90 z-10" />
                </motion.div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden z-20 pointer-events-none">
                    <motion.div animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity }} className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-[100px] ${selectedSport === 'badminton' ? 'bg-badminton/30' : 'bg-primary/30'}`} />
                    <motion.div animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 7, repeat: Infinity }} className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] bg-accent/20" />
                </div>

                <div className="relative z-30 flex flex-col items-center space-y-12 w-full max-w-6xl mt-16">
                    {/* Live Tournament Status Badge */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="premium-glass px-6 py-2 rounded-full flex items-center space-x-3 border border-white/20 shadow-2xl"
                    >
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Live Broadcast Network</span>
                    </motion.div>

                    <div className="text-center space-y-6">
                        <motion.h1
                            key={`h1-${selectedSport}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="text-7xl md:text-9xl font-display font-black uppercase leading-[0.9] tracking-tighter text-white drop-shadow-2xl"
                        >
                            {selectedSport === 'badminton' ? 'Elite ' : 'Ultimate '}<br/>
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${selectedSport === 'badminton' ? 'from-badminton to-fuchsia-400' : 'from-primary to-green-300'}`}>
                                {selectedSport}
                            </span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                            className="text-slate-300 text-lg md:text-2xl font-light tracking-[0.2em] uppercase max-w-2xl mx-auto"
                        >
                            Professional Tournament Management & Real-Time Scoring Platform
                        </motion.p>
                    </div>

                    {/* Master Sport Toggle (Apple TV Style) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                        className="premium-glass p-1.5 rounded-full flex items-center border border-white/10 shadow-2xl relative"
                    >
                        <button
                            onClick={() => setSelectedSport('throwball')}
                            className={`relative px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-500 z-10 ${selectedSport === 'throwball' ? 'text-black' : 'text-slate-400 hover:text-white'}`}
                        >
                            {selectedSport === 'throwball' && (
                                <motion.div layoutId="activeSport" className="absolute inset-0 bg-primary rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)] -z-10" />
                            )}
                            Throwball
                        </button>
                        <button
                            onClick={() => setSelectedSport('badminton')}
                            className={`relative px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-500 z-10 ${selectedSport === 'badminton' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            {selectedSport === 'badminton' && (
                                <motion.div layoutId="activeSport" className="absolute inset-0 bg-badminton rounded-full shadow-[0_0_30px_rgba(139,92,246,0.5)] -z-10" />
                            )}
                            Badminton
                        </button>
                    </motion.div>
                </div>

                {/* Bottom Stats Banner */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-30 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 bg-gradient-to-t from-charcoal to-transparent">
                    <div className="flex space-x-12">
                        <div className="space-y-1">
                            <div className="text-4xl font-black font-display">{matches.length}</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Matches</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-4xl font-black font-display text-accent">{liveMatches.length}</div>
                            <div className="text-[10px] text-accent uppercase tracking-widest font-bold">Live Now</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE BROADCAST SECTION */}
            <section className="relative z-10">
                <div className="flex items-center space-x-4 mb-12">
                    <div className="w-1.5 h-8 bg-accent rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter">Live Broadcast</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-6" />
                </div>

                {liveMatches.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {liveMatches.map((match, idx) => (
                            <LiveMatchCard key={match._id} match={match} idx={idx} />
                        ))}
                    </div>
                ) : (
                    <div className="premium-glass-panel p-16 rounded-[3rem] flex flex-col items-center justify-center text-center">
                        <Activity size={48} className="text-slate-600 mb-6 opacity-50" />
                        <h3 className="text-2xl font-display font-bold text-slate-300 mb-2">No Live Coverage</h3>
                        <p className="text-slate-500 uppercase tracking-widest text-sm font-bold">Coverage resumes when the next match begins.</p>
                    </div>
                )}
            </section>

            {/* FIXTURES TIMELINE */}
            <section className="relative z-10">
                <div className="flex items-center space-x-4 mb-12">
                    <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter">Event Timeline</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-6" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Upcoming */}
                    <div>
                        <h3 className="text-xl font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center">
                            <Calendar size={18} className="mr-3" /> Upcoming Fixtures
                        </h3>
                        <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-8 before:w-px before:bg-white/10">
                            {upcomingMatches.length > 0 ? upcomingMatches.map(match => (
                                <TimelineCard key={match._id} match={match} type="upcoming" />
                            )) : <p className="text-slate-600 font-bold uppercase tracking-widest text-sm pl-16">No upcoming fixtures.</p>}
                        </div>
                    </div>

                    {/* Results */}
                    <div>
                        <h3 className="text-xl font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center">
                            <Trophy size={18} className="mr-3" /> Recent Results
                        </h3>
                        <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-8 before:w-px before:bg-white/10">
                            {completedMatches.length > 0 ? completedMatches.map(match => (
                                <TimelineCard key={match._id} match={match} type="completed" />
                            )) : <p className="text-slate-600 font-bold uppercase tracking-widest text-sm pl-16">No results recorded.</p>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// ESPN/Apple TV Style Live Card
const LiveMatchCard = ({ match, idx }) => {
    const currentSet = match.sets[match.currentSet - 1] || match.sets[0];
    const isBadminton = match.sport === 'badminton';
    const accentTheme = isBadminton ? 'badminton' : 'primary';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="hover-lift"
        >
            <Link to={`/match/${match._id}`} className="block relative bg-charcoal rounded-[2rem] overflow-hidden border border-white/10 group shadow-2xl">
                {/* Glowing Top Border */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${isBadminton ? 'bg-badminton shadow-[0_0_20px_#8b5cf6]' : 'bg-primary shadow-[0_0_20px_#10b981]'} z-20`} />
                
                {/* Background Texture/Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0" />
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 ${isBadminton ? 'bg-badminton/5' : 'bg-primary/5'}`} />

                <div className="relative z-10 p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className={`px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${isBadminton ? 'bg-badminton/20 text-badminton border-badminton/30' : 'bg-primary/20 text-primary border-primary/30'}`}>
                                    {match.tournament?.name || 'Tournament'}
                                </div>
                                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center">
                                    <MapPin size={12} className="mr-1" /> {match.venue}
                                </div>
                            </div>
                        </div>
                        <div className="bg-red-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full flex items-center tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                            <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-pulse" />
                            LIVE
                        </div>
                    </div>

                    {/* Main Score Area */}
                    <div className="flex justify-between items-center px-4">
                        {/* Team A */}
                        <div className="flex-1 flex flex-col items-center text-center space-y-4">
                            <div className="text-6xl md:text-7xl font-display font-black text-white drop-shadow-xl tabular-nums tracking-tighter">
                                {currentSet?.teamAScore || 0}
                            </div>
                            <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-slate-200 line-clamp-1">{match.teamA?.name}</h3>
                        </div>

                        {/* Center Info */}
                        <div className="flex flex-col items-center px-6 space-y-4">
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Set {match.currentSet}</div>
                            <div className="flex space-x-2">
                                {match.sets.map((s, i) => (
                                    <div
                                        key={i}
                                        className={`w-3 h-3 rounded-full border border-white/20 ${s.isCompleted ? ((s.winner === match.teamA._id || s.winner?._id === match.teamA._id) ? (isBadminton ? 'bg-badminton shadow-[0_0_10px_#8b5cf6]' : 'bg-primary shadow-[0_0_10px_#10b981]') : 'bg-slate-400') : 'bg-transparent'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Team B */}
                        <div className="flex-1 flex flex-col items-center text-center space-y-4">
                            <div className="text-6xl md:text-7xl font-display font-black text-white drop-shadow-xl tabular-nums tracking-tighter">
                                {currentSet?.teamBScore || 0}
                            </div>
                            <h3 className="text-sm md:text-base font-bold uppercase tracking-wider text-slate-200 line-clamp-1">{match.teamB?.name}</h3>
                        </div>
                    </div>
                </div>

                {/* Broadcast Footer */}
                <div className="relative z-10 bg-black/40 border-t border-white/10 px-8 py-4 flex justify-between items-center group-hover:bg-black/60 transition-colors">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                        <Zap size={14} className="mr-2 text-accent" /> Premium Broadcast
                    </span>
                    <ArrowRight className={`opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all ${isBadminton ? 'text-badminton' : 'text-primary'}`} size={20} />
                </div>
            </Link>
        </motion.div>
    );
};

// Timeline Style Fixture Card
const TimelineCard = ({ match, type }) => {
    const isBadminton = match.sport === 'badminton';
    const accentTheme = isBadminton ? 'badminton' : 'primary';
    const date = new Date(match.date);
    
    return (
        <motion.div whileHover={{ x: 8 }} className="relative pl-16 group">
            {/* Timeline Dot */}
            <div className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-charcoal z-10 shadow-lg ${type === 'completed' ? 'bg-slate-600' : (isBadminton ? 'bg-badminton' : 'bg-primary')}`} />
            
            <Link to={`/match/${match._id}`} className="block">
                <div className="premium-glass-panel rounded-3xl p-6 flex items-center transition-colors group-hover:bg-white/5">
                    {/* Date Block */}
                    <div className="pr-6 border-r border-white/10 mr-6 text-center">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                        <div className="text-2xl font-display font-black text-white">{date.getDate()}</div>
                    </div>

                    {/* Match Info */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{match.tournament?.name}</span>
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded bg-white/5 ${type === 'completed' ? 'text-slate-500' : (isBadminton ? 'text-badminton' : 'text-primary')}`}>
                                {match.status}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-white tracking-tight">
                                {match.teamA?.name} <span className="text-slate-600 font-light mx-2">vs</span> {match.teamB?.name}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default Home;

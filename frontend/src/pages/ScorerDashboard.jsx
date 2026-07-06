import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Plus, Trophy, Users, Play, Trash2, Calendar, LayoutDashboard, Flag, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import TeamManagement from '../components/TeamManagement';
import TournamentManagement from '../components/TournamentManagement';
import { useAuth } from '../context/AuthContext';

const ScorerDashboard = ({ isAdminView = false }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('matches');
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [officials, setOfficials] = useState([]);
    const [showCreateMatch, setShowCreateMatch] = useState(false);
    const [newMatch, setNewMatch] = useState({
        teamAName: '',
        teamBName: '',
        tournament: '',
        venue: '',
        date: new Date().toISOString().split('T')[0],
        pointsPerSet: 27,
        scorer: '',
        sport: 'throwball'
    });

    useEffect(() => {
        if (user?._id) {
            fetchInitialData();
        }

        // Add Socket listener for real-time updates
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
    }, [user?._id, activeTab]);

    const fetchInitialData = async () => {
        try {
            const requests = [
                axios.get('/matches'),
                axios.get('/teams'),
                axios.get('/tournaments')
            ];

            // Only fetch users if admin (to avoid 403 for scorers)
            if (user.role === 'admin') {
                requests.push(axios.get('/users'));
            }

            const results = await Promise.allSettled(requests);

            // Process results
            if (results[0].status === 'fulfilled') {
                const fetchedMatches = results[0].value.data.data;
                console.log(`[Dashboard] Matches Fetched: ${fetchedMatches.length}`);
                setMatches(fetchedMatches);
            }

            if (results[1].status === 'fulfilled') setTeams(results[1].value.data.data);
            if (results[2].status === 'fulfilled') {
                setTournaments(results[2].value.data.data);
                console.log('Fetched Tournaments:', results[2].value.data.data);
            }

            if (user.role === 'admin' && results[3]?.status === 'fulfilled') {
                setOfficials(results[3].value.data.data.filter(u => u.role === 'scorer' || u.role === 'admin'));
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        }
    };

    const handleCreateMatch = async (e) => {
        e.preventDefault();
        try {
            const matchData = {
                ...newMatch,
                scorer: newMatch.scorer || null // Default to null for admin to assign
            };
            const res = await axios.post('/matches', matchData);
            setMatches([...matches, res.data.data]);
            setShowCreateMatch(false);
            setNewMatch({ teamAName: '', teamBName: '', tournament: '', venue: '', date: new Date().toISOString().split('T')[0], pointsPerSet: 27, scorer: '', sport: 'throwball' });
            toast.success('Match scheduled successfully!');
        } catch (err) {
            toast.error('Error creating match');
        }
    };

    const handleDeleteMatch = async (id) => {
        if (!window.confirm('Are you sure you want to delete this match?')) return;
        try {
            await axios.delete(`/matches/${id}`);
            setMatches(matches.filter(m => m._id !== id));
            toast.success('Match deleted');
        } catch (err) {
            toast.error('Error deleting match');
        }
    };

    const handleAssignScorer = async (matchId, scorerId) => {
        try {
            await axios.put(`/matches/${matchId}`, { scorer: scorerId });
            fetchInitialData();
            toast.success('Scorer reassigned!');
        } catch (err) {
            toast.error('Failed to assign scorer');
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {!isAdminView && (
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                            <Trophy className="text-green-500" size={32} />
                            Official Scorer Panel
                        </h1>
                        <p className="text-xs md:text-sm text-slate-500 font-medium tracking-wide">Secure scoring interface • Logged in as <span className="text-green-500 font-bold uppercase">{user.username}</span></p>
                    </div>
                </header>
            )}

            {/* Navigation Tabs - Visible to everyone since Scorers handle Teams/Events too */}
            <div className="flex flex-wrap p-1 bg-slate-800/50 rounded-2xl w-full md:w-fit border border-white/5 shadow-2xl">
                {[
                    { id: 'matches', label: 'Match Schedule', icon: Trophy },
                    ...(!isAdminView ? [
                        { id: 'teams', label: 'Teams', icon: Users },
                        { id: 'tournaments', label: 'Events', icon: Flag }
                    ] : [])
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 md:px-6 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === tab.id
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <main className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'matches' && (
                        <motion.div
                            key="matches"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Match Schedule</h2>
                                {(user.role === 'scorer' || isAdminView) && (
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={fetchInitialData}
                                            className="text-primary hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center space-x-1"
                                        >
                                            <LayoutDashboard size={14} />
                                            <span>Sync Data</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowCreateMatch(!showCreateMatch);
                                                if (!showCreateMatch) fetchInitialData();
                                            }}
                                            className="bg-primary hover:bg-secondary px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-primary/20"
                                        >
                                            <Plus size={20} />
                                            <span>Schedule Match</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {showCreateMatch && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="overflow-hidden"
                                >
                                    <div className="glass-morphism p-8 rounded-3xl border border-primary/20">
                                        <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                                            <Trophy className="text-primary" />
                                            <span>Setup New Match</span>
                                        </h2>
                                        <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Team A Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-slate-800 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary"
                                                    placeholder="Enter Team A Name"
                                                    value={newMatch.teamAName}
                                                    onChange={(e) => setNewMatch({ ...newMatch, teamAName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Team B Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-slate-800 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary"
                                                    placeholder="Enter Team B Name"
                                                    value={newMatch.teamBName}
                                                    onChange={(e) => setNewMatch({ ...newMatch, teamBName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Assign Tournament</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-medium appearance-none cursor-pointer"
                                                        value={newMatch.tournament}
                                                        onChange={(e) => setNewMatch({ ...newMatch, tournament: e.target.value })}
                                                        required
                                                    >
                                                        <option value="" className="text-slate-500">Choose an active tournament...</option>
                                                        {tournaments.map(t => (
                                                            <option key={t._id} value={t._id}>
                                                                {t.name} {t.venue ? `(${t.venue})` : ''}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                        <Trophy size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Sport</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-medium appearance-none cursor-pointer"
                                                        value={newMatch.sport || 'throwball'}
                                                        onChange={(e) => {
                                                            const sport = e.target.value;
                                                            setNewMatch({ 
                                                                ...newMatch, 
                                                                sport, 
                                                                pointsPerSet: sport === 'badminton' ? 21 : 27 
                                                            });
                                                        }}
                                                        required
                                                    >
                                                        <option value="throwball">Throwball</option>
                                                        <option value="badminton">Badminton</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Venue</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-slate-800 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary"
                                                    placeholder="Ground Name"
                                                    value={newMatch.venue}
                                                    onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full bg-slate-800 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary"
                                                    value={newMatch.date}
                                                    onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">Points Per Set</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-slate-800 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary"
                                                    placeholder="e.g. 27"
                                                    value={newMatch.pointsPerSet || ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                                                        setNewMatch({ ...newMatch, pointsPerSet: isNaN(val) ? 0 : val });
                                                    }}
                                                    required
                                                    min="1"
                                                />
                                            </div>
                                            {user.role === 'admin' && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Assigned Scorer</label>
                                                    <select
                                                        className="w-full bg-slate-800 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary"
                                                        value={newMatch.scorer}
                                                        onChange={(e) => setNewMatch({ ...newMatch, scorer: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select Scorer</option>
                                                        {officials.map(off => (
                                                            <option key={off._id} value={off._id}>
                                                                {off.username} ({off.role})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            <div className={`flex items-end ${user.role === 'admin' ? '' : 'lg:col-span-2'}`}>
                                                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-xl font-bold uppercase transition-all shadow-lg shadow-green-600/20">
                                                    Initialize Match
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {matches.length > 0 ? matches.map(match => (
                                    <div key={`match-scorer-${match._id}`} className="glass-morphism p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center group transition-all hover:bg-white/5 border border-white/5">
                                        <div className="flex items-center space-x-6 mb-4 md:mb-0">
                                            <div className={`w-3 h-3 rounded-full ${match.status === 'live' ? 'bg-red-500 animate-pulse' : (match.status === 'upcoming' ? 'bg-blue-500' : 'bg-slate-700')}`} />
                                            <div>
                                                <div className="font-bold text-lg">{match.teamA?.name} vs {match.teamB?.name}</div>
                                                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{match.sport === 'badminton' ? 'Badminton' : 'Throwball'}</div>
                                                <div className="text-sm text-slate-500 flex items-center space-x-3 mb-1">
                                                    <span className="flex items-center"><Flag size={14} className="mr-1" /> {match.tournament?.name}</span>
                                                    <span>•</span>
                                                    {!match.scorer ? (
                                                        <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-amber-500/20">Assignment Pending</span>
                                                    ) : (
                                                        <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(match.date).toLocaleDateString()}</span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center">
                                                    <Shield size={10} className="mr-1" /> Scorer:
                                                    {user.role === 'admin' ? (
                                                        <select
                                                            className="ml-2 bg-slate-800 border-none text-primary focus:ring-0 p-0 text-[10px] font-black uppercase cursor-pointer"
                                                            value={match.scorer?._id || match.scorer}
                                                            onChange={(e) => handleAssignScorer(match._id, e.target.value)}
                                                        >
                                                            <option value="">Choose Scorer</option>
                                                            {officials.map(o => (
                                                                <option key={o._id} value={o._id}>{o.username}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <span className="text-primary ml-1">{match.scorer?.username || 'Unassigned'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            {match.status !== 'completed' && (
                                                user.role === 'admin' ? (
                                                    <Link
                                                        to={`/match/${match._id}`}
                                                        className="px-6 py-2 rounded-xl font-bold text-sm flex items-center space-x-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/10 border border-blue-500/20"
                                                    >
                                                        <Trophy size={16} />
                                                        <span>VIEW LIVE</span>
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to={`/admin/match/${match._id}`}
                                                        className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all ${((match.scorer?._id || match.scorer)?.toString() === (user.id || user._id)?.toString())
                                                            ? 'bg-primary/20 text-primary hover:bg-primary hover:text-white shadow-lg shadow-primary/20'
                                                            : 'bg-slate-800 text-slate-600 cursor-not-allowed pointer-events-none'
                                                            }`}
                                                    >
                                                        <Play size={16} />
                                                        <span>{((match.scorer?._id || match.scorer)?.toString() === (user.id || user._id)?.toString()) ? 'SCORE MATCH' : 'NOT ASSIGNED'}</span>
                                                    </Link>
                                                )
                                            )}
                                            <button
                                                onClick={() => handleDeleteMatch(match._id)}
                                                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                                                title="Delete Match"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 text-slate-500 glass-morphism rounded-3xl">
                                        No matches assigned or scheduled yet.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'teams' && (
                        <motion.div
                            key="teams"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <TeamManagement onUpdate={fetchInitialData} />
                        </motion.div>
                    )}

                    {activeTab === 'tournaments' && (
                        <motion.div
                            key="tournaments"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <TournamentManagement onUpdate={fetchInitialData} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ScorerDashboard;

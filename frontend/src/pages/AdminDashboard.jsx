import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Plus, Trophy, Users, Play, Trash2, Calendar, LayoutDashboard, Flag, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import TeamManagement from '../components/TeamManagement';
import TournamentManagement from '../components/TournamentManagement';
import UserManagement from '../components/UserManagement';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('matches');
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [showCreateMatch, setShowCreateMatch] = useState(false);
    const [newMatch, setNewMatch] = useState({
        teamAName: '', teamBName: '', tournament: '', venue: '', date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [matchesRes, teamsRes, tourneyRes] = await Promise.all([
                axios.get('/matches'),
                axios.get('/teams'),
                axios.get('/tournaments')
            ]);
            setMatches(matchesRes.data.data);
            setTeams(teamsRes.data.data);
            setTournaments(tourneyRes.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateMatch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/matches', newMatch);
            setMatches([...matches, res.data.data]);
            setShowCreateMatch(false);
            setNewMatch({ teamAName: '', teamBName: '', tournament: '', venue: '', date: new Date().toISOString().split('T')[0] });
            toast.success('Match scheduled successfully!');
        } catch (err) {
            toast.error('Error creating match');
        }
    };

    const handleDeleteMatch = async (id) => {
        if (!window.confirm('Delete this match?')) return;
        try {
            await axios.delete(`/matches/${id}`);
            setMatches(matches.filter(m => m._id !== id));
            toast.success('Match deleted');
        } catch (err) {
            toast.error('Error deleting match');
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <LayoutDashboard className="text-primary" size={36} />
                        Admin Command Center
                    </h1>
                    <p className="text-slate-500 font-medium">Full control of your Throwball ecosystem</p>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex p-1 bg-slate-800/50 rounded-2xl w-fit border border-white/5">
                {[
                    { id: 'matches', label: 'Matches', icon: Trophy },
                    { id: 'teams', label: 'Teams', icon: Users },
                    { id: 'tournaments', label: 'Tournaments', icon: Flag },
                    { id: 'users', label: 'Officials', icon: Shield }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={18} />
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
                                <button
                                    onClick={() => setShowCreateMatch(!showCreateMatch)}
                                    className="bg-primary hover:bg-secondary px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-primary/20"
                                >
                                    <Plus size={20} />
                                    <span>Schedule Match</span>
                                </button>
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
                                                <label className="text-xs font-bold text-slate-500 uppercase">Tournament</label>
                                                <select
                                                    className="w-full bg-slate-800 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary"
                                                    value={newMatch.tournament}
                                                    onChange={(e) => setNewMatch({ ...newMatch, tournament: e.target.value })}
                                                    required
                                                >
                                                    <option value="">Select Tournament</option>
                                                    {tournaments.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                                </select>
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
                                            <div className="flex items-end">
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
                                    <div key={`match-admin-${match._id}`} className="glass-morphism p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center group transition-all hover:bg-white/5 border border-white/5">
                                        <div className="flex items-center space-x-6 mb-4 md:mb-0">
                                            <div className={`w-3 h-3 rounded-full ${match.status === 'live' ? 'bg-red-500 animate-pulse' : (match.status === 'upcoming' ? 'bg-blue-500' : 'bg-slate-700')}`} />
                                            <div>
                                                <div className="font-bold text-lg">{match.teamA?.name} vs {match.teamB?.name}</div>
                                                <div className="text-sm text-slate-500 flex items-center space-x-3">
                                                    <span className="flex items-center"><Flag size={14} className="mr-1" /> {match.tournament?.name}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(match.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            {match.status !== 'completed' && (
                                                <Link
                                                    to={`/admin/match/${match._id}`}
                                                    className="bg-primary/20 text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center space-x-2 transition-all"
                                                >
                                                    <Play size={16} />
                                                    <span>CONTROL</span>
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleDeleteMatch(match._id)}
                                                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 text-slate-500 glass-morphism rounded-3xl">
                                        No matches scheduled yet.
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
                            <TeamManagement />
                        </motion.div>
                    )}

                    {activeTab === 'tournaments' && (
                        <motion.div
                            key="tournaments"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <TournamentManagement />
                        </motion.div>
                    )}

                    {activeTab === 'users' && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <UserManagement />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboard;

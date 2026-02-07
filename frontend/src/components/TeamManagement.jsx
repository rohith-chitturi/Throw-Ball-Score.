import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Plus, Trash2, Edit2, Users, UserPlus, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const TeamManagement = ({ onUpdate }) => {
    const [teams, setTeams] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [newTeam, setNewTeam] = useState({ name: '', shortName: '' });
    const [newPlayer, setNewPlayer] = useState({ name: '', jerseyNumber: '', isCaptain: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await axios.get('/teams');
            setTeams(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/teams', newTeam);
            setNewTeam({ name: '', shortName: '' });
            setShowCreate(false);
            fetchTeams();
            if (onUpdate) onUpdate();
            toast.success('Team created successfully!');
        } catch (err) {
            toast.error('Error creating team');
        }
    };

    const handleAddPlayer = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/teams/${selectedTeam._id}/players`, newPlayer);
            setNewPlayer({ name: '', jerseyNumber: '', isCaptain: false });
            toast.success('Player added to squad!');
            // Refresh specified team in the list
            const res = await axios.get('/teams');
            const updatedTeams = res.data.data;
            setTeams(updatedTeams);
            setSelectedTeam(updatedTeams.find(t => t._id === selectedTeam._id));
        } catch (err) {
            if (err.response?.status === 403) {
                toast.error('Forbidden: Admin access required');
            } else {
                toast.error('Error adding player');
            }
        }
    };

    const handleDeletePlayer = async (playerId) => {
        if (!window.confirm('Remove this player?')) return;
        try {
            await axios.delete(`/teams/players/${playerId}`);
            const res = await axios.get('/teams');
            const updatedTeams = res.data.data;
            setTeams(updatedTeams);
            setSelectedTeam(updatedTeams.find(t => t._id === selectedTeam._id));
            toast.success('Player removed');
        } catch (err) {
            toast.error('Error deleting player');
        }
    };

    const handleDeleteTeam = async (id) => {
        if (!window.confirm('Are you sure? This will delete all players in this team as well.')) return;
        try {
            await axios.delete(`/teams/${id}`);
            fetchTeams();
            if (onUpdate) onUpdate();
            toast.success('Team deleted');
        } catch (err) {
            toast.error('Error deleting team');
        }
    };

    if (loading) return <div className="text-slate-500">Loading teams...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Teams</h2>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="bg-primary hover:bg-secondary px-6 py-3 rounded-2xl flex items-center space-x-2 transition-all font-bold uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
                >
                    <Plus size={18} />
                    <span>Add New Team</span>
                </button>
            </div>

            {showCreate && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-morphism p-8 rounded-3xl border border-white/5"
                >
                    <form onSubmit={handleCreateTeam} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Team Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-medium"
                                placeholder="e.g. Royal Strikers"
                                value={newTeam.name}
                                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Short Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-medium uppercase"
                                placeholder="e.g. RST"
                                maxLength={3}
                                value={newTeam.shortName}
                                onChange={(e) => setNewTeam({ ...newTeam, shortName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full bg-primary py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:bg-secondary active:scale-95">Save Team Profile</button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team, idx) => (
                    <motion.div
                        whileHover={{ y: -5 }}
                        key={`team-manage-${team._id || idx}`}
                        className="glass-morphism p-6 rounded-[2rem] border border-white/5 flex flex-col justify-between group"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-4xl font-black italic text-primary/40 group-hover:text-primary transition-colors">{team.shortName}</div>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => setSelectedTeam(team)}
                                        className="p-3 bg-white/5 hover:bg-primary/20 rounded-xl transition-all text-slate-400 hover:text-primary"
                                    >
                                        <Users size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTeam(team._id)}
                                        className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl transition-all text-slate-500 hover:text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="font-black text-xl uppercase tracking-tight">{team.name}</div>
                            <div className="text-xs text-slate-500 flex items-center mt-2 font-bold uppercase tracking-widest">
                                <Users size={12} className="mr-2 text-primary" />
                                {team.players?.length || 0} Registered Players
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Players Modal */}
            <AnimatePresence>
                {selectedTeam && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTeam(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl glass-morphism rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="bg-white/5 p-8 border-b border-white/5 flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Squad Management</h3>
                                    <p className="text-primary text-sm font-bold uppercase tracking-widest">{selectedTeam.name}</p>
                                </div>
                                <button onClick={() => setSelectedTeam(null)} className="p-3 hover:bg-white/5 rounded-2xl transition-colors">
                                    <X />
                                </button>
                            </div>

                            <div className="p-8 max-h-[60vh] overflow-y-auto">
                                <form onSubmit={handleAddPlayer} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white/5 p-6 rounded-3xl border border-white/5">
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Player Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary transition-all"
                                            placeholder="Enter full name"
                                            value={newPlayer.name}
                                            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jersey No.</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary transition-all"
                                            placeholder="0-99"
                                            value={newPlayer.jerseyNumber}
                                            onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex items-center">
                                        <label className="flex items-center cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={newPlayer.isCaptain}
                                                onChange={(e) => setNewPlayer({ ...newPlayer, isCaptain: e.target.checked })}
                                            />
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${newPlayer.isCaptain ? 'bg-primary border-primary' : 'border-white/10 group-hover:border-primary/50'}`}>
                                                {newPlayer.isCaptain && <Shield size={14} className="text-white" />}
                                            </div>
                                            <span className="ml-3 text-sm font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Designate as Captain</span>
                                        </label>
                                    </div>
                                    <div className="md:col-span-1">
                                        <button type="submit" className="w-full bg-primary py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center space-x-2 shadow-lg shadow-primary/20">
                                            <UserPlus size={16} />
                                            <span>Add Player</span>
                                        </button>
                                    </div>
                                </form>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Current Roster</h4>
                                    {selectedTeam.players?.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedTeam.players.map((player, pIdx) => (
                                                <div key={`player-manage-${player._id || pIdx}`} className="bg-slate-900 border border-white/5 p-4 rounded-2xl flex justify-between items-center group">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-primary">
                                                            {player.jerseyNumber}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold flex items-center font-xl tracking-tight">
                                                                {player.name}
                                                                {player.isCaptain && <Shield size={12} className="ml-2 text-primary" />}
                                                            </div>
                                                            <div className="text-[10px] text-slate-500 font-bold uppercase">Squad Member</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeletePlayer(player._id)}
                                                        className="p-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-white/5 rounded-[2rem] border border-dashed border-white/10 text-slate-600 font-bold uppercase tracking-widest text-xs">
                                            No players registered yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeamManagement;

import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Plus, Trash2, Calendar, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TournamentManagement = ({ onUpdate }) => {
    const [tournaments, setTournaments] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [newTourney, setNewTourney] = useState({ name: '', startDate: '', endDate: '', venue: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const res = await axios.get('/tournaments');
            setTournaments(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/tournaments', newTourney);
            setNewTourney({ name: '', startDate: '', endDate: '', venue: '' });
            setShowCreate(false);
            fetchTournaments();
            if (onUpdate) onUpdate();
            toast.success('Tournament created!');
        } catch (err) {
            toast.error('Error creating tournament');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tournament?')) return;
        try {
            await axios.delete(`/tournaments/${id}`);
            fetchTournaments();
            if (onUpdate) onUpdate();
            toast.success('Tournament removed');
        } catch (err) {
            toast.error('Error deleting tournament');
        }
    };

    if (loading) return <div className="text-slate-500">Loading tournaments...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Tournaments</h2>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="bg-primary hover:bg-secondary px-4 py-2 rounded-xl flex items-center space-x-2 transition-all"
                >
                    <Plus size={18} />
                    <span>New Tournament</span>
                </button>
            </div>

            {showCreate && (
                <div className="glass-morphism p-6 rounded-2xl">
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Tournament Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary"
                                placeholder="e.g. Hyderabad Open 2026"
                                value={newTourney.name}
                                onChange={(e) => setNewTourney({ ...newTourney, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                            <input
                                type="date"
                                className="w-full bg-slate-800 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary"
                                value={newTourney.startDate}
                                onChange={(e) => setNewTourney({ ...newTourney, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">End Date</label>
                            <input
                                type="date"
                                className="w-full bg-slate-800 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary"
                                value={newTourney.endDate}
                                onChange={(e) => setNewTourney({ ...newTourney, endDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Main Venue</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-primary"
                                placeholder="e.g. Central Stadium"
                                value={newTourney.venue}
                                onChange={(e) => setNewTourney({ ...newTourney, venue: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full bg-primary py-3 rounded-xl font-bold uppercase tracking-widest">Create Tournament</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {tournaments.map((tourney, tIdx) => (
                    <div key={tourney._id || tIdx} className="glass-morphism p-6 rounded-2xl flex justify-between items-center group">
                        <div className="flex items-center space-x-6">
                            <div className="bg-primary/10 p-4 rounded-2xl">
                                <Calendar className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{tourney.name}</h3>
                                <div className="text-sm text-slate-500 flex items-center space-x-4 mt-1">
                                    <span className="flex items-center"><MapPin size={14} className="mr-1" /> {tourney.venue}</span>
                                    <span>•</span>
                                    <span>{new Date(tourney.startDate).toLocaleDateString()} - {new Date(tourney.endDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(tourney._id)}
                            className="p-3 text-slate-500 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TournamentManagement;

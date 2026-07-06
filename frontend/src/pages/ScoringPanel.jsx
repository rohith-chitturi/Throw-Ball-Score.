import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ChevronLeft, Info, Trophy, Wifi, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ScoringPanel = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const res = await axios.get(`/matches/${id}`);
                setMatch(res.data.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 403) {
                    toast.error('You are not authorized to score this match.');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchMatch();
    }, [id, navigate]);

    // Authorization check
    // ONLY THE ASSIGNED SCORER has access to this panel. Admins use the public view.
    const isAuthorized = (match?.scorer?._id === (user?.id || user?._id) || match?.scorer === (user?.id || user?._id));
    const canEdit = isAuthorized;


    const handleUpdateScore = async (team, points) => {
        if (updating || match.status === 'completed') return;
        setUpdating(true);
        try {
            const res = await axios.post(`/matches/${id}/score`, { team, points });
            setMatch(res.data.data);
            if (points > 0) toast.success(`Point added for ${team === 'teamA' ? match.teamA.name : match.teamB.name}`);
        } catch (err) {
            toast.error('Error updating score');
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            const res = await axios.patch(`/matches/${id}/status`, { status });
            setMatch(res.data.data);
            toast.success(`Match status: ${status}`);
        } catch (err) {
            toast.error('Error updating status');
        }
    };

    if (loading) return <div className="text-center mt-20">Loading controller...</div>;
    if (!match) return <div className="text-center mt-20">Match not found</div>;

    const currentSet = match.sets[match.currentSet - 1];

    if (!isAuthorized) {
        return (
            <div className="max-w-4xl mx-auto mt-20 p-8 glass-morphism rounded-3xl text-center space-y-4">
                <AlertTriangle size={64} className="mx-auto text-red-500" />
                <h2 className="text-2xl font-bold">Unauthorized Access</h2>
                <p className="text-slate-400">You are not the assigned official for this match.</p>
                <button
                    onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/scorer')}
                    className="bg-primary px-8 py-3 rounded-2xl font-bold"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header className="flex justify-between items-center">
                <button
                    onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/scorer')}
                    className="flex items-center text-slate-400 hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>
                <div className="flex items-center space-x-2 text-green-500 text-sm font-bold">
                    <Wifi size={16} />
                    <span>REAL-TIME CONNECTED</span>
                </div>
            </header>

            {match.status === 'upcoming' && (
                <div className={`${!match.scorer ? 'bg-amber-500/10 border-amber-500/20' : 'bg-blue-500/10 border-blue-500/20'} border p-6 rounded-3xl flex justify-between items-center`}>
                    <div>
                        <h2 className="font-bold text-lg">{!match.scorer ? 'Assignment Required' : 'Match ready to start'}</h2>
                        <p className="text-slate-400 text-sm">
                            {!match.scorer
                                ? 'An Admin must assign a scorer before this match can go live.'
                                : 'Initialize scoring once teams are ready'}
                        </p>
                    </div>
                    <button
                        disabled={!match.scorer || !canEdit}
                        onClick={() => handleUpdateStatus('live')}
                        className={`${(!match.scorer || !canEdit) ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} px-8 py-3 rounded-2xl font-bold uppercase tracking-widest transition-all`}
                    >
                        {!match.scorer ? 'Wait for Admin' : (!canEdit ? 'View Only' : 'Go Live')}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Team A Control */}
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="glass-morphism p-8 rounded-[2.5rem] border-b-8 border-primary text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 p-4 opacity-5 text-6xl font-black italic">{match.teamA?.shortName || 'A'}</div>
                    <div className="relative z-10">
                        <h3 className="text-xl md:text-2xl font-black uppercase mb-1 text-primary">{match.teamA?.name || 'Team A'}</h3>
                        <div className="text-xs font-bold text-slate-500 tracking-[0.3em] mb-6">POINT PROVIDER A</div>
                        <div className="text-7xl md:text-9xl font-black mb-8 italic text-white drop-shadow-2xl">{currentSet?.teamAScore || 0}</div>
                        <div className="flex space-x-4">
                            <button
                                disabled={updating || match.status !== 'live' || currentSet?.isCompleted || !canEdit}
                                onClick={() => handleUpdateScore('teamA', -1)}
                                className="flex-1 bg-slate-800/80 hover:bg-slate-700 py-6 rounded-2xl font-black text-2xl transition-all disabled:opacity-50 border border-white/5"
                            >
                                -
                            </button>
                            <button
                                disabled={updating || match.status !== 'live' || currentSet?.isCompleted || !canEdit}
                                onClick={() => handleUpdateScore('teamA', 1)}
                                className="flex-[2] bg-primary hover:bg-secondary py-6 rounded-2xl font-black text-4xl shadow-lg shadow-primary/30 transition-all disabled:opacity-50 active:scale-95 text-white"
                            >
                                +1 PT
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Team B Control */}
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="glass-morphism p-8 rounded-[2rem] border-b-8 border-purple-500 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-black italic">{match.teamB?.shortName || 'B'}</div>
                    <div className="relative z-10">
                        <h3 className="text-xl md:text-2xl font-black uppercase mb-1 text-purple-400">{match.teamB?.name || 'Team B'}</h3>
                        <div className="text-xs font-bold text-slate-500 tracking-[0.3em] mb-6">POINT PROVIDER B</div>
                        <div className="text-7xl md:text-9xl font-black mb-8 italic text-white drop-shadow-2xl">{currentSet?.teamBScore || 0}</div>
                        <div className="flex space-x-4">
                            <button
                                disabled={updating || match.status !== 'live' || currentSet?.isCompleted || !canEdit}
                                onClick={() => handleUpdateScore('teamB', -1)}
                                className="flex-1 bg-slate-800/80 hover:bg-slate-700 py-6 rounded-2xl font-black text-2xl transition-all disabled:opacity-50 border border-white/5"
                            >
                                -
                            </button>
                            <button
                                disabled={updating || match.status !== 'live' || currentSet?.isCompleted || !canEdit}
                                onClick={() => handleUpdateScore('teamB', 1)}
                                className="flex-[2] bg-purple-600 hover:bg-purple-700 py-6 rounded-2xl font-black text-4xl shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 active:scale-95 text-white"
                            >
                                +1 PT
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-morphism p-6 rounded-3xl flex items-center space-x-4 border border-white/5">
                    <div className="bg-primary/20 p-3 rounded-2xl"><Trophy className="text-primary" size={24} /></div>
                    <div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Set</div>
                        <div className="font-black text-xl italic">SET {match.currentSet} <span className="text-slate-600 text-sm">/ 3</span></div>
                    </div>
                </div>

                <div className="glass-morphism p-6 rounded-3xl flex items-center space-x-3">
                    <div className="bg-orange-500/20 p-2 rounded-lg"><Info className="text-orange-500" size={20} /></div>
                    <div>
                        <div className="text-xs text-slate-500 font-bold uppercase">{match.sport === 'badminton' ? 'Badminton' : 'Throwball'} Rules</div>
                        <div className="font-bold">First to {match.pointsPerSet || 27} Wins Set</div>
                    </div>
                </div>

                <div className="glass-morphism p-6 rounded-3xl flex flex-col justify-center border border-white/5">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Championship Status</div>
                    <div className="font-black text-primary italic text-lg uppercase tracking-tight">
                        {match.matchWinner ? (
                            (match.matchWinner === match.teamA?._id || match.matchWinner?._id === match.teamA?._id)
                                ? (match.teamA?.name || 'Team A')
                                : (match.teamB?.name || 'Team B')
                        ) : 'BATTLE IN PROGRESS'}
                    </div>
                </div>
            </div>

            {match.status === 'completed' && (
                <div className="bg-green-500/20 border border-green-500/30 p-8 rounded-3xl text-center">
                    <h2 className="text-3xl font-black text-green-500 italic mb-2">MATCH ARCHIVED</h2>
                    <p className="text-green-500/60 uppercase tracking-widest font-bold">Final scores synced and locked</p>
                </div>
            )}
        </div>
    );
};

export default ScoringPanel;

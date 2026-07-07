import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Lock, User, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginSport, setLoginSport] = useState('throwball');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'scorer') navigate('/scorer');
            else navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/auth/login', { username, password });
            login(res.data.user, res.data.token, loginSport);
            toast.success(`Welcome back, ${res.data.user.username}!`);
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else if (res.data.user.role === 'scorer') {
                navigate('/scorer');
            } else {
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-glass-panel p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Lock className="text-primary" size={32} />
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                        Welcome <span className="text-primary italic underline decoration-4 underline-offset-8">Back</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-4 font-bold uppercase tracking-widest">Login to Access Scoreboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Username</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-all font-medium"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {/* Sport Context Selection */}
                    <div className="space-y-3 pt-2">
                        <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest text-center block w-full">Select Operational Context</label>
                        <div className="flex p-1 premium-glass rounded-2xl w-full border border-white/5">
                            <button
                                type="button"
                                onClick={() => setLoginSport('throwball')}
                                className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${loginSport === 'throwball'
                                    ? 'bg-primary text-black shadow-[0_0_20px_theme(colors.primary/0.4)]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Throwball
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginSport('badminton')}
                                className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${loginSport === 'badminton'
                                    ? 'bg-badminton text-white shadow-[0_0_20px_theme(colors.badminton/0.4)]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Badminton
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-secondary py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all disabled:opacity-50 active:scale-95"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-10 text-center space-y-6">
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">
                        First time here?{' '}
                        <Link to="/signup" className="text-primary hover:text-white underline underline-offset-4 decoration-2 transition-all ml-1">
                            Sign Up
                        </Link>
                    </p>

                    <div className="pt-6 border-t border-white/5">
                        <div className="text-[10px] text-slate-600 flex items-center justify-center uppercase tracking-[0.3em] font-black">
                            <Terminal size={12} className="mr-2" /> Secure Authentication v.2
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

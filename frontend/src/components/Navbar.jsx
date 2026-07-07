import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User as UserIcon, LayoutDashboard, Home, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        toast.success('Signed out successfully');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Top Bar (Floating Pill on Desktop, Sticky on Mobile) */}
            <div className="fixed top-0 left-0 right-0 z-50 pt-4 md:pt-6 px-4 pointer-events-none flex justify-center">
                <motion.nav 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="premium-glass pointer-events-auto rounded-full px-6 py-3 md:py-4 w-full max-w-5xl flex justify-between items-center transition-all shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
                >
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="bg-primary/20 p-2 rounded-full border border-primary/30 group-hover:bg-primary/40 transition-colors">
                            <Activity className="text-primary w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                        </div>
                        <span className="text-lg md:text-xl font-display font-black tracking-tight text-white group-hover:text-primary transition-colors">
                            Live<span className="font-light">Score</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2 bg-white/5 p-1 rounded-full border border-white/10">
                        <Link to="/" className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${isActive('/') ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>Home</Link>
                        
                        {user ? (
                            <>
                                {(user.role === 'admin' || user.role === 'scorer') && (
                                    <Link to={user.role === 'admin' ? "/admin" : "/scorer"} className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${isActive('/admin') || isActive('/scorer') ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                        Dashboard
                                    </Link>
                                )}
                            </>
                        ) : null}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/profile" className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors group pl-4 border-l border-white/10">
                                    <div className="flex flex-col items-end">
                                        <span className="text-white font-bold leading-none text-sm group-hover:text-primary transition-colors">{user.username}</span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${user.role === 'admin' ? 'text-primary' : (user.role === 'scorer' ? 'text-blue-400' : 'text-slate-500')}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="bg-white/5 p-2 rounded-full border border-white/10 group-hover:border-primary/50 transition-colors">
                                        <UserIcon size={18} />
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2.5 rounded-full transition-all border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0)] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                                >
                                    <LogOut size={16} strokeWidth={3} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
                                <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors px-4">Login</Link>
                                <Link to="/signup" className="bg-primary hover:bg-primary/90 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] text-charcoal">Sign Up</Link>
                            </div>
                        )}
                    </div>
                    
                    {/* Mobile Top Actions (If not logged in) */}
                    {!user && (
                        <div className="md:hidden flex space-x-2">
                             <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 px-4 py-2 rounded-full">Login</Link>
                        </div>
                    )}
                </motion.nav>
            </div>
            
            {/* Spacer for fixed nav */}
            <div className="h-24 md:h-32"></div>

            {/* Mobile Bottom Navigation - Kept simple but themed */}
            {user && (
                <div className="md:hidden fixed bottom-4 left-4 right-4 premium-glass z-50 px-6 py-3 flex justify-between items-center rounded-3xl pb-[max(env(safe-area-inset-bottom),12px)]">
                    <Link to="/" className={`flex flex-col items-center space-y-1 ${isActive('/') ? 'text-primary scale-110' : 'text-slate-500 hover:text-white'} transition-all`}>
                        <Home size={20} strokeWidth={isActive('/') ? 3 : 2} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Home</span>
                    </Link>

                    {(user.role === 'admin' || user.role === 'scorer') && (
                        <Link to={user.role === 'admin' ? "/admin" : "/scorer"} className={`flex flex-col items-center space-y-1 ${isActive('/admin') || isActive('/scorer') ? 'text-primary scale-110' : 'text-slate-500 hover:text-white'} transition-all`}>
                            <LayoutDashboard size={20} strokeWidth={isActive('/admin') || isActive('/scorer') ? 3 : 2} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Panel</span>
                        </Link>
                    )}

                    <Link to="/profile" className={`flex flex-col items-center space-y-1 ${isActive('/profile') ? 'text-primary scale-110' : 'text-slate-500 hover:text-white'} transition-all`}>
                        <UserIcon size={20} strokeWidth={isActive('/profile') ? 3 : 2} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Profile</span>
                    </Link>

                    <button onClick={handleLogout} className="flex flex-col items-center space-y-1 text-red-500/70 hover:text-red-500 transition-all">
                        <LogOut size={20} strokeWidth={2} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Exit</span>
                    </button>
                </div>
            )}
        </>
    );
};

export default Navbar;

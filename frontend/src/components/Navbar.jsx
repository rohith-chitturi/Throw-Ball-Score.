import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User as UserIcon, LayoutDashboard, Home } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
            {/* Top Bar (Universal) */}
            <nav className="glass-morphism sticky top-0 z-50 px-6 py-4 mb-4 md:mb-8 border-b border-white/5 shadow-md bg-black/40">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <Activity className="text-primary w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-xl md:text-2xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-300">
                            Live Sports
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">Matches</Link>

                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="flex items-center space-x-1 hover:text-primary transition-colors">
                                        <LayoutDashboard size={18} />
                                        <span>Admin Panel</span>
                                    </Link>
                                )}
                                {user.role === 'scorer' && (
                                    <Link to="/scorer" className="flex items-center space-x-1 hover:text-primary transition-colors">
                                        <LayoutDashboard size={18} />
                                        <span>Scorer Panel</span>
                                    </Link>
                                )}
                                <div className="flex items-center space-x-4 ml-4">
                                    <Link to="/profile" className="flex items-center space-x-2 text-slate-400 hover:text-primary transition-colors">
                                        <div className="flex flex-col items-end mr-1">
                                            <span className="text-white font-bold leading-none">{user.username}</span>
                                            <span className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded mt-1 ${user.role === 'admin' ? 'bg-primary/20 text-primary' : (user.role === 'scorer' ? 'bg-green-500/20 text-green-500' : 'bg-slate-700 text-slate-400')}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <UserIcon size={20} className="text-slate-500" />
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-full transition-all"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors px-4">Login</Link>
                                <Link to="/signup" className="bg-primary hover:bg-secondary px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20 text-black">Sign Up</Link>
                            </div>
                        )}
                    </div>
                    
                    {/* Mobile Top Actions (If not logged in) */}
                    {!user && (
                        <div className="md:hidden flex space-x-2">
                             <Link to="/login" className="text-xs font-bold uppercase text-primary border border-primary px-3 py-1.5 rounded-lg">Login</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            {user && (
                <div className="md:hidden fixed bottom-0 left-0 w-full glass-morphism border-t border-white/10 z-50 px-6 py-3 flex justify-between items-center pb-[max(env(safe-area-inset-bottom),12px)] bg-black/60">
                    <Link to="/" className={`flex flex-col items-center space-y-1 ${isActive('/') ? 'text-primary scale-110' : 'text-slate-500 hover:text-white'} transition-all`}>
                        <Home size={22} strokeWidth={isActive('/') ? 3 : 2} />
                        <span className="text-[9px] font-bold uppercase">Home</span>
                    </Link>

                    {(user.role === 'admin' || user.role === 'scorer') && (
                        <Link to={user.role === 'admin' ? "/admin" : "/scorer"} className={`flex flex-col items-center space-y-1 ${isActive('/admin') || isActive('/scorer') ? 'text-primary scale-110' : 'text-slate-500 hover:text-white'} transition-all`}>
                            <LayoutDashboard size={22} strokeWidth={isActive('/admin') || isActive('/scorer') ? 3 : 2} />
                            <span className="text-[9px] font-bold uppercase">Dashboard</span>
                        </Link>
                    )}

                    <Link to="/profile" className={`flex flex-col items-center space-y-1 ${isActive('/profile') ? 'text-primary scale-110' : 'text-slate-500 hover:text-white'} transition-all`}>
                        <UserIcon size={22} strokeWidth={isActive('/profile') ? 3 : 2} />
                        <span className="text-[9px] font-bold uppercase">Profile</span>
                    </Link>

                    <button onClick={handleLogout} className="flex flex-col items-center space-y-1 text-red-500/70 hover:text-red-500 transition-all">
                        <LogOut size={22} strokeWidth={2} />
                        <span className="text-[9px] font-bold uppercase">Log Out</span>
                    </button>
                </div>
            )}
        </>
    );
};

export default Navbar;

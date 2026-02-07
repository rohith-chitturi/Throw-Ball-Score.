import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, LogOut, User as UserIcon, LayoutDashboard, Menu, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        toast.success('Signed out successfully');
    };

    return (
        <nav className="glass-morphism sticky top-0 z-50 px-6 py-4 mb-4 md:mb-8">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                    <Trophy className="text-primary w-6 h-6 md:w-8 md:h-8" />
                    <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        Throwball Live
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center space-x-6">
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
                            <Link to="/signup" className="bg-primary hover:bg-secondary px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20">Sign Up</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden p-2 text-slate-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Sidebar/Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden mt-4 pt-4 border-t border-white/5 overflow-hidden"
                    >
                        <div className="flex flex-col space-y-4 pb-4">
                            <Link
                                to="/"
                                className="px-4 py-2 hover:bg-primary/10 rounded-xl transition-colors font-bold uppercase tracking-widest text-sm"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Matches
                            </Link>

                            {user ? (
                                <>
                                    {user.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            className="px-4 py-2 flex items-center space-x-2 hover:bg-primary/10 rounded-xl transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <LayoutDashboard size={20} />
                                            <span>Admin Panel</span>
                                        </Link>
                                    )}
                                    {user.role === 'scorer' && (
                                        <Link
                                            to="/scorer"
                                            className="px-4 py-2 flex items-center space-x-2 hover:bg-primary/10 rounded-xl transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <LayoutDashboard size={20} />
                                            <span>Scorer Panel</span>
                                        </Link>
                                    )}
                                    <Link
                                        to="/profile"
                                        className="px-4 py-4 flex items-center justify-between border-t border-white/5 mt-4"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <UserIcon size={24} className="text-primary" />
                                            <div>
                                                <p className="font-bold text-white">{user.username}</p>
                                                <p className="text-[10px] uppercase font-black text-slate-500">{user.role}</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="mx-4 flex items-center justify-center space-x-2 bg-red-500/10 text-red-500 py-3 rounded-xl font-bold uppercase text-xs tracking-widest mt-2"
                                    >
                                        <LogOut size={16} />
                                        <span>Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 px-4 pt-4 border-t border-white/5">
                                    <Link
                                        to="/login"
                                        className="text-center py-3 rounded-xl border border-white/10 font-bold uppercase text-xs tracking-widest"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="text-center bg-primary py-3 rounded-xl font-bold uppercase text-xs tracking-widest text-white shadow-lg shadow-primary/20"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

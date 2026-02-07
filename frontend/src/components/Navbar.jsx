import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        toast.success('Signed out successfully');
    };

    return (
        <nav className="glass-morphism sticky top-0 z-50 px-6 py-4 mb-8">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <Trophy className="text-primary w-8 h-8" />
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        Throwball Live
                    </span>
                </Link>

                <div className="flex items-center space-x-6">
                    <Link to="/" className="hover:text-primary transition-colors">Matches</Link>

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
                            <div className="flex items-center space-x-4">
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
                            <Link
                                to="/login"
                                className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors px-4"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-primary hover:bg-secondary px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

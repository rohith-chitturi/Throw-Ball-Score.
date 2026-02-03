import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { UserPlus, Trash2, Shield, User, Mail, ShieldAlert, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        username: '',
        email: '',
        password: '',
        role: 'admin'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/users');
            setUsers(res.data.data);
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/users', newAdmin);
            setNewAdmin({ username: '', email: '', password: '', role: 'admin' });
            setShowCreate(false);
            fetchUsers();
            toast.success('Admin account created successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error creating admin');
        }
    };

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await axios.patch(`/users/${userId}/role`, { role: newRole });
            fetchUsers();
            toast.success(`User role updated to ${newRole}`);
        } catch (err) {
            toast.error('Failed to update role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await axios.delete(`/users/${userId}`);
            fetchUsers();
            toast.success('User deleted');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error deleting user');
        }
    };

    if (loading) return <div className="text-slate-500">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Officials & Users</h2>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="bg-primary hover:bg-secondary px-6 py-3 rounded-2xl flex items-center space-x-2 transition-all font-bold uppercase text-xs tracking-widest shadow-lg shadow-primary/20"
                >
                    <UserPlus size={18} />
                    <span>Create New Official</span>
                </button>
            </div>

            {showCreate && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-morphism p-8 rounded-3xl border border-primary/20"
                >
                    <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-medium"
                                placeholder="johndoe"
                                value={newAdmin.username}
                                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-medium"
                                placeholder="admin@example.com"
                                value={newAdmin.email}
                                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password"
                                className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-primary transition-all font-medium"
                                placeholder="••••••••"
                                value={newAdmin.password}
                                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                minLength={8}
                                required
                            />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full bg-primary py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:bg-secondary active:scale-95">Save Admin</button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {users.map((user, idx) => (
                    <motion.div
                        key={`user-row-${user._id || idx}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-morphism p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center group border border-white/5"
                    >
                        <div className="flex items-center space-x-6 mb-4 md:mb-0">
                            <div className={`p-4 rounded-2xl ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-slate-800 text-slate-500'}`}>
                                {user.role === 'admin' ? <Shield size={24} /> : <User size={24} />}
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-xl font-bold">{user.username}</h3>
                                    {user.role === 'admin' && <span className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded-md font-black uppercase tracking-widest">Official Admin</span>}
                                </div>
                                <div className="text-sm text-slate-500 flex items-center mt-1">
                                    <Mail size={14} className="mr-2" />
                                    {user.email}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleToggleRole(user._id, user.role)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${user.role === 'admin'
                                    ? 'bg-slate-800 text-slate-400 hover:bg-orange-500/10 hover:text-orange-500'
                                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}
                            >
                                {user.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                            </button>
                            <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                title="Delete User"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;

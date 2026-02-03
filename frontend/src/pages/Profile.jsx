import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { User, Mail, Lock, Save, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        username: '',
        email: ''
    });
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/auth/me');
            setProfile({
                username: res.data.data.username,
                email: res.data.data.email
            });
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/auth/update-profile', {
                username: profile.username,
                email: profile.email
            });
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error updating profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        try {
            await axios.put('/auth/update-profile', {
                password: passwords.newPassword
            });
            setPasswords({ newPassword: '', confirmPassword: '' });
            toast.success('Password updated! Please login again.');
            setTimeout(() => logout(), 2000);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error updating password');
        }
    };

    if (loading) return <div className="text-slate-500">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                    <User className="text-primary" size={36} />
                    Account Settings
                </h1>
                <p className="text-slate-500 font-medium tracking-wide">Manage your account details and security</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-morphism p-8 rounded-3xl border border-white/5"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Shield className="text-primary" size={20} />
                        Basic Information
                    </h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 pl-12 focus:outline-none focus:border-primary transition-all font-medium"
                                    value={profile.username}
                                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 pl-12 focus:outline-none focus:border-primary transition-all font-medium"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-primary hover:bg-secondary py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group">
                            <Save size={18} className="group-hover:scale-110 transition-transform" />
                            Update Profile
                        </button>
                    </form>
                </motion.div>

                {/* Security / Password */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-morphism p-8 rounded-3xl border border-white/5"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Lock className="text-primary" size={20} />
                        Security Settings
                    </h2>
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 pl-12 focus:outline-none focus:border-primary transition-all font-medium"
                                    placeholder="••••••••"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    minLength={8}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-4 pl-12 focus:outline-none focus:border-primary transition-all font-medium"
                                    placeholder="••••••••"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    minLength={8}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group">
                            <Lock size={18} className="group-hover:rotate-12 transition-transform" />
                            Change Password
                        </button>
                    </form>
                </motion.div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-3xl">
                <p className="text-orange-500 text-sm font-bold flex items-center gap-3 uppercase tracking-tighter">
                    <Shield size={20} />
                    Critical Note: Changing your password will log you out of all sessions for security reasons.
                </p>
            </div>
        </div>
    );
};

export default Profile;

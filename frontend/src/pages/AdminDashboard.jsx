import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Shield, Users, Trophy, Flag, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TeamManagement from '../components/TeamManagement';
import TournamentManagement from '../components/TournamentManagement';
import UserManagement from '../components/UserManagement';
import ScorerDashboard from './ScorerDashboard'; // We can reuse the matches view from here or refactor it

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div className="space-y-8 pb-20 relative">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <header>
                <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter flex items-center gap-4">
                    <div className="p-3 bg-primary/20 text-primary rounded-2xl border border-primary/30">
                        <Shield size={32} />
                    </div>
                    System Operations
                </h1>
                <p className="text-slate-400 font-bold tracking-[0.2em] uppercase mt-4 text-sm">Manage official credentials and assign broadcasters to live events</p>
            </header>

            {/* Admin Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                <div className="flex flex-wrap p-1 premium-glass rounded-2xl w-full sm:w-fit">
                    {[
                        { id: 'users', label: 'Official Accounts', icon: Shield },
                        { id: 'matches', label: 'Match Assignments', icon: Trophy }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === tab.id
                                ? 'bg-primary text-black shadow-[0_0_20px_theme(colors.primary/0.4)]'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={16} />
                            <span className="truncate">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="p-4 premium-glass hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all hover-lift"
                    title="Force Refresh App"
                >
                    <Settings size={20} className="animate-spin-slow" />
                </button>
            </div>

            <main className="min-h-[600px] relative z-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'users' && (
                        <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="premium-glass-panel p-8 md:p-12 rounded-[3rem]">
                                <UserManagement />
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'matches' && (
                        <motion.div key="matches" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <ScorerDashboard isAdminView={true} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboard;

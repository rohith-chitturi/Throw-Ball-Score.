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
        <div className="space-y-8 pb-20">
            <header>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                    <Shield className="text-primary" size={36} />
                    Administrative Command
                </h1>
                <p className="text-slate-500 font-medium tracking-wide">Manage official credentials and assign scorers to active matches</p>
            </header>

            {/* Admin Tabs */}
            <div className="flex items-center space-x-4">
                <div className="flex p-1 bg-slate-800/50 rounded-2xl w-fit border border-white/5 shadow-2xl">
                    {[
                        { id: 'users', label: 'Official Accounts', icon: Shield },
                        { id: 'matches', label: 'Match Assignments', icon: Trophy }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="p-4 bg-slate-800/50 hover:bg-white/5 rounded-2xl border border-white/5 text-slate-400 hover:text-white transition-all shadow-xl"
                    title="Force Refresh App"
                >
                    <Settings size={20} className="animate-spin-slow" />
                </button>
            </div>

            <main className="min-h-[600px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'users' && (
                        <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="bg-slate-800/20 p-8 rounded-[2.5rem] border border-white/5">
                                <UserManagement />
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'matches' && (
                        <motion.div key="matches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <ScorerDashboard isAdminView={true} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboard;

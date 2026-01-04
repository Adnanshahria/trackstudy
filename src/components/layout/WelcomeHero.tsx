
import React from 'react';
import { Button } from '../ui/Button';

export const WelcomeHero: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">

        {/* Animated Background Effects - Neutral blues and teals */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 to-cyan-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/20 to-blue-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-gradient-to-r from-teal-500/15 to-emerald-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Subtle floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-blue-400/50 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute top-[60%] left-[80%] w-3 h-3 bg-teal-400/50 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute top-[30%] left-[70%] w-2 h-2 bg-cyan-400/50 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
            <div className="absolute top-[80%] left-[20%] w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '2s' }} />
        </div>

        {/* ===== HEADER ===== */}
        <header className="flex items-center justify-center px-6 lg:px-12 py-5 z-10 animate-fade-in">
            <div className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-blue-500/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <img src="./icons/icon-512.png" alt="Logo" className="w-10 h-10" />
                </div>
                <span className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-teal-100 bg-clip-text text-transparent">
                    TrackStudy
                </span>
            </div>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-6 lg:px-12 py-4 z-10">

            {/* LEFT: Hero Text */}
            <div className="flex-1 max-w-lg text-center lg:text-left animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-teal-500/20 border border-blue-500/30 text-blue-200 text-[10px] font-bold uppercase tracking-wider mb-4">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 animate-pulse" />
                    For HSC & SSC Students
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
                    Master Your Syllabus,<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400">
                        Ace Your Exams
                    </span>
                </h1>

                <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed">
                    The smart <span className="text-teal-400 font-semibold">weighted study tracker</span>. Track lectures, books & practice. Visualize progress. Stay ahead.
                </p>

                <Button
                    onClick={onLogin}
                    className="px-8 py-4 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40"
                >
                    🚀 Start Tracking →
                </Button>
            </div>

            {/* RIGHT: Features Grid */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { icon: '📊', title: 'Weighted Progress', desc: 'Custom weights for learning', color: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30' },
                        { icon: '📚', title: 'Full Syllabus', desc: 'HSC & SSC pre-loaded', color: 'from-teal-500/20 to-cyan-500/20', border: 'border-teal-500/30' },
                        { icon: '⏱️', title: 'Exam Countdown', desc: 'Days remaining tracker', color: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/30' },
                        { icon: '☁️', title: 'Cloud Sync', desc: 'Syncs across devices', color: 'from-cyan-500/20 to-sky-500/20', border: 'border-cyan-500/30' },
                        { icon: '📱', title: 'Offline First', desc: 'No internet needed', color: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/30' },
                        { icon: '🎯', title: 'Goal Tracking', desc: 'Set & achieve targets', color: 'from-indigo-500/20 to-blue-500/20', border: 'border-indigo-500/30' },
                    ].map((f, i) => (
                        <div
                            key={i}
                            className={`p-3 md:p-4 rounded-xl bg-gradient-to-br ${f.color} border ${f.border} hover:scale-105 transition-all duration-300 cursor-default group`}
                        >
                            <div className="text-xl mb-2 group-hover:animate-bounce">{f.icon}</div>
                            <div className="text-xs md:text-sm font-bold text-white">{f.title}</div>
                            <div className="text-[10px] text-slate-400">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </main>

        {/* ===== FOOTER: Stats Bar ===== */}
        <footer className="flex items-center justify-center gap-6 md:gap-12 px-6 py-4 bg-gradient-to-r from-slate-900/50 via-slate-800/50 to-slate-900/50 border-t border-white/10 z-10 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {[
                { value: '100%', label: 'Free', color: 'from-emerald-400 to-teal-400' },
                { value: 'Offline', label: 'Capable', color: 'from-blue-400 to-cyan-400' },
                { value: 'Cloud', label: 'Synced', color: 'from-teal-400 to-emerald-400' },
                { value: 'HSC+SSC', label: 'Syllabus', color: 'from-indigo-400 to-blue-400' },
            ].map((stat, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent" />}
                    <div className="text-center">
                        <div className={`text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                            {stat.value}
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider">{stat.label}</div>
                    </div>
                </React.Fragment>
            ))}
        </footer>
    </div>
);

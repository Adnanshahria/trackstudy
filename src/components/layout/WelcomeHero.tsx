
import React from 'react';
import { Button } from '../ui/Button';

export const WelcomeHero: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">

        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        {/* ===== HEADER ===== */}
        <header className="flex items-center justify-center px-6 lg:px-12 py-5 z-10">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                    <img src="./icons/icon-512.png" alt="Logo" className="w-10 h-10" />
                </div>
                <span className="text-2xl md:text-3xl font-black tracking-tight">TrackStudy</span>
            </div>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-6 lg:px-12 py-4 z-10">

            {/* LEFT: Hero Text */}
            <div className="flex-1 max-w-lg text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-4">
                    For HSC & SSC Students
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
                    Master Your Syllabus,<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Ace Your Exams</span>
                </h1>

                <p className="text-sm md:text-base text-slate-400 mb-6 leading-relaxed">
                    The smart weighted study tracker. Track lectures, books & practice. Visualize progress. Stay ahead.
                </p>

                <Button
                    onClick={onLogin}
                    className="px-6 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20"
                >
                    Start Tracking Free →
                </Button>
            </div>

            {/* RIGHT: Features Grid */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg">
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { icon: '📊', title: 'Weighted Progress', desc: 'Custom weights for learning' },
                        { icon: '📚', title: 'Full Syllabus', desc: 'HSC & SSC pre-loaded' },
                        { icon: '⏱️', title: 'Exam Countdown', desc: 'Days remaining tracker' },
                        { icon: '☁️', title: 'Cloud Sync', desc: 'Syncs across devices' },
                        { icon: '📱', title: 'Offline First', desc: 'No internet needed' },
                        { icon: '🎯', title: 'Goal Tracking', desc: 'Set & achieve targets' },
                    ].map((f, i) => (
                        <div key={i} className="p-3 md:p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800/70 transition-colors">
                            <div className="text-xl mb-2">{f.icon}</div>
                            <div className="text-xs md:text-sm font-bold text-white">{f.title}</div>
                            <div className="text-[10px] text-slate-500">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </main>

        {/* ===== FOOTER: Stats Bar ===== */}
        <footer className="flex items-center justify-center gap-6 md:gap-12 px-6 py-4 bg-slate-900/50 border-t border-white/5 z-10">
            <div className="text-center">
                <div className="text-lg md:text-xl font-black text-white">100%</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Free</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
                <div className="text-lg md:text-xl font-black text-white">Offline</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Capable</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
                <div className="text-lg md:text-xl font-black text-white">Cloud</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Synced</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
                <div className="text-lg md:text-xl font-black text-white">HSC+SSC</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">Syllabus</div>
            </div>
        </footer>
    </div>
);

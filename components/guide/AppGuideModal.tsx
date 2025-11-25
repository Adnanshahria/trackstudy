import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface AppGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AppGuideModal: React.FC<AppGuideModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="অ্যাপ ইউজার গাইড (App Guide)">
            <div className="flex flex-col gap-6 text-slate-700 dark:text-slate-300 font-sans">
                
                {/* Intro */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-500/20">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2">স্বাগতম!</h4>
                    <p className="text-sm leading-relaxed">
                        <strong className="text-slate-900 dark:text-white">Master Your Potential</strong> হলো আপনার পার্সোনাল স্টাডি ট্র্যাকার। এটি শুধু সিলেবাস শেষ করার জন্য নয়, বরং প্রতিটি চ্যাপ্টার কতটা দক্ষতার সাথে শেষ করেছেন তা ট্র্যাক করার জন্য তৈরি।
                    </p>
                </div>

                {/* Section 1: Core Concepts */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-white/10 pb-1">১. ট্র্যাকিং সিস্টেম (কিভাবে মার্ক করবেন?)</h4>
                    <p className="text-xs text-slate-500 mb-2">সিলেবাসের বক্সে ক্লিক করলে নিচের কালার কোড অনুযায়ী স্ট্যাটাস পরিবর্তন হবে:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-3 shadow-sm">
                            <span className="w-8 h-6 rounded bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</span>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">সম্পন্ন (Done)</span>
                                <span className="text-[10px] text-slate-500">চ্যাপ্টারটি পুরোপুরি শেষ। (100%)</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-3 shadow-sm">
                            <span className="w-8 h-6 rounded bg-rose-500 text-white flex items-center justify-center text-xs font-bold">✕</span>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">বাদ (Skip)</span>
                                <span className="text-[10px] text-slate-500">এই টপিক পড়বেন না। (0%)</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-3 col-span-1 sm:col-span-2 shadow-sm">
                            <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden relative border border-slate-300 dark:border-slate-600">
                                <div className="absolute top-0 left-0 h-full w-[60%] bg-sky-500"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">আংশিক অগ্রগতি (Progress)</span>
                                <span className="text-[10px] text-slate-500">বক্সে বারবার ক্লিক করলে ২০%, ৪০%, ৬০%... এভাবে বাড়বে।</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Weighted Progress */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-white/10 pb-1">২. Weighted Scoring (গুরুত্ব সেট করা)</h4>
                    <p className="text-xs leading-relaxed">
                        সব টাস্কের গুরুত্ব সমান নয়। "Main Book" পড়া আর "Model Test" দেওয়া এক নয়। ড্যাশবোর্ডের উপরে <span className="inline-block px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[10px]">⚙️</span> আইকনে ক্লিক করে আপনি সেট করতে পারবেন কোনটির গুরুত্ব কত।
                    </p>
                    <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-400">
                        <li>উদাহরণ: Main Book = 40%, Question Bank = 30%, Revision = 30%</li>
                        <li>আপনার টোটাল প্রোগ্রেস বার এই ওয়েট অনুযায়ী ক্যালকুলাইট হবে।</li>
                    </ul>
                </div>

                {/* Section 3: Customization */}
                <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-white/10 pb-1">৩. কাস্টমাইজেশন (Customization)</h4>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="flex gap-2">
                            <span className="font-bold text-blue-500">সাবজেক্ট যুক্ত/ডিলিট:</span>
                            <span>বাম পাশের সাইডবারে <span className="font-bold">+</span> বাটন দিয়ে নতুন সাবজেক্ট এড করুন। <span className="font-bold">✏️</span> বাটনে ক্লিক করে ডিলিট বা রিনেম করুন।</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold text-blue-500">কলাম এড/রিনেম:</span>
                            <span>সিলেবাস টেবিলের উপরে <span className="font-bold">✏️</span> আইকনে ক্লিক করে "Edit Mode" অন করুন। এরপর কলাম রিনেম বা নতুন কলাম এড করতে পারবেন।</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold text-blue-500">নোটস:</span>
                            <span>যেকোনো বক্সে মাউস নিলে (ডেস্কটপে) বা লং প্রেস করলে ছোট <span className="font-bold">+</span> বাটন আসবে। সেখানে নোট লিখে রাখতে পারবেন।</span>
                        </div>
                    </div>
                </div>

                 {/* Section 4: Print & Offline */}
                 <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-white/10 pb-1">৪. এক্সট্রা ফিচার</h4>
                    <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-400">
                        <li><strong>Print Mode:</strong> সিলেবাসের উপরে "Print View" বাটনে চাপ দিলে একটি ক্লিন PDF ভার্সন পাবেন প্রিন্ট করার জন্য।</li>
                        <li><strong>Countdown:</strong> পরীক্ষার ডেট সেট করতে টাইমারের উপরে <span className="inline-block px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[10px]">⚙️</span> আইকনে ক্লিক করুন।</li>
                        <li><strong>Offline Mode:</strong> একবার লোড হলে ইন্টারনেট ছাড়াও অ্যাপ কাজ করবে। ইন্টারনেট কানেক্ট হলে অটোমেটিক ডাটা সিঙ্ক হবে।</li>
                    </ul>
                </div>

                <div className="pt-2">
                    <Button onClick={onClose} className="w-full py-3 shadow-lg shadow-blue-500/20">ধন্যবাদ, আমি বুঝতে পেরেছি!</Button>
                </div>
            </div>
        </Modal>
    );
};
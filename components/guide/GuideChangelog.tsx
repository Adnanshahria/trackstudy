
import React from 'react';
import { GuideSectionCard } from './GuideSectionCard';
import { APP_VERSION, VERSION_LABEL } from '../../constants/version';

export const GuideChangelog = () => (
    <GuideSectionCard title="🛠️ আপডেট লগ (Update Logs)" icon="📢">
        <div className="flex flex-col gap-3">
            {/* Newest Entry - v39.2.0 */}
            <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{APP_VERSION} - {VERSION_LABEL}</span>
                    <span className="text-[10px] text-purple-500 border border-purple-200 dark:border-purple-900 px-1.5 rounded bg-purple-50 dark:bg-purple-900/20">Latest</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                    <li><strong>🔄 Data Migration:</strong> একাউন্ট ট্রান্সফার সিস্টেম! পুরাতন একাউন্ট থেকে নতুন একাউন্টে সব ডেটা মাইগ্রেট করুন।</li>
                    <li><strong>📤 Export:</strong> সেটিংস মেনু → Data Migration → Export Code জেনারেট করুন।</li>
                    <li><strong>📥 Import:</strong> নতুন একাউন্টে লগইন → Data Migration → কোড পেস্ট করে Import করুন।</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-purple-200 dark:border-purple-800">
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mb-1">✅ <strong>সুবিধা:</strong> নতুন ID তৈরি করলেও পুরাতন প্রোগ্রেস হারাবে না, সব ডেটা এক ক্লিকে ট্রান্সফার</p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400">⚠️ <strong>সাবধান:</strong> Migration code গোপন রাখুন - এতে আপনার সব ডেটা আছে</p>
                </div>
            </div>

            {/* Previous Entry - v39.1.0 */}
            <div className="p-3 rounded-lg opacity-80 border border-slate-200 dark:border-white/5">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">v39.1.0 - Admin Panel & History Logs</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                    <li><strong>🔧 Admin Panel:</strong> কলামের ডিফল্ট নাম পরিবর্তন করুন।</li>
                    <li><strong>📊 History Logs:</strong> প্রতিটি tick এর রেকর্ড দেখুন।</li>
                    <li><strong>🔒 Security:</strong> Firestore Rules ও Indexes ফিক্স।</li>
                </ul>
            </div>

            {/* Previous Entry */}
            <div className="p-3 rounded-lg opacity-80 border border-slate-200 dark:border-white/5">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">v39.0.0 - Universal Deployment & Security</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                    <li><strong>📱 Responsive:</strong> Consolidated to true Mobile & Desktop only - removed tablet view, desktop now at 1280px+.</li>
                    <li><strong>🚀 Deployment:</strong> Now deployable on ANY platform - GitHub Pages, Vercel, Netlify, AWS, custom domains.</li>
                    <li><strong>🔐 Security:</strong> Fixed password change to update both Firebase Auth and Firestore. Password recovery fully functional.</li>
                    <li><strong>🔑 Auth:</strong> Password change now requires old password verification with reauthentication.</li>
                    <li><strong>🎨 UI:</strong> Added frosted glass styling to auth buttons for better visual hierarchy.</li>
                </ul>
            </div>

            <div className="p-3 rounded-lg opacity-80 border border-slate-200 dark:border-white/5">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">v38.3.6 - Experience Updates</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                    <li><strong>Layout:</strong> Fixed subject list jitter and status dot overlap.</li>
                    <li><strong>Tools:</strong> Added Force Sync button and Quick Add for progress bars.</li>
                    <li><strong>Guest Mode:</strong> Improved Guest IDs with readable timestamps.</li>
                    <li><strong>Display:</strong> Optimized one-page view for desktop/tablet.</li>
                </ul>
            </div>

            <div className="p-3 rounded-lg opacity-60 border border-slate-200 dark:border-white/5">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">v38.3.5 - Data Stability</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                    <li><strong>Bug Fix:</strong> Fixed column deletion data shifting.</li>
                    <li><strong>Auto Migration:</strong> Data safely migrated to new ID system.</li>
                </ul>
            </div>

            <div className="p-3 rounded-lg opacity-60 border border-slate-200 dark:border-white/5">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">v38.3.4 - Rebranding</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                    <li><strong>Rebrand:</strong> App is now <strong>TrackStudy</strong>.</li>
                </ul>
            </div>
        </div>
    </GuideSectionCard>
);

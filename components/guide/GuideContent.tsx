
import React from 'react';

export const GuideIntroContent = () => (
    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        <strong className="text-slate-900 dark:text-white">TrackStudy</strong> হলো আপনার পার্সোনাল স্টাডি ট্র্যাকার। এটি শুধু সিলেবাস শেষ করার জন্য নয়, বরং প্রতিটি চ্যাপ্টার কতটা দক্ষতার সাথে শেষ করেছেন তা ট্র্যাক করার জন্য তৈরি।
    </p>
);

export const GuideStepsContent = () => (
    <div className="text-xs space-y-3 text-slate-600 dark:text-slate-300">
        {[
            { title: "অ্যাকাউন্ট তৈরি করুন:", text: 'প্রথমেই "Sign In" এ ক্লিক করে "Create Account" ট্যাবে যান এবং একটি ইউজার নেম ও পাসওয়ার্ড দিয়ে একাউন্ট খুলুন।' },
            { title: "সিলেবাস সেটআপ:", text: 'বাম পাশের সাইডবারে আপনার প্রয়োজনীয় সাবজেক্টগুলো আছে কিনা দেখুন। নতুন সাবজেক্ট লাগলে + বাটনে ক্লিক করুন।' },
            { title: "ওয়েট (Weight) কনফিগারেশন:", text: 'ড্যাশবোর্ডের উপরে "Weighted Progress" কার্ডে ⚙️ আইকনে ক্লিক করুন। এখানে ঠিক করুন কোন কাজের গুরুত্ব কত পার্সেন্ট।' },
            { title: "ট্র্যাকিং শুরু করুন:", text: 'ডান পাশের টেবিলে চ্যাপ্টারের নামের পাশে ছোট বক্সগুলোতে ক্লিক করে আপনার প্রোগ্রেস মার্ক করুন।' }
        ].map((step, i) => (
            <div key={i} className="flex gap-3 bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">{i + 1}</span>
                <div><strong className="text-slate-900 dark:text-white block mb-0.5">{step.title}</strong><p className="opacity-90">{step.text}</p></div>
            </div>
        ))}
    </div>
);

export const GuideLegendContent = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
            { icon: '✓', bg: 'bg-emerald-500', title: 'সম্পন্ন (Done)', desc: 'চ্যাপ্টারটি ১০০% শেষ।' },
            { icon: '✕', bg: 'bg-rose-500', title: 'বাদ (Skip)', desc: 'এই টপিক পড়বেন না (০%)।' }
        ].map((item, i) => (
            <div key={i} className="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3">
                <span className={`w-8 h-6 rounded ${item.bg} text-white flex items-center justify-center text-xs font-bold`}>{item.icon}</span>
                <div className="flex flex-col"><span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span><span className="text-[10px] text-slate-500">{item.desc}</span></div>
            </div>
        ))}
            <div className="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-3 col-span-1 sm:col-span-2">
            <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden relative border border-slate-300 dark:border-slate-600"><div className="absolute top-0 left-0 h-full w-[60%] bg-sky-500"></div></div>
            <div className="flex flex-col"><span className="text-xs font-bold text-slate-900 dark:text-white">আংশিক অগ্রগতি (Progress)</span><span className="text-[10px] text-slate-500">বক্সে বারবার ক্লিক করলে ২০%, ৪০%, ৬০%... এভাবে বাড়বে।</span></div>
        </div>
    </div>
);

export const GuideCustomizationContent = () => (
    <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex gap-2 items-start"><span className="font-bold text-blue-500 min-w-[80px]">সাবজেক্ট:</span><span>সাইডবারের <span className="font-bold">+</span> বাটনে নতুন সাবজেক্ট এড করুন।</span></div>
        <div className="flex gap-2 items-start"><span className="font-bold text-blue-500 min-w-[80px]">কলাম:</span><span>টেবিলের উপরে <span className="font-bold">✏️</span> আইকনে ক্লিক করে "Edit Mode" অন করুন।</span></div>
        <div className="flex gap-2 items-start"><span className="font-bold text-blue-500 min-w-[80px]">নোটস:</span><span>বক্সের কোণায় থাকা ছোট <span className="font-bold">+</span> আইকনে ক্লিক করে নোট সেভ করুন।</span></div>
    </div>
);

export const GuideExtrasContent = () => (
    <ul className="text-xs space-y-2 list-disc pl-4 text-slate-600 dark:text-slate-400">
        <li><strong>Print Mode:</strong> "Print View" বাটনে চাপ দিলে একটি ক্লিন PDF ভার্সন জেনারেট হবে।</li>
        <li><strong>Exam Countdown:</strong> পরীক্ষার ডেট সেট করতে টাইমারের উপরে <span className="inline-block px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[10px]">⚙️</span> আইকনে ক্লিক করুন।</li>
        <li><strong>Data Sync:</strong> অটোমেটিক সেভ হয়। লগআউট করার আগে "Online" স্ট্যাটাস দেখে নিন।</li>
    </ul>
);

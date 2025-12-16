import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { GuideIntroContent, GuideStepsContent, GuideLegendContent, GuideCustomizationContent, GuideExtrasContent } from './GuideContent';
import { GuideChangelog } from './GuideChangelog';
import { GuideSectionCard } from './GuideSectionCard';

interface AppGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AppGuideModal: React.FC<AppGuideModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="অ্যাপ ইউজার গাইড (App Guide)">
            <div className="flex flex-col gap-3 md:gap-4 text-slate-700 dark:text-slate-300 font-sans">
                {/* Intro Block (Static) */}
                <div className="p-2 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl md:rounded-2xl border border-blue-200 dark:border-blue-500/20 mb-1 md:mb-2">
                    <GuideIntroContent />
                </div>

                {/* Collapsible Sections */}
                <GuideSectionCard title="🚀 নতুন ইউজারদের জন্য (Getting Started)" icon="⭐" defaultOpen={true}>
                    <GuideStepsContent />
                </GuideSectionCard>

                <GuideSectionCard title="🎨 ট্র্যাকিং সিস্টেম (Color Codes)" icon="📊">
                    <GuideLegendContent />
                </GuideSectionCard>

                <GuideSectionCard title="🛠️ কাস্টমাইজেশন টুলস (Tools)" icon="⚙️">
                    <GuideCustomizationContent />
                </GuideSectionCard>

                <GuideSectionCard title="💡 এক্সট্রা ফিচার (Extras)" icon="✨">
                    <GuideExtrasContent />
                </GuideSectionCard>

                <GuideChangelog />

                <div className="pt-1 md:pt-2">
                    <Button onClick={onClose} className="w-full py-2.5 md:py-3 shadow-lg shadow-blue-500/20 font-bold text-xs md:text-sm">ধন্যবাদ, শুরু করা যাক!</Button>
                </div>
            </div>
        </Modal>
    );
};
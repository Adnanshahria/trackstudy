// Tick Log Types - Read-only data model for audit history

export interface TickLog {
    id: string;
    boxId: string;        // e.g., "s_biology_1_mainBook"
    subjectId: string;
    chapterId: string;
    fieldKey: string;
    userId: string;
    timestamp: Date;
    iso: string;
    percentAfter: number;
    percentBefore: number;
    comment?: string;
    source: 'manual' | 'auto' | 'import';
}

// Mock data for UI prototyping
export const MOCK_TICK_LOGS: TickLog[] = [
    {
        id: '1',
        boxId: 's_biology_1_mainBook',
        subjectId: 'biology',
        chapterId: '1',
        fieldKey: 'mainBook',
        userId: 'user123',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        iso: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        percentAfter: 80,
        percentBefore: 60,
        source: 'manual'
    },
    {
        id: '2',
        boxId: 's_biology_1_mainBook',
        subjectId: 'biology',
        chapterId: '1',
        fieldKey: 'mainBook',
        userId: 'user123',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        iso: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        percentAfter: 60,
        percentBefore: 40,
        source: 'manual'
    },
    {
        id: '3',
        boxId: 's_biology_1_mainBook',
        subjectId: 'biology',
        chapterId: '1',
        fieldKey: 'mainBook',
        userId: 'user123',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        iso: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        percentAfter: 40,
        percentBefore: 20,
        source: 'manual'
    },
    {
        id: '4',
        boxId: 's_biology_1_mainBook',
        subjectId: 'biology',
        chapterId: '1',
        fieldKey: 'mainBook',
        userId: 'user123',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        iso: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        percentAfter: 20,
        percentBefore: 0,
        source: 'manual'
    }
];

// Helper to format relative time
export const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
};

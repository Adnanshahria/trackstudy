export const getPercent = (status: unknown): number => {
    if (status === null || status === undefined) return 0;
    const num = typeof status === 'number' ? status : Number(status);
    if (Number.isNaN(num) || !Number.isFinite(num)) return 0;
    const clamped = Math.max(0, Math.min(5, Math.floor(num)));
    return clamped * 20;
};

export const normalize = (raw: unknown): number => {
    if (raw === null || raw === undefined) return 0;
    const num = typeof raw === 'number' ? raw : Number(raw);
    if (Number.isNaN(num) || !Number.isFinite(num)) return 0;
    return Math.max(0, Math.min(100, num));
};
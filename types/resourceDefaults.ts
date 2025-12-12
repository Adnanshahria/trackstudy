// Resource Defaults Types
// Global column/resource configuration managed by admin

export interface ResourceDefault {
    id: number;
    order: number;
    key: string;           // Legacy key for backward compatibility
    label: string;         // User-facing display name
    color: string;         // Tailwind color class
    createdAt?: string;
    updatedAt?: string;
    updatedBy?: string;
}

// Legacy key to new ID mapping
export const LEGACY_KEY_TO_ID: Record<string, number> = {
    mainbook: 1,
    class: 2,
    revclass: 3,
    meditrics: 4,
    mqb: 5,
    sfexam: 6,
    rev1: 7,
    rev2: 8
};

// ID to legacy key (reverse mapping)
export const ID_TO_LEGACY_KEY: Record<number, string> = {
    1: 'mainbook',
    2: 'class',
    3: 'revclass',
    4: 'meditrics',
    5: 'mqb',
    6: 'sfexam',
    7: 'rev1',
    8: 'rev2'
};

// Default resource configuration (fallback when Firestore unavailable)
export const DEFAULT_RESOURCES: ResourceDefault[] = [
    { id: 1, order: 1, key: 'mainbook', label: 'Lecture', color: 'bg-sky-500' },
    { id: 2, order: 2, key: 'class', label: 'Book', color: 'bg-blue-500' },
    { id: 3, order: 3, key: 'revclass', label: 'Resource 1', color: 'bg-indigo-500' },
    { id: 4, order: 4, key: 'meditrics', label: 'Resource 2', color: 'bg-teal-500' },
    { id: 5, order: 5, key: 'mqb', label: 'Resource 3', color: 'bg-amber-500' },
    { id: 6, order: 6, key: 'sfexam', label: 'Resource 4', color: 'bg-rose-500' },
    { id: 7, order: 7, key: 'rev1', label: 'Resource 5', color: 'bg-violet-500' },
    { id: 8, order: 8, key: 'rev2', label: 'Resource 6', color: 'bg-purple-500' }
];

// Per-user custom label overrides type
export type CustomLabels = Record<string, string>; // { "1": "My Custom Name", "3": "Another Name" }

// Helper to get resolved label (custom override or global default)
export const resolveLabel = (
    id: number,
    customLabels: CustomLabels | undefined,
    defaults: ResourceDefault[]
): string => {
    // Check custom override first
    if (customLabels && customLabels[String(id)]) {
        return customLabels[String(id)];
    }
    // Fall back to global default
    const resource = defaults.find(r => r.id === id);
    return resource?.label || `Resource ${id}`;
};

// Helper to convert legacy TrackableItem to ResourceDefault
export const legacyKeyToResource = (
    legacyKey: string,
    defaults: ResourceDefault[]
): ResourceDefault | undefined => {
    const id = LEGACY_KEY_TO_ID[legacyKey];
    if (!id) return undefined;
    return defaults.find(r => r.id === id);
};

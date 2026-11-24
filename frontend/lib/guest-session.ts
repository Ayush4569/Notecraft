import { PartialBlock } from "@blocknote/core";

export interface GuestDocument {
    id: string;
    title: string;
    content: {
        version?: string;
        blocks: PartialBlock[];
    };
    icon: string | null;
    coverImage: string | null;
    createdAt: string;
    updatedAt: string;
}

const GUEST_DOC_KEY = "notecraft_guest_document";
const GUEST_SESSION_KEY = "notecraft_guest_session_id";

export function getGuestSessionId(): string {
    if (typeof window === "undefined") return "guest-server";
    let sessionId = localStorage.getItem(GUEST_SESSION_KEY);
    if (!sessionId) {
        sessionId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem(GUEST_SESSION_KEY, sessionId);
    }
    return sessionId;
}

export function createDefaultGuestDocument(): GuestDocument {
    const defaultBlocks: PartialBlock[] = [
        {
            type: "heading",
            props: { level: 1 },
            content: "Welcome to Notecraft (Guest Mode)",
        },
        {
            type: "paragraph",
            content: "This is a live temporary workspace. You can start typing, organize your thoughts with headings, format text, and experiment with all editor features right now.",
        },
        {
            type: "bulletListItem",
            content: "✨ Full block-based editor support",
        },
        {
            type: "bulletListItem",
            content: "💾 Auto-saved in your browser's local session",
        },
        {
            type: "bulletListItem",
            content: "🚀 Sign up anytime to save this document to your permanent account",
        },
    ];

    const now = new Date().toISOString();
    return {
        id: `guest_${Date.now()}`,
        title: "Welcome to Notecraft (Guest Mode)",
        content: {
            version: "1",
            blocks: defaultBlocks,
        },
        icon: "🚀",
        coverImage: null,
        createdAt: now,
        updatedAt: now,
    };
}

export function getGuestDocument(): GuestDocument | null {
    if (typeof window === "undefined") return null;
    try {
        const item = localStorage.getItem(GUEST_DOC_KEY);
        if (!item) return null;
        return JSON.parse(item) as GuestDocument;
    } catch {
        return null;
    }
}

export function saveGuestDocument(doc: Partial<GuestDocument>): GuestDocument {
    const existing = getGuestDocument() || createDefaultGuestDocument();
    const updated: GuestDocument = {
        ...existing,
        ...doc,
        updatedAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
        try {
            localStorage.setItem(GUEST_DOC_KEY, JSON.stringify(updated));
        } catch (e) {
            console.warn("Failed to save guest document to localStorage:", e);
        }
    }
    return updated;
}

export function hasGuestDocument(): boolean {
    if (typeof window === "undefined") return false;
    const doc = getGuestDocument();
    return doc !== null;
}

export function clearGuestDocument(): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(GUEST_DOC_KEY);
        localStorage.removeItem(GUEST_SESSION_KEY);
    } catch (e) {
        console.warn("Failed to clear guest document:", e);
    }
}


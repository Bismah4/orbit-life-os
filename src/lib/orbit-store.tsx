import * as React from "react";
import type { OrbitItem, Reminder, Category, Priority, CaptureKind } from "./orbit-types";

const LS_KEY = "orbit-state-v1";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  streak: number;
  premium: boolean;
}

interface OrbitState {
  items: OrbitItem[];
  reminders: Reminder[];
  user: UserProfile;
  connectedAccounts: { google: boolean; apple: boolean };
  security: { biometric: boolean; twoFA: boolean };
  prefs: { dailyPulseTime: string; reminderStyle: "gentle" | "standard" | "assertive" };
  hasOnboarded: boolean;
  isAuthed: boolean;
}

const defaultUser: UserProfile = {
  name: "Alex Morgan",
  email: "alex@orbit.app",
  phone: "+1 555 0142",
  streak: 7,
  premium: true,
};

const seedItems: OrbitItem[] = [
  {
    id: "i1",
    title: "Pay electricity bill",
    summary: "ConEd $142.30 due Friday",
    category: "money",
    priority: "high",
    source: "screenshot",
    insight: "Bill detected from screenshot. Due in 2 days.",
    suggestedAction: "Pay now or schedule",
    createdAt: new Date().toISOString(),
    dueAt: new Date(Date.now() + 2 * 86400000).toISOString(),
  },
  {
    id: "i2",
    title: "Review contract screenshot",
    summary: "NDA from Acme Corp — needs signature",
    category: "work",
    priority: "high",
    source: "screenshot",
    insight: "Contract excerpt detected. Signature requested.",
    suggestedAction: "Read & sign",
    createdAt: new Date().toISOString(),
  },
  {
    id: "i3",
    title: "Renew passport",
    summary: "Expires in 4 months",
    category: "admin",
    priority: "med",
    source: "manual",
    suggestedAction: "Book appointment",
    createdAt: new Date().toISOString(),
  },
  {
    id: "i4",
    title: "Call mom",
    summary: "Birthday tomorrow",
    category: "people",
    priority: "med",
    source: "text",
    createdAt: new Date().toISOString(),
  },
  {
    id: "i5",
    title: "Book dentist",
    category: "health",
    priority: "low",
    source: "manual",
    createdAt: new Date().toISOString(),
  },
  {
    id: "i6",
    title: "Q4 OKR draft",
    category: "goals",
    priority: "low",
    source: "text",
    createdAt: new Date().toISOString(),
  },
];

const initialState: OrbitState = {
  items: seedItems,
  reminders: [],
  user: defaultUser,
  connectedAccounts: { google: true, apple: false },
  security: { biometric: true, twoFA: false },
  prefs: { dailyPulseTime: "08:00", reminderStyle: "standard" },
  hasOnboarded: false,
  isAuthed: false,
};

interface Ctx {
  state: OrbitState;
  addItem: (item: Omit<OrbitItem, "id" | "createdAt">) => OrbitItem;
  updateItem: (id: string, patch: Partial<OrbitItem>) => void;
  markDone: (id: string) => void;
  discardItem: (id: string) => void;
  addReminder: (itemId: string, remindAt: string) => void;
  setUser: (patch: Partial<UserProfile>) => void;
  setConnected: (k: "google" | "apple", v: boolean) => void;
  setSecurity: (patch: Partial<OrbitState["security"]>) => void;
  setPrefs: (patch: Partial<OrbitState["prefs"]>) => void;
  completeOnboarding: () => void;
  signIn: () => void;
  signOut: () => void;
  reset: () => void;
}

const OrbitCtx = React.createContext<Ctx | null>(null);

function load(): OrbitState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...JSON.parse(raw) };
  } catch {
    return initialState;
  }
}

export function OrbitProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<OrbitState>(initialState);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
  }, [state, hydrated]);

  const ctx: Ctx = React.useMemo(() => ({
    state,
    addItem: (item) => {
      const newItem: OrbitItem = { ...item, id: `i${Date.now()}`, createdAt: new Date().toISOString() };
      setState((s) => ({ ...s, items: [newItem, ...s.items] }));
      return newItem;
    },
    updateItem: (id, patch) => setState((s) => ({
      ...s,
      items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    })),
    markDone: (id) => setState((s) => ({
      ...s,
      items: s.items.map((i) => (i.id === id ? { ...i, completedAt: new Date().toISOString() } : i)),
    })),
    discardItem: (id) => setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) })),
    addReminder: (itemId, remindAt) => setState((s) => {
      const item = s.items.find((i) => i.id === itemId);
      if (!item) return s;
      const r: Reminder = {
        id: `r${Date.now()}`,
        itemId,
        title: item.title,
        category: item.category,
        priority: item.priority,
        remindAt,
      };
      return {
        ...s,
        reminders: [r, ...s.reminders],
        items: s.items.map((i) => (i.id === itemId ? { ...i, remindAt } : i)),
      };
    }),
    setUser: (patch) => setState((s) => ({ ...s, user: { ...s.user, ...patch } })),
    setConnected: (k, v) => setState((s) => ({ ...s, connectedAccounts: { ...s.connectedAccounts, [k]: v } })),
    setSecurity: (patch) => setState((s) => ({ ...s, security: { ...s.security, ...patch } })),
    setPrefs: (patch) => setState((s) => ({ ...s, prefs: { ...s.prefs, ...patch } })),
    completeOnboarding: () => setState((s) => ({ ...s, hasOnboarded: true })),
    signIn: () => setState((s) => ({ ...s, isAuthed: true })),
    signOut: () => setState((s) => ({ ...s, isAuthed: false })),
    reset: () => { localStorage.removeItem(LS_KEY); setState(initialState); },
  }), [state]);

  return <OrbitCtx.Provider value={ctx}>{children}</OrbitCtx.Provider>;
}

export function useOrbit() {
  const ctx = React.useContext(OrbitCtx);
  if (!ctx) throw new Error("useOrbit must be used inside OrbitProvider");
  return ctx;
}

export type { Category, Priority, CaptureKind };

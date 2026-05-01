export type Priority = "high" | "med" | "low";
export type Category = "money" | "work" | "admin" | "health" | "people" | "goals";

export type CaptureKind =
  | "screenshot"
  | "document"
  | "voice"
  | "text"
  | "manual"
  | "email";

export interface OrbitItem {
  id: string;
  title: string;
  summary?: string;
  category: Category;
  priority: Priority;
  dueAt?: string; // ISO
  source: CaptureKind;
  insight?: string;
  suggestedAction?: string;
  preview?: string; // image data URL or text snippet
  createdAt: string;
  completedAt?: string;
  remindAt?: string;
}

export interface Reminder {
  id: string;
  itemId: string;
  title: string;
  category: Category;
  priority: Priority;
  remindAt: string; // ISO
  completed?: boolean;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  money: "Money",
  work: "Work",
  admin: "Admin",
  health: "Health",
  people: "People",
  goals: "Goals",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: "High",
  med: "Medium",
  low: "Low",
};

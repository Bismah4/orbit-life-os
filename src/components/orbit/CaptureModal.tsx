import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useOrbit } from "@/lib/orbit-store";
import type { CaptureKind, Category, Priority } from "@/lib/orbit-types";
import { CATEGORY_LABEL } from "@/lib/orbit-types";
import { toast } from "sonner";
import { Mic, Square, Upload, Camera, Mail } from "lucide-react";

const KIND_TITLES: Record<CaptureKind, string> = {
  screenshot: "Upload Screenshot",
  document: "Scan Document",
  voice: "Record Voice",
  text: "Paste Text",
  manual: "Manual Task",
  email: "Connect Email",
};

interface DraftBase {
  title: string;
  summary?: string;
  category: Category;
  priority: Priority;
  insight?: string;
  suggestedAction?: string;
  preview?: string;
}

/** Naive on-device "AI" — keyword based, deterministic. */
function detect(text: string, kind: CaptureKind): DraftBase {
  const t = text.toLowerCase();
  let category: Category = "admin";
  let priority: Priority = "med";
  let suggestedAction = "Take action";
  let insight = "Orbit detected this needs attention.";

  if (/(bill|invoice|payment|due|\$|usd|eur|charge|receipt)/.test(t)) { category = "money"; priority = "high"; suggestedAction = "Pay or schedule payment"; insight = "Looks like a payment with a deadline."; }
  else if (/(meeting|deadline|client|project|deliver|contract|nda|sign)/.test(t)) { category = "work"; priority = "high"; suggestedAction = "Review & respond"; insight = "Work-critical item detected."; }
  else if (/(passport|license|renew|form|tax|gov|id|application)/.test(t)) { category = "admin"; priority = "med"; suggestedAction = "Schedule paperwork"; insight = "Administrative task with a deadline."; }
  else if (/(doctor|dentist|appointment|prescription|medic|workout|gym)/.test(t)) { category = "health"; priority = "med"; suggestedAction = "Book or schedule"; insight = "Health-related task surfaced."; }
  else if (/(call|message|birthday|family|friend|mom|dad|wife|husband)/.test(t)) { category = "people"; priority = "med"; suggestedAction = "Reach out"; insight = "Someone important is waiting."; }
  else if (/(goal|habit|plan|q[1-4]|okr|milestone)/.test(t)) { category = "goals"; priority = "low"; suggestedAction = "Set milestone"; insight = "Goal-related insight captured."; }

  let title = text.split(/[.\n]/)[0].trim().slice(0, 70);
  if (!title) title = KIND_TITLES[kind];
  if (kind === "screenshot") title = title.length > 0 ? `Screenshot: ${title}` : "Screenshot captured";
  if (kind === "voice") title = title.length > 0 ? title : "Voice note";

  return { title, summary: text.slice(0, 160), category, priority, suggestedAction, insight };
}

export function CaptureModal({
  kind,
  onClose,
  onAdded,
}: {
  kind: CaptureKind | null;
  onClose: () => void;
  onAdded: (id: string) => void;
}) {
  const open = !!kind;
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="mx-auto max-w-[440px] rounded-t-3xl bg-popover border-border p-0 max-h-[92vh] overflow-y-auto"
      >
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-lg">{kind ? KIND_TITLES[kind] : ""}</SheetTitle>
        </SheetHeader>
        {kind && <CaptureBody kind={kind} onClose={onClose} onAdded={onAdded} />}
      </SheetContent>
    </Sheet>
  );
}

function CaptureBody({ kind, onClose, onAdded }: { kind: CaptureKind; onClose: () => void; onAdded: (id: string) => void }) {
  const { addItem } = useOrbit();
  const [text, setText] = React.useState("");
  const [preview, setPreview] = React.useState<string | undefined>();
  const [recording, setRecording] = React.useState(false);
  const [phase, setPhase] = React.useState<"input" | "processing" | "result">("input");
  const [draft, setDraft] = React.useState<DraftBase | null>(null);
  const [step, setStep] = React.useState(0);

  // Manual fields
  const [mTitle, setMTitle] = React.useState("");
  const [mCat, setMCat] = React.useState<Category>("admin");
  const [mPri, setMPri] = React.useState<Priority>("med");

  // Email fields
  const [sender, setSender] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");

  const onFile = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPreview(String(r.result));
    r.readAsDataURL(f);
  };

  const submit = () => {
    let basis = "";
    let extra: Partial<DraftBase> = {};
    if (kind === "manual") {
      if (!mTitle.trim()) { toast.error("Add a title"); return; }
      const d: DraftBase = { title: mTitle, category: mCat, priority: mPri, insight: "Created by you.", suggestedAction: "Complete task" };
      setDraft(d); runProcessing();
      return;
    }
    if (kind === "email") {
      if (!sender || !subject) { toast.error("Sender + subject required"); return; }
      basis = `${subject} ${body}`;
      extra = { title: subject, summary: `From ${sender}: ${body.slice(0, 120)}`, suggestedAction: "Reply or follow up", insight: `Email from ${sender}.` };
    } else if (kind === "voice") {
      if (!text.trim()) { toast.error("Record something first"); return; }
      basis = text;
    } else if (kind === "screenshot" || kind === "document") {
      if (!preview) { toast.error("Upload a file first"); return; }
      basis = text || (kind === "screenshot" ? "Screenshot captured" : "Document captured");
      extra = { preview };
    } else {
      if (!text.trim()) { toast.error("Paste some text"); return; }
      basis = text;
    }
    const d = { ...detect(basis, kind), ...extra };
    setDraft(d);
    runProcessing();
  };

  const runProcessing = () => {
    setPhase("processing");
    setStep(0);
    const steps = 5;
    let s = 0;
    const t = setInterval(() => {
      s++; setStep(s);
      if (s >= steps) { clearInterval(t); setPhase("result"); }
    }, 320);
  };

  const confirmAdd = (overrides?: Partial<DraftBase>) => {
    if (!draft) return;
    const merged = { ...draft, ...overrides };
    const item = addItem({
      title: merged.title,
      summary: merged.summary,
      category: merged.category,
      priority: merged.priority,
      source: kind,
      insight: merged.insight,
      suggestedAction: merged.suggestedAction,
      preview: merged.preview,
    });
    toast.success("Added to Orbit");
    onAdded(item.id);
  };

  if (phase === "processing") return <ProcessingView step={step} />;
  if (phase === "result" && draft) return (
    <ResultCard kind={kind} draft={draft} onAdd={confirmAdd} onDiscard={onClose} />
  );

  return (
    <div className="px-5 py-5 space-y-4">
      {kind === "screenshot" && (
        <FileBlock icon={Camera} label="Choose screenshot" accept="image/*" preview={preview} onFile={onFile} />
      )}
      {kind === "document" && (
        <FileBlock icon={Upload} label="Choose document or scan" accept="image/*,application/pdf" preview={preview} onFile={onFile} />
      )}
      {kind === "voice" && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-surface ring-1 ring-border p-6 grid place-items-center">
            <button
              onClick={() => {
                if (recording) { setRecording(false); if (!text) setText("Pay electricity bill due Friday"); toast("Transcribed"); }
                else { setRecording(true); }
              }}
              className={"h-16 w-16 rounded-full grid place-items-center transition " + (recording ? "bg-[var(--pri-high)] orbit-glow" : "bg-primary orbit-glow")}
            >
              {recording ? <Square className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-primary-foreground" />}
            </button>
            <p className="mt-3 text-xs text-muted-foreground">{recording ? "Tap to stop" : "Tap to record"}</p>
          </div>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Transcript will appear here…" className="min-h-[100px] bg-surface" />
        </div>
      )}
      {kind === "text" && (
        <Textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste anything — a snippet, link, message…" className="min-h-[140px] bg-surface" />
      )}
      {kind === "manual" && (
        <div className="space-y-3">
          <div><Label>Title</Label><Input value={mTitle} onChange={(e) => setMTitle(e.target.value)} className="h-11 bg-surface" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <select value={mCat} onChange={(e) => setMCat(e.target.value as Category)} className="mt-1 w-full h-11 rounded-md bg-surface ring-1 ring-border px-3 text-sm">
                {Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <Label>Priority</Label>
              <select value={mPri} onChange={(e) => setMPri(e.target.value as Priority)} className="mt-1 w-full h-11 rounded-md bg-surface ring-1 ring-border px-3 text-sm">
                <option value="high">High</option><option value="med">Medium</option><option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {kind === "email" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5" /> Mock-forward an email to Orbit
          </div>
          <div><Label>From</Label><Input value={sender} onChange={(e) => setSender(e.target.value)} placeholder="boss@acme.com" className="h-11 bg-surface" /></div>
          <div><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Contract for review" className="h-11 bg-surface" /></div>
          <div><Label>Body</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[100px] bg-surface" /></div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1 bg-surface" onClick={onClose}>Cancel</Button>
        <Button className="flex-1 orbit-glow" onClick={submit}>Continue</Button>
      </div>
    </div>
  );
}

function FileBlock({ icon: Icon, label, accept, preview, onFile }: { icon: React.ElementType; label: string; accept: string; preview?: string; onFile: (f?: File) => void }) {
  return (
    <label className="block rounded-2xl bg-surface ring-1 ring-border p-5 text-center cursor-pointer hover:bg-surface-2 transition">
      {preview ? (
        <img src={preview} alt="" className="mx-auto max-h-52 rounded-xl object-contain" />
      ) : (
        <div className="py-8">
          <Icon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
        </div>
      )}
      <input type="file" accept={accept} className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
    </label>
  );
}

function ProcessingView({ step }: { step: number }) {
  const labels = ["Reading input", "Detecting meaning", "Finding action", "Setting priority", "Added to Orbit"];
  return (
    <div className="px-5 py-10">
      <div className="mx-auto h-20 w-20 relative mb-6">
        <div className="absolute inset-0 rounded-full bg-[var(--orbit-blue)]/30 blur-2xl pulse-ring" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--orbit-blue)] to-[oklch(0.55_0.18_265)] grid place-items-center orbit-glow">
          <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.7)]" />
        </div>
      </div>
      <ul className="space-y-2 max-w-xs mx-auto">
        {labels.map((l, i) => (
          <li key={l} className={"flex items-center gap-3 text-sm transition " + (i < step ? "text-foreground" : i === step ? "text-foreground" : "text-muted-foreground")}>
            <span className={"h-1.5 w-1.5 rounded-full " + (i <= step ? "bg-[var(--orbit-blue)]" : "bg-muted-foreground/30")} />
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { CategoryChip, PriorityChip } from "@/components/orbit/Chips";

function ResultCard({
  kind,
  draft,
  onAdd,
  onDiscard,
}: {
  kind: CaptureKind;
  draft: DraftBase;
  onAdd: (overrides?: Partial<DraftBase>) => void;
  onDiscard: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [d, setD] = React.useState(draft);

  return (
    <div className="px-5 py-5 space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-[var(--orbit-blue)]/15 to-transparent ring-1 ring-[var(--orbit-blue)]/30 p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <CategoryChip value={d.category} />
          <PriorityChip value={d.priority} />
          <span className="ml-auto text-[10.5px] uppercase tracking-wider text-muted-foreground">via {kind}</span>
        </div>

        {kind === "screenshot" && d.preview && (
          <img src={d.preview} alt="" className="rounded-xl mb-3 max-h-44 w-full object-cover ring-1 ring-border" />
        )}
        {kind === "document" && d.preview && (
          <div className="rounded-xl bg-surface ring-1 ring-border p-3 mb-3 flex items-center gap-3">
            <div className="h-12 w-10 rounded bg-surface-2 ring-1 ring-border grid place-items-center text-[10px] text-muted-foreground">DOC</div>
            <p className="text-xs text-muted-foreground">Document captured</p>
          </div>
        )}
        {kind === "voice" && (
          <div className="rounded-xl bg-surface ring-1 ring-border p-3 mb-3 text-xs text-muted-foreground italic">
            “{d.summary}”
          </div>
        )}
        {kind === "text" && d.summary && (
          <div className="rounded-xl bg-surface ring-1 ring-border p-3 mb-3 text-xs text-muted-foreground">
            {d.summary}
          </div>
        )}
        {kind === "email" && (
          <div className="rounded-xl bg-surface ring-1 ring-border p-3 mb-3 text-xs">
            <p className="text-muted-foreground">{d.summary}</p>
          </div>
        )}

        <p className="font-semibold tracking-tight">{d.title}</p>
        {d.insight && <p className="text-xs text-muted-foreground mt-1"><span className="text-foreground/80 font-medium">Orbit understood:</span> {d.insight}</p>}
        {d.suggestedAction && <p className="text-xs text-muted-foreground mt-1"><span className="text-foreground/80 font-medium">Suggested:</span> {d.suggestedAction}</p>}
      </div>

      {editing && (
        <div className="space-y-3 rounded-2xl bg-surface ring-1 ring-border p-4">
          <div><Label>Title</Label><Input value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} className="h-10 bg-background" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <select value={d.category} onChange={(e) => setD({ ...d, category: e.target.value as Category })} className="mt-1 w-full h-10 rounded-md bg-background ring-1 ring-border px-3 text-sm">
                {Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <Label>Priority</Label>
              <select value={d.priority} onChange={(e) => setD({ ...d, priority: e.target.value as Priority })} className="mt-1 w-full h-10 rounded-md bg-background ring-1 ring-border px-3 text-sm">
                <option value="high">High</option><option value="med">Medium</option><option value="low">Low</option>
              </select>
            </div>
          </div>
          <div><Label>Suggested action</Label><Input value={d.suggestedAction ?? ""} onChange={(e) => setD({ ...d, suggestedAction: e.target.value })} className="h-10 bg-background" /></div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 bg-surface" onClick={onDiscard}>Discard</Button>
        <Button variant="outline" className="flex-1 bg-surface" onClick={() => setEditing((e) => !e)}>{editing ? "Done editing" : "Edit"}</Button>
        <Button className="flex-1 orbit-glow" onClick={() => onAdd(d)}>Add</Button>
      </div>
    </div>
  );
}

"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  name: string;
  label: string;
  items?: string[];
  placeholder?: string;
};

export function AdminListEditor({ name, label, items = [], placeholder = "Add an item" }: Props) {
  const [values, setValues] = useState(items.length ? items : [""]);

  function update(index: number, value: string) {
    setValues((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</span>
        <button type="button" onClick={() => setValues((current) => [...current, ""])} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-accent hover:border-accent/40">
          <Plus size={13} /> Add
        </button>
      </div>
      <div className="grid gap-2">
        {values.map((value, index) => (
          <div key={`${name}-${index}`} className="flex items-center gap-2">
            <input name={name} value={value} onChange={(event) => update(index, event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-accent" />
            <button type="button" aria-label="Remove item" onClick={() => setValues((current) => current.length === 1 ? [""] : current.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-muted hover:border-red-300 hover:text-red-600">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

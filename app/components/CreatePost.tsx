// PlusButton.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";

export default function CreatePost() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // This is used for managing the portal mount state, hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Create post"
      >
        <Plus size={20} />
      </button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-xl rounded-3xl bg-slate-950 p-6 shadow-2xl ring-1 ring-white/10">
            <div className="flex items-center justify-between gap-4 pb-4">
              <h2 className="text-lg font-semibold text-white">Create Post</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white transition hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <div className="space-y-4 text-sm text-slate-200">
              <p>Add your post content here, then submit.</p>
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
                <p className="text-slate-400">Post editor placeholder</p>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
// PlusButton.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function CreatePost() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <Plus />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50">
          <div className="bg-red-500 p-4">
            Create Post Modal
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
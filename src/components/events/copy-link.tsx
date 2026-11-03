"use client";

import { useState } from "react";

export function CopyLink({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="btn btn-black"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(new URL(path, window.location.origin).toString());
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? "Anim id" : "Est laborum"}
    </button>
  );
}

"use client";

import { useEffect } from "react";
import type { ReactElement, ReactNode } from "react";

type SideDrawerProps = {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function SideDrawer({
  title,
  subtitle,
  isOpen,
  onClose,
  children,
}: SideDrawerProps): ReactElement {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <div
      className={`drawer-overlay ${isOpen ? "open" : ""}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="drawer" role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="drawer-content">{children}</div>
      </div>
    </div>
  );
}

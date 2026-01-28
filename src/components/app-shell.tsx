"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";

type NavItem = {
  href: string;
  label: string;
};

type AppShellProps = {
  navItems: NavItem[];
  children: React.ReactNode;
};

export default function AppShell({ navItems, children }: AppShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 980px)");
    const syncState = () => setIsOpen(!mediaQuery.matches);
    syncState();
    mediaQuery.addEventListener("change", syncState);
    return () => mediaQuery.removeEventListener("change", syncState);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    const updateHeaderHeight = () => {
      const height = header.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        "--app-header-height",
        `${Math.ceil(height)}px`
      );
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateHeaderHeight);
      observer.observe(header);
    }

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className={`app-shell ${isOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
      <header className="app-header" ref={headerRef}>
        <div className="header-left">
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="brand">
            <span className="brand-dot" aria-hidden="true" />
            <div>
              <p className="brand-title">Street Light Management</p>
              <p className="brand-subtitle">Admin Control Console</p>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </header>

      <aside className={`app-sidebar${isOpen ? " open" : " collapsed"}`}>
        <div className="sidebar-header">
          <p>Navigation</p>
          <button
            type="button"
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>
        <nav className="sidebar-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div
        className={`sidebar-backdrop${isOpen ? " show" : ""}`}
        role="presentation"
        onClick={() => setIsOpen(false)}
      />

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <span>India | National Highways Lighting Platform</span>
        <span>Phase 1: Discovery + Architecture</span>
      </footer>
    </div>
  );
}

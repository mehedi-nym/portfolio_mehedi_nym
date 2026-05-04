"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { NavItem } from "@/lib/portfolio-data";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image"; // Import Next.js Image component

type Props = {
  navItems: NavItem[];
};

export function Navbar({ navItems }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-bg/75 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between">
        <a href="#top" className="group flex items-center gap-5">
          {/* DIGITAL SIGNATURE LOGO */}
          <div className="relative">
            <Image
              src="/logo/digital-sign-nym.png"
              alt="Mehedi Hasan Nayem Signature"
              width={240} // Adjusted for a standard signature width
              height={100}
              className="h-auto w-40 sm:w-48 object-contain transition-transform duration-300 group-hover:scale-105 dark:invert"
              priority
            />
          </div>

          {/* VERTICAL DIVIDER & INFO (Optional: You might want to hide the text on small screens if it gets crowded) */}
          <div className="hidden border-l border-line/50 pl-4 sm:block">
            <p className="text-sm font-semibold text-fg">Md Mehedi Hasan Nayem</p>
            <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
              Technical Project Coordinator
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-muted hover:text-fg">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <a
            href="#contact"
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-accent dark:bg-white dark:text-ink"
          >
            Contact Me
          </a>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Open navigation"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line/80 bg-surface/80"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DROPDOWN */}
      {open ? (
        <div className="section-shell pb-5 lg:hidden">
          <div className="section-card flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm text-muted hover:bg-accent/5 hover:text-fg"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  right?: React.ReactNode;
  sticky?: boolean;
  children?: React.ReactNode;
}

export function PageHeader({ title, right, sticky = true, children }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className={cn("border-b border-[var(--line)] bg-white", sticky && "sticky top-0 z-30")}>
      <div className="flex min-h-[60px] items-center gap-3 px-5 py-3">
        <button type="button" onClick={() => router.back()} aria-label="뒤로가기" className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--surface-muted)]">
          <ChevronLeft className="h-6 w-6 text-[var(--brand-ink)]" strokeWidth={2.3} />
        </button>
        <h1 className="text-[18px] font-extrabold tracking-[-0.4px] text-[var(--brand-ink)]">{title}</h1>
        {right && <div className="ml-auto">{right}</div>}
      </div>
      {children}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Heart, Home, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/favorites", icon: Heart, label: "관심목록" },
  { href: "/register", icon: Plus, label: "매물등록", fab: true },
  { href: "/jobs", icon: Briefcase, label: "구인구직" },
  { href: "/more", icon: Menu, label: "더보기" },
];

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export function MobileLayout({ children, hideNav = false }: MobileLayoutProps) {
  const pathname = usePathname();
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex min-h-screen justify-center bg-[#ECEAF0]">
      <div className="flex min-h-screen w-full max-w-[430px] flex-col bg-[var(--surface-muted)] shadow-[0_0_32px_rgba(27,23,38,.1)]">
        <main className={cn("flex-1 overflow-auto", !hideNav && "pb-[92px]")}>{children}</main>

        {!hideNav && (
          <nav className="fixed bottom-0 left-1/2 z-40 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-5 items-end border-t border-[#332b45] bg-[rgba(20,15,31,.96)] px-2 pb-[max(12px,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl">
            {NAV_ITEMS.map(({ href, icon: Icon, label, fab }) => {
              const isActive = isCurrent(href);

              if (fab) {
                return (
                  <Link key={href} href={href} className="-mt-[24px] flex flex-col items-center gap-[5px]">
                    <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] border-[3px] border-[#332b45] bg-[var(--brand-purple)] shadow-[0_6px_18px_rgba(123,47,247,.5)]">
                      <Icon className="h-6 w-6 text-white" strokeWidth={2.4} />
                    </div>
                    <span className={cn("text-[10.5px]", isActive ? "font-extrabold text-white" : "font-semibold text-white/40")}>
                      {label}
                    </span>
                    {isActive && <span className="h-[3px] w-[3px] rounded-full bg-[var(--brand-gold)]" />}
                  </Link>
                );
              }

              return (
                <Link key={href} href={href} className={cn("relative flex flex-col items-center gap-1 pt-1", isActive ? "text-white" : "text-white/40")}>
                  <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.1 : 1.9} />
                  <span className={cn("text-[10.5px]", isActive ? "font-extrabold" : "font-semibold")}>{label}</span>
                  {isActive && <span className="h-[3px] w-[3px] rounded-full bg-[var(--brand-gold)]" />}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}

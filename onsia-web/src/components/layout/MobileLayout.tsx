"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Briefcase, Menu, Plus } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* 모바일 컨테이너 (최대 480px) */}
      <div className="w-full max-w-[390px] bg-[#F7F6FB] min-h-screen flex flex-col shadow-xl">
        {/* 메인 콘텐츠 */}
        <main className={cn("flex-1 overflow-auto", !hideNav && "pb-24")}>
          {children}
        </main>

        {/* 하단 네비게이션 — 중앙 매물등록 FAB */}
        {!hideNav && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-[#EFEBF7] px-2 pt-2.5 pb-4 grid grid-cols-5 items-end">
            {NAV_ITEMS.map(({ href, icon: Icon, label, fab }) => {
              const isActive = pathname === href;

              if (fab) {
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex flex-col items-center gap-[5px] -mt-[26px]"
                  >
                    <div
                      className="w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(123,47,247,.35)]"
                      style={{ background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }}
                    >
                      <Icon className="w-6 h-6 text-white" strokeWidth={2.4} />
                    </div>
                    <span
                      className={cn(
                        "text-[10.5px]",
                        isActive ? "font-bold text-[#7B2FF7]" : "font-semibold text-[#A49BBE]"
                      )}
                    >
                      {label}
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-col items-center gap-1",
                    isActive ? "text-[#7B2FF7]" : "text-[#A49BBE]"
                  )}
                >
                  <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.1 : 1.9} />
                  <span
                    className={cn("text-[10.5px]", isActive ? "font-bold" : "font-semibold")}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}

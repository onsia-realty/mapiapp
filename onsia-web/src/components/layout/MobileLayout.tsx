"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", emoji: "🏠", label: "홈" },
  { href: "/favorites", emoji: "❤️", label: "관심목록" },
  { href: "/register", emoji: "➕", label: "매물등록" },
  { href: "/jobs", emoji: "💼", label: "구인구직" },
  { href: "/more", emoji: "☰", label: "더보기" },
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
      <div className="w-full max-w-[480px] bg-gray-50 min-h-screen flex flex-col shadow-xl">
        {/* 메인 콘텐츠 */}
        <main className={cn("flex-1 overflow-auto", !hideNav && "pb-20")}>
          {children}
        </main>

        {/* 하단 네비게이션 */}
        {!hideNav && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-around py-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center gap-1 py-1 px-3"
                  >
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        isActive ? "text-purple-600 font-semibold" : "text-gray-600"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  right?: React.ReactNode;
  sticky?: boolean;
  /** 헤더 아래 붙는 콘텐츠 (탭·칩 등) */
  children?: React.ReactNode;
}

// 내부 페이지 공용 헤더 — 디자인 시스템 (#1B1330 타이틀, #EFEBF7 보더)
export function PageHeader({ title, right, sticky = true, children }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className={cn("bg-white border-b border-[#EFEBF7]", sticky && "sticky top-0 z-10")}>
      <div className="flex items-center gap-3 px-5 py-4">
        <button type="button" onClick={() => router.back()} aria-label="뒤로가기">
          <ChevronLeft className="w-6 h-6 text-[#1B1330]" strokeWidth={2.4} />
        </button>
        <h1 className="text-[17px] font-extrabold text-[#1B1330] tracking-[-0.3px]">{title}</h1>
        {right && <div className="ml-auto">{right}</div>}
      </div>
      {children}
    </header>
  );
}

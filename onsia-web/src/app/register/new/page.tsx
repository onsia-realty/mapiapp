"use client";

import Link from "next/link";
import { Ticket, Building2, Hotel, Briefcase, Store } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";

// 홈 카테고리와 동일한 파스텔 타일 컬러 체계
function CircleWonIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M15 9.5c0-1-1.3-1.7-3-1.7s-3 .7-3 1.7 1 1.5 3 1.9 3 .9 3 1.9-1.3 1.7-3 1.7-3-.7-3-1.7" />
    </svg>
  );
}

const CATEGORIES = [
  { key: "bunyanggwon", title: "분양권 전매", subtitle: "분양권 전매 등록", href: "/register/new/bunyanggwon", tileBg: "bg-[#EDE9FE]", iconColor: "text-[#7B2FF7]", icon: Ticket },
  { key: "ijaman", title: "이자만", subtitle: "이자만 등록", tileBg: "bg-[#FFF1E8]", iconColor: "text-[#F97316]", icon: null },
  { key: "apartment", title: "아파트(임대차)", subtitle: "아파트 등록", tileBg: "bg-[#E8F0FE]", iconColor: "text-[#2563EB]", icon: Building2 },
  { key: "officetel", title: "오피스텔(임대차)", subtitle: "오피스텔 등록", tileBg: "bg-[#FCE7F3]", iconColor: "text-[#DB2777]", icon: Hotel },
  { key: "office", title: "사무실(임대차)", subtitle: "사무실 등록", tileBg: "bg-[#E7F7EF]", iconColor: "text-[#059669]", icon: Briefcase },
  { key: "store", title: "상가(임대차)", subtitle: "상가 등록", tileBg: "bg-[#FEF3C7]", iconColor: "text-[#D97706]", icon: Store },
];

export default function RegisterCategoryPage() {
  return (
    <MobileLayout>
      <PageHeader title="매물 등록" />

      <div className="px-5 pt-5 pb-10">
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(({ key, icon: Icon, title, subtitle, href, tileBg, iconColor }) => {
            const inner = (
              <>
                <div className={`w-14 h-14 rounded-2xl ${tileBg} flex items-center justify-center`}>
                  {Icon ? (
                    <Icon className={`w-7 h-7 ${iconColor}`} strokeWidth={1.9} />
                  ) : (
                    <CircleWonIcon className={iconColor} />
                  )}
                </div>
                <div className="text-center">
                  <div className="text-[15px] font-bold text-[#1B1330] leading-[1.3]">{title}</div>
                  <div className="text-[11.5px] text-[#9A93AC] font-medium mt-1 leading-[1.3]">
                    {subtitle}
                  </div>
                </div>
              </>
            );
            const className =
              "bg-white rounded-[20px] p-5 flex flex-col items-center gap-3 shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.97] transition-transform";

            return href ? (
              <Link key={key} href={href} className={className}>
                {inner}
              </Link>
            ) : (
              <button
                key={key}
                type="button"
                className={className}
                onClick={() => alert(`${title} 등록은 준비 중입니다.`)}
              >
                {inner}
              </button>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
}

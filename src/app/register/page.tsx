"use client";

import Link from "next/link";
import { Building2, Search } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";

const MENU = [
  {
    href: "/register/new",
    icon: Building2,
    title: "매물 등록",
    subtitle: "매물 등록하기",
    tileBg: "bg-[#EDE9FE]",
    iconColor: "text-[#7B2FF7]",
  },
  {
    href: "/register/list",
    icon: Search,
    title: "매물 조회",
    subtitle: "내가 등록한 매물 확인",
    tileBg: "bg-[#E8F0FE]",
    iconColor: "text-[#2563EB]",
  },
];

export default function RegisterHomePage() {
  return (
    <MobileLayout>
      <PageHeader title="매물 관리" />

      <div className="px-5 pt-5 pb-10">
        <div className="grid grid-cols-2 gap-3">
          {MENU.map(({ href, icon: Icon, title, subtitle, tileBg, iconColor }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-[20px] p-5 flex flex-col items-center gap-3 shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.97] transition-transform"
            >
              <div className={`w-14 h-14 rounded-2xl ${tileBg} flex items-center justify-center`}>
                <Icon className={`w-7 h-7 ${iconColor}`} strokeWidth={1.9} />
              </div>
              <div className="text-center">
                <div className="text-[15px] font-bold text-[#1B1330] leading-[1.3]">{title}</div>
                <div className="text-[11.5px] text-[#9A93AC] font-medium mt-1 leading-[1.3]">
                  {subtitle}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}

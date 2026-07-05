"use client";

import { ChevronRight, User, MessageSquare, Smartphone, LogOut } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";

// Mock — 개발사 앱 내 정보 화면(캡처 92)과 동일 데이터
const MOCK_USER = {
  name: "마피 중개사",
  role: "중개사",
  email: "jooong@google.com",
};

const MENU = [
  { icon: MessageSquare, label: "SNS 계정 로그인", tileBg: "bg-[#FEF3C7]", iconColor: "text-[#D97706]" },
  { icon: Smartphone, label: "휴대전화번호 재설정", tileBg: "bg-[#E8F0FE]", iconColor: "text-[#2563EB]" },
  { icon: LogOut, label: "로그아웃", tileBg: "bg-[#FFF1F2]", iconColor: "text-[#FF3B5C]" },
];

export default function MyPage() {
  return (
    <MobileLayout>
      <PageHeader title="내 정보" />

      <div className="px-4 pt-4 pb-10 space-y-4">
        {/* 프로필 카드 */}
        <div
          className="rounded-[20px] p-5 flex items-center gap-4 shadow-[0_8px_20px_rgba(109,31,240,.25)]"
          style={{ background: "linear-gradient(160deg,#6D1FF0 0%,#9333EA 55%,#B45CFF 100%)" }}
        >
          <div className="w-14 h-14 rounded-full bg-white/[.16] flex items-center justify-center">
            <User className="w-7 h-7 text-white" strokeWidth={1.9} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-extrabold text-white">{MOCK_USER.name}</span>
              <span className="bg-white/90 text-[#6D1FF0] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {MOCK_USER.role}
              </span>
            </div>
            <div className="text-[12.5px] text-white/[.78] mt-1">{MOCK_USER.email}</div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(27,19,48,.05)] divide-y divide-[#F3F0FA]">
          {MENU.map(({ icon: Icon, label, tileBg, iconColor }) => (
            <button
              key={label}
              type="button"
              onClick={() => alert(`${label} (데모)`)}
              className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-[#F7F6FB] transition-colors first:rounded-t-[20px] last:rounded-b-[20px]"
            >
              <div className={`w-10 h-10 rounded-xl ${tileBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.9} />
              </div>
              <span className="flex-1 text-[15px] font-semibold text-[#1B1330]">{label}</span>
              <ChevronRight className="w-5 h-5 text-[#C9C2DC]" />
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}

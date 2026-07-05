"use client";

import Link from "next/link";
import { MobileLayout } from "@/components/layout/MobileLayout";
import {
  Bell,
  User,
  Search,
  Building2,
  FileText,
  Building,
  Hotel,
  Briefcase,
  Store,
  Pencil,
  Tag,
  ChevronRight,
} from "lucide-react";

// 시안 2a 커스텀 원화(₩) 서클 아이콘 — lucide에 없어 시안 SVG 사용
function CircleWonIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
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

// 일반 카테고리 카드 (파스텔 아이콘 타일 + 제목/부제)
const SUB_CATEGORIES = [
  {
    href: "/category/apartment",
    icon: Building,
    title: "아파트",
    subtitle: "임대차",
    tileBg: "bg-[#E8F0FE]",
    iconColor: "text-[#2563EB]",
  },
  {
    href: "/category/officetel",
    icon: Hotel,
    title: "오피스텔",
    subtitle: "임대차",
    tileBg: "bg-[#FCE7F3]",
    iconColor: "text-[#DB2777]",
  },
  {
    href: "/category/office",
    icon: Briefcase,
    title: "사무실",
    subtitle: "임대차",
    tileBg: "bg-[#E7F7EF]",
    iconColor: "text-[#059669]",
  },
  {
    href: "/category/store",
    icon: Store,
    title: "상가",
    subtitle: "임대차",
    tileBg: "bg-[#FEF3C7]",
    iconColor: "text-[#D97706]",
  },
];

export default function HomePage() {
  return (
    <MobileLayout>
      {/* 다크 헤더 (콘텐츠와 함께 스크롤) */}
      <header className="bg-[#1B1330] px-5 pt-5 pb-[22px] rounded-b-[26px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-gradient-to-br from-[#7B2FF7] to-[#A855F7] flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 11l9-8 9 8" />
                <path d="M5 10v10h14V10" />
              </svg>
            </div>
            <span className="text-[22px] font-black tracking-[-0.5px] text-white">MAPI</span>
          </div>
          <div className="flex items-center gap-4 text-white">
            <Bell className="w-5 h-5" strokeWidth={1.9} />
            <User className="w-5 h-5" strokeWidth={1.9} />
          </div>
        </div>

        {/* 검색창 */}
        <div className="flex items-center gap-2.5 bg-[#2C2145] rounded-[14px] px-4 py-[13px]">
          <Search className="w-[18px] h-[18px] text-[#A855F7]" strokeWidth={2.2} />
          <input
            type="text"
            placeholder="어떤 공간을 찾고 계시나요?"
            className="flex-1 bg-transparent outline-none text-[14.5px] font-medium text-white placeholder:text-[#9A8FB8]"
            readOnly
          />
        </div>
      </header>

      <div className="bg-[#F7F6FB]">
        {/* 카테고리 */}
        <section className="px-5 pt-[22px]">
          <h2 className="text-lg font-extrabold text-[#1B1330] tracking-[-0.3px] mb-3.5">
            카테고리
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {/* 히어로 카드 — 분양권전매 */}
            <Link
              href="/category/bunyanggwon"
              className="row-span-2 rounded-[20px] p-5 px-[18px] min-h-[246px] flex flex-col justify-between relative overflow-hidden shadow-[0_8px_20px_rgba(109,31,240,.25)] active:scale-[0.97] transition-transform"
              style={{
                background: "linear-gradient(160deg,#6D1FF0 0%,#9333EA 55%,#B45CFF 100%)",
              }}
            >
              <div className="absolute -right-[30px] -top-[30px] w-[120px] h-[120px] rounded-full bg-white/[.08]" />
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-[14px] bg-white/[.16] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" strokeWidth={1.9} />
                </div>
                <span className="bg-white/90 text-[#6D1FF0] text-[10px] font-extrabold px-[9px] py-1 rounded-full tracking-[.4px]">
                  PREMIUM
                </span>
              </div>
              <div>
                <div className="text-[19px] font-extrabold text-white tracking-[-0.4px] leading-tight">
                  분양권전매
                </div>
                <div className="text-[12.5px] text-white/[.78] mt-[5px] font-medium">
                  프리미엄 분양권 거래
                </div>
                <div className="inline-flex items-center gap-1 mt-3.5 bg-white/[.18] rounded-full px-3 py-1.5">
                  <span className="text-[11.5px] font-bold text-white">바로가기</span>
                  <ChevronRight className="w-3 h-3 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </Link>

            {/* 이자만 (HOT) */}
            <Link
              href="/category/ijaman"
              className="bg-white rounded-[20px] p-4 relative shadow-[0_2px_10px_rgba(27,19,48,.05)] flex flex-col gap-2.5 active:scale-[0.97] transition-transform"
            >
              <span className="absolute top-3 right-3 bg-[#FF3B5C] text-white text-[10px] font-extrabold px-2 py-[3px] rounded-full tracking-[.3px]">
                HOT
              </span>
              <div className="w-[38px] h-[38px] rounded-xl bg-[#FFF1E8] flex items-center justify-center">
                <CircleWonIcon className="text-[#F97316]" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-[#1B1330] leading-[1.3]">이자만</div>
                <div className="text-[11.5px] text-[#7B2FF7] font-semibold mt-0.5 leading-[1.3]">급매물임대</div>
              </div>
            </Link>

            {/* 신규분양정보 (NEW) */}
            <Link
              href="/category/subscription"
              className="bg-white rounded-[20px] p-4 relative shadow-[0_2px_10px_rgba(27,19,48,.05)] flex flex-col gap-2.5 active:scale-[0.97] transition-transform"
            >
              <span className="absolute top-3 right-3 bg-[#16A34A] text-white text-[10px] font-extrabold px-2 py-[3px] rounded-full tracking-[.3px]">
                NEW
              </span>
              <div className="w-[38px] h-[38px] rounded-xl bg-[#EDE9FE] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#7B2FF7]" strokeWidth={1.9} />
              </div>
              <div>
                <div className="text-[15px] font-bold text-[#1B1330] leading-[1.3]">신규분양정보</div>
                <div className="text-[11.5px] text-[#7B2FF7] font-semibold mt-0.5 leading-[1.3]">청약홈</div>
              </div>
            </Link>

            {/* 아파트 ~ 상가 (2×2 가로 카드) */}
            {SUB_CATEGORIES.map(({ href, icon: Icon, title, subtitle, tileBg, iconColor }) => (
              <Link
                key={href}
                href={href}
                className="bg-white rounded-[20px] p-4 shadow-[0_2px_10px_rgba(27,19,48,.05)] flex items-center gap-3 active:scale-[0.97] transition-transform"
              >
                <div
                  className={`w-[38px] h-[38px] rounded-xl ${tileBg} flex items-center justify-center flex-none`}
                >
                  <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.9} />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#1B1330] leading-[1.3]">{title}</div>
                  <div className="text-[11.5px] text-[#7B2FF7] font-semibold mt-0.5 leading-[1.3]">
                    {subtitle}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 매물 의뢰하기 */}
        <section className="px-5 pt-[26px]">
          <h2 className="text-lg font-extrabold text-[#1B1330] tracking-[-0.3px] mb-3.5">
            매물 의뢰하기
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/request/bunyanggwon"
              className="rounded-2xl p-4 flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(123,47,247,.3)] active:scale-[0.97] transition-transform"
              style={{ background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }}
            >
              <Pencil className="w-[18px] h-[18px] text-white" strokeWidth={2} />
              <span className="text-sm font-extrabold text-white">분양권 의뢰</span>
            </Link>
            <Link
              href="/request/ijaman"
              className="bg-[#1B1330] rounded-2xl p-4 flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
            >
              <Tag className="w-[18px] h-[18px] text-white" strokeWidth={2} />
              <span className="text-sm font-extrabold text-white">이자만 의뢰</span>
            </Link>
          </div>
        </section>

        {/* 혜택 배너 (골드 프리미엄) */}
        <section className="px-5 pt-5 pb-6">
          <div
            className="rounded-[18px] px-[22px] py-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(115deg,#17130B 0%,#2E2410 60%,#4A3A14 100%)",
            }}
          >
            <div
              className="absolute -right-[30px] -top-[30px] w-[130px] h-[130px] rounded-full"
              style={{ background: "rgba(212,175,55,.18)", filter: "blur(34px)" }}
            />
            <div className="text-[10.5px] font-extrabold text-[#D9B54A] tracking-[1.6px] mb-[7px]">
              중개업소 추천 가입 혜택
            </div>
            <div className="text-[17px] font-extrabold text-white tracking-[-0.3px] leading-[1.4]">
              매물등록 10회권 지급
              <br />
              <span className="text-[#EBD79A]">구인구직 1회권</span> 추가 지급
            </div>
            <div className="inline-flex items-center gap-[5px] mt-3.5 bg-[#D9B54A] rounded-full px-3.5 py-[7px]">
              <span className="text-[11.5px] font-extrabold text-[#17130B]">혜택 받기</span>
              <ChevronRight className="w-3 h-3 text-[#17130B]" strokeWidth={2.6} />
            </div>
            {/* 골드 빌딩 실루엣 */}
            <div className="absolute right-4 -bottom-1.5 flex items-end gap-1 opacity-50">
              <div
                className="w-3.5 h-11 rounded-t-[3px]"
                style={{ background: "linear-gradient(180deg,#D9B54A,#8a7126)" }}
              />
              <div
                className="w-3.5 h-16 rounded-t-[3px]"
                style={{ background: "linear-gradient(180deg,#EBD79A,#9c8433)" }}
              />
              <div
                className="w-3.5 h-[34px] rounded-t-[3px]"
                style={{ background: "linear-gradient(180deg,#D9B54A,#8a7126)" }}
              />
            </div>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}

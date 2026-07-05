"use client";

import { useState } from "react";
import Image from "next/image";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarDays,
  Building2,
  Check,
  Phone,
  Bookmark,
  MessageCircle,
} from "lucide-react";

// Mock — 개발사 앱 구인 공고 상세(캡처 81/81b) 데이터 + 업계 정보(역할·수수료) 보강
const JOB_DETAIL = {
  company: "마피 중개사",
  category: "아파트 · 서울 마포구",
  title: "샘플 아파트 공인 중개사",
  address: "서울 마포구 가양대로 2031",
  registeredAt: "2026.04.07",
  agency: "주식회사 토우",
  startDate: "2026년 06월 15일(월)",
  roles: [
    { role: "팀장", fee: "RT 330만원" },
    { role: "팀원", fee: "RT 670만원" },
  ],
  recruit: [
    { label: "근무형태", value: "정규직" },
    { label: "경력", value: "1년 이상" },
    { label: "급여", value: "기본급" },
    { label: "근무시간", value: "09:00-18:00" },
    { label: "휴무", value: "주말 휴무" },
  ],
  benefits: ["4대보험", "인센티브", "식사제공", "숙소비제공"],
  detailImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
  contact: { manager: "홍길동", phone: "010-3456-7890" },
  media: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=450&fit=crop",
  ],
};

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgba(27,19,48,.05)]">
      <h2 className="text-base font-extrabold text-[#1B1330] tracking-[-0.3px] mb-3.5">{title}</h2>
      {children}
    </div>
  );
}

export default function JobDetailPage() {
  const [slide, setSlide] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const total = JOB_DETAIL.media.length;

  return (
    <MobileLayout hideNav>
      <PageHeader title="공고 상세" />

      {/* 미디어 슬라이더 */}
      <div className="relative w-full aspect-video bg-black">
        <Image
          src={JOB_DETAIL.media[slide]}
          alt={`미디어 ${slide + 1}`}
          fill
          className="object-cover"
          sizes="390px"
        />
        <button
          type="button"
          onClick={() => setSlide((slide - 1 + total) % total)}
          aria-label="이전"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1B1330]/60 text-white flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setSlide((slide + 1) % total)}
          aria-label="다음"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1B1330]/60 text-white flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="absolute bottom-2 right-2 bg-[#1B1330]/70 text-white text-[11px] font-semibold rounded-full px-2.5 py-1">
          {slide + 1}/{total}
        </span>
      </div>

      <div className="px-4 pt-4 pb-32 space-y-4">
        {/* 공고 기본 정보 */}
        <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgba(27,19,48,.05)]">
          <div className="text-[11px] font-bold text-[#7B2FF7]">{JOB_DETAIL.category}</div>
          <h1 className="text-[19px] font-extrabold text-[#1B1330] tracking-[-0.4px] mt-1">
            {JOB_DETAIL.title}
          </h1>
          <div className="text-[12.5px] text-[#9A93AC] mt-0.5">{JOB_DETAIL.company}</div>

          {/* 역할·수수료 */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {JOB_DETAIL.roles.map(({ role, fee }) => (
              <span key={role} className="inline-flex items-center gap-1.5">
                <span className="bg-[#EDE9FE] text-[#7B2FF7] text-[11px] font-extrabold px-2 py-1 rounded-md">
                  {role}
                </span>
                <span className="text-[15px] font-extrabold text-[#FF3B5C]">{fee}</span>
              </span>
            ))}
          </div>

          <div className="border-t border-[#F3F0FA] mt-4 pt-4 space-y-2">
            <div className="flex items-center gap-2 text-[13px] text-[#6E6787]">
              <MapPin className="w-4 h-4 text-[#7B2FF7]" strokeWidth={2} />
              {JOB_DETAIL.address}
            </div>
            <div className="flex items-center gap-2 text-[13px] text-[#6E6787]">
              <Building2 className="w-4 h-4 text-[#7B2FF7]" strokeWidth={2} />
              대행사 {JOB_DETAIL.agency}
            </div>
            <div className="flex items-center gap-2 text-[13px] text-[#6E6787]">
              <CalendarDays className="w-4 h-4 text-[#7B2FF7]" strokeWidth={2} />
              투입일 {JOB_DETAIL.startDate} · 등록일 {JOB_DETAIL.registeredAt}
            </div>
          </div>
        </div>

        {/* 모집 내용 */}
        <Section title="모집 내용">
          <div className="rounded-xl border border-[#F3F0FA] overflow-hidden">
            {JOB_DETAIL.recruit.map((row, i) => (
              <div key={row.label} className={`flex ${i > 0 ? "border-t border-[#F3F0FA]" : ""}`}>
                <div className="w-28 shrink-0 bg-[#F7F6FB] px-4 py-3 text-[13px] font-bold text-[#6E6787]">
                  {row.label}
                </div>
                <div className="flex-1 px-4 py-3 text-[13.5px] font-medium text-[#1B1330] bg-white">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 복리후생 */}
        <Section title="복리후생">
          <div className="flex gap-2 flex-wrap">
            {JOB_DETAIL.benefits.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1 bg-[#EDE9FE] text-[#7B2FF7] text-[12.5px] font-bold px-3 py-1.5 rounded-full"
              >
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> {b}
              </span>
            ))}
          </div>
        </Section>

        {/* 상세 모집내용 */}
        <Section title="상세 모집내용">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
            <Image
              src={JOB_DETAIL.detailImage}
              alt="상세 모집내용"
              fill
              className="object-cover"
              sizes="390px"
            />
          </div>
        </Section>

        {/* 지원 방법 */}
        <div
          className="rounded-[20px] p-5 shadow-[0_8px_20px_rgba(109,31,240,.25)]"
          style={{ background: "linear-gradient(160deg,#6D1FF0 0%,#9333EA 55%,#B45CFF 100%)" }}
        >
          <h2 className="flex items-center gap-1.5 text-base font-extrabold text-white tracking-[-0.3px] mb-3">
            <Phone className="w-[18px] h-[18px]" strokeWidth={2.1} /> 지원 방법
          </h2>
          <p className="text-[14.5px] text-white font-semibold">
            담당자 {JOB_DETAIL.contact.manager} · {JOB_DETAIL.contact.phone}
          </p>
          <p className="text-[12px] text-white/[.78] mt-2">
            * 전화 또는 문자로 연락 주시면 상담 도와드립니다.
            <br />* 이력서 제출 필요 없이 바로 면접 가능!
          </p>
        </div>

        {/* 위치 */}
        <Section title="위치">
          <div className="w-full h-48 rounded-xl bg-[#F3F0FA] flex items-center justify-center text-[#A49BBE] text-[13px]">
            지도 영역 ({JOB_DETAIL.address})
          </div>
          <p className="text-[11px] text-[#C9C2DC] mt-3">
            본 채용공고의 저작권은 {JOB_DETAIL.company}에 있으며, 무단 전재 및 재배포를 금지합니다.
          </p>
        </Section>
      </div>

      {/* sticky 하단 문의 바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-[#EFEBF7] px-4 pt-3 pb-5 flex items-center gap-2.5 z-20">
        <button
          type="button"
          onClick={() => setBookmarked(!bookmarked)}
          aria-label="북마크"
          className="w-12 h-12 shrink-0 rounded-xl border border-[#E9E4F5] flex items-center justify-center"
        >
          <Bookmark
            className={bookmarked ? "w-5 h-5 text-[#7B2FF7] fill-[#7B2FF7]" : "w-5 h-5 text-[#A49BBE]"}
            strokeWidth={2}
          />
        </button>
        <button
          type="button"
          onClick={() => alert("전화문의 (데모)")}
          className="flex-1 h-12 rounded-xl border-[1.5px] border-[#7B2FF7] text-[#7B2FF7] text-[14.5px] font-extrabold flex items-center justify-center gap-1.5"
        >
          <Phone className="w-4 h-4" strokeWidth={2.2} /> 전화문의
        </button>
        <button
          type="button"
          onClick={() => alert("채팅문의 (데모)")}
          className="flex-1 h-12 rounded-xl text-white text-[14.5px] font-extrabold flex items-center justify-center gap-1.5 shadow-[0_6px_16px_rgba(123,47,247,.3)]"
          style={{ background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }}
        >
          <MessageCircle className="w-4 h-4" strokeWidth={2.2} /> 채팅 문의
        </button>
      </div>
    </MobileLayout>
  );
}

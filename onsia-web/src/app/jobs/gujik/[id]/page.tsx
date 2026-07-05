"use client";

import { Phone } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";

// Mock — 개발사 앱 구직 상세(캡처 83/83b)와 동일 데이터
// ※ 개발사 앱은 헤더가 "구인상세"로 잘못 표기되어 있음 → 웹에서는 "구직 상세"로 표기
const GUJIK_DETAIL = {
  basic: [
    { label: "성명", value: "홍길동" },
    { label: "성별", value: "남" },
    { label: "연령", value: "41세" },
    { label: "주소", value: "서울 구로구 가마산로 87" },
  ],
  hope: [
    { label: "희망업무", value: "관리" },
    { label: "희망지역", value: "수도권" },
    { label: "근무가능일", value: "즉시협의" },
  ],
  career: [
    { label: "경력", value: "10년 이상" },
    { label: "자격사항", value: "공인중개사" },
    { label: "인맥", value: "-" },
  ],
  introduction: "안녕하세요\n분양 대행사 주식회사",
  etc: "",
  contact: [
    { label: "핸드폰", value: "010-1234-5678" },
    { label: "전화", value: "-" },
    { label: "이메일", value: "abcd@naver.com" },
    { label: "홈페이지", value: "www.abc.com" },
  ],
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgba(27,19,48,.05)]">
      <h2 className="text-base font-extrabold text-[#1B1330] tracking-[-0.3px] mb-3.5">{title}</h2>
      {children}
    </div>
  );
}

function InfoTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="rounded-xl border border-[#F3F0FA] overflow-hidden">
      {rows.map((row, i) => (
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
  );
}

export default function GujikDetailPage() {
  return (
    <MobileLayout>
      <PageHeader title="구직 상세" />

      <div className="px-4 pt-4 pb-10 space-y-4">
        <Section title="기본 정보">
          <InfoTable rows={GUJIK_DETAIL.basic} />
        </Section>

        <Section title="희망 조건">
          <InfoTable rows={GUJIK_DETAIL.hope} />
        </Section>

        <Section title="경력 · 역량">
          <InfoTable rows={GUJIK_DETAIL.career} />
        </Section>

        <Section title="자기소개">
          <div className="rounded-xl bg-[#F7F6FB] px-4 py-4 text-[13.5px] text-[#1B1330] whitespace-pre-line min-h-[60px] leading-[1.6]">
            {GUJIK_DETAIL.introduction}
          </div>
        </Section>

        <Section title="기타">
          <div className="rounded-xl bg-[#F7F6FB] px-4 py-4 text-[13.5px] text-[#1B1330] min-h-[52px]">
            {GUJIK_DETAIL.etc || "-"}
          </div>
        </Section>

        {/* 연락처 — 브랜드 그라디언트 카드 */}
        <div
          className="rounded-[20px] p-5 shadow-[0_8px_20px_rgba(109,31,240,.25)]"
          style={{ background: "linear-gradient(160deg,#6D1FF0 0%,#9333EA 55%,#B45CFF 100%)" }}
        >
          <h2 className="flex items-center gap-1.5 text-base font-extrabold text-white tracking-[-0.3px] mb-3">
            <Phone className="w-[18px] h-[18px]" strokeWidth={2.1} /> 연락처
          </h2>
          <div className="space-y-2">
            {GUJIK_DETAIL.contact.map((row) => (
              <div key={row.label} className="flex text-[14px]">
                <span className="w-20 text-white/[.7] font-semibold">{row.label}</span>
                <span className="text-white font-bold">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

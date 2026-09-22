"use client";

import { useState } from "react";
import { Bookmark, CheckCircle2, MessageCircle, Phone, Send, UserRound, X } from "lucide-react";
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
  const [bookmarked, setBookmarked] = useState(false);
  const [contact, setContact] = useState<"contact" | "offer" | "sent" | null>(null);

  return (
    <MobileLayout>
      <PageHeader title="구직 상세" />

      <div className="px-4 pt-4 pb-40 space-y-4">
        <div className="relative overflow-hidden rounded-[22px] bg-[var(--brand-ink)] p-5 text-white shadow-[0_12px_28px_rgba(27,23,38,.14)]">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--brand-gold)]/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <span className="gold-fill grid h-14 w-14 shrink-0 place-items-center rounded-[18px]"><UserRound className="h-7 w-7" /></span>
            <div><p className="text-[10px] font-black tracking-[1px] text-[#E9D6A0]">VERIFIED PROFILE</p><h1 className="mt-1 text-[20px] font-black">경력 10년 공인중개사</h1><p className="mt-1 text-[11.5px] text-white/60">수도권 · 즉시 협의 가능</p></div>
            <button type="button" aria-label="인재 저장" onClick={() => setBookmarked((value) => !value)} className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-white/10"><Bookmark className={bookmarked ? "h-5 w-5 fill-[#E4C577] text-[#E4C577]" : "h-5 w-5 text-white/70"} /></button>
          </div>
        </div>
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

      {contact && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45" onClick={() => setContact(null)}>
          <div className="w-full max-w-[430px] rounded-t-[26px] bg-white p-5 pb-7" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-black tracking-[1px] text-[var(--brand-purple)]">TALENT CONTACT</p><h2 className="mt-1 text-[19px] font-black text-[var(--brand-ink)]">{contact === "contact" ? "인재에게 문의하기" : contact === "offer" ? "면접 제안 보내기" : "제안이 전송되었습니다"}</h2></div><button type="button" aria-label="닫기" onClick={() => setContact(null)} className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-muted)]"><X className="h-4 w-4" /></button></div>
            {contact === "contact" && <div className="space-y-3"><a href="tel:010-1234-5678" className="flex items-center gap-3 rounded-[16px] border border-[var(--line)] p-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-purple-soft)]"><Phone className="h-5 w-5 text-[var(--brand-purple)]" /></span><span><b className="block text-[14px] text-[var(--brand-ink)]">전화 연결</b><span className="text-[12px] text-[var(--text-muted)]">010-1234-5678</span></span></a><button type="button" onClick={() => setContact("sent")} className="flex w-full items-center gap-3 rounded-[16px] border border-[var(--line)] p-4 text-left"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF7E7]"><MessageCircle className="h-5 w-5 text-[#A97819]" /></span><span><b className="block text-[14px] text-[var(--brand-ink)]">메시지 남기기</b><span className="text-[12px] text-[var(--text-muted)]">채용 담당자 연락처와 함께 전달됩니다.</span></span></button></div>}
            {contact === "offer" && <div><div className="rounded-[16px] bg-[var(--surface-muted)] p-4"><p className="text-[12px] font-bold text-[var(--text-muted)]">제안 대상</p><p className="mt-1 text-[15px] font-black text-[var(--brand-ink)]">경력 10년 공인중개사 · 수도권</p></div><textarea aria-label="면접 제안 메시지" defaultValue="안녕하세요. 프로필을 보고 면접을 제안드립니다. 편한 시간에 연락 부탁드립니다." className="mt-3 h-28 w-full resize-none rounded-[16px] border border-[var(--line)] p-4 text-[13px] leading-6 outline-none focus:border-[var(--brand-purple)]" /><button type="button" onClick={() => setContact("sent")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-[15px] bg-[linear-gradient(135deg,#7B2FF7,#A855F7)] py-4 text-[15px] font-black text-white"><Send className="h-4 w-4" /> 면접 제안 전송</button></div>}
            {contact === "sent" && <div className="py-3 text-center"><span className="gold-fill mx-auto grid h-16 w-16 place-items-center rounded-[22px]"><CheckCircle2 className="h-8 w-8" /></span><p className="mt-4 text-[13px] leading-6 text-[var(--text-muted)]">인재에게 제안 알림을 보냈습니다.<br />답변이 오면 알림으로 알려드립니다.</p><button type="button" onClick={() => setContact(null)} className="mt-5 w-full rounded-[15px] bg-[var(--brand-ink)] py-3.5 text-[14px] font-black text-white">확인</button></div>}
          </div>
        </div>
      )}

      <div className="fixed bottom-[88px] left-1/2 z-30 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-2 gap-2.5 border-t border-[var(--line)] bg-white/95 px-4 pb-3 pt-3 backdrop-blur">
        <button type="button" onClick={() => setContact("contact")} className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-[var(--brand-purple)] text-[14px] font-black text-[var(--brand-purple)]"><Phone className="h-4 w-4" /> 문의하기</button>
        <button type="button" onClick={() => setContact("offer")} className="flex h-12 items-center justify-center gap-1.5 rounded-xl bg-[linear-gradient(135deg,#7B2FF7,#A855F7)] text-[14px] font-black text-white shadow-[0_6px_16px_rgba(123,47,247,.3)]"><Send className="h-4 w-4" /> 면접 제안</button>
      </div>
    </MobileLayout>
  );
}

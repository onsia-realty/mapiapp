"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Check, CheckCircle2, ChevronRight, FileText, MapPin, Paperclip, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

interface RequestFormProps {
  kind: "bunyanggwon" | "ijaman";
  title: string;
  dateLabel: string;
  optionLabel: string;
  options: string[];
}

const INPUT = "w-full rounded-[14px] border border-[var(--line)] bg-white px-4 py-3.5 text-[14px] font-semibold text-[var(--text-strong)] outline-none transition focus:border-[var(--brand-purple)] placeholder:text-[#B7B1C0]";

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return <div><div className="mb-2 flex items-center gap-1 text-[12.5px] font-extrabold text-[var(--text-muted)]">{label}{required && <span className="text-[var(--danger)]">*</span>}{hint && <span className="ml-auto font-medium text-[#A49EAD]">{hint}</span>}</div>{children}</div>;
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <section className="rounded-[22px] border border-white bg-white p-5 shadow-[0_7px_22px_rgba(27,23,38,.055)]"><div className="mb-5 flex items-center gap-3"><span className="gold-fill grid h-9 w-9 place-items-center rounded-[12px]">{icon}</span><h2 className="text-[16px] font-black tracking-[-.3px] text-[var(--brand-ink)]">{title}</h2></div><div className="space-y-4">{children}</div></section>;
}

function Summary({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] py-3.5 last:border-0"><span className="shrink-0 text-[12px] font-semibold text-[var(--text-muted)]">{label}</span><span className={cn("text-right text-[13px] font-bold text-[var(--text-strong)]", strong && "gold-text text-[14px] font-black")}>{value}</span></div>;
}

export function RequestForm({ kind, title, dateLabel, optionLabel, options }: RequestFormProps) {
  const isTransfer = kind === "bunyanggwon";
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [contractor, setContractor] = useState("마피 고객");
  const [phone, setPhone] = useState("010-1111-1111");
  const [siteName, setSiteName] = useState(isTransfer ? "광교 중흥S클래스" : "광교 더샵 레이크시티");
  const [address, setAddress] = useState(isTransfer ? "경기 수원시 영통구 광교호수공원로 277" : "경기 수원시 영통구 광교중앙로 145");
  const [date, setDate] = useState(isTransfer ? "2026-12-01" : "2026-10-01");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([options[0]]);
  const [message, setMessage] = useState(isTransfer ? "마이너스 프리미엄 매물을 찾고 있습니다. 상담 가능한 매물을 안내해 주세요." : "렌트프리 기간과 실제 부담 비용을 비교해 보고 싶습니다.");
  const [fileName, setFileName] = useState("");
  const [addressNotice, setAddressNotice] = useState(false);
  const [error, setError] = useState("");

  const toggleOption = (option: string) => {
    setSelectedOptions((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
    setError("");
  };

  const review = () => {
    if (![contractor, phone, siteName, address, date, message].every((value) => value.trim()) || selectedOptions.length === 0) {
      setError("필수 항목과 상담 옵션을 확인해 주세요.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (step === 3) return (
    <MobileLayout hideNav><PageHeader title="상담 의뢰 완료" /><div className="flex min-h-[calc(100vh-61px)] flex-col px-5 pb-10 pt-12">
      <div className="text-center"><div className="gold-fill mx-auto grid h-20 w-20 place-items-center rounded-[28px]"><CheckCircle2 className="h-10 w-10" strokeWidth={2.2} /></div><span className="mt-6 inline-block rounded-full bg-[var(--brand-purple-soft)] px-3 py-1.5 text-[10px] font-black tracking-[.6px] text-[var(--brand-purple)]">REQUEST RECEIVED</span><h1 className="mt-3 text-[24px] font-black tracking-[-.8px] text-[var(--brand-ink)]">상담 의뢰를 접수했어요</h1><p className="mt-2 text-[13px] leading-6 text-[var(--text-muted)]">{siteName}<br />조건에 맞는 매물을 확인하는 흐름을 보여드립니다.</p></div>
      <div className="mt-8 rounded-[20px] border border-[#D7AE54]/30 bg-[#211B29] p-5 text-white shadow-[0_12px_28px_rgba(27,23,38,.15)]"><div className="flex items-center gap-2 text-[13px] font-black"><ShieldCheck className="h-4 w-4 text-[#E7C66D]" /> 1차 전달용 데모 안내</div><p className="mt-2 text-[11.5px] leading-5 text-white/60">현재는 접수 화면과 클릭 흐름을 확인하는 데모입니다. 실제 저장, 담당 상담사 배정, 연락 알림은 개발사의 API 연동 후 동작합니다.</p></div>
      <div className="mt-auto space-y-3 pt-10"><Link href={isTransfer ? "/category/bunyanggwon" : "/category/ijaman"} className="flex w-full items-center justify-center rounded-[16px] bg-[var(--brand-purple)] py-4 text-[15px] font-black text-white shadow-[0_8px_20px_rgba(123,47,247,.26)]">{isTransfer ? "분양권 매물 보기" : "이자만 매물 보기"}</Link><Link href="/" className="flex w-full items-center justify-center rounded-[16px] border border-[var(--line)] bg-white py-4 text-[14px] font-extrabold text-[var(--brand-ink)]">홈으로 돌아가기</Link></div>
    </div></MobileLayout>
  );

  return <MobileLayout hideNav><PageHeader title={title} />
    <div className="border-b border-[var(--line)] bg-white px-5 py-3"><div className="flex items-center gap-2"><span className={cn("grid h-7 w-7 place-items-center rounded-full text-[11px] font-black", "gold-fill")}>{step > 1 ? <Check className="h-3.5 w-3.5" /> : 1}</span><span className="text-[10.5px] font-extrabold text-[var(--brand-ink)]">상담 정보</span><span className={cn("h-px flex-1", step > 1 ? "bg-[var(--brand-gold)]" : "bg-[var(--line)]")} /><span className={cn("grid h-7 w-7 place-items-center rounded-full text-[11px] font-black", step === 2 ? "gold-fill" : "bg-[#ECE9F0] text-[#A39DAB]")}>2</span><span className={cn("text-[10.5px] font-extrabold", step === 2 ? "text-[var(--brand-ink)]" : "text-[#A39DAB]")}>접수 확인</span></div></div>

    <div className="space-y-4 px-4 pb-[122px] pt-4">
      {error && <div role="alert" className="rounded-[14px] border border-[#F4C8CB] bg-[#FFF1F2] px-4 py-3 text-[12.5px] font-bold text-[var(--danger)]">{error}</div>}
      {step === 1 ? <>
        <div className="relative overflow-hidden rounded-[22px] bg-[var(--brand-ink)] p-5 text-white"><div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-[var(--brand-purple)]/25 blur-2xl" /><span className="gold-text text-[10px] font-black tracking-[1.2px]">MAPI CONCIERGE</span><h1 className="mt-2 text-[20px] font-black tracking-[-.5px]">{isTransfer ? "조건에 맞는 분양권을 찾아드려요" : "실질 혜택을 비교해 드려요"}</h1><p className="mt-1 text-[11.5px] leading-5 text-white/55">희망 조건을 남기면 상담 연결 과정이 한결 빨라집니다.</p></div>
        <Section icon={<FileText className="h-[18px] w-[18px]" />} title="신청자 정보"><Field label="이름·계약자" required><input aria-label="이름·계약자" value={contractor} onChange={(e) => setContractor(e.target.value)} className={INPUT} /></Field><Field label="연락처" required><input aria-label="연락처" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT} /></Field></Section>
        <Section icon={<MapPin className="h-[18px] w-[18px]" />} title="희망 현장·조건"><Field label="현장·건물명" required><input aria-label="현장·건물명" value={siteName} onChange={(e) => setSiteName(e.target.value)} className={INPUT} /></Field><Field label="주소" required><div className="flex gap-2"><input aria-label="주소" value={address} onChange={(e) => setAddress(e.target.value)} className={cn(INPUT, "min-w-0 flex-1")} /><button type="button" onClick={() => setAddressNotice(true)} className="inline-flex shrink-0 items-center gap-1 rounded-[14px] bg-[var(--brand-purple-soft)] px-3 text-[11px] font-black text-[var(--brand-purple)]"><Search className="h-3.5 w-3.5" /> 검색</button></div>{addressNotice && <div className="mt-2 rounded-[12px] bg-[#F8F6FB] px-3 py-2.5 text-[10.5px] leading-4 text-[var(--text-muted)]">주소 검색은 개발사 지도 API 연동 후 제공됩니다. 데모에서는 직접 입력해 주세요.</div>}</Field><Field label={dateLabel} required><div className="relative"><CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-purple)]" /><input aria-label={dateLabel} type="date" value={date} onChange={(e) => setDate(e.target.value)} className={cn(INPUT, "pl-10")} /></div></Field><Field label={optionLabel} required hint="중복 선택"><div className="flex flex-wrap gap-2">{options.map((option) => <button key={option} type="button" onClick={() => toggleOption(option)} className={cn("rounded-full border px-4 py-2.5 text-[12px] font-extrabold", selectedOptions.includes(option) ? "border-[var(--brand-purple)] bg-[var(--brand-purple)] text-white" : "border-[var(--line)] bg-white text-[var(--text-muted)]")}>{option}</button>)}</div></Field></Section>
        <Section icon={<Sparkles className="h-[18px] w-[18px]" />} title="상담 요청"><Field label="요청 내용" required hint={`${message.length}/300`}><textarea aria-label="요청 내용" value={message} onChange={(e) => setMessage(e.target.value.slice(0, 300))} rows={5} className={cn(INPUT, "resize-none leading-6")} /></Field><Field label="참고 파일" hint="선택"><label htmlFor={`request-file-${kind}`} className="flex cursor-pointer items-center gap-3 rounded-[15px] border-2 border-dashed border-[#D9D3E1] bg-[#FAF9FB] p-4"><span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[var(--brand-purple-soft)] text-[var(--brand-purple)]"><Paperclip className="h-5 w-5" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-[12px] text-[var(--brand-ink)]">{fileName || "계약서·참고 이미지 선택"}</strong><span className="mt-0.5 block text-[10px] text-[var(--text-muted)]">JPG, PNG, PDF · 최대 10MB</span></span>{fileName && <button type="button" aria-label="첨부 파일 삭제" onClick={(e) => { e.preventDefault(); setFileName(""); }}><X className="h-4 w-4" /></button>}</label><input id={`request-file-${kind}`} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} /></Field></Section>
      </> : <>
        <div className="rounded-[22px] bg-[var(--brand-ink)] p-5 text-white shadow-[0_12px_28px_rgba(27,23,38,.15)]"><span className="gold-fill inline-flex rounded-full px-3 py-1 text-[9px] font-black tracking-[.7px]">REQUEST PREVIEW</span><h1 className="mt-4 text-[21px] font-black tracking-[-.5px]">{siteName}</h1><p className="mt-1 text-[11.5px] text-white/55">{address}</p><p className="gold-text mt-5 text-[16px] font-black">{selectedOptions.join(" · ")}</p></div>
        <Section icon={<CheckCircle2 className="h-[18px] w-[18px]" />} title="접수 정보 확인"><Summary label="신청자" value={contractor} /><Summary label="연락처" value={phone} /><Summary label={dateLabel} value={date} /><Summary label={optionLabel} value={selectedOptions.join(", ")} strong /><Summary label="첨부 파일" value={fileName || "첨부 안 함"} /></Section><div className="rounded-[18px] border border-[var(--line)] bg-white p-4"><p className="text-[12px] font-black text-[var(--brand-ink)]">상담 요청 내용</p><p className="mt-2 whitespace-pre-wrap text-[11.5px] leading-5 text-[var(--text-muted)]">{message}</p></div>
      </>}
    </div>
    <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[430px] -translate-x-1/2 gap-2 border-t border-[var(--line)] bg-white/95 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">{step === 2 && <button type="button" onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="w-[96px] rounded-[15px] border border-[var(--line)] bg-white py-4 text-[13px] font-extrabold text-[var(--brand-ink)]">수정</button>}<button type="button" onClick={step === 1 ? review : () => { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex flex-1 items-center justify-center gap-1 rounded-[15px] bg-[var(--brand-purple)] py-4 text-[14px] font-black text-white shadow-[0_7px_18px_rgba(123,47,247,.28)]">{step === 1 ? "접수 내용 확인" : "상담 의뢰 접수"}<ChevronRight className="h-4 w-4" /></button></div>
  </MobileLayout>;
}

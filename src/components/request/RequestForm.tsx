"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, CalendarDays, Check, CheckCircle2, ChevronRight, CircleDollarSign, FileText, Landmark, MapPin, Paperclip, Search, ShieldCheck, Sparkles, X } from "lucide-react";
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

const TRANSFER_CONDITIONS = ["마이너스P", "원분양가·무피", "플러스P", "가격 협의"] as const;
const INTERIM_STATUSES = ["있음", "없음", "확인 필요"] as const;
const INTEREST_CONDITIONS = ["무이자", "이자후불제", "유이자", "모름"] as const;

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatManwon(value: string) {
  const amount = Number(value);
  if (!amount) return "0원";
  const billion = Math.floor(amount / 10000);
  const remainder = amount % 10000;
  if (!billion) return `${amount.toLocaleString("ko-KR")}만원`;
  return `${billion}억${remainder ? ` ${remainder.toLocaleString("ko-KR")}만원` : ""}`;
}

function AmountInput({ label, value, onChange, placeholder = "0" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <div className="relative"><input aria-label={label} inputMode="numeric" value={value} onChange={(event) => onChange(digitsOnly(event.target.value))} placeholder={placeholder} className={cn(INPUT, "pr-14 text-right tabular-nums")} /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[var(--text-muted)]">만원</span></div>;
}

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
  const [message, setMessage] = useState(isTransfer ? "보유 중인 분양권을 매도 의뢰합니다. 확인 후 연락 부탁드립니다." : "렌트프리 기간과 실제 부담 비용을 비교해 보고 싶습니다.");
  const [fileName, setFileName] = useState("");
  const [addressNotice, setAddressNotice] = useState(false);
  const [error, setError] = useState("");
  const [buildingDong, setBuildingDong] = useState("101동");
  const [buildingUnit, setBuildingUnit] = useState("1203호");
  const [housingType, setHousingType] = useState("84A");
  const [areaPyeong, setAreaPyeong] = useState("34");
  const [totalSalePrice, setTotalSalePrice] = useState("58000");
  const [firstContractAmount, setFirstContractAmount] = useState("5800");
  const [paidAmount, setPaidAmount] = useState("5800");
  const [balconyCost, setBalconyCost] = useState("1800");
  const [paidOptionCost, setPaidOptionCost] = useState("1200");
  const [interimStatus, setInterimStatus] = useState<(typeof INTERIM_STATUSES)[number]>("있음");
  const [interestCondition, setInterestCondition] = useState<(typeof INTEREST_CONDITIONS)[number]>("무이자");
  const [totalRounds, setTotalRounds] = useState("6");
  const [paidRounds, setPaidRounds] = useState("0");
  const [transferCondition, setTransferCondition] = useState<(typeof TRANSFER_CONDITIONS)[number]>("마이너스P");
  const [premiumAmount, setPremiumAmount] = useState("3000");
  const [saleTiming, setSaleTiming] = useState("가능한 빠르게");

  const premiumDelta = transferCondition === "마이너스P" ? -Number(premiumAmount) : transferCondition === "플러스P" ? Number(premiumAmount) : 0;
  const expectedDealPrice = transferCondition === "가격 협의" ? null : Math.max(0, Number(totalSalePrice) + premiumDelta);
  const expectedSettlement = transferCondition === "가격 협의" ? null : Math.max(0, Number(paidAmount) + premiumDelta);
  const premiumLabel = transferCondition === "마이너스P" ? `-${formatManwon(premiumAmount)}` : transferCondition === "플러스P" ? `+${formatManwon(premiumAmount)}` : transferCondition === "원분양가·무피" ? "0원" : "상담 후 결정";

  const toggleOption = (option: string) => {
    setSelectedOptions((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
    setError("");
  };

  const review = () => {
    const commonRequired = [contractor, phone, siteName, address, date, message];
    const transferRequired = [buildingDong, buildingUnit, housingType, areaPyeong, totalSalePrice, firstContractAmount, paidAmount];
    const needsPremium = transferCondition === "마이너스P" || transferCondition === "플러스P";
    if (!commonRequired.every((value) => value.trim()) || (isTransfer ? !transferRequired.every((value) => value.trim()) || (needsPremium && !premiumAmount) : selectedOptions.length === 0)) {
      setError(isTransfer ? "필수 항목과 매도 조건을 확인해 주세요." : "필수 항목과 상담 옵션을 확인해 주세요.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (step === 3) return (
    <MobileLayout hideNav><PageHeader title="상담 의뢰 완료" /><div className="flex min-h-[calc(100vh-61px)] flex-col px-5 pb-10 pt-12">
      <div className="text-center"><div className="gold-fill mx-auto grid h-20 w-20 place-items-center rounded-[28px]"><CheckCircle2 className="h-10 w-10" strokeWidth={2.2} /></div><span className="mt-6 inline-block rounded-full bg-[var(--brand-purple-soft)] px-3 py-1.5 text-[10px] font-black tracking-[.6px] text-[var(--brand-purple)]">REQUEST RECEIVED</span><h1 className="mt-3 text-[24px] font-black tracking-[-.8px] text-[var(--brand-ink)]">{isTransfer ? "매도 의뢰를 접수했어요" : "상담 의뢰를 접수했어요"}</h1><p className="mt-2 text-[13px] leading-6 text-[var(--text-muted)]">{siteName}<br />{isTransfer ? "담당자가 계약·납부 정보를 확인한 뒤 연락드리는 흐름입니다." : "조건에 맞는 매물을 확인하는 흐름을 보여드립니다."}</p></div>
      <div className="mt-8 rounded-[20px] border border-[#D7AE54]/30 bg-[#211B29] p-5 text-white shadow-[0_12px_28px_rgba(27,23,38,.15)]"><div className="flex items-center gap-2 text-[13px] font-black"><ShieldCheck className="h-4 w-4 text-[#E7C66D]" /> 1차 전달용 데모 안내</div><p className="mt-2 text-[11.5px] leading-5 text-white/60">현재는 접수 화면과 클릭 흐름을 확인하는 데모입니다. 실제 저장, 담당 상담사 배정, 연락 알림은 개발사의 API 연동 후 동작합니다.</p></div>
      <div className="mt-auto space-y-3 pt-10"><Link href={isTransfer ? "/category/bunyanggwon" : "/category/ijaman"} className="flex w-full items-center justify-center rounded-[16px] bg-[var(--brand-purple)] py-4 text-[15px] font-black text-white shadow-[0_8px_20px_rgba(123,47,247,.26)]">{isTransfer ? "분양권 매물 보기" : "이자만 매물 보기"}</Link><Link href="/" className="flex w-full items-center justify-center rounded-[16px] border border-[var(--line)] bg-white py-4 text-[14px] font-extrabold text-[var(--brand-ink)]">홈으로 돌아가기</Link></div>
    </div></MobileLayout>
  );

  return <MobileLayout hideNav><PageHeader title={title} />
    <div className="border-b border-[var(--line)] bg-white px-5 py-3"><div className="flex items-center gap-2"><span className={cn("grid h-7 w-7 place-items-center rounded-full text-[11px] font-black", "gold-fill")}>{step > 1 ? <Check className="h-3.5 w-3.5" /> : 1}</span><span className="text-[10.5px] font-extrabold text-[var(--brand-ink)]">상담 정보</span><span className={cn("h-px flex-1", step > 1 ? "bg-[var(--brand-gold)]" : "bg-[var(--line)]")} /><span className={cn("grid h-7 w-7 place-items-center rounded-full text-[11px] font-black", step === 2 ? "gold-fill" : "bg-[#ECE9F0] text-[#A39DAB]")}>2</span><span className={cn("text-[10.5px] font-extrabold", step === 2 ? "text-[var(--brand-ink)]" : "text-[#A39DAB]")}>접수 확인</span></div></div>

    <div className="space-y-4 px-4 pb-[122px] pt-4">
      {error && <div role="alert" className="rounded-[14px] border border-[#F4C8CB] bg-[#FFF1F2] px-4 py-3 text-[12.5px] font-bold text-[var(--danger)]">{error}</div>}
      {step === 1 ? <>
        <div className="relative overflow-hidden rounded-[22px] bg-[var(--brand-ink)] p-5 text-white"><div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-[var(--brand-purple)]/25 blur-2xl" /><span className="gold-text text-[10px] font-black tracking-[1.2px]">MAPI CONCIERGE</span><h1 className="mt-2 text-[20px] font-black tracking-[-.5px]">{isTransfer ? "보유한 분양권을 안전하게 매도 의뢰하세요" : "실질 혜택을 비교해 드려요"}</h1><p className="mt-1 text-[11.5px] leading-5 text-white/55">{isTransfer ? "계약서 기준으로 입력하면 더 빠르고 정확하게 상담할 수 있어요." : "희망 조건을 남기면 상담 연결 과정이 한결 빨라집니다."}</p></div>
        <Section icon={<FileText className="h-[18px] w-[18px]" />} title="신청자 정보"><Field label="이름·계약자" required><input aria-label="이름·계약자" value={contractor} onChange={(e) => setContractor(e.target.value)} className={INPUT} /></Field><Field label="연락처" required><input aria-label="연락처" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={INPUT} /></Field></Section>
        <Section icon={isTransfer ? <Building2 className="h-[18px] w-[18px]" /> : <MapPin className="h-[18px] w-[18px]" />} title={isTransfer ? "분양권 기본 정보" : "희망 현장·조건"}><Field label="현장·건물명" required><input aria-label="현장·건물명" value={siteName} onChange={(e) => setSiteName(e.target.value)} className={INPUT} /></Field><Field label="주소" required><div className="flex gap-2"><input aria-label="주소" value={address} onChange={(e) => setAddress(e.target.value)} className={cn(INPUT, "min-w-0 flex-1")} /><button type="button" onClick={() => setAddressNotice(true)} className="inline-flex shrink-0 items-center gap-1 rounded-[14px] bg-[var(--brand-purple-soft)] px-3 text-[11px] font-black text-[var(--brand-purple)]"><Search className="h-3.5 w-3.5" /> 검색</button></div>{addressNotice && <div className="mt-2 rounded-[12px] bg-[#F8F6FB] px-3 py-2.5 text-[10.5px] leading-4 text-[var(--text-muted)]">주소 검색은 개발사 지도 API 연동 후 제공됩니다. 데모에서는 직접 입력해 주세요.</div>}</Field>{isTransfer && <><div className="grid grid-cols-2 gap-3"><Field label="동" required><input aria-label="동" value={buildingDong} onChange={(e) => setBuildingDong(e.target.value)} className={INPUT} /></Field><Field label="호수" required><input aria-label="호수" value={buildingUnit} onChange={(e) => setBuildingUnit(e.target.value)} className={INPUT} /></Field></div><div className="grid grid-cols-2 gap-3"><Field label="주택형" required><input aria-label="주택형" value={housingType} onChange={(e) => setHousingType(e.target.value)} placeholder="예: 84A" className={INPUT} /></Field><Field label="평형" required><div className="relative"><input aria-label="평형" inputMode="decimal" value={areaPyeong} onChange={(e) => setAreaPyeong(e.target.value.replace(/[^\d.]/g, ""))} className={cn(INPUT, "pr-10 text-right")} /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[var(--text-muted)]">평</span></div></Field></div></>}<Field label={dateLabel} required><div className="relative"><CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-purple)]" /><input aria-label={dateLabel} type="date" value={date} onChange={(e) => setDate(e.target.value)} className={cn(INPUT, "pl-10")} /></div></Field>{!isTransfer && <Field label={optionLabel} required hint="중복 선택"><div className="flex flex-wrap gap-2">{options.map((option) => <button key={option} type="button" onClick={() => toggleOption(option)} className={cn("rounded-full border px-4 py-2.5 text-[12px] font-extrabold", selectedOptions.includes(option) ? "border-[var(--brand-purple)] bg-[var(--brand-purple)] text-white" : "border-[var(--line)] bg-white text-[var(--text-muted)]")}>{option}</button>)}</div></Field>}</Section>
        {isTransfer && <>
          <Section icon={<CircleDollarSign className="h-[18px] w-[18px]" />} title="계약·납부 금액"><Field label="총 분양가" required hint={formatManwon(totalSalePrice)}><AmountInput label="총 분양가" value={totalSalePrice} onChange={setTotalSalePrice} /></Field><div className="grid grid-cols-2 gap-3"><Field label="발코니 확장비" hint="선택"><AmountInput label="발코니 확장비" value={balconyCost} onChange={setBalconyCost} /></Field><Field label="유상 옵션비" hint="선택"><AmountInput label="유상 옵션비" value={paidOptionCost} onChange={setPaidOptionCost} /></Field></div><Field label="1차 계약금 납부액" required hint={formatManwon(firstContractAmount)}><AmountInput label="1차 계약금 납부액" value={firstContractAmount} onChange={setFirstContractAmount} /></Field><Field label="현재까지 납부한 총액" required hint="계약금·납부 중도금 포함"><AmountInput label="현재까지 납부한 총액" value={paidAmount} onChange={setPaidAmount} /></Field></Section>
          <Section icon={<Landmark className="h-[18px] w-[18px]" />} title="중도금 정보"><Field label="중도금" required><div className="grid grid-cols-3 gap-2">{INTERIM_STATUSES.map((status) => <button key={status} type="button" onClick={() => setInterimStatus(status)} className={cn("rounded-[13px] border px-2 py-3 text-[11.5px] font-extrabold", interimStatus === status ? "border-[var(--brand-purple)] bg-[var(--brand-purple)] text-white" : "border-[var(--line)] bg-white text-[var(--text-muted)]")}>{status}</button>)}</div></Field>{interimStatus === "있음" && <><Field label="금융 조건" required><div className="flex flex-wrap gap-2">{INTEREST_CONDITIONS.map((condition) => <button key={condition} type="button" onClick={() => setInterestCondition(condition)} className={cn("rounded-full border px-3.5 py-2.5 text-[11.5px] font-extrabold", interestCondition === condition ? "border-[var(--brand-purple)] bg-[var(--brand-purple)] text-white" : "border-[var(--line)] bg-white text-[var(--text-muted)]")}>{condition}</button>)}</div></Field><div className="grid grid-cols-2 gap-3"><Field label="전체 회차"><input aria-label="중도금 전체 회차" inputMode="numeric" value={totalRounds} onChange={(e) => setTotalRounds(digitsOnly(e.target.value))} className={INPUT} /></Field><Field label="납부 완료 회차"><input aria-label="중도금 납부 완료 회차" inputMode="numeric" value={paidRounds} onChange={(e) => setPaidRounds(digitsOnly(e.target.value))} className={INPUT} /></Field></div></>}</Section>
          <Section icon={<Sparkles className="h-[18px] w-[18px]" />} title="매도 희망 조건"><Field label="희망 조건" required hint="1개 선택"><div className="grid grid-cols-2 gap-2">{TRANSFER_CONDITIONS.map((condition) => <button key={condition} type="button" onClick={() => setTransferCondition(condition)} className={cn("rounded-[13px] border px-3 py-3 text-[12px] font-extrabold", transferCondition === condition ? "border-[var(--brand-purple)] bg-[var(--brand-purple)] text-white" : "border-[var(--line)] bg-white text-[var(--text-muted)]")}>{condition}</button>)}</div></Field>{(transferCondition === "마이너스P" || transferCondition === "플러스P") && <Field label={transferCondition === "마이너스P" ? "마이너스 금액" : "프리미엄 금액"} required hint={formatManwon(premiumAmount)}><AmountInput label="프리미엄 금액" value={premiumAmount} onChange={setPremiumAmount} /></Field>}<Field label="매도 희망 시기"><select aria-label="매도 희망 시기" value={saleTiming} onChange={(e) => setSaleTiming(e.target.value)} className={INPUT}><option>가능한 빠르게</option><option>1개월 이내</option><option>3개월 이내</option><option>좋은 조건이면 협의</option></select></Field><div className="rounded-[16px] bg-[#211B29] p-4 text-white"><div className="flex items-center justify-between text-[11px] text-white/60"><span>희망 프리미엄</span><strong className="gold-text text-[14px]">{premiumLabel}</strong></div><div className="mt-3 flex items-end justify-between border-t border-white/10 pt-3"><span className="text-[11px] text-white/60">예상 거래가</span><strong className="text-[18px] font-black">{expectedDealPrice === null ? "상담 후 결정" : formatManwon(String(expectedDealPrice))}</strong></div><p className="mt-2 text-[9.5px] leading-4 text-white/40">총 분양가와 희망 프리미엄을 기준으로 한 예상값이며, 실제 정산액은 납부 상태와 승계 조건 확인 후 확정됩니다.</p></div></Section>
        </>}
        <Section icon={<Sparkles className="h-[18px] w-[18px]" />} title="상담 요청"><Field label="요청 내용" required hint={`${message.length}/300`}><textarea aria-label="요청 내용" value={message} onChange={(e) => setMessage(e.target.value.slice(0, 300))} rows={5} className={cn(INPUT, "resize-none leading-6")} /></Field><Field label="참고 파일" hint="선택"><label htmlFor={`request-file-${kind}`} className="flex cursor-pointer items-center gap-3 rounded-[15px] border-2 border-dashed border-[#D9D3E1] bg-[#FAF9FB] p-4"><span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[var(--brand-purple-soft)] text-[var(--brand-purple)]"><Paperclip className="h-5 w-5" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-[12px] text-[var(--brand-ink)]">{fileName || (isTransfer ? "공급계약서·옵션계약서 선택" : "계약서·참고 이미지 선택")}</strong><span className="mt-0.5 block text-[10px] text-[var(--text-muted)]">JPG, PNG, PDF · 최대 10MB</span></span>{fileName && <button type="button" aria-label="첨부 파일 삭제" onClick={(e) => { e.preventDefault(); setFileName(""); }}><X className="h-4 w-4" /></button>}</label><input id={`request-file-${kind}`} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} /></Field></Section>
      </> : <>
        <div className="rounded-[22px] bg-[var(--brand-ink)] p-5 text-white shadow-[0_12px_28px_rgba(27,23,38,.15)]"><span className="gold-fill inline-flex rounded-full px-3 py-1 text-[9px] font-black tracking-[.7px]">{isTransfer ? "SELLING REQUEST PREVIEW" : "REQUEST PREVIEW"}</span><h1 className="mt-4 text-[21px] font-black tracking-[-.5px]">{siteName}</h1><p className="mt-1 text-[11.5px] text-white/55">{address}</p><p className="gold-text mt-5 text-[16px] font-black">{isTransfer ? `${transferCondition} · ${premiumLabel}` : selectedOptions.join(" · ")}</p></div>
        <Section icon={<CheckCircle2 className="h-[18px] w-[18px]" />} title="접수 정보 확인"><Summary label="신청자" value={contractor} /><Summary label="연락처" value={phone} />{isTransfer && <><Summary label="동·호수" value={`${buildingDong} ${buildingUnit}`} /><Summary label="주택형·평형" value={`${housingType} · ${areaPyeong}평`} /></>}<Summary label={dateLabel} value={date} />{isTransfer ? <><Summary label="총 분양가" value={formatManwon(totalSalePrice)} /><Summary label="1차 계약금" value={formatManwon(firstContractAmount)} /><Summary label="현재까지 납부액" value={formatManwon(paidAmount)} /><Summary label="중도금" value={interimStatus === "있음" ? `${interestCondition} · ${paidRounds}/${totalRounds}회 납부` : interimStatus} /><Summary label="매도 희망 조건" value={`${transferCondition} · ${premiumLabel}`} strong /><Summary label="예상 거래가" value={expectedDealPrice === null ? "상담 후 결정" : formatManwon(String(expectedDealPrice))} strong /><Summary label="예상 정산금" value={expectedSettlement === null ? "상담 후 결정" : formatManwon(String(expectedSettlement))} /></> : <Summary label={optionLabel} value={selectedOptions.join(", ")} strong />}<Summary label="첨부 파일" value={fileName || "첨부 안 함"} /></Section>{isTransfer && <p className="rounded-[14px] bg-[#F8F6FB] px-4 py-3 text-[10.5px] leading-5 text-[var(--text-muted)]">예상 정산금은 현재까지 납부한 금액과 희망 프리미엄을 단순 합산한 참고값입니다. 실제 정산은 계약서, 중도금 대출, 옵션 납부 내역 확인 후 확정됩니다.</p>}<div className="rounded-[18px] border border-[var(--line)] bg-white p-4"><p className="text-[12px] font-black text-[var(--brand-ink)]">상담 요청 내용</p><p className="mt-2 whitespace-pre-wrap text-[11.5px] leading-5 text-[var(--text-muted)]">{message}</p></div>
      </>}
    </div>
    <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[430px] -translate-x-1/2 gap-2 border-t border-[var(--line)] bg-white/95 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">{step === 2 && <button type="button" onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="w-[96px] rounded-[15px] border border-[var(--line)] bg-white py-4 text-[13px] font-extrabold text-[var(--brand-ink)]">수정</button>}<button type="button" onClick={step === 1 ? review : () => { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex flex-1 items-center justify-center gap-1 rounded-[15px] bg-[var(--brand-purple)] py-4 text-[14px] font-black text-white shadow-[0_7px_18px_rgba(123,47,247,.28)]">{step === 1 ? "접수 내용 확인" : isTransfer ? "매도 의뢰 접수" : "상담 의뢰 접수"}<ChevronRight className="h-4 w-4" /></button></div>
  </MobileLayout>;
}

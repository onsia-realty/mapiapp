"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, Check, CheckCircle2, FileCheck2, MapPin, ShieldCheck, Upload, UserRound, UsersRound } from "lucide-react";
import { DemoRole, saveDemoSession } from "@/lib/demo-auth";
import { cn } from "@/lib/utils";

const INPUT = "h-12 w-full rounded-[14px] border border-[var(--line)] bg-white px-4 text-[13px] text-[var(--brand-ink)] outline-none focus:border-[var(--brand-purple)]";

const ROLE_OPTIONS: { role: DemoRole; title: string; description: string; icon: React.ElementType }[] = [
  { role: "broker", title: "공인중개사", description: "매물 등록·고객 의뢰·구인 관리", icon: Building2 },
  { role: "sales", title: "분양사", description: "분양 현장·상담·채용 관리", icon: UsersRound },
  { role: "general", title: "일반회원", description: "관심 매물·상담 의뢰", icon: UserRound },
];

interface RegistrationForm {
  role: DemoRole;
  name: string;
  phone: string;
  email: string;
  password: string;
  company: string;
  representative: string;
  businessNo: string;
  registrationNo: string;
  address: string;
  specialties: string[];
  documentName: string;
  licenseName: string;
}

const INITIAL_FORM: RegistrationForm = {
  role: "broker",
  name: "김중개",
  phone: "010-1234-5678",
  email: "newbroker@mapi.com",
  password: "1234",
  company: "마피공인중개사사무소",
  representative: "김중개",
  businessNo: "123-45-67890",
  registrationNo: "11680-2026-00123",
  address: "서울 강남구 테헤란로 152",
  specialties: ["분양권"],
  documentName: "사업자등록증_샘플.pdf",
  licenseName: "공인중개사자격증_샘플.jpg",
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[12px] font-black text-[#4e4756]">{label}{required && <b className="ml-1 text-[var(--brand-purple)]">*</b>}</span>{children}</label>;
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(true);

  const update = <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const isBusinessRole = form.role !== "general";

  const validate = () => {
    if (step === 0 && (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.password.trim())) return "기본 회원정보를 모두 입력해주세요.";
    if (step === 1 && isBusinessRole && (!form.company.trim() || !form.businessNo.trim() || !form.address.trim())) return "사업자 정보를 모두 입력해주세요.";
    if (step === 2 && !agreed) return "필수 약관과 개인정보 수집에 동의해주세요.";
    return "";
  };

  const next = () => {
    const message = validate();
    if (message) { setError(message); return; }
    setError("");
    setStep((current) => current + 1);
  };

  const complete = () => {
    window.localStorage.setItem("mapi-demo-registration", JSON.stringify({ ...form, password: undefined, createdAt: new Date().toISOString() }));
    saveDemoSession(form.role);
    setStep(4);
  };

  if (step === 4) {
    return (
      <main className="min-h-screen bg-[#17121f] px-5 py-[max(40px,env(safe-area-inset-top))] text-white">
        <div className="mx-auto flex min-h-[75dvh] max-w-[430px] flex-col items-center justify-center text-center">
          <span className="gold-fill grid h-20 w-20 place-items-center rounded-[26px]"><CheckCircle2 className="h-10 w-10" /></span>
          <p className="gold-text mt-6 text-[11px] font-black tracking-[.2em]">REGISTRATION COMPLETE</p>
          <h1 className="mt-2 text-2xl font-black">가입 신청이 완료되었습니다</h1>
          <p className="mt-3 text-[13px] leading-6 text-white/55">{isBusinessRole ? "사업자·자격 서류는 관리자 승인 후 정식 노출됩니다. 데모에서는 승인 상태를 바로 체험할 수 있습니다." : "일반회원 계정으로 관심 매물과 상담 의뢰 기능을 사용할 수 있습니다."}</p>
          <div className="mt-8 grid w-full grid-cols-2 gap-2"><Link href="/mypage" className="gold-fill flex h-13 items-center justify-center rounded-2xl text-sm font-black">MY 바로가기</Link><Link href="/" className="flex h-13 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-sm font-black">홈으로</Link></div>
          {isBusinessRole && <Link href="/billing/plans" className="mt-3 text-xs font-bold text-[#e4c36d] underline underline-offset-4">자격증 인증 첫 달 무료 상품 보기</Link>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--surface-muted)] pb-28">
      <header className="bg-[#17121f] px-5 pb-6 pt-[max(18px,env(safe-area-inset-top))] text-white">
        <div className="mx-auto max-w-[430px]">
          <div className="flex items-center gap-3"><button type="button" onClick={() => step === 0 ? router.back() : setStep((current) => current - 1)} className="grid h-10 w-10 place-items-center rounded-xl bg-white/8"><ArrowLeft className="h-5 w-5" /></button><div><p className="gold-text text-[9px] font-black tracking-[.2em]">MAPI MEMBER</p><h1 className="text-lg font-black">회원·중개사 등록</h1></div></div>
          <div className="mt-6 grid grid-cols-4 gap-2">{["회원 유형", "사업자 정보", "인증 서류", "검토"].map((label, index) => <div key={label}><span className={cn("block h-1 rounded-full", index <= step ? "bg-[#d7ae54]" : "bg-white/12")} /><p className={cn("mt-2 text-[9px] font-bold", index === step ? "text-[#efd587]" : "text-white/35")}>{label}</p></div>)}</div>
        </div>
      </header>

      <div className="mx-auto max-w-[430px] px-4 pt-5">
        {step === 0 && <div className="space-y-4">
          <section className="rounded-[22px] border border-[var(--line)] bg-white p-5"><p className="text-[10px] font-black tracking-[1.2px] text-[var(--brand-purple)]">ACCOUNT TYPE</p><h2 className="mt-1 text-xl font-black text-[var(--brand-ink)]">어떤 회원으로 가입하시나요?</h2><div className="mt-4 grid gap-2">{ROLE_OPTIONS.map(({ role, title, description, icon: Icon }) => { const active = form.role === role; return <button key={role} type="button" onClick={() => update("role", role)} className={cn("flex items-center gap-3 rounded-[17px] border p-4 text-left", active ? "border-[var(--brand-purple)] bg-[var(--brand-purple-soft)]" : "border-[var(--line)]")}><span className={cn("grid h-11 w-11 place-items-center rounded-[14px]", active ? "bg-[var(--brand-purple)] text-white" : "bg-[var(--surface-muted)] text-[var(--text-muted)]")}><Icon className="h-5 w-5" /></span><span className="flex-1"><b className="block text-[14px] text-[var(--brand-ink)]">{title}</b><span className="text-[11px] text-[var(--text-muted)]">{description}</span></span>{active && <Check className="h-5 w-5 text-[var(--brand-purple)]" />}</button>; })}</div></section>
          <section className="space-y-4 rounded-[22px] border border-[var(--line)] bg-white p-5"><Field label="이름" required><input className={INPUT} value={form.name} onChange={(e) => update("name", e.target.value)} /></Field><Field label="휴대폰번호" required><input className={INPUT} value={form.phone} onChange={(e) => update("phone", e.target.value)} /></Field><Field label="이메일" required><input type="email" className={INPUT} value={form.email} onChange={(e) => update("email", e.target.value)} /></Field><Field label="비밀번호" required><input type="password" className={INPUT} value={form.password} onChange={(e) => update("password", e.target.value)} /></Field></section>
        </div>}

        {step === 1 && <section className="space-y-4 rounded-[22px] border border-[var(--line)] bg-white p-5"><p className="text-[10px] font-black tracking-[1.2px] text-[var(--brand-purple)]">{isBusinessRole ? "BUSINESS PROFILE" : "MEMBER PROFILE"}</p><h2 className="text-xl font-black text-[var(--brand-ink)]">{isBusinessRole ? "사업자 정보를 확인해주세요" : "관심 지역을 설정해주세요"}</h2>{isBusinessRole ? <><Field label={form.role === "broker" ? "중개사무소명" : "분양회사·대행사명"} required><input className={INPUT} value={form.company} onChange={(e) => update("company", e.target.value)} /></Field><Field label="대표자명" required><input className={INPUT} value={form.representative} onChange={(e) => update("representative", e.target.value)} /></Field><Field label="사업자등록번호" required><input className={INPUT} value={form.businessNo} onChange={(e) => update("businessNo", e.target.value)} /></Field>{form.role === "broker" && <Field label="중개사무소 등록번호"><input className={INPUT} value={form.registrationNo} onChange={(e) => update("registrationNo", e.target.value)} /></Field>}<Field label="사업장 주소" required><div className="relative"><MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-purple)]" /><input className={cn(INPUT, "pl-10")} value={form.address} onChange={(e) => update("address", e.target.value)} /></div></Field></> : <p className="rounded-[16px] bg-[var(--brand-purple-soft)] p-4 text-[12px] leading-6 text-[#5f3b96]">일반회원은 별도 사업자 인증 없이 가입할 수 있습니다. 가입 후 관심 지역과 매물 알림을 설정할 수 있습니다.</p>}<Field label="전문 분야"><div className="flex flex-wrap gap-2">{["분양권", "아파트", "오피스텔", "사무실", "상가"].map((item) => <button key={item} type="button" onClick={() => update("specialties", form.specialties.includes(item) ? form.specialties.filter((value) => value !== item) : [...form.specialties, item])} className={cn("rounded-full border px-4 py-2 text-[11px] font-black", form.specialties.includes(item) ? "border-[var(--brand-purple)] bg-[var(--brand-purple)] text-white" : "border-[var(--line)] text-[var(--text-muted)]")}>{item}</button>)}</div></Field></section>}

        {step === 2 && <section className="space-y-4 rounded-[22px] border border-[var(--line)] bg-white p-5"><p className="text-[10px] font-black tracking-[1.2px] text-[var(--brand-purple)]">VERIFICATION</p><h2 className="text-xl font-black text-[var(--brand-ink)]">{isBusinessRole ? "인증 서류를 첨부해주세요" : "약관을 확인해주세요"}</h2>{isBusinessRole && <><label className="block rounded-[18px] border-2 border-dashed border-[#d9d3e1] bg-[#faf9fb] p-5 text-center"><Upload className="mx-auto h-6 w-6 text-[var(--brand-purple)]" /><b className="mt-2 block text-[13px]">사업자등록증</b><span className="text-[10px] text-[var(--text-muted)]">{form.documentName || "PDF, JPG, PNG"}</span><input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => update("documentName", e.target.files?.[0]?.name ?? "")} /></label>{form.role === "broker" && <label className="block rounded-[18px] border-2 border-dashed border-[#d9d3e1] bg-[#faf9fb] p-5 text-center"><FileCheck2 className="mx-auto h-6 w-6 text-[var(--brand-purple)]" /><b className="mt-2 block text-[13px]">공인중개사 자격증</b><span className="text-[10px] text-[var(--text-muted)]">{form.licenseName || "자격증 인증 시 첫 1개월 무료"}</span><input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => update("licenseName", e.target.files?.[0]?.name ?? "")} /></label>}</>}<label className="flex items-start gap-3 rounded-[16px] bg-[var(--surface-muted)] p-4 text-[12px] leading-5 text-[#625b69]"><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#7b2ff7]" /><span><b className="block text-[var(--brand-ink)]">필수 약관 전체 동의</b>이용약관, 개인정보 수집·이용, 사업자 정보 확인 및 관리자 승인 절차에 동의합니다.</span></label><div className="flex gap-2 rounded-[15px] border border-[#ead99c] bg-[#fff9e9] p-4 text-[11px] leading-5 text-[#6b5522]"><ShieldCheck className="h-5 w-5 shrink-0" />실제 서비스에서는 파일 저장·OCR·관리자 승인을 서버와 연결합니다. 현재 데모는 파일명과 승인 흐름만 보여줍니다.</div></section>}

        {step === 3 && <section className="rounded-[22px] border border-[var(--line)] bg-white p-5"><p className="text-[10px] font-black tracking-[1.2px] text-[var(--brand-purple)]">FINAL REVIEW</p><h2 className="mt-1 text-xl font-black text-[var(--brand-ink)]">등록 정보를 확인해주세요</h2><div className="mt-5 overflow-hidden rounded-[16px] border border-[var(--line)]">{[["회원 유형", ROLE_OPTIONS.find((item) => item.role === form.role)?.title ?? ""], ["이름", form.name], ["이메일", form.email], ["연락처", form.phone], ...(isBusinessRole ? [["회사·사무소", form.company], ["사업자번호", form.businessNo], ["주소", form.address], ["전문 분야", form.specialties.join(", ") || "미선택"]] : [["관심 분야", form.specialties.join(", ") || "미선택"]])].map(([label, value]) => <div key={label} className="grid grid-cols-[105px_1fr] border-b border-[var(--line)] last:border-0"><span className="bg-[var(--surface-muted)] px-3 py-3 text-[11px] font-bold text-[var(--text-muted)]">{label}</span><span className="px-3 py-3 text-[12px] font-bold text-[var(--brand-ink)]">{value}</span></div>)}</div>{isBusinessRole && <p className="mt-4 rounded-[14px] bg-[var(--brand-purple-soft)] p-3 text-[11px] leading-5 text-[#65429a]">접수 후 관리자 검토 → 승인 → 중개사 프로필 노출 → 매물·구인 등록 순서로 연결됩니다.</p>}</section>}

        {error && <p className="mt-4 rounded-[14px] bg-red-50 px-4 py-3 text-[12px] font-bold text-red-600">{error}</p>}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] border-t border-[var(--line)] bg-white/95 p-4 pb-[max(16px,env(safe-area-inset-bottom))] backdrop-blur-xl">
        <button type="button" onClick={step === 3 ? complete : next} className="flex h-13 w-full items-center justify-center gap-2 rounded-[16px] bg-[var(--brand-purple)] text-sm font-black text-white shadow-[0_8px_22px_rgba(123,47,247,.28)]">{step === 3 ? "가입 신청 완료" : "다음 단계"}{step === 3 ? <CheckCircle2 className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}</button>
      </div>
    </main>
  );
}


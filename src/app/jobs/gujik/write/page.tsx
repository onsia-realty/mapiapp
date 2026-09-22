"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, ImagePlus, Paperclip, Search, ShoppingBag, Trash2, UserRound } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";

function Section({ icon, title, children }: { icon?: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgba(27,19,48,.05)]">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
          {icon ?? <ShoppingBag className="w-[18px] h-[18px] text-[#7B2FF7]" strokeWidth={2} />}
        </div>
        <h2 className="text-[17px] font-extrabold text-[#1B1330] tracking-[-0.3px]">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[13px] font-semibold text-[#6E6787] mb-1.5">
        {label} {required && <span className="text-[#FF3B5C]">*</span>}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-[#E9E4F5] rounded-xl px-4 py-3 outline-none text-[15px] text-[#1B1330] placeholder:text-[#C9C2DC] focus:border-[#7B2FF7] transition-colors";

// 개발사 앱 구직 등록 폼(캡처 84~84c) 재현
export default function GujikWritePage() {
  const [stage, setStage] = useState<"form" | "preview" | "complete">("form");

  const [name, setName] = useState("마피 중개사");
  const [gender, setGender] = useState("남");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("01011111111");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("jooong@google.com");
  const [homepage, setHomepage] = useState("");
  const [hopeWork, setHopeWork] = useState("");
  const [hopeRegion, setHopeRegion] = useState("");
  const [workDate, setWorkDate] = useState("");
  const [career, setCareer] = useState("");
  const [license, setLicense] = useState("");
  const [network, setNetwork] = useState("");
  const [intro, setIntro] = useState("");
  const [etc, setEtc] = useState("");
  const [showAddressDemo, setShowAddressDemo] = useState(false);
  const [attachment, setAttachment] = useState("");
  const [error, setError] = useState("");

  const handlePreview = () => {
    const missing = [
      [career, "경력"], [hopeWork, "희망직급"], [hopeRegion, "희망지역"],
      [intro, "자기소개"], [mobile, "휴대폰"],
    ].filter(([value]) => !value.trim()).map(([, label]) => label);
    if (missing.length) {
      setError(`${missing.join(", ")} 항목을 입력해 주세요.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setError("");
    setStage("preview");
  };

  if (stage === "complete") {
    return <MobileLayout hideNav><PageHeader title="구직 등록 완료" /><div className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center px-6 pb-10 text-center"><span className="gold-fill grid h-20 w-20 place-items-center rounded-[26px]"><CheckCircle2 className="h-10 w-10" /></span><p className="mt-6 text-[10px] font-black tracking-[1.4px] text-[var(--brand-gold)]">PROFILE COMPLETE</p><h1 className="mt-2 text-[24px] font-black tracking-[-.7px] text-[var(--brand-ink)]">구직 프로필 등록이<br />완료되었습니다</h1><p className="mt-3 text-[13px] leading-6 text-[var(--text-muted)]">현재는 화면 흐름을 확인하는 데모입니다.<br />실제 저장·채용 담당자 알림은 개발사 서버 연동 대상입니다.</p><div className="mt-7 w-full rounded-[20px] border border-[var(--line)] bg-white p-4 text-left shadow-[0_8px_24px_rgba(27,23,38,.06)]"><span className="rounded-full bg-[var(--brand-purple-soft)] px-2.5 py-1 text-[10px] font-black text-[var(--brand-purple)]">구직 프로필</span><h2 className="mt-3 text-[16px] font-black text-[var(--brand-ink)]">{hopeWork} · {career}</h2><p className="mt-1 text-[12px] text-[var(--text-muted)]">{hopeRegion} · {workDate || "근무일 협의"}</p></div><div className="mt-7 grid w-full grid-cols-2 gap-3"><Link href="/jobs/gujik/gujik1" className="rounded-[15px] border border-[var(--brand-purple)] py-3.5 text-[14px] font-black text-[var(--brand-purple)]">구직 상세 보기</Link><Link href="/jobs" className="rounded-[15px] bg-[var(--brand-purple)] py-3.5 text-[14px] font-black text-white">구인구직 홈</Link></div></div></MobileLayout>;
  }

  if (stage === "preview") {
    return <MobileLayout hideNav><PageHeader title="구직 프로필 미리보기" /><div className="space-y-4 px-4 pb-32 pt-4"><div className="relative overflow-hidden rounded-[22px] bg-[var(--brand-ink)] p-5 text-white shadow-[0_12px_28px_rgba(27,23,38,.15)]"><div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[var(--brand-gold)]/20 blur-3xl" /><div className="relative flex items-center gap-4"><span className="gold-fill grid h-14 w-14 shrink-0 place-items-center rounded-[18px]"><UserRound className="h-7 w-7" /></span><div><p className="text-[10px] font-black tracking-[1px] text-[#E9D6A0]">JOB SEEKER PROFILE</p><h1 className="mt-1 text-[20px] font-black">{hopeWork} · {career}</h1><p className="mt-1 text-[11.5px] text-white/60">{hopeRegion} · {workDate || "근무일 협의"}</p></div></div></div><Section title="기본 · 연락 정보"><div className="space-y-2 text-[13px]">{[["성명", name], ["연령", age ? `${age}세` : "미입력"], ["주소", address || "미입력"], ["휴대폰", mobile], ["이메일", email || "미입력"]].map(([label, value]) => <div key={label} className="flex rounded-xl bg-[var(--surface-muted)] px-3.5 py-3"><span className="w-20 font-bold text-[var(--text-muted)]">{label}</span><span className="font-semibold text-[var(--brand-ink)]">{value}</span></div>)}</div></Section><Section title="경력 · 자기소개"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[var(--brand-purple-soft)] px-3 py-1.5 text-[11px] font-bold text-[var(--brand-purple)]">{career}</span>{license && <span className="rounded-full bg-[#FFF7E7] px-3 py-1.5 text-[11px] font-bold text-[#966D1B]">{license}</span>}</div><p className="mt-4 whitespace-pre-line text-[13px] leading-6 text-[#5E5769]">{intro}</p>{attachment && <div className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--line)] px-3.5 py-3 text-[12px] font-bold text-[var(--brand-ink)]"><Paperclip className="h-4 w-4 text-[var(--brand-purple)]" />{attachment}</div>}</Section></div><div className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-[1fr_1.6fr] gap-3 border-t border-[var(--line)] bg-white/95 px-4 pb-5 pt-3 backdrop-blur"><button type="button" onClick={() => setStage("form")} className="rounded-[15px] border border-[var(--brand-purple)] py-3.5 text-[14px] font-black text-[var(--brand-purple)]">수정하기</button><button type="button" onClick={() => setStage("complete")} className="rounded-[15px] bg-[linear-gradient(135deg,#7B2FF7,#A855F7)] py-3.5 text-[14px] font-black text-white">확인 후 등록</button></div></MobileLayout>;
  }

  return (
    <MobileLayout hideNav>
      <PageHeader title="구직 등록" />

      <div className="px-4 pt-4 pb-10 space-y-4">
        {error && <div role="alert" className="rounded-[15px] border border-[#F4C7CC] bg-[#FFF1F2] px-4 py-3 text-[12px] font-bold text-[#C73543]">{error}</div>}
        <Section title="기본 정보" icon={<FileText className="w-6 h-6 text-purple-600" />}>
          <Field label="성명" required>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </Field>
          <Field label="성별" required>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border border-[#E9E4F5] rounded-xl px-3 py-3 bg-white text-base"
            >
              <option value="남">남</option>
              <option value="여">여</option>
            </select>
          </Field>
          <Field label="연령" required>
            <div className="flex items-center border border-[#E9E4F5] rounded-xl px-4 py-3 bg-white">
              <input
                type="text"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="예: 41"
                className="flex-1 outline-none text-base placeholder:text-[#C9C2DC]"
              />
              <span className="text-gray-700 ml-2">세</span>
            </div>
          </Field>
          <Field label="주소" required>
            <div className="flex gap-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="주소를 검색해주세요"
                className="flex-1 min-w-0 border border-[#E9E4F5] rounded-xl px-4 py-3 outline-none text-base placeholder:text-[#C9C2DC]"
              />
              <button
                type="button"
                onClick={() => setShowAddressDemo((value) => !value)}
                className="shrink-0 bg-[#7B2FF7] text-white text-sm font-semibold rounded-lg px-4 flex items-center gap-1 active:opacity-80"
              >
                <Search className="w-4 h-4" />
                주소 검색
              </button>
            </div>
            {showAddressDemo && <div className="mt-2 rounded-[14px] border border-[var(--line)] bg-[var(--surface-muted)] p-3"><p className="mb-2 text-[10.5px] font-bold text-[var(--text-muted)]">데모 주소 검색 결과</p>{["서울 마포구 월드컵북로 120", "서울 강남구 테헤란로 152", "경기 성남시 분당구 판교역로 166"].map((item) => <button key={item} type="button" onClick={() => { setAddress(item); setShowAddressDemo(false); }} className="block w-full rounded-lg px-2 py-2 text-left text-[12px] font-semibold text-[var(--brand-ink)] hover:bg-white">{item}</button>)}<p className="mt-2 border-t border-[var(--line)] pt-2 text-[10px] leading-4 text-[var(--text-muted)]">실제 도로명 주소 검색 API는 개발사 연동 대상입니다.</p></div>}
          </Field>
        </Section>

        <Section title="연락">
          <Field label="휴대폰" required>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className={inputCls} />
          </Field>
          <Field label="전화">
            <input
              type="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              placeholder="-를 제외한 숫자만 입력"
              className={inputCls}
            />
          </Field>
          <Field label="이메일">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </Field>
          <Field label="홈페이지">
            <input
              type="text"
              value={homepage}
              onChange={(e) => setHomepage(e.target.value)}
              placeholder="예: www.abc.com"
              className={inputCls}
            />
          </Field>
        </Section>

        <Section title="희망 조건">
          <Field label="희망직급" required>
            <input
              type="text"
              value={hopeWork}
              onChange={(e) => setHopeWork(e.target.value)}
              placeholder="예: 소속 공인중개사 · 팀장"
              className={inputCls}
            />
          </Field>
          <Field label="희망지역" required>
            <input
              type="text"
              value={hopeRegion}
              onChange={(e) => setHopeRegion(e.target.value)}
              placeholder="예: 수도권"
              className={inputCls}
            />
          </Field>
          <Field label="근무가능일">
            <input
              type="text"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              placeholder="예: 즉시협의"
              className={inputCls}
            />
          </Field>
        </Section>

        <Section title="경력 · 역량">
          <Field label="경력" required>
            <input
              type="text"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              placeholder="예: 관리"
              className={inputCls}
            />
          </Field>
          <Field label="자격사항">
            <input
              type="text"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              placeholder="예: 공인중개사"
              className={inputCls}
            />
          </Field>
          <Field label="인맥">
            <input
              type="text"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              placeholder="예: 50명"
              className={inputCls}
            />
          </Field>
        </Section>

        <Section title="이력 · 프로필 첨부" icon={<ImagePlus className="h-[18px] w-[18px] text-[var(--brand-purple)]" />}>
          {attachment ? <div className="flex items-center gap-3 rounded-[14px] border border-[var(--line)] p-3.5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-purple-soft)]"><Paperclip className="h-5 w-5 text-[var(--brand-purple)]" /></span><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-bold text-[var(--brand-ink)]">{attachment}</p><p className="mt-0.5 text-[10px] text-[var(--text-muted)]">데모 첨부 파일</p></div><button type="button" aria-label="첨부 삭제" onClick={() => setAttachment("")} className="grid h-9 w-9 place-items-center rounded-full bg-[#FFF1F2]"><Trash2 className="h-4 w-4 text-[#D8424E]" /></button></div> : <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[15px] border-2 border-dashed border-[#DDD7E8] py-8"><ImagePlus className="h-8 w-8 text-[#BEB6CD]" /><span className="text-[13px] font-bold text-[#6E6787]">이력서 또는 프로필 이미지 선택</span><span className="text-[10.5px] text-[#A49BBE]">JPG, PNG, PDF · 최대 10MB</span><input type="file" accept="image/jpeg,image/png,application/pdf" className="sr-only" onChange={(event) => setAttachment(event.target.files?.[0]?.name ?? "")} /></label>}
        </Section>

        <Section title="자기소개">
          <Field label="자기소개" required>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="입력"
              rows={4}
              className={`${inputCls} resize-none`}
            />
          </Field>
          <Field label="기타">
            <textarea
              value={etc}
              onChange={(e) => setEtc(e.target.value)}
              placeholder="입력"
              rows={4}
              className={`${inputCls} resize-none`}
            />
          </Field>
        </Section>

        <button
          type="button"
          onClick={handlePreview}
          className="w-full text-white text-base font-extrabold rounded-2xl py-4 shadow-[0_6px_16px_rgba(123,47,247,.3)] active:scale-[0.98] transition-transform"
          style={{ background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }}
        >
          미리보기 · 등록
        </button>
      </div>
    </MobileLayout>
  );
}

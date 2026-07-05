"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  FileText,
  ImagePlus,
  Upload,
  User,
  ShoppingBag,
  Search,
  Calendar,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

/* 구인글 등록 — 마피 원본 폼 베이스 + 분양의신 장점 이식
   (모집 직책 칩·즉시 투입·급여 방식·수수료 퀵버튼·혜택 미제공/지원 토글·임시저장) */

const POSITIONS = ["본부장", "팀장", "팀원", "기타"] as const;
const PAY_TYPES = ["계약수수료", "기본급", "기본급 + 인센"] as const;
const FEE_QUICK = [500, 1000, 1500, 2500];
const MEALS = ["조식", "중식", "석식"] as const;
const BENEFIT_ITEMS = ["숙소비", "영업비", "[영업지원] 광고비", "[영업지원] MGM"] as const;

const inputCls =
  "w-full border border-[#E9E4F5] rounded-xl px-4 py-3 outline-none text-[15px] text-[#1B1330] placeholder:text-[#C9C2DC] focus:border-[#7B2FF7] transition-colors";

function Section({ icon, title, children }: { icon?: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgba(27,19,48,.05)]">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
          {icon ?? <ShoppingBag className="w-[18px] h-[18px] text-[#7B2FF7]" strokeWidth={2} />}
        </div>
        <h2 className="text-[17px] font-extrabold text-[#1B1330] tracking-[-0.3px]">{title}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, required, right, children }: { label: string; required?: boolean; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] font-semibold text-[#6E6787]">
          {label} {required && <span className="text-[#FF3B5C]">*</span>}
        </span>
        {right}
      </div>
      {children}
    </div>
  );
}

// 점선 라운드 칩 (분양의신 스타일)
function DashChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-[13.5px] font-bold transition-colors",
        active
          ? "bg-[#1B1330] text-white"
          : "bg-white text-[#6E6787] border border-dashed border-[#C9C2DC]"
      )}
    >
      {children}
    </button>
  );
}

// 미제공/지원 토글
function ProvideToggle({ value, onChange, options = ["미제공", "지원"] }: { value: string; onChange: (v: string) => void; options?: string[] }) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <DashChip key={opt} active={value === opt} onClick={() => onChange(opt)}>
          {opt}
        </DashChip>
      ))}
    </div>
  );
}

export default function GuinWritePage() {
  const router = useRouter();
  const [jobType, setJobType] = useState<"공인 중개사" | "분양 상담사" | null>(null);

  // 기본 정보
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 모집 조건 (분양의신 이식)
  const [positions, setPositions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [immediate, setImmediate] = useState(false);
  const [payType, setPayType] = useState<string>("");
  const [fee, setFee] = useState(0);
  const [feeConsult, setFeeConsult] = useState(false);
  const [workAddress, setWorkAddress] = useState("");
  const [workTime, setWorkTime] = useState("");
  const [holiday, setHoliday] = useState("");

  // 혜택 (분양의신 이식)
  const [dailyPay, setDailyPay] = useState("");
  const [dailyPayNone, setDailyPayNone] = useState(true);
  const [meals, setMeals] = useState<string[]>([]);
  const [mealNone, setMealNone] = useState(true);
  const [benefits, setBenefits] = useState<Record<string, string>>(
    Object.fromEntries(BENEFIT_ITEMS.map((b) => [b, "미제공"]))
  );

  // 연락처
  const [manager, setManager] = useState("");
  const [phone, setPhone] = useState("");

  const togglePosition = (p: string) => {
    setPositions((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : prev.length >= 2 ? prev : [...prev, p]
    );
  };
  const toggleMeal = (m: string) => {
    setMealNone(false);
    setMeals((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const handleDraft = () => alert("임시저장 되었습니다. (데모)");
  const handleSubmit = () => {
    alert("공고가 등록되었습니다.\n(데모: 실제 저장은 되지 않습니다)");
    router.push("/jobs");
  };

  // 1단계: 유형 선택
  if (!jobType) {
    return (
      <MobileLayout hideNav>
        <PageHeader title="구인글 등록" />
        <div className="px-5 pt-5 pb-10">
          <div className="text-base font-extrabold text-[#1B1330] tracking-[-0.3px] mb-3">유형</div>
          <div className="grid grid-cols-2 gap-3">
            {(["공인 중개사", "분양 상담사"] as const).map((t, i) => (
              <button
                key={t}
                type="button"
                onClick={() => setJobType(t)}
                className="bg-white rounded-[20px] p-6 flex flex-col items-center gap-3 shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.97] transition-transform"
              >
                <div className={`w-14 h-14 rounded-2xl ${i === 0 ? "bg-[#EDE9FE]" : "bg-[#FEF3C7]"} flex items-center justify-center`}>
                  <User className={`w-7 h-7 ${i === 0 ? "text-[#7B2FF7]" : "text-[#D97706]"}`} strokeWidth={1.9} />
                </div>
                <div className="text-center">
                  <div className="text-[15px] font-bold text-[#1B1330]">{t}</div>
                  <div className="text-[11.5px] text-[#9A93AC] font-medium mt-1">
                    {t.replace(" ", "")} 등록
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </MobileLayout>
    );
  }

  // 2단계: 등록 폼
  return (
    <MobileLayout hideNav>
      <header className="sticky top-0 z-10 bg-white border-b border-[#EFEBF7]">
        <div className="flex items-center gap-3 px-5 py-4">
          <button type="button" onClick={() => setJobType(null)} aria-label="뒤로가기">
            <ChevronLeft className="w-6 h-6 text-[#1B1330]" strokeWidth={2.4} />
          </button>
          <h1 className="text-[17px] font-extrabold text-[#1B1330] tracking-[-0.3px]">
            {jobType.replace(" ", "")} 등록
          </h1>
        </div>
      </header>

      <div className="px-4 pt-4 pb-10 space-y-4">
        {/* 기본 정보 */}
        <Section title="기본 정보" icon={<FileText className="w-[18px] h-[18px] text-[#7B2FF7]" strokeWidth={2} />}>
          <Field label="공고 제목" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 강남 아파트 전문 공인중개사 모집"
              className={inputCls}
            />
          </Field>
          <Field label="현장 한 줄 소개">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="예: 조건변경 들어갑니다! 대박현장 급구"
              maxLength={50}
              className={inputCls}
            />
          </Field>
        </Section>

        {/* 이미지 등록 */}
        <Section title="이미지 등록" icon={<ImagePlus className="w-[18px] h-[18px] text-[#7B2FF7]" strokeWidth={2} />}>
          <button
            type="button"
            onClick={() => alert("이미지 업로드 (데모)")}
            className="w-full border-2 border-dashed border-[#E9E4F5] rounded-xl py-10 flex flex-col items-center gap-2 text-gray-400"
          >
            <Upload className="w-9 h-9 text-[#C9C2DC]" />
            <div className="text-[14px] text-[#6E6787] font-semibold">클릭하여 이미지 업로드 (0/5)</div>
            <div className="text-[12px] text-[#C9C2DC]">PNG, JPG (장당 최대 5MB · 4:3 노출)</div>
          </button>
        </Section>

        {/* 모집 조건 — 분양의신 장점 이식 */}
        <Section title="모집 조건">
          <Field label="어떤 분을 찾고 계세요?" required right={<span className="text-[11px] text-[#A49BBE]">최대 2개 선택</span>}>
            <div className="flex gap-2 flex-wrap">
              {POSITIONS.map((p) => (
                <DashChip key={p} active={positions.includes(p)} onClick={() => togglePosition(p)}>
                  {p}
                </DashChip>
              ))}
            </div>
          </Field>

          <Field
            label="투입일"
            required
            right={
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6E6787]">
                <input
                  type="checkbox"
                  checked={immediate}
                  onChange={(e) => setImmediate(e.target.checked)}
                  className="w-4 h-4 accent-[#7B2FF7]"
                />
                즉시 투입
              </label>
            }
          >
            <div className="flex items-center gap-2 border border-[#E9E4F5] rounded-xl px-4 py-3">
              <Calendar className="w-[18px] h-[18px] text-[#7B2FF7]" strokeWidth={2} />
              {immediate ? (
                <span className="flex-1 text-[15px] text-[#1B1330] font-semibold">즉시 투입</span>
              ) : (
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 outline-none text-[15px] text-[#1B1330] bg-transparent"
                />
              )}
            </div>
          </Field>

          <Field label="급여는 어떻게 할까요?" required>
            <div className="flex gap-2 flex-wrap">
              {PAY_TYPES.map((t) => (
                <DashChip key={t} active={payType === t} onClick={() => setPayType(t)}>
                  {t}
                </DashChip>
              ))}
            </div>
          </Field>

          {payType === "계약수수료" && (
            <Field
              label="계약수수료 정보"
              required
              right={
                <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6E6787]">
                  <input
                    type="checkbox"
                    checked={feeConsult}
                    onChange={(e) => setFeeConsult(e.target.checked)}
                    className="w-4 h-4 accent-[#7B2FF7]"
                  />
                  상담 시 문의
                </label>
              }
            >
              <div
                className={cn(
                  "flex items-center gap-2 border border-[#E9E4F5] rounded-xl px-3 py-3",
                  feeConsult && "opacity-50"
                )}
              >
                <span className="bg-[#EDE9FE] text-[#7B2FF7] text-[11px] font-extrabold px-2 py-1 rounded-md shrink-0">
                  {positions[0] ?? "직책"}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={fee ? fee.toLocaleString() : ""}
                  onChange={(e) => setFee(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
                  placeholder="1,000,000"
                  disabled={feeConsult}
                  className="flex-1 min-w-0 outline-none text-[16px] font-bold text-[#1B1330] placeholder:text-[#C9C2DC] placeholder:font-normal"
                />
                <span className="text-[#6E6787] text-sm font-medium">만원</span>
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {FEE_QUICK.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={feeConsult}
                    onClick={() => setFee(fee + q)}
                    className="bg-[#F3F0FA] text-[#6E6787] text-[12px] font-bold px-2.5 py-1.5 rounded-lg disabled:opacity-50"
                  >
                    + {q.toLocaleString()}만원
                  </button>
                ))}
              </div>
            </Field>
          )}

          {(payType === "기본급" || payType === "기본급 + 인센") && (
            <Field label="급여 조건" required>
              <input type="text" placeholder="예: 기본급 250만 + 인센티브" className={inputCls} />
            </Field>
          )}

          <Field label="근무지 주소" required>
            <div className="flex gap-2">
              <input
                type="text"
                value={workAddress}
                onChange={(e) => setWorkAddress(e.target.value)}
                placeholder="주소를 검색해주세요"
                className={cn(inputCls, "flex-1 min-w-0")}
              />
              <button
                type="button"
                onClick={() => alert("주소 검색 (데모)")}
                className="shrink-0 text-white text-[13px] font-bold rounded-xl px-4 flex items-center gap-1 active:opacity-80"
                style={{ background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }}
              >
                <Search className="w-4 h-4" />
                주소 검색
              </button>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="근무 시간">
              <input
                type="text"
                value={workTime}
                onChange={(e) => setWorkTime(e.target.value)}
                placeholder="09:00 ~ 18:00"
                className={inputCls}
              />
            </Field>
            <Field label="휴무">
              <input
                type="text"
                value={holiday}
                onChange={(e) => setHoliday(e.target.value)}
                placeholder="주 5일 (토/일)"
                className={inputCls}
              />
            </Field>
          </div>
        </Section>

        {/* 제공 혜택 — 분양의신 장점 이식 */}
        <Section title="제공되는 혜택이 있나요?">
          <Field
            label="일비"
            required
            right={
              <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6E6787]">
                <input
                  type="checkbox"
                  checked={dailyPayNone}
                  onChange={(e) => setDailyPayNone(e.target.checked)}
                  className="w-4 h-4 accent-[#7B2FF7]"
                />
                미제공
              </label>
            }
          >
            <div
              className={cn(
                "flex items-center border border-[#E9E4F5] rounded-xl px-4 py-3",
                dailyPayNone && "bg-[#F7F6FB] opacity-60"
              )}
            >
              <input
                type="text"
                inputMode="numeric"
                value={dailyPay}
                onChange={(e) => setDailyPay(e.target.value)}
                placeholder="10,000"
                disabled={dailyPayNone}
                className="flex-1 outline-none text-[15px] text-[#1B1330] placeholder:text-[#C9C2DC] bg-transparent"
              />
              <span className="text-[#6E6787] text-sm font-medium ml-2">원</span>
            </div>
          </Field>

          <Field label="식사 제공" required right={<span className="text-[11px] text-[#A49BBE]">중복 선택 가능</span>}>
            <div className="flex items-center gap-2 flex-wrap">
              <DashChip
                active={mealNone}
                onClick={() => {
                  setMealNone(true);
                  setMeals([]);
                }}
              >
                미제공
              </DashChip>
              <span className="w-px h-6 bg-[#EFEBF7]" />
              {MEALS.map((m) => (
                <DashChip key={m} active={meals.includes(m)} onClick={() => toggleMeal(m)}>
                  {m}
                </DashChip>
              ))}
            </div>
          </Field>

          {BENEFIT_ITEMS.map((b) => (
            <Field key={b} label={b} required>
              <ProvideToggle
                value={benefits[b]}
                onChange={(v) => setBenefits((prev) => ({ ...prev, [b]: v }))}
              />
            </Field>
          ))}
        </Section>

        {/* 연락처 */}
        <Section title="연락처">
          <Field label="담당자명" required>
            <input
              type="text"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              placeholder="예: 홍길동"
              className={inputCls}
            />
          </Field>
          <Field label="휴대폰" required>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="-를 제외한 숫자만 입력"
              className={inputCls}
            />
          </Field>
        </Section>

        {/* 유의사항 */}
        <div className="bg-[#FFFBEB] border border-[#F1E2B6] rounded-[20px] p-5 text-xs text-[#6E6787] space-y-2 leading-[1.6]">
          <p className="text-sm font-extrabold text-[#1B1330]">공고 등록 시 유의사항</p>
          <p>
            · 등록하는 이미지 및 영상물에 대한 <b>저작권·초상권 확인 책임</b>은 등록자에게 있으며,
            플랫폼은 이에 대한 어떠한 책임도 지지 않습니다.
          </p>
          <p>
            · <b>최저임금 미만의 급여</b> 또는 <b>연령·성별 제한</b> 내용이 포함된 공고는 사전 경고
            없이 삭제될 수 있습니다.
          </p>
          <p>· 등록된 공고의 로고·이미지·상세요강은 제휴를 통해 외부 채널에 게시될 수 있습니다.</p>
        </div>

        {/* 임시저장 + 등록 (분양의신 패턴) */}
        <div className="grid grid-cols-[1fr_1.6fr] gap-3">
          <button
            type="button"
            onClick={handleDraft}
            className="bg-white border-[1.5px] border-[#7B2FF7] text-[#7B2FF7] text-base font-extrabold rounded-2xl py-4"
          >
            임시저장
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white text-base font-extrabold rounded-2xl py-4 shadow-[0_6px_16px_rgba(123,47,247,.3)] active:scale-[0.98] transition-transform"
            style={{ background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }}
          >
            공고 등록하기
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}

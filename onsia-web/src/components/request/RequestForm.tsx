"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, ShoppingBag, Search, Paperclip, Calendar } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

interface RequestFormProps {
  title: string;
  dateLabel: string;
  optionLabel: string;
  options: string[];
}

const inputCls =
  "w-full border border-[#E9E4F5] rounded-xl px-4 py-3 outline-none text-[15px] text-[#1B1330] placeholder:text-[#C9C2DC] focus:border-[#7B2FF7] transition-colors";

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgba(27,19,48,.05)]">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] flex items-center justify-center">{icon}</div>
        <h2 className="text-[17px] font-extrabold text-[#1B1330] tracking-[-0.3px]">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[13px] font-semibold text-[#6E6787] mb-1.5">
        {label} {required && <span className="text-[#FF3B5C]">*</span>}
      </div>
      {children}
    </div>
  );
}

// 개발사 앱 의뢰 폼(캡처 60/61) 공통 구조: 회원 정보 + 현장·건물 정보 + 상담 요청
export function RequestForm({ title, dateLabel, optionLabel, options }: RequestFormProps) {
  const router = useRouter();

  const [contractor, setContractor] = useState("마피 중개사");
  const [phone, setPhone] = useState("01011111111");
  const [siteName, setSiteName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("2026-07-06");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (opt: string) => {
    setSelectedOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const handleSubmit = () => {
    alert("상담 요청이 접수되었습니다.\n(데모: 실제 저장은 되지 않습니다)");
    router.push("/");
  };

  return (
    <MobileLayout hideNav>
      <PageHeader title={title} />

      <div className="px-4 pt-4 pb-10 space-y-4">
        <Section title="회원 정보" icon={<FileText className="w-[18px] h-[18px] text-[#7B2FF7]" strokeWidth={2} />}>
          <Field label="계약자" required>
            <input type="text" value={contractor} onChange={(e) => setContractor(e.target.value)} className={inputCls} />
          </Field>
          <Field label="휴대폰" required>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
          </Field>
        </Section>

        <Section title="현장 · 건물 정보" icon={<ShoppingBag className="w-[18px] h-[18px] text-[#7B2FF7]" strokeWidth={2} />}>
          <Field label="현장/건물명" required>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="예: 래미안 강남 포레스트"
              className={inputCls}
            />
          </Field>

          <Field label="주소" required>
            <div className="flex gap-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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

          <Field label={dateLabel} required>
            <div className="flex items-center gap-2 border border-[#E9E4F5] rounded-xl px-4 py-3 focus-within:border-[#7B2FF7] transition-colors">
              <Calendar className="w-[18px] h-[18px] text-[#7B2FF7]" strokeWidth={2} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 outline-none text-[15px] text-[#1B1330] bg-transparent"
              />
            </div>
          </Field>

          <Field label={`${optionLabel} (중복 가능)`} required>
            <div className="flex gap-2 flex-wrap">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleOption(opt)}
                  className={cn(
                    "px-4 py-2.5 rounded-full text-[13.5px] font-semibold border transition-colors",
                    selectedOptions.includes(opt)
                      ? "bg-[#7B2FF7] text-white border-[#7B2FF7]"
                      : "bg-white text-[#6E6787] border-[#E9E4F5]"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Field>

          <Field label="분양 계약서 첨부 (선택)">
            <button
              type="button"
              onClick={() => alert("파일 첨부 (데모)")}
              className="w-full border-2 border-dashed border-[#E9E4F5] rounded-xl py-4 text-center text-[13px] text-[#6E6787]"
            >
              <span className="inline-flex items-center gap-1 font-semibold">
                <Paperclip className="w-4 h-4" /> 파일 첨부하기
              </span>
              <br />
              <span className="text-[#C9C2DC]">jpg, png, pdf (최대 10MB)</span>
            </button>
          </Field>
        </Section>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full text-white text-base font-extrabold rounded-2xl py-4 shadow-[0_6px_16px_rgba(123,47,247,.3)] active:scale-[0.98] transition-transform"
          style={{ background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }}
        >
          상담 요청하기
        </button>
      </div>
    </MobileLayout>
  );
}

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
  Bold,
  Underline,
  List,
  ListOrdered,
  LinkIcon,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

const BENEFITS = ["4대보험", "인센티브", "교육제공", "점심제공"];

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

// 개발사 앱 구인글 등록(캡처 85, 86~86c) 재현: 유형 선택 → 등록 폼 2단계
export default function GuinWritePage() {
  const router = useRouter();
  const [jobType, setJobType] = useState<"공인 중개사" | "분양 상담사" | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [workAddress, setWorkAddress] = useState("");
  const [workType, setWorkType] = useState("정규직");
  const [career, setCareer] = useState("신입OK");
  const [salary, setSalary] = useState("");
  const [workTime, setWorkTime] = useState("");
  const [holiday, setHoliday] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [manager, setManager] = useState("");
  const [phone, setPhone] = useState("");

  const toggleBenefit = (b: string) => {
    setBenefits((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  };

  const handleSubmit = () => {
    alert("공고가 등록되었습니다.\n(데모: 실제 저장은 되지 않습니다)");
    router.push("/jobs");
  };

  // 1단계: 유형 선택 (캡처 85)
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
                <div
                  className={`w-14 h-14 rounded-2xl ${i === 0 ? "bg-[#EDE9FE]" : "bg-[#FEF3C7]"} flex items-center justify-center`}
                >
                  <User
                    className={`w-7 h-7 ${i === 0 ? "text-[#7B2FF7]" : "text-[#D97706]"}`}
                    strokeWidth={1.9}
                  />
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

  // 2단계: 등록 폼 (캡처 86~86c)
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
        <Section title="기본 정보" icon={<FileText className="w-6 h-6 text-purple-600" />}>
          <Field label="공고 제목" required>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 강남 아파트 전문 공인중개사 모집"
              className={inputCls}
            />
          </Field>
          <Field label="상세 내용 (에디터)">
            <div className="border border-[#E9E4F5] rounded-xl overflow-hidden">
              {/* 에디터 툴바 (데모 — 실제 서식 기능 없음) */}
              <div className="flex flex-wrap gap-1 bg-gray-50 border-b border-gray-300 p-2 text-gray-600">
                {[Bold, Underline, List, ListOrdered, LinkIcon, ImageIcon, Video].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-9 h-9 bg-white border border-gray-200 rounded flex items-center justify-center"
                    onClick={() => alert("에디터 서식 (데모)")}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 outline-none text-base resize-none"
              />
            </div>
          </Field>
        </Section>

        <Section title="이미지 등록" icon={<ImagePlus className="w-6 h-6 text-purple-600" />}>
          <button
            type="button"
            onClick={() => alert("이미지 업로드 (데모)")}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-10 flex flex-col items-center gap-2 text-gray-400"
          >
            <Upload className="w-9 h-9" />
            <div className="text-base text-gray-600">클릭하여 이미지 업로드</div>
            <div className="text-sm text-gray-400">PNG, JPG, GIF (최대 2MB)</div>
          </button>
          <button
            type="button"
            onClick={() => alert("영상 업로드 (데모)")}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 flex items-center justify-center gap-4 text-gray-400"
          >
            <Upload className="w-9 h-9" />
            <div className="text-left">
              <div className="text-base text-gray-600">클릭하여 영상 업로드</div>
              <div className="text-sm text-gray-400">MP4, MOV (최대 500MB)</div>
            </div>
          </button>
          <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-800 text-sm mb-1">영상 가이드라인</p>
            <p>· 업로드 후 마피 운영팀 검수를 거쳐 노출됩니다</p>
            <p>· 영상 공고는 상담 우선 노출됩니다</p>
          </div>
        </Section>

        <Section title="모집 조건">
          <Field label="근무지 주소" required>
            <div className="flex gap-2">
              <input
                type="text"
                value={workAddress}
                onChange={(e) => setWorkAddress(e.target.value)}
                placeholder="주소를 검색해주세요"
                className="flex-1 min-w-0 border border-[#E9E4F5] rounded-xl px-4 py-3 outline-none text-base placeholder:text-[#C9C2DC]"
              />
              <button
                type="button"
                onClick={() => alert("주소 검색 (데모)")}
                className="shrink-0 bg-[#7B2FF7] text-white text-sm font-semibold rounded-lg px-4 flex items-center gap-1 active:opacity-80"
              >
                <Search className="w-4 h-4" />
                주소 검색
              </button>
            </div>
          </Field>
          <Field label="근무 형태" required>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full border border-[#E9E4F5] rounded-xl px-3 py-3 bg-white text-base"
            >
              <option>정규직</option>
              <option>계약직</option>
              <option>프리랜서</option>
            </select>
          </Field>
          <Field label="경력" required>
            <select
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              className="w-full border border-[#E9E4F5] rounded-xl px-3 py-3 bg-white text-base"
            >
              <option>신입OK</option>
              <option>경력 1년 이상</option>
              <option>경력 3년 이상</option>
              <option>경력 5년 이상</option>
            </select>
          </Field>
          <Field label="급여 조건" required>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="예: 기본급 + 인센티브"
              className={inputCls}
            />
          </Field>
          <Field label="근무 시간">
            <input
              type="text"
              value={workTime}
              onChange={(e) => setWorkTime(e.target.value)}
              placeholder="예: 09:00 ~ 18:00"
              className={inputCls}
            />
          </Field>
          <Field label="휴무">
            <input
              type="text"
              value={holiday}
              onChange={(e) => setHoliday(e.target.value)}
              placeholder="예: 주 5일 (토/일 휴무)"
              className={inputCls}
            />
          </Field>
          <Field label="복리후생">
            <div className="flex gap-2 flex-wrap">
              {BENEFITS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBenefit(b)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base",
                    benefits.includes(b)
                      ? "bg-[#7B2FF7] text-white font-semibold"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </Field>
        </Section>

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

        {/* 유의사항 (캡처 86c) */}
        <div className="bg-[#FFFBEB] border border-[#F1E2B6] rounded-[20px] p-5 text-xs text-[#6E6787] space-y-2 leading-[1.6]">
          <p className="text-sm font-extrabold text-[#1B1330]">공고 등록 시 유의사항</p>
          <p>
            · 등록하는 이미지 및 영상물에 대한 <b>저작권·초상권 확인 책임</b>은 등록자에게
            있으며, 부동산인은 이에 대한 어떠한 책임도 지지 않습니다.
          </p>
          <p>
            · <b>최저임금 미만의 급여</b> 또는 <b>연령·성별 제한</b> 내용이 포함된 공고는 사전
            경고 없이 삭제될 수 있습니다.
          </p>
          <p>
            · 파일 링크 첨부 시 반드시 <b className="text-orange-600">HTTPS 보안 링크</b>를
            사용해 주세요.
          </p>
          <p>· 등록된 공고의 로고·이미지·상세요강은 제휴를 통해 외부 채널에 게시될 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setJobType(null)}
            className="bg-white border border-[#E9E4F5] text-[#6E6787] text-base font-bold rounded-2xl py-4"
          >
            취소
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, ShoppingBag, Search } from "lucide-react";
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
  const router = useRouter();

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

  const handleSubmit = () => {
    alert("구직글이 등록되었습니다.\n(데모: 실제 저장은 되지 않습니다)");
    router.push("/jobs");
  };

  return (
    <MobileLayout hideNav>
      <PageHeader title="구직 등록" />

      <div className="px-4 pt-4 pb-10 space-y-4">
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
                onClick={() => alert("주소 검색 (데모)")}
                className="shrink-0 bg-[#7B2FF7] text-white text-sm font-semibold rounded-lg px-4 flex items-center gap-1 active:opacity-80"
              >
                <Search className="w-4 h-4" />
                주소 검색
              </button>
            </div>
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
          <Field label="희망업무">
            <input
              type="text"
              value={hopeWork}
              onChange={(e) => setHopeWork(e.target.value)}
              placeholder="예: 관리"
              className={inputCls}
            />
          </Field>
          <Field label="희망지역">
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
          <Field label="경력">
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

        <Section title="자기소개">
          <Field label="자기소개">
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
          onClick={handleSubmit}
          className="w-full text-white text-base font-extrabold rounded-2xl py-4 shadow-[0_6px_16px_rgba(123,47,247,.3)] active:scale-[0.98] transition-transform"
          style={{ background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }}
        >
          등록하기
        </button>
      </div>
    </MobileLayout>
  );
}

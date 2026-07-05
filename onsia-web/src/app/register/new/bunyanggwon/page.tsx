"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, ImagePlus, Upload, Building2 } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

const SIDO_LIST = ["서울특별시", "경기도", "인천광역시", "부산광역시", "대구광역시", "광주광역시", "대전광역시"];
const SIGUNGU_LIST = ["수원시 영통구", "고양시 일산동구", "성남시 분당구", "화성시", "평택시"];
const DONG_LIST = ["이의동", "원천동", "매탄동", "영통동"];
const DANJI_LIST = ["샘플 아파트", "래미안 강남 포레스트", "광교 중흥S클래스"];
const AREA_LIST = ["59㎡", "74㎡", "84㎡", "101㎡", "123㎡"];
const DIRECTION_LIST = ["동향", "서향", "남향", "북향", "남동향", "남서향", "북동향", "북서향"];

function SectionCard({ icon, title, children }: { icon?: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgba(27,19,48,.05)]">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
          {icon ?? <FileText className="w-[18px] h-[18px] text-[#7B2FF7]" strokeWidth={2} />}
        </div>
        <h2 className="text-[17px] font-extrabold text-[#1B1330] tracking-[-0.3px]">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div className="text-[13px] font-semibold text-[#6E6787] mb-1.5">
      {label} {required && <span className="text-[#FF3B5C]">*</span>}
    </div>
  );
}

function SuffixInput({
  suffix,
  value,
  onChange,
  placeholder = "입력",
}: {
  suffix: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center border border-[#E9E4F5] rounded-xl px-4 py-3 bg-white focus-within:border-[#7B2FF7] transition-colors">
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 outline-none text-[15px] text-[#1B1330] placeholder:text-[#C9C2DC]"
      />
      <span className="text-[#6E6787] text-sm font-medium ml-2">{suffix}</span>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full border border-[#E9E4F5] rounded-xl px-3 py-3 bg-white text-[15px] text-[#1B1330] appearance-none focus:border-[#7B2FF7] outline-none transition-colors",
        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23555%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]",
        value === "" && "text-gray-500"
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export default function BunyanggwonRegisterPage() {
  const router = useRouter();

  const [propertyType, setPropertyType] = useState("아파트");
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [dong, setDong] = useState("");
  const [danji, setDanji] = useState("");
  const [buildingNo, setBuildingNo] = useState("");
  const [unitNo, setUnitNo] = useState("");
  const [area, setArea] = useState("");
  const [floor, setFloor] = useState("");
  const [totalFloor, setTotalFloor] = useState("");
  const [direction, setDirection] = useState("");

  const [dealType, setDealType] = useState("매매");
  const [salePrice, setSalePrice] = useState("");
  const [tradePrice, setTradePrice] = useState("");
  const [moveInType, setMoveInType] = useState<"immediate" | "date">("immediate");
  const [moveInDate, setMoveInDate] = useState("2026-07-06");
  const [moveInPeriod, setMoveInPeriod] = useState("");
  const [negotiable, setNegotiable] = useState(false);

  const [transport, setTransport] = useState("");
  const [walkMinutes, setWalkMinutes] = useState("");
  const [deposit1, setDeposit1] = useState("");
  const [deposit2, setDeposit2] = useState("");
  const [interim, setInterim] = useState("");
  const [loanAvailable, setLoanAvailable] = useState(true);
  const [balance, setBalance] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    alert("매물이 등록되었습니다.\n(데모: 실제 저장은 되지 않습니다)");
    router.push("/register/list");
  };

  return (
    <MobileLayout hideNav>
      <PageHeader title="분양권 전매 등록" />

      <div className="px-4 pt-4 pb-10 space-y-4">
        {/* 매물 정보 */}
        <SectionCard title="매물 정보">
          <div>
            <FieldLabel label="매물 종류" required />
            <div className="inline-flex items-center gap-3 border-2 border-[#7B2FF7] rounded-2xl px-6 py-4 bg-white shadow-[0_4px_12px_rgba(123,47,247,.12)]">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-gray-500" />
              </div>
              <div className="text-base font-bold text-gray-900 leading-tight">
                아파트
                <br />
                오피스텔
              </div>
            </div>
          </div>
          <Select value={propertyType} onChange={setPropertyType} options={["아파트", "오피스텔"]} placeholder="선택" />
        </SectionCard>

        {/* 정보 입력 */}
        <SectionCard title="정보 입력">
          <div>
            <FieldLabel label="매물종류" required />
            <div className="text-base text-gray-900 px-1">{propertyType || "아파트"}</div>
          </div>

          <div>
            <FieldLabel label="소재지" required />
            <div className="grid grid-cols-3 gap-2">
              <Select value={sido} onChange={setSido} options={SIDO_LIST} placeholder="시/도" />
              <Select value={sigungu} onChange={setSigungu} options={SIGUNGU_LIST} placeholder="시/군/구" />
              <Select value={dong} onChange={setDong} options={DONG_LIST} placeholder="읍/면/동" />
            </div>
          </div>

          <div>
            <FieldLabel label="단지" required />
            <Select value={danji} onChange={setDanji} options={DANJI_LIST} placeholder="단지리스트" />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => alert("네이버 부동산 단지/동 확인 (데모)")}
                className="flex-1 bg-[#16A34A] text-white text-sm font-bold rounded-xl py-3 active:opacity-80"
              >
                네이버 단지/동 확인하기
              </button>
              <button
                type="button"
                onClick={() => alert("단지정보 신규등록 요청 (데모)")}
                className="flex-1 bg-[#2563EB] text-white text-sm font-bold rounded-xl py-3 active:opacity-80"
              >
                단지정보 신규등록 요청
              </button>
            </div>
          </div>

          <div>
            <FieldLabel label="동/호수" required />
            <div className="flex items-center border border-[#E9E4F5] rounded-xl px-4 py-3 bg-white gap-2">
              <input
                type="text"
                value={buildingNo}
                onChange={(e) => setBuildingNo(e.target.value)}
                placeholder="예: 101"
                className="flex-1 min-w-0 outline-none text-base placeholder:text-[#C9C2DC]"
              />
              <span className="text-gray-700">동</span>
              <input
                type="text"
                value={unitNo}
                onChange={(e) => setUnitNo(e.target.value)}
                placeholder="예: 1201"
                className="flex-1 min-w-0 outline-none text-base placeholder:text-[#C9C2DC] text-right"
              />
              <span className="text-gray-700">호</span>
            </div>
          </div>

          <div>
            <FieldLabel label="면적" required />
            <Select value={area} onChange={setArea} options={AREA_LIST} placeholder="선택" />
          </div>

          <div>
            <FieldLabel label="층" required />
            <SuffixInput suffix="층" value={floor} onChange={setFloor} />
          </div>

          <div>
            <FieldLabel label="전체층수" required />
            <SuffixInput suffix="층" value={totalFloor} onChange={setTotalFloor} />
          </div>

          <div>
            <FieldLabel label="방향" required />
            <Select value={direction} onChange={setDirection} options={DIRECTION_LIST} placeholder="선택" />
          </div>
        </SectionCard>

        {/* 거래정보 */}
        <SectionCard title="거래정보">
          <div>
            <FieldLabel label="거래종류" required />
            <Select value={dealType} onChange={setDealType} options={["매매"]} placeholder="매매" />
          </div>

          <div>
            <FieldLabel label="분양가" required />
            <SuffixInput suffix="원" value={salePrice} onChange={setSalePrice} />
          </div>

          <div>
            <FieldLabel label="매매가" required />
            <SuffixInput suffix="원" value={tradePrice} onChange={setTradePrice} />
          </div>

          <div>
            <FieldLabel label="입주예정일" required />
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={moveInType === "immediate"}
                  onChange={() => setMoveInType("immediate")}
                  className="w-5 h-5 accent-[#7B2FF7]"
                />
                <span className="text-base text-gray-900">즉시입주</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={moveInType === "date"}
                    onChange={() => setMoveInType("date")}
                    className="w-5 h-5 accent-[#7B2FF7]"
                  />
                  <span className="text-base text-gray-900">입주일지정</span>
                </label>
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  disabled={moveInType !== "date"}
                  className="bg-gray-200 rounded-lg px-3 py-2 text-sm disabled:opacity-60"
                />
                {["초순", "중순", "하순"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    disabled={moveInType !== "date"}
                    onClick={() => setMoveInPeriod(p)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm disabled:opacity-60",
                      moveInPeriod === p && moveInType === "date"
                        ? "bg-[#7B2FF7] text-white"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="w-5 h-5 accent-[#7B2FF7]"
                />
                <span className="text-base text-gray-900">협의가능</span>
              </label>
            </div>
            <div className="mt-3 space-y-1 text-xs text-gray-500">
              <p>* 실제 매물의 입주 가능한 날짜를 선택해주세요.</p>
              <p>* 초순/중순/하순을 선택할 경우 입주일 년월+시기 형태로 노출됩니다.</p>
            </div>
          </div>
        </SectionCard>

        {/* 이미지 등록 */}
        <SectionCard title="이미지 등록" icon={<ImagePlus className="w-[18px] h-[18px] text-[#7B2FF7]" strokeWidth={2} />}>
          <button
            type="button"
            onClick={() => alert("이미지 업로드 (데모)")}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-12 flex flex-col items-center gap-3 text-gray-400"
          >
            <Upload className="w-10 h-10" />
            <div className="text-base text-gray-600">클릭하여 이미지 업로드</div>
            <div className="text-sm text-gray-400">PNG, JPG, GIF (최대 2MB)</div>
          </button>
          <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-800 text-sm mb-1">이미지 가이드라인</p>
            <p>· 권장 크기 : 800 X 600px (4:3 비율)</p>
            <p>· 큰 이미지는 자동으로 축소/압축됩니다</p>
            <p>· 매물 목록에서 카드 썸네일로 표시됩니다</p>
          </div>
        </SectionCard>

        {/* 상세 정보 */}
        <SectionCard title="상세 정보">
          <div>
            <FieldLabel label="교통접근성" />
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                placeholder="입력"
                className="flex-1 border border-[#E9E4F5] rounded-xl px-4 py-3 outline-none text-base placeholder:text-[#C9C2DC]"
              />
              <span className="text-gray-700 text-base">도보</span>
              <input
                type="text"
                inputMode="numeric"
                value={walkMinutes}
                onChange={(e) => setWalkMinutes(e.target.value)}
                placeholder="입력"
                className="w-16 border border-[#E9E4F5] rounded-xl px-3 py-3 outline-none text-base placeholder:text-[#C9C2DC]"
              />
              <span className="text-gray-700 text-base">분</span>
            </div>
          </div>

          <div>
            <FieldLabel label="계약금 1차" />
            <SuffixInput suffix="%" value={deposit1} onChange={setDeposit1} />
          </div>

          <div>
            <FieldLabel label="계약금 2차" />
            <SuffixInput suffix="%" value={deposit2} onChange={setDeposit2} />
          </div>

          <div>
            <FieldLabel label="중도금" />
            <SuffixInput suffix="%" value={interim} onChange={setInterim} />
          </div>

          <div>
            <FieldLabel label="대출 여부" />
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLoanAvailable(true)}
                className={cn(
                  "rounded-xl py-4 text-base font-semibold",
                  loanAvailable ? "bg-[#7B2FF7] text-white" : "bg-gray-200 text-gray-400"
                )}
              >
                대출 가능
              </button>
              <button
                type="button"
                onClick={() => setLoanAvailable(false)}
                className={cn(
                  "rounded-xl py-4 text-base font-semibold",
                  !loanAvailable ? "bg-[#7B2FF7] text-white" : "bg-gray-200 text-gray-400"
                )}
              >
                대출 불가능
              </button>
            </div>
          </div>

          <div>
            <FieldLabel label="잔금" />
            <SuffixInput suffix="%" value={balance} onChange={setBalance} />
          </div>
        </SectionCard>

        {/* 매물 설명 */}
        <SectionCard title="매물 설명">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="입력"
            rows={5}
            className="w-full border border-[#E9E4F5] rounded-xl px-4 py-3 outline-none text-base placeholder:text-[#C9C2DC] resize-none"
          />
        </SectionCard>

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

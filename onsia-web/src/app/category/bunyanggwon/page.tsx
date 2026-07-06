"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { mockBunyanggwon } from "@/lib/mock-bunyanggwon";
import { ChevronLeft, Search, ImageIcon, Loader2 } from "lucide-react";
import type { PropertyType } from "@/types/bunyanggwon";
import type { KnowledgeCenterData } from "@/types/api";

interface ApiListItem {
  id: string;
  apiId: string;
  propertyName: string;
  address: string;
  region: string;
  district: string;
  totalUnits: number;
  moveInDate: string;
  builder: string;
  homepageUrl: string;
  applicationStart: string;
  applicationEnd: string;
}

const SIDO_BY_REGION: Record<string, string | undefined> = {
  전국: undefined,
  서울: "서울특별시",
  경기도: "경기도",
  인천: "인천광역시",
  부산: "부산광역시",
  대전: "대전광역시",
};

// 청약기간 표시 (MM.DD ~ MM.DD, 없으면 "청약 예정")
function formatApplicationPeriod(start: string, end: string): string {
  if (!start) return "청약 예정";
  const s = `${start.slice(4, 6)}.${start.slice(6, 8)}`;
  const e = end ? `${end.slice(4, 6)}.${end.slice(6, 8)}` : "";
  return e ? `청약 ${s} ~ ${e}` : `청약 ${s}`;
}

const TYPE_TABS: { value: PropertyType; label: string }[] = [
  { value: "APARTMENT", label: "아파트" },
  { value: "OFFICETEL", label: "오피스텔" },
  { value: "KNOWLEDGE_INDUSTRY", label: "지식산업센터" },
];

export default function BunyanggwonPage() {
  const [selectedType, setSelectedType] = useState<PropertyType>("APARTMENT");
  const [selectedRegion, setSelectedRegion] = useState("전국");
  const [apiData, setApiData] = useState<ApiListItem[]>([]);
  const [knowledgeCenters, setKnowledgeCenters] = useState<KnowledgeCenterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 데이터 가져오기
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        if (selectedType === "KNOWLEDGE_INDUSTRY") {
          // 지식산업센터: CSV 시드 기반
          const sido = SIDO_BY_REGION[selectedRegion];
          const params = new URLSearchParams({ limit: "100" });
          if (sido) params.append("sido", sido);

          const response = await fetch(`/api/knowledge-centers?${params}`);
          if (!response.ok) throw new Error("지식산업센터 API 호출 실패");

          const result = await response.json();
          setKnowledgeCenters(result.success ? result.data : []);
          setApiData([]);
        } else {
          // 아파트/오피스텔: 청약홈 API
          const regionParam =
            selectedRegion === "전국"
              ? "경기"
              : selectedRegion === "경기도"
                ? "경기"
                : selectedRegion;

          const response = await fetch(
            `/api/bunyanggwon/list?region=${encodeURIComponent(regionParam)}&perPage=50`
          );

          if (!response.ok) throw new Error("API 호출 실패");

          const result = await response.json();
          setApiData(result.success && result.data ? result.data : []);
          setKnowledgeCenters([]);
        }
      } catch (err) {
        console.error("분양 목록 조회 오류:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다");
        setApiData([]);
        setKnowledgeCenters([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedRegion, selectedType]);

  // VIP 매물 (Mock 데이터에서 - 전매 매물은 별도 관리)
  const vipItems = mockBunyanggwon.filter(
    (item) => item.salesStatus === "VIP" && item.type === selectedType
  );

  // API 데이터 지역별 필터링
  const filteredApiData = apiData.filter((item) => {
    if (selectedRegion === "전국") return true;
    if (selectedRegion === "서울") return item.region === "서울";
    if (selectedRegion === "경기도") return item.region === "경기";
    if (selectedRegion === "인천") return item.region === "인천";
    return item.region === selectedRegion;
  });

  const regions = ["전국", "서울", "경기도", "인천", "부산", "대전"];

  return (
    <MobileLayout>
      {/* 다크 헤더 */}
      <header className="bg-[#1B1330] px-5 py-[18px] rounded-b-[26px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <ChevronLeft className="w-[22px] h-[22px] text-white" strokeWidth={2.2} />
            </Link>
            <span className="text-[19px] font-extrabold tracking-[-0.4px] text-white">
              분양권 전매
            </span>
          </div>
          <Search className="w-5 h-5 text-white" strokeWidth={2} />
        </div>

        {/* 타입 필터 (카테고리 필 탭) */}
        <div className="flex gap-2">
          {TYPE_TABS.map((tab) => {
            const active = selectedType === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedType(tab.value)}
                className={`text-[13px] px-4 py-2 rounded-full whitespace-nowrap ${
                  active
                    ? "font-extrabold text-white"
                    : "font-semibold bg-[#2C2145] text-[#9A8FB8]"
                }`}
                style={
                  active
                    ? { background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }
                    : undefined
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* 지역 칩 행 */}
      <div className="flex gap-2 px-5 pt-[14px] overflow-x-auto">
        {regions.map((region) => {
          const active = selectedRegion === region;
          return (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`text-[12.5px] px-[15px] py-[7px] rounded-full whitespace-nowrap flex-none ${
                active
                  ? "bg-[#1B1330] text-white font-bold"
                  : "bg-white text-[#4B4560] font-semibold border border-[#ECE8F6]"
              }`}
            >
              {region}
            </button>
          );
        })}
      </div>

      {/* VIP 전매 매물 섹션 */}
      {vipItems.length > 0 && (
        <div className="px-5 pt-[22px]">
          <div className="flex items-center gap-[7px] mb-3">
            <span className="bg-[#D9B54A] text-[#17130B] text-[10px] font-black px-2 py-[3px] rounded-[6px] tracking-[.5px]">
              VIP
            </span>
            <span className="text-[17px] font-extrabold text-[#1B1330] tracking-[-0.3px]">
              VIP 전매 매물
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {vipItems.map((item) => (
              <Link
                key={item.id}
                href={`/category/bunyanggwon/${item.apiId || item.id}`}
                className="flex gap-[13px] bg-white rounded-[20px] p-[14px] shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.99] transition-transform"
              >
                <div
                  className="w-[92px] h-[104px] rounded-[14px] flex-none flex items-center justify-center"
                  style={{ background: "linear-gradient(160deg,#ECE8F6,#DCD4EE)" }}
                >
                  <ImageIcon className="w-[26px] h-[26px] text-[#A49BBE]" strokeWidth={1.7} />
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#D9B54A] text-[#17130B] text-[9.5px] font-black px-[7px] py-[2px] rounded-[5px] flex-none">
                      VIP
                    </span>
                    <span className="text-[14.5px] font-extrabold text-[#1B1330] truncate">
                      {item.propertyName}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-[#9A93AC] truncate">
                    {item.address}
                  </div>
                  {item.premiumType === "MINUS" && (
                    <span className="self-start bg-[#E8F0FE] text-[#2563EB] text-[10.5px] font-extrabold px-2 py-[3px] rounded-[6px]">
                      마이너스P −{item.premium.toLocaleString()}만
                    </span>
                  )}
                  {item.premiumType === "PREMIUM" && (
                    <span className="self-start bg-[#FEE2E2] text-[#DC2626] text-[10.5px] font-extrabold px-2 py-[3px] rounded-[6px]">
                      프리미엄 +{item.premium.toLocaleString()}만
                    </span>
                  )}
                  {item.premiumType === "NONE" && (
                    <span className="self-start bg-[#F1EEF8] text-[#6B6580] text-[10.5px] font-bold px-2 py-[3px] rounded-[6px]">
                      프리미엄 없음
                    </span>
                  )}
                  <div className="flex items-end justify-between mt-0.5">
                    <span className="text-[18px] font-black text-[#7B2FF7] tracking-[-0.3px]">
                      {item.price.toLocaleString()}만
                    </span>
                    <span className="border-[1.5px] border-[#7B2FF7] text-[#7B2FF7] text-[11px] font-extrabold px-3 py-[5px] rounded-full">
                      상세보기
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 분양 중인 단지 / 지식산업센터 섹션 */}
      <div className="px-5 pt-[24px] pb-[24px]">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[17px] font-extrabold text-[#1B1330] tracking-[-0.3px]">
            {selectedType === "KNOWLEDGE_INDUSTRY" ? "분양 가능 지식산업센터" : "분양 중인 단지"}
          </span>
          <span className="text-[12px] font-bold text-[#7B2FF7]">
            {loading
              ? "로딩 중..."
              : selectedType === "KNOWLEDGE_INDUSTRY"
                ? `${knowledgeCenters.length}개 단지`
                : `${filteredApiData.length}개 단지`}
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#7B2FF7] animate-spin mb-2" />
            <p className="text-[#9A93AC] text-sm">
              {selectedType === "KNOWLEDGE_INDUSTRY"
                ? "지식산업센터 정보를 불러오는 중..."
                : "청약홈에서 정보를 가져오는 중..."}
            </p>
          </div>
        ) : selectedType === "KNOWLEDGE_INDUSTRY" ? (
          knowledgeCenters.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[#9A93AC] text-sm">해당 지역 지식산업센터가 없습니다</p>
            </div>
          ) : (
            <>
              <div className="bg-[#FBF6E8] border border-[#EFE0B8] rounded-[14px] px-3 py-3 mb-3">
                <p className="text-[11.5px] font-medium text-[#8A6D1B]">
                  📊 한국산업단지공단 공공데이터 (2025-06-30 기준) — 분양/임대 가능 단지만
                </p>
              </div>
              <div className="flex flex-col gap-2.5">
                {knowledgeCenters.map((kc) => (
                  <Link
                    key={kc.id}
                    href={`/category/bunyanggwon/knowledge/${kc.id}`}
                    className="flex gap-[13px] bg-white rounded-[18px] p-[14px] shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.99] transition-transform"
                  >
                    <div
                      className="w-[58px] h-[58px] rounded-[14px] flex-none flex flex-col items-center justify-center"
                      style={{ background: "linear-gradient(160deg,#EDE9FE,#DCD0FA)" }}
                    >
                      <span className="text-[13px] font-black text-[#7B2FF7]">지산</span>
                      <span className="text-[9.5px] font-bold text-[#A78BDB]">
                        {kc.buildStatus || "-"}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col gap-[5px]">
                      <span className="text-[14px] font-extrabold text-[#1B1330] truncate">
                        {kc.centerName}
                      </span>
                      <div className="flex flex-wrap gap-[5px]">
                        <span className="bg-[#F1EEF8] text-[#6B6580] text-[10px] font-bold px-[7px] py-[2px] rounded-[5px]">
                          {kc.saleType}
                        </span>
                        {kc.complexName && (
                          <span className="bg-[#F1EEF8] text-[#6B6580] text-[10px] font-bold px-[7px] py-[2px] rounded-[5px]">
                            {kc.complexName}
                          </span>
                        )}
                        {kc.complexType && (
                          <span className="bg-[#F1EEF8] text-[#6B6580] text-[10px] font-bold px-[7px] py-[2px] rounded-[5px]">
                            {kc.complexType}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[11px] font-semibold text-[#9A93AC] truncate">
                          시행{" "}
                          <span className="text-[#7B2FF7] font-extrabold text-[12px]">
                            {kc.company || "-"}
                          </span>
                        </span>
                        <span className="text-[10.5px] font-semibold text-[#9A93AC] flex-none">
                          {kc.landArea > 0 && `${Math.round(kc.landArea).toLocaleString()}㎡`}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-[#DC2626] text-sm mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-[#7B2FF7] text-sm underline"
            >
              다시 시도
            </button>
          </div>
        ) : filteredApiData.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[#9A93AC] text-sm">해당 지역 분양 단지가 없습니다</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredApiData.map((item) => (
              <Link
                key={item.apiId}
                href={`/category/bunyanggwon/${item.apiId}`}
                className="flex gap-[13px] bg-white rounded-[18px] p-[14px] shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.99] transition-transform"
              >
                <div
                  className="w-[58px] h-[58px] rounded-[14px] flex-none flex flex-col items-center justify-center"
                  style={{ background: "linear-gradient(160deg,#EDE9FE,#DCD0FA)" }}
                >
                  <span className="text-[15px] font-black text-[#7B2FF7] leading-none">
                    {item.totalUnits}
                  </span>
                  <span className="text-[9.5px] font-bold text-[#A78BDB] mt-0.5">세대</span>
                </div>
                <div className="min-w-0 flex-1 flex flex-col gap-[5px]">
                  <span className="text-[14px] font-extrabold text-[#1B1330] truncate">
                    {item.propertyName}
                  </span>
                  <div className="flex flex-wrap gap-[5px]">
                    <span className="bg-[#F1EEF8] text-[#6B6580] text-[10px] font-bold px-[7px] py-[2px] rounded-[5px]">
                      {item.region}
                    </span>
                    {item.district && (
                      <span className="bg-[#F1EEF8] text-[#6B6580] text-[10px] font-bold px-[7px] py-[2px] rounded-[5px]">
                        {item.district}
                      </span>
                    )}
                    {item.builder && (
                      <span className="bg-[#F1EEF8] text-[#6B6580] text-[10px] font-bold px-[7px] py-[2px] rounded-[5px]">
                        {item.builder}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-semibold text-[#9A93AC]">
                      입주예정{" "}
                      <span className="text-[#7B2FF7] font-extrabold text-[12px]">
                        {item.moveInDate || "미정"}
                      </span>
                    </span>
                    <span className="text-[10.5px] font-semibold text-[#9A93AC] flex-none">
                      {formatApplicationPeriod(item.applicationStart, item.applicationEnd)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

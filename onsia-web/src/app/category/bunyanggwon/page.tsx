"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { mockBunyanggwon } from "@/lib/mock-bunyanggwon";
import { ChevronLeft, Loader2 } from "lucide-react";
import type { PropertyType } from "@/types/bunyanggwon";

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

export default function BunyanggwonPage() {
  const [selectedType, setSelectedType] = useState<PropertyType>("APARTMENT");
  const [selectedRegion, setSelectedRegion] = useState("전국");
  const [apiData, setApiData] = useState<ApiListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 데이터 가져오기
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // 지역 필터에 따른 API 호출
        const regionParam =
          selectedRegion === "전국"
            ? "경기"
            : selectedRegion === "경기도"
              ? "경기"
              : selectedRegion;

        const response = await fetch(
          `/api/bunyanggwon/list?region=${encodeURIComponent(regionParam)}&perPage=50`
        );

        if (!response.ok) {
          throw new Error("API 호출 실패");
        }

        const result = await response.json();

        if (result.success && result.data) {
          setApiData(result.data);
        } else {
          setApiData([]);
        }
      } catch (err) {
        console.error("분양권 목록 조회 오류:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다");
        setApiData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedRegion]);

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
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">분양권 전매</h1>
        </div>

        {/* 타입 필터 */}
        <div className="flex gap-2 px-5 pb-3">
          <button
            onClick={() => setSelectedType("APARTMENT")}
            className={`px-4 py-2 text-sm rounded-full font-medium ${
              selectedType === "APARTMENT"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            아파트
          </button>
          <button
            onClick={() => setSelectedType("OFFICETEL")}
            className={`px-4 py-2 text-sm rounded-full font-medium ${
              selectedType === "OFFICETEL"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            오피스텔
          </button>
          <button
            onClick={() => setSelectedType("KNOWLEDGE_INDUSTRY")}
            className={`px-4 py-2 text-sm rounded-full font-medium whitespace-nowrap ${
              selectedType === "KNOWLEDGE_INDUSTRY"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            지식산업센터
          </button>
        </div>

        {/* 지역 필터 */}
        <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-1.5 text-sm whitespace-nowrap rounded-full font-medium ${
                selectedRegion === region
                  ? "border-2 border-purple-600 text-purple-600"
                  : "border border-gray-300 text-gray-600"
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 pt-4 pb-10">
        {/* VIP 매물 섹션 (전매 매물) */}
        {vipItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-yellow-400 text-black font-bold px-2 py-0.5 rounded">
                VIP
              </span>
              <span className="text-sm font-bold text-gray-900">VIP 전매 매물</span>
            </div>

            <div className="space-y-3">
              {vipItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/category/bunyanggwon/${item.apiId || item.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 active:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-sm">이미지 영역</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <span className="text-xs bg-yellow-400 text-black font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                          VIP
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                          {item.propertyName}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        {item.address}
                      </p>
                      <div className="text-xs mb-2">
                        {item.premiumType === "MINUS" && (
                          <span className="text-red-600 font-medium">
                            마이너스P {item.premium.toLocaleString()}만
                          </span>
                        )}
                        {item.premiumType === "PREMIUM" && (
                          <span className="text-blue-600 font-medium">
                            프리미엄 +{item.premium.toLocaleString()}만
                          </span>
                        )}
                        {item.premiumType === "NONE" && (
                          <span className="text-gray-600 font-medium">
                            프리미엄 없음
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-purple-600">
                          {item.price.toLocaleString()}만
                        </div>
                        <span className="px-3 py-1 text-xs bg-purple-600 text-white rounded-full">
                          상세보기
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 전체 분양 단지 섹션 (청약홈 API) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-900">분양 중인 단지</span>
            <span className="text-xs text-gray-500">
              {loading ? "로딩 중..." : `${filteredApiData.length}개 단지`}
            </span>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
              <p className="text-gray-500 text-sm">청약홈에서 정보를 가져오는 중...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-red-500 text-sm mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-purple-600 text-sm underline"
              >
                다시 시도
              </button>
            </div>
          ) : filteredApiData.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-sm">해당 지역 분양 단지가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApiData.map((item) => (
                <Link
                  key={item.apiId}
                  href={`/category/bunyanggwon/${item.apiId}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 active:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-center">
                        <div className="text-purple-600 text-xs font-medium">
                          {item.totalUnits}
                        </div>
                        <div className="text-purple-400 text-[10px]">세대</div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                        {item.propertyName}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        {item.address}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {item.region}
                        </span>
                        {item.district && (
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {item.district}
                          </span>
                        )}
                        {item.builder && (
                          <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                            {item.builder}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500">입주예정</div>
                          <div className="text-sm font-bold text-purple-600">
                            {item.moveInDate || "미정"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">청약기간</div>
                          <div className="text-xs text-gray-700">
                            {item.applicationStart
                              ? `${item.applicationStart.slice(2, 4)}.${item.applicationStart.slice(4, 6)}.${item.applicationStart.slice(6)}`
                              : "-"}{" "}
                            ~{" "}
                            {item.applicationEnd
                              ? `${item.applicationEnd.slice(4, 6)}.${item.applicationEnd.slice(6)}`
                              : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}

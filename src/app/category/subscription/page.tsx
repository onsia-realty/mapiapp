"use client";

import { useState } from "react";
import Link from "next/link";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { mockSubscriptions } from "@/lib/mock-subscriptions";
import { ChevronLeft } from "lucide-react";

type SubscriptionType = "아파트" | "오피스텔" | "지식산업센터";
const REGIONS = ["전국", "서울", "경기도", "인천", "부산", "대전"] as const;
type Region = (typeof REGIONS)[number];

function regionMatches(address: string | undefined, region: Region): boolean {
  if (region === "전국" || !address) return true;
  const map: Record<Exclude<Region, "전국">, string[]> = {
    서울: ["서울"],
    경기도: ["경기"],
    인천: ["인천"],
    부산: ["부산"],
    대전: ["대전"],
  };
  return map[region as Exclude<Region, "전국">].some((kw) =>
    address.includes(kw)
  );
}

export default function SubscriptionPage() {
  const [selectedType, setSelectedType] = useState<SubscriptionType>("아파트");
  const [selectedRegion, setSelectedRegion] = useState<Region>("전국");

  // 지역 필터링 (타입 필터는 mockSubscriptions에 type 필드가 없어 우선 지역만)
  const filtered = mockSubscriptions.filter((s) =>
    regionMatches(s.address, selectedRegion)
  );

  return (
    <MobileLayout>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">신규분양 청약홈</h1>
        </div>

        {/* 타입 필터 */}
        <div className="flex gap-2 px-5 pb-3">
          {(["아파트", "오피스텔", "지식산업센터"] as SubscriptionType[]).map(
            (t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-4 py-2 text-sm rounded-full font-medium whitespace-nowrap ${
                  selectedType === t
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>

        {/* 지역 필터 */}
        <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
          {REGIONS.map((region) => (
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

      {/* 지식산업센터 탭일 때 안내 */}
      {selectedType === "지식산업센터" && (
        <div className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800 mb-1">
            📊 지식산업센터 데이터는 분양정보 페이지에서 확인하세요.
          </p>
          <Link
            href="/category/bunyanggwon"
            className="text-xs text-amber-700 underline font-medium"
          >
            → 분양정보 페이지로 이동 (977개 단지)
          </Link>
        </div>
      )}

      {/* 오피스텔 탭일 때 안내 */}
      {selectedType === "오피스텔" && (
        <div className="mx-5 mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            오피스텔 분양정보는 준비 중입니다.
          </p>
        </div>
      )}

      {/* VIP 매물 (실제 데이터로 링크) */}
      {selectedType === "아파트" && filtered.length > 0 && (
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-yellow-400 text-black font-bold px-2 py-0.5 rounded">
              VIP
            </span>
            <span className="text-sm font-bold text-gray-900">VIP 매물</span>
          </div>

          <div className="space-y-3">
            {filtered.slice(0, 2).map((sub) => (
              <Link
                key={`vip-${sub.id}`}
                href={`/category/subscription/${sub.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 active:bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-sm">이미지</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-xs bg-yellow-400 text-black font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                        VIP
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                        {sub.houseName}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                      {sub.address}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-purple-600">
                        {sub.avgPrice?.toLocaleString()}만원
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

      {/* 전체 매물 섹션 */}
      {selectedType === "아파트" && (
        <div className="px-5 pt-6 pb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-900">전체 매물</span>
            <span className="text-xs text-gray-500">
              {filtered.length}개 단지
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-sm">
                {selectedRegion} 지역 분양 단지가 없습니다
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((subscription) => (
                <Link
                  key={subscription.id}
                  href={`/category/subscription/${subscription.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 active:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-xs text-center px-2">
                        이미지
                        <br />
                        영역
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        {subscription.status === "upcoming" && (
                          <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded flex-shrink-0">
                            오늘
                          </span>
                        )}
                        {subscription.status === "ended" && (
                          <span className="text-xs bg-gray-400 text-white px-1.5 py-0.5 rounded flex-shrink-0">
                            마감
                          </span>
                        )}
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                          {subscription.houseName}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        {subscription.address}
                      </p>
                      <div className="text-xs text-gray-500 mb-2">
                        {subscription.totalHouseholds}세대 | {subscription.moveInDate}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500">평균 분양가</div>
                          <div className="text-sm font-bold text-purple-600">
                            {subscription.avgPrice?.toLocaleString()}만원
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">평당가</div>
                          <div className="text-sm font-bold text-gray-900">
                            {subscription.avgPricePerPyeong?.toLocaleString()}만원
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
      )}
    </MobileLayout>
  );
}

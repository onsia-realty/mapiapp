"use client";

import { useState } from "react";
import Link from "next/link";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { mockBunyanggwon } from "@/lib/mock-bunyanggwon";
import { ChevronLeft } from "lucide-react";
import type { PropertyType } from "@/types/bunyanggwon";

export default function BunyanggwonPage() {
  const [selectedType, setSelectedType] = useState<PropertyType>("APARTMENT");
  const [selectedRegion, setSelectedRegion] = useState("전국");

  // 타입별 필터링
  const filteredByType = mockBunyanggwon.filter((item) => {
    if (selectedType === "APARTMENT") return item.type === "APARTMENT";
    if (selectedType === "OFFICETEL") return item.type === "OFFICETEL";
    if (selectedType === "KNOWLEDGE_INDUSTRY") return item.type === "KNOWLEDGE_INDUSTRY";
    return true;
  });

  // 지역별 필터링
  const filteredData = filteredByType.filter((item) => {
    if (selectedRegion === "전국") return true;
    return item.region === selectedRegion;
  });

  // VIP와 일반 매물 분리
  const vipItems = filteredData.filter((item) => item.salesStatus === "VIP");
  const generalItems = filteredData.filter((item) => item.salesStatus === "GENERAL");

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
        {/* VIP 매물 섹션 */}
        {vipItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-yellow-400 text-black font-bold px-2 py-0.5 rounded">
                VIP
              </span>
              <span className="text-sm font-bold text-gray-900">VIP 매물</span>
            </div>

            <div className="space-y-3">
              {vipItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/category/bunyanggwon/${item.id}`}
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
                        <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded-full">
                          이미지 영역
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 전체 매물 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-900">전체 매물</span>
            <span className="text-xs text-gray-500">
              {generalItems.length}개 매물
            </span>
          </div>

          {generalItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-sm">매물이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {generalItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/category/bunyanggwon/${item.id}`}
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
                      <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                        {item.propertyName} {item.pyeong}평형
                      </h3>
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
                          <span className="text-green-600 font-medium">
                            분양가 그대로
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500">매매가</div>
                          <div className="text-sm font-bold text-purple-600">
                            {item.price.toLocaleString()}만원
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">평당가</div>
                          <div className="text-sm font-bold text-gray-900">
                            {item.pricePerPyeong?.toLocaleString()}만원
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

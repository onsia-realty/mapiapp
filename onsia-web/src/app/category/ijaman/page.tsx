"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChevronLeft } from "lucide-react";

// Mock 데이터
const mockIjaman = [
  {
    id: "1",
    propertyName: "힐스테이트 강남",
    address: "서울시 강남구 역삼동",
    type: "OFFICETEL",
    exclusiveArea: 28.5,
    price: 35000,
    monthlyRent: 80,
    interestRate: 3.5,
    region: "서울",
    isHot: true,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    propertyName: "래미안 퍼스티지",
    address: "서울시 서초구 반포동",
    type: "OFFICETEL",
    exclusiveArea: 32.5,
    price: 42000,
    monthlyRent: 95,
    interestRate: 3.2,
    region: "서울",
    isHot: false,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop",
  },
];

export default function IjamanPage() {
  const [selectedRegion, setSelectedRegion] = useState("전국");

  const filteredData = mockIjaman.filter((item) => {
    if (selectedRegion === "전국") return true;
    return item.region === selectedRegion;
  });

  const hotItems = filteredData.filter((item) => item.isHot);
  const generalItems = filteredData.filter((item) => !item.isHot);

  const regions = ["전국", "서울", "경기도", "인천", "부산", "대전"];

  return (
    <MobileLayout>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">이자만 (급매물임대)</h1>
          <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            HOT
          </span>
        </div>

        {/* 지역 필터 */}
        <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-1.5 text-sm whitespace-nowrap rounded-full font-medium ${
                selectedRegion === region
                  ? "border-2 border-red-500 text-red-600"
                  : "border border-gray-300 text-gray-600"
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 pt-4 pb-10">
        {/* 안내 배너 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-6">
          <div className="text-sm font-bold text-gray-900 mb-2">
            💰 이자만 납부로 투자하세요!
          </div>
          <div className="text-xs text-gray-600">
            원금 상환 없이 이자만 납부하고 월세 수익을 받는 투자형 매물입니다.
          </div>
        </div>

        {/* HOT 매물 섹션 */}
        {hotItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded">
                HOT
              </span>
              <span className="text-sm font-bold text-gray-900">급매물</span>
            </div>

            <div className="space-y-3">
              {hotItems.map((item) => (
                <div
                  key={item.id}
                  className="block bg-white rounded-xl border border-red-200 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.propertyName}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <span className="text-xs bg-red-500 text-white font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                          HOT
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                          {item.propertyName}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        {item.address}
                      </p>
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">전용면적</span>
                          <span className="text-gray-900 font-medium">
                            {item.exclusiveArea}㎡ (약 {Math.round(item.exclusiveArea / 3.3)}평)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">이자율</span>
                          <span className="text-red-600 font-bold">
                            연 {item.interestRate}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500">보증금</div>
                          <div className="text-sm font-bold text-gray-900">
                            {item.price.toLocaleString()}만
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">월세</div>
                          <div className="text-sm font-bold text-red-600">
                            {item.monthlyRent}만
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                <div
                  key={item.id}
                  className="block bg-white rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.propertyName}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                        {item.propertyName}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        {item.address}
                      </p>
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">전용면적</span>
                          <span className="text-gray-900 font-medium">
                            {item.exclusiveArea}㎡ (약 {Math.round(item.exclusiveArea / 3.3)}평)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">이자율</span>
                          <span className="text-red-600 font-bold">
                            연 {item.interestRate}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500">보증금</div>
                          <div className="text-sm font-bold text-gray-900">
                            {item.price.toLocaleString()}만
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">월세</div>
                          <div className="text-sm font-bold text-red-600">
                            {item.monthlyRent}만
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}

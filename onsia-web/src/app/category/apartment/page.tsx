"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChevronLeft } from "lucide-react";

// Mock 데이터
const mockApartment = [
  {
    id: "1",
    propertyName: "래미안 퍼스티지",
    address: "서울시 서초구 반포동",
    dealType: "SALE",
    price: 120000,
    exclusiveArea: 114.5,
    floor: "23층/35층",
    region: "서울",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    propertyName: "힐스테이트 강남",
    address: "서울시 강남구 역삼동",
    dealType: "RENT",
    deposit: 50000,
    monthlyRent: 150,
    exclusiveArea: 84.9,
    floor: "15층/25층",
    region: "서울",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop",
  },
];

export default function ApartmentPage() {
  const [selectedType, setSelectedType] = useState<"SALE" | "RENT" | "MONTHLY">("SALE");
  const [selectedRegion, setSelectedRegion] = useState("전국");

  const filteredData = mockApartment.filter((item) => {
    const matchesType = item.dealType === selectedType;
    const matchesRegion = selectedRegion === "전국" || item.region === selectedRegion;
    return matchesType && matchesRegion;
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
          <h1 className="text-lg font-bold text-gray-900">아파트</h1>
        </div>

        {/* 거래 유형 필터 */}
        <div className="flex gap-2 px-5 pb-3">
          <button
            onClick={() => setSelectedType("SALE")}
            className={`px-4 py-2 text-sm rounded-full font-medium ${
              selectedType === "SALE"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            매매
          </button>
          <button
            onClick={() => setSelectedType("RENT")}
            className={`px-4 py-2 text-sm rounded-full font-medium ${
              selectedType === "RENT"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            전세
          </button>
          <button
            onClick={() => setSelectedType("MONTHLY")}
            className={`px-4 py-2 text-sm rounded-full font-medium ${
              selectedType === "MONTHLY"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            월세
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
                  ? "border-2 border-blue-600 text-blue-600"
                  : "border border-gray-300 text-gray-600"
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 pt-4 pb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-900">전체 매물</span>
          <span className="text-xs text-gray-500">
            {filteredData.length}개 매물
          </span>
        </div>

        {filteredData.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-sm">매물이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="block bg-white rounded-xl border border-gray-200 p-4"
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
                        <span className="text-gray-500">층수</span>
                        <span className="text-gray-900 font-medium">
                          {item.floor}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {item.dealType === "SALE" ? (
                        <div>
                          <div className="text-xs text-gray-500">매매가</div>
                          <div className="text-sm font-bold text-blue-600">
                            {item.price?.toLocaleString()}만원
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="text-xs text-gray-500">보증금</div>
                            <div className="text-sm font-bold text-gray-900">
                              {item.deposit?.toLocaleString()}만
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">월세</div>
                            <div className="text-sm font-bold text-blue-600">
                              {item.monthlyRent}만
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

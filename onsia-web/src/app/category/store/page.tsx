"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChevronLeft } from "lucide-react";

const mockStore = [
  {
    id: "1",
    propertyName: "강남역 1층 상가",
    address: "서울시 강남구 역삼동",
    dealType: "MONTHLY",
    deposit: 30000,
    monthlyRent: 500,
    exclusiveArea: 45.5,
    floor: "1층/10층",
    region: "서울",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop",
  },
];

export default function StorePage() {
  const [selectedType, setSelectedType] = useState<"SALE" | "RENT" | "MONTHLY">("MONTHLY");
  const [selectedRegion, setSelectedRegion] = useState("전국");

  const filteredData = mockStore.filter((item) => {
    const matchesType = item.dealType === selectedType;
    const matchesRegion = selectedRegion === "전국" || item.region === selectedRegion;
    return matchesType && matchesRegion;
  });

  const regions = ["전국", "서울", "경기도", "인천", "부산", "대전"];

  return (
    <MobileLayout>
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">상가</h1>
        </div>

        <div className="flex gap-2 px-5 pb-3">
          <button
            onClick={() => setSelectedType("SALE")}
            className={`px-4 py-2 text-sm rounded-full font-medium ${
              selectedType === "SALE" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            매매
          </button>
          <button
            onClick={() => setSelectedType("RENT")}
            className={`px-4 py-2 text-sm rounded-full font-medium ${
              selectedType === "RENT" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            전세
          </button>
          <button
            onClick={() => setSelectedType("MONTHLY")}
            className={`px-4 py-2 text-sm rounded-full font-medium ${
              selectedType === "MONTHLY" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            월세
          </button>
        </div>

        <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-1.5 text-sm whitespace-nowrap rounded-full font-medium ${
                selectedRegion === region
                  ? "border-2 border-orange-600 text-orange-600"
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
          <span className="text-xs text-gray-500">{filteredData.length}개 매물</span>
        </div>

        {filteredData.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-sm">매물이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((item) => (
              <div key={item.id} className="block bg-white rounded-xl border border-gray-200 p-4">
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
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{item.propertyName}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-1">{item.address}</p>
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">전용면적</span>
                        <span className="text-gray-900 font-medium">
                          {item.exclusiveArea}㎡ (약 {Math.round(item.exclusiveArea / 3.3)}평)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">층수</span>
                        <span className="text-gray-900 font-medium">{item.floor}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500">보증금</div>
                        <div className="text-sm font-bold text-gray-900">{item.deposit?.toLocaleString()}만</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">월세</div>
                        <div className="text-sm font-bold text-orange-600">{item.monthlyRent}만</div>
                      </div>
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

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChevronLeft, Search } from "lucide-react";

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

const TYPE_TABS: { value: "SALE" | "RENT" | "MONTHLY"; label: string }[] = [
  { value: "SALE", label: "매매" },
  { value: "RENT", label: "전세" },
  { value: "MONTHLY", label: "월세" },
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
      {/* 다크 헤더 */}
      <header className="bg-[#1B1330] px-5 py-[18px] rounded-b-[26px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <ChevronLeft className="w-[22px] h-[22px] text-white" strokeWidth={2.2} />
            </Link>
            <span className="text-[19px] font-extrabold tracking-[-0.4px] text-white">
              아파트
            </span>
          </div>
          <Search className="w-5 h-5 text-white" strokeWidth={2} />
        </div>

        {/* 거래 유형 필터 (카테고리 필 탭) */}
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

      <div className="px-5 pt-[24px] pb-[24px]">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[17px] font-extrabold text-[#1B1330] tracking-[-0.3px]">
            전체 매물
          </span>
          <span className="text-[12px] font-bold text-[#7B2FF7]">
            {filteredData.length}개 매물
          </span>
        </div>

        {filteredData.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[#9A93AC] text-sm">매물이 없습니다</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="block bg-white rounded-[18px] p-[14px] shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.99] transition-transform"
              >
                <div className="flex items-start gap-[13px]">
                  <div
                    className="relative w-24 h-24 rounded-[14px] overflow-hidden flex-none"
                    style={{ background: "linear-gradient(160deg,#EDE9FE,#DCD0FA)" }}
                  >
                    <Image
                      src={item.image}
                      alt={item.propertyName}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-extrabold text-[#1B1330] mb-1 truncate">
                      {item.propertyName}
                    </h3>
                    <p className="text-[11px] font-medium text-[#9A93AC] mb-2 truncate">
                      {item.address}
                    </p>
                    <div className="flex flex-wrap gap-[5px] mb-2">
                      <span className="bg-[#F1EEF8] text-[#6B6580] text-[10px] font-bold px-[7px] py-[2px] rounded-[5px]">
                        {item.exclusiveArea}㎡ (약 {Math.round(item.exclusiveArea / 3.3)}평)
                      </span>
                      <span className="bg-[#F1EEF8] text-[#6B6580] text-[10px] font-bold px-[7px] py-[2px] rounded-[5px]">
                        {item.floor}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      {item.dealType === "SALE" ? (
                        <div>
                          <div className="text-[11px] font-semibold text-[#9A93AC]">매매가</div>
                          <div className="text-[15px] font-extrabold text-[#7B2FF7] tracking-[-0.3px]">
                            {item.price?.toLocaleString()}만원
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="text-[11px] font-semibold text-[#9A93AC]">보증금</div>
                            <div className="text-[15px] font-extrabold text-[#1B1330]">
                              {item.deposit?.toLocaleString()}만
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[11px] font-semibold text-[#9A93AC]">월세</div>
                            <div className="text-[15px] font-extrabold text-[#7B2FF7]">
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

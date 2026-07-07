"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChevronLeft, Search } from "lucide-react";

const mockOfficetel = [
  {
    id: "1",
    propertyName: "힐스테이트 강남 오피스텔",
    address: "서울시 강남구 역삼동",
    dealType: "MONTHLY",
    deposit: 5000,
    monthlyRent: 80,
    exclusiveArea: 28.5,
    floor: "8층/15층",
    region: "서울",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop",
  },
];

const DEAL_TABS: { value: "SALE" | "RENT" | "MONTHLY"; label: string }[] = [
  { value: "SALE", label: "매매" },
  { value: "RENT", label: "전세" },
  { value: "MONTHLY", label: "월세" },
];

export default function OfficetelPage() {
  const [selectedType, setSelectedType] = useState<"SALE" | "RENT" | "MONTHLY">("MONTHLY");
  const [selectedRegion, setSelectedRegion] = useState("전국");

  const filteredData = mockOfficetel.filter((item) => {
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
              오피스텔
            </span>
          </div>
          <Search className="w-5 h-5 text-white" strokeWidth={2} />
        </div>

        {/* 거래유형 필터 (카테고리 필 탭) */}
        <div className="flex gap-2">
          {DEAL_TABS.map((tab) => {
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

      {/* 매물 리스트 섹션 */}
      <div className="px-5 pt-[22px] pb-[24px]">
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
                className="bg-white rounded-[18px] p-[14px] shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.99] transition-transform"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="relative w-24 h-24 rounded-[14px] overflow-hidden flex-shrink-0"
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
                    <h3 className="text-[14px] font-extrabold text-[#1B1330] mb-1 line-clamp-1">
                      {item.propertyName}
                    </h3>
                    <p className="text-[11px] text-[#9A93AC] mb-2 line-clamp-1">{item.address}</p>
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#9A93AC]">전용면적</span>
                        <span className="text-[#1B1330] font-semibold">
                          {item.exclusiveArea}㎡ (약 {Math.round(item.exclusiveArea / 3.3)}평)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#9A93AC]">층수</span>
                        <span className="text-[#1B1330] font-semibold">{item.floor}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-[#9A93AC]">보증금</div>
                        <div className="text-[14px] font-extrabold text-[#1B1330]">
                          {item.deposit?.toLocaleString()}만
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-[#9A93AC]">월세</div>
                        <div className="text-[14px] font-extrabold text-[#7B2FF7]">
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
    </MobileLayout>
  );
}

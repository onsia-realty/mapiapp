"use client";

import { useState } from "react";
import Image from "next/image";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

const CATEGORY_TABS = ["분양권", "이자만", "아파트", "오피스텔", "사무실", "상가"];

interface FavoriteItem {
  id: string;
  isPremium: boolean;
  title: string;
  typeInfo?: string;
  supply: string;
  direction: string;
  price: string;
  pText: string;
  pColor: "gray" | "red";
  salePrice: string;
  image: string;
}

const THUMB = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop";

// Mock — 개발사 앱 관심목록 화면(캡처 70)과 동일 데이터
const FAVORITES: FavoriteItem[] = [
  {
    id: "1",
    isPremium: false,
    title: "101동 1201호",
    supply: "공급 60m²",
    direction: "남향",
    price: "매매 2.5억",
    pText: "P 없음",
    pColor: "gray",
    salePrice: "분양가 2.5억",
    image: THUMB,
  },
  {
    id: "2",
    isPremium: true,
    title: "301동 1001호",
    typeInfo: "16A타입 · 1/10층",
    supply: "공급 123.5m²",
    direction: "남향",
    price: "매매 3.3억",
    pText: "3,000만",
    pColor: "red",
    salePrice: "분양가 3억",
    image: THUMB,
  },
];

export default function FavoritesPage() {
  const [mainTab, setMainTab] = useState<"관심" | "최근 본">("관심");
  const [activeCategory, setActiveCategory] = useState("분양권");

  const items = mainTab === "관심" && activeCategory === "분양권" ? FAVORITES : [];

  return (
    <MobileLayout>
      <PageHeader title="관심목록">
        {/* 관심 / 최근 본 탭 */}
        <div className="grid grid-cols-2">
          {(["관심", "최근 본"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMainTab(tab)}
              className={cn(
                "py-3 text-[14.5px] border-b-2 transition-colors",
                mainTab === tab
                  ? "border-[#7B2FF7] text-[#1B1330] font-extrabold"
                  : "border-transparent text-[#A49BBE] font-semibold"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 카테고리 칩 */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveCategory(tab)}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors",
                activeCategory === tab
                  ? "bg-[#1B1330] text-white border-[#1B1330]"
                  : "bg-white text-[#6E6787] border-[#E9E4F5]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="px-4 pt-4 pb-6 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-4 bg-white rounded-[20px] shadow-[0_2px_10px_rgba(27,19,48,.05)]"
            >
              <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-gray-200">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="96px" />
                {item.isPremium && (
                  <span className="absolute top-0 left-0 bg-[#FF3B5C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-br-xl">
                    프리미엄
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[15px] font-bold text-[#1B1330]">{item.title}</span>
                  {item.typeInfo && <span className="text-[11px] text-[#9A93AC]">{item.typeInfo}</span>}
                </div>
                <div className="text-[12.5px] text-[#9A93AC] mt-1">
                  {item.supply} · {item.direction}
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-base font-extrabold text-[#1B1330]">{item.price}</span>
                  <span
                    className={cn(
                      "text-[13px]",
                      item.pColor === "red" ? "text-[#FF3B5C] font-bold" : "text-[#9A93AC] font-medium"
                    )}
                  >
                    {item.pText}
                  </span>
                </div>
                <div className="text-[12.5px] text-[#9A93AC] mt-0.5">{item.salePrice}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center text-[#A49BBE] text-sm">
            {mainTab === "관심" ? "관심 매물이 없습니다." : "최근 본 매물이 없습니다."}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

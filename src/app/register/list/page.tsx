"use client";

import { useState } from "react";
import Image from "next/image";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

const CATEGORY_TABS = ["분양권", "이자만", "아파트", "오피스텔", "사무실", "상가"];

type PBadge = "none" | "minus" | "premium";

interface MyListing {
  id: string;
  status: "승인" | "접수";
  pBadge: PBadge;
  title: string;
  typeInfo?: string;
  supply: string;
  direction: string;
  price: string;
  pText: string;
  salePrice: string;
  image: string;
}

const THUMB = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop";

// Mock — 개발사 앱 매물조회 화면(캡처 44)과 동일 데이터
const MY_LISTINGS: MyListing[] = [
  { id: "1", status: "승인", pBadge: "none", title: "101동 1201호", supply: "공급 60㎡", direction: "남향", price: "매매 2.5억", pText: "P 없음", salePrice: "분양가 2.5억", image: THUMB },
  { id: "2", status: "승인", pBadge: "none", title: "101동 1201호", supply: "공급 60㎡", direction: "남향", price: "매매 2.5억", pText: "P 없음", salePrice: "분양가 2.5억", image: THUMB },
  { id: "3", status: "접수", pBadge: "minus", title: "101동 1201호", typeInfo: "100타입 · 1/24층", supply: "공급 0㎡", direction: "남향", price: "매매 1.1억", pText: "-1,000만", salePrice: "분양가 1.2억", image: THUMB },
  { id: "4", status: "승인", pBadge: "none", title: "101동 123호", supply: "공급 59㎡", direction: "남향", price: "매매 2.5억", pText: "P 없음", salePrice: "분양가 2.5억", image: THUMB },
  { id: "5", status: "승인", pBadge: "none", title: "12동 121호", supply: "공급 123㎡", direction: "남향", price: "매매 2.5억", pText: "P 없음", salePrice: "분양가 2.5억", image: THUMB },
  { id: "6", status: "접수", pBadge: "premium", title: "101동 1002호", typeInfo: "47C타입 · 10/36층", supply: "공급 90㎡", direction: "남향", price: "매매 1.2억", pText: "2,000만", salePrice: "분양가 1억", image: THUMB },
  { id: "7", status: "접수", pBadge: "premium", title: "101동 101호", typeInfo: "39타입 · 1/36층", supply: "공급 0㎡", direction: "남향", price: "매매 1.1억", pText: "1,000만", salePrice: "분양가 1억", image: THUMB },
];

export default function MyListingsPage() {
  const [activeTab, setActiveTab] = useState("분양권");

  return (
    <MobileLayout>
      <PageHeader title="매물 조회">
        {/* 카테고리 탭 */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors",
                activeTab === tab
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
        {activeTab === "분양권" ? (
          MY_LISTINGS.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-4 bg-white rounded-[20px] shadow-[0_2px_10px_rgba(27,19,48,.05)]"
            >
              <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-gray-200">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="96px" />
                {item.pBadge === "minus" && (
                  <span className="absolute top-0 left-0 bg-[#2563EB] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-br-xl">
                    마이너스P
                  </span>
                )}
                {item.pBadge === "premium" && (
                  <span className="absolute top-0 left-0 bg-[#FF3B5C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-br-xl">
                    프리미엄
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "text-[10px] font-extrabold px-2 py-0.5 rounded-full",
                      item.status === "승인"
                        ? "bg-[#E7F7EF] text-[#059669]"
                        : "bg-[#E8F0FE] text-[#2563EB]"
                    )}
                  >
                    {item.status}
                  </span>
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
                      "text-[13px] font-bold",
                      item.pBadge === "minus" && "text-[#2563EB]",
                      item.pBadge === "premium" && "text-[#FF3B5C]",
                      item.pBadge === "none" && "text-[#9A93AC] font-medium"
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
          <div className="py-24 text-center text-[#A49BBE] text-sm">등록된 매물이 없습니다.</div>
        )}
      </div>
    </MobileLayout>
  );
}

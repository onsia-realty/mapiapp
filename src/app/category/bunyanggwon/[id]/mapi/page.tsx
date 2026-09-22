"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { mockBunyanggwon } from "@/lib/mock-bunyanggwon";
import { getMapiListingsByBunyanggwonId } from "@/lib/mock-mapi";
import { ChevronLeft, ChevronDown, Eye, Heart } from "lucide-react";
import { MapiListing } from "@/types/bunyanggwon";

export default function MapiListPage() {
  const params = useParams();
  const [sortType, setSortType] = useState<"latest" | "price_low" | "price_high">("latest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const mockItem = mockBunyanggwon.find((item) => item.id === params.id || item.apiId === params.id);
  const propertyName = mockItem?.propertyName ?? "";
  const mapiListings: MapiListing[] = getMapiListingsByBunyanggwonId(
    mockItem?.id || (params.id as string)
  );

  // 정렬된 매물 목록
  const sortedListings = [...mapiListings].sort((a, b) => {
    switch (sortType) {
      case "price_low":
        return a.salePrice - b.salePrice;
      case "price_high":
        return b.salePrice - a.salePrice;
      case "latest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    if (price >= 10000) {
      const billion = Math.floor(price / 10000);
      const remainder = price % 10000;
      return remainder > 0 ? `${billion}억 ${remainder.toLocaleString()}` : `${billion}억`;
    }
    return `${price.toLocaleString()}만원`;
  };

  // 프리미엄 표시
  const formatPremium = (premium: number, premiumType: string) => {
    if (premiumType === "NONE" || premium === 0) {
      return { text: "P 없음", color: "text-gray-600" };
    }
    if (premium > 0) {
      return { text: `+${premium.toLocaleString()}만`, color: "text-red-600" };
    }
    return { text: `${premium.toLocaleString()}만`, color: "text-blue-600" };
  };

  return (
    <MobileLayout>
      {/* 헤더 */}
      <header className="sticky top-0 z-30 bg-[var(--brand-ink)] text-white">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href={`/category/bunyanggwon/${params.id}`}>
            <ChevronLeft className="w-6 h-6 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-extrabold text-white line-clamp-1">
              마피 매물
            </h1>
            <p className="text-xs text-white/60 line-clamp-1">{propertyName}</p>
          </div>
        </div>
      </header>

      {/* 필터/정렬 바 */}
      <div className="sticky top-[60px] z-20 bg-white/95 backdrop-blur-xl border-b border-[var(--line)] px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            총 <span className="font-extrabold text-[var(--brand-purple)]">{mapiListings.length}</span>건
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 text-sm text-gray-700"
            >
              {sortType === "latest" && "최신순"}
              {sortType === "price_low" && "낮은가격순"}
              {sortType === "price_high" && "높은가격순"}
              <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
            </button>
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20 min-w-[120px]">
                <button
                  onClick={() => { setSortType("latest"); setShowSortDropdown(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm ${sortType === "latest" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  최신순
                </button>
                <button
                  onClick={() => { setSortType("price_low"); setShowSortDropdown(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm ${sortType === "price_low" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  낮은가격순
                </button>
                <button
                  onClick={() => { setSortType("price_high"); setShowSortDropdown(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm ${sortType === "price_high" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  높은가격순
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 매물 목록 */}
      <div className="bg-[var(--surface-muted)] px-5 py-4 pb-6">
        {sortedListings.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-500 mb-2">등록된 마피 매물이 없습니다.</p>
              <Link
                href={`/category/bunyanggwon/${params.id}`}
                className="text-blue-600 underline text-sm"
              >
                단지 상세로 돌아가기
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedListings.map((listing) => {
              const premiumInfo = formatPremium(listing.premium, listing.premiumType);
              return (
                <Link
                  key={listing.id}
                  href={`/category/bunyanggwon/${params.id}/mapi/${listing.id}`}
                  className="block rounded-[18px] border border-[var(--line)] bg-white p-4 shadow-[0_6px_18px_rgba(27,23,38,.045)] active:scale-[.99] transition-transform"
                >
                  <div className="flex gap-4">
                    {/* 썸네일 */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      {listing.images[0] ? (
                        <Image
                          src={listing.images[0]}
                          alt={`${listing.dong}동 ${listing.ho}호`}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          이미지 없음
                        </div>
                      )}
                      {/* 프리미엄 뱃지 */}
                      {listing.premiumType !== "NONE" && (
                        <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          listing.premiumType === "MINUS" ? "bg-blue-600 text-white" : "bg-red-600 text-white"
                        }`}>
                          {listing.premiumType === "MINUS" ? "마이너스P" : "프리미엄"}
                        </div>
                      )}
                    </div>

                    {/* 매물 정보 */}
                    <div className="flex-1 min-w-0">
                      {/* 동호수 및 타입 */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">
                          {listing.dong}동 {listing.ho}호
                        </span>
                        <span className="text-xs text-gray-500">
                          {listing.type}타입 · {listing.floor}/{listing.totalFloors}층
                        </span>
                      </div>

                      {/* 면적 및 방향 */}
                      <div className="text-xs text-gray-600 mb-2">
                        전용 {listing.exclusiveArea}㎡ · {listing.direction}
                      </div>

                      {/* 가격 정보 */}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-base font-bold text-gray-900">
                          {formatPrice(listing.salePrice)}
                        </span>
                        <span className={`text-xs font-medium ${premiumInfo.color}`}>
                          {premiumInfo.text}
                        </span>
                      </div>

                      {/* 분양가 */}
                      <div className="text-xs text-gray-500 mb-2">
                        분양가 {formatPrice(listing.originalPrice)}
                      </div>

                      {/* 조회수/좋아요 */}
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {listing.viewCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" />
                          {listing.likeCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}

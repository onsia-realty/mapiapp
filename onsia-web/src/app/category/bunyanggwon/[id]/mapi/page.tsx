"use client";

import { useState, useEffect } from "react";
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
  const [mapiListings, setMapiListings] = useState<MapiListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyName, setPropertyName] = useState("");
  const [sortType, setSortType] = useState<"latest" | "price_low" | "price_high">("latest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    // Mock 데이터에서 해당 단지 찾기
    const mockItem = mockBunyanggwon.find((b) => b.id === params.id);
    if (mockItem) {
      setPropertyName(mockItem.propertyName);
    }

    // 마피 매물 조회
    const listings = getMapiListingsByBunyanggwonId(params.id as string);
    setMapiListings(listings);
    setLoading(false);
  }, [params.id]);

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

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">매물을 불러오는 중...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href={`/category/bunyanggwon/${params.id}`}>
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900 line-clamp-1">
              마피 매물
            </h1>
            <p className="text-xs text-gray-600 line-clamp-1">{propertyName}</p>
          </div>
        </div>
      </header>

      {/* 필터/정렬 바 */}
      <div className="sticky top-[60px] z-10 bg-white border-b border-gray-200 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            총 <span className="font-bold text-blue-600">{mapiListings.length}</span>건
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
      <div className="pb-6">
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
          <div className="divide-y divide-gray-200">
            {sortedListings.map((listing) => {
              const premiumInfo = formatPremium(listing.premium, listing.premiumType);
              return (
                <Link
                  key={listing.id}
                  href={`/category/bunyanggwon/${params.id}/mapi/${listing.id}`}
                  className="block px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
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

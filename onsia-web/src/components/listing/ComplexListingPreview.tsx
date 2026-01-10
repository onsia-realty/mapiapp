"use client";

import Link from "next/link";
import { ChevronRight, Eye, Heart } from "lucide-react";
import {
  RealEstateListing,
  formatListingPrice,
  getListingTypeLabel,
  getListingTypeColor,
} from "@/lib/mock-listings";

interface ComplexListingPreviewProps {
  listings: RealEstateListing[];
  complexId: string;
  maxItems?: number;
}

export function ComplexListingPreview({
  listings,
  complexId,
  maxItems = 3,
}: ComplexListingPreviewProps) {
  // 매물이 없으면 표시하지 않음
  if (!listings || listings.length === 0) {
    return (
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900">이 단지 매물</h2>
          <span className="text-xs text-gray-500">0건</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-sm text-gray-500">등록된 매물이 없습니다</p>
          <p className="text-xs text-gray-400 mt-1">
            새로운 매물이 등록되면 알려드릴게요
          </p>
        </div>
      </div>
    );
  }

  const displayListings = listings.slice(0, maxItems);

  return (
    <div className="px-5 pt-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900">이 단지 매물</h2>
        <span className="text-xs text-blue-600 font-medium">{listings.length}건</span>
      </div>

      {/* 매물 카드 리스트 */}
      <div className="space-y-3">
        {displayListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
          >
            {/* 상단: 거래유형 뱃지 + 동/호 정보 */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded font-medium ${getListingTypeColor(
                    listing.listingType
                  )}`}
                >
                  {getListingTypeLabel(listing.listingType)}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {listing.dong}동 {listing.ho}호
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {listing.type} · {listing.floor}층
              </span>
            </div>

            {/* 가격 정보 */}
            <div className="mb-2">
              {listing.listingType === "SALE" && (
                <span className="text-base font-bold text-gray-900">
                  {formatListingPrice(listing.salePrice || 0)}
                </span>
              )}
              {listing.listingType === "JEONSE" && (
                <span className="text-base font-bold text-gray-900">
                  {formatListingPrice(listing.deposit || 0)}
                </span>
              )}
              {listing.listingType === "MONTHLY" && (
                <span className="text-base font-bold text-gray-900">
                  {formatListingPrice(listing.deposit || 0)} / {listing.monthlyRent}만
                </span>
              )}
            </div>

            {/* 특징 태그 */}
            {listing.features.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {listing.features.slice(0, 3).map((feature, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}

            {/* 하단: 조회수, 좋아요 */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {listing.viewCount}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {listing.likeCount}
              </span>
              <span className="ml-auto text-gray-500">{listing.moveInDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 전체보기 버튼 - 향후 매물 리스트 페이지로 연결 */}
      {listings.length > maxItems && (
        <button
          className="mt-4 w-full flex items-center justify-center gap-1 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          전체 매물 보기 ({listings.length}건)
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

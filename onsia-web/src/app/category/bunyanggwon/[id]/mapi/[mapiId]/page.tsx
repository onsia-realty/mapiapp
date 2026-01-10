"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { getMapiListingById } from "@/lib/mock-mapi";
import { MapiListing } from "@/types/bunyanggwon";
import { NearbyPriceData } from "@/types/api";
import { ChevronLeft, Heart, Eye, AlertTriangle, Phone } from "lucide-react";

export default function MapiDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<MapiListing | null>(null);
  const [nearbyPrices, setNearbyPrices] = useState<NearbyPriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Mock 데이터에서 매물 조회
        const mapiId = params.mapiId as string;
        const data = getMapiListingById(mapiId);

        if (data) {
          setListing(data);

          // 주변 시세 API 호출
          const priceResponse = await fetch(
            `/api/realprice?address=${encodeURIComponent(data.complexInfo.address)}`
          );
          const priceResult = await priceResponse.json();

          if (priceResult.success) {
            setNearbyPrices(priceResult.data.prices || []);
          }
        }
      } catch (err) {
        console.error("데이터 로딩 에러:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.mapiId]);

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    if (price >= 10000) {
      const billions = Math.floor(price / 10000);
      const remainder = price % 10000;
      return remainder > 0
        ? `${billions}억 ${remainder.toLocaleString()}만원`
        : `${billions}억`;
    }
    return `${price.toLocaleString()}만원`;
  };

  // 프리미엄 포맷팅
  const formatPremium = (premium: number) => {
    const absValue = Math.abs(premium);
    const formatted = absValue >= 10000
      ? `${Math.floor(absValue / 10000)}억 ${absValue % 10000 > 0 ? (absValue % 10000).toLocaleString() : ""}만원`
      : `${absValue.toLocaleString()}만원`;
    return premium < 0 ? `-${formatted}` : `+${formatted}`;
  };

  // 로딩 중
  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">매물 정보를 불러오는 중...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // 데이터 없음
  if (!listing) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-500 mb-4">매물 정보를 찾을 수 없습니다.</p>
            <Link href={`/category/bunyanggwon/${params.id}`} className="text-blue-600 underline">
              단지 상세로 돌아가기
            </Link>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // 동일 단지 평균 매매가 계산 (실거래가 기준)
  const avgPrice = nearbyPrices.length > 0
    ? Math.round(nearbyPrices.reduce((sum, p) => sum + p.recentPrice, 0) / nearbyPrices.length)
    : 0;
  const priceDiff = avgPrice > 0 ? listing.salePrice - avgPrice : 0;

  return (
    <MobileLayout>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Link href={`/category/bunyanggwon/${params.id}`}>
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <span className="text-sm text-gray-600">등록번호 {listing.registrationNo}</span>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full ${isLiked ? "text-red-500" : "text-gray-400"}`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>
      </header>

      <div className="pb-24">
        {/* 이미지 슬라이더 */}
        <div className="relative">
          {listing.images.length > 0 ? (
            <>
              <div className="relative h-72 bg-gray-100">
                <Image
                  src={listing.images[currentImageIndex]}
                  alt={`${listing.propertyName} ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                {currentImageIndex + 1}/{listing.images.length}
              </div>
              {/* 이미지 네비게이션 */}
              <div className="absolute bottom-4 left-4 flex gap-1">
                {listing.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="h-72 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">이미지 없음</p>
            </div>
          )}
        </div>

        {/* 기본 정보 영역 */}
        <div className="px-5 pt-4">
          {/* 태그 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded">
              분양권전매
            </span>
            <span className="text-sm text-gray-600">
              {listing.type}타입 · 전용 {listing.exclusiveArea}㎡
            </span>
          </div>

          {/* 단지명, 동호수 */}
          <h1 className="text-lg font-bold text-gray-900 mb-1">
            {listing.propertyName} {listing.dong}동 {listing.ho}호
          </h1>

          {/* 층수, 방향 */}
          <p className="text-sm text-gray-600 mb-2">
            {listing.floor}층 ({listing.floor}층/{listing.totalFloors}층) · {listing.direction}
          </p>

          {/* 교통, 입주예정 */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            {listing.nearestStation && (
              <span className="flex items-center gap-1">
                <span className="text-blue-500">🚇</span>
                {listing.nearestStation} {listing.stationDistance}
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="text-blue-500">🏠</span>
              {listing.moveInDate} 입주예정
            </span>
          </div>

          {/* 조회수, 좋아요 */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {listing.viewCount.toLocaleString()}회
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {listing.likeCount}
            </span>
          </div>
        </div>

        {/* 매매 금액 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">매매 금액</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-gray-600 bg-gray-50 w-24">매매가</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600 text-lg">
                    {formatPrice(listing.salePrice)}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-gray-600 bg-gray-50">분양가</td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {formatPrice(listing.originalPrice)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600 bg-gray-50">프리미엄</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-bold ${
                        listing.premium < 0
                          ? "text-blue-600"
                          : listing.premium > 0
                          ? "text-red-500"
                          : "text-gray-700"
                      }`}
                    >
                      {listing.premium === 0 ? "없음" : formatPremium(listing.premium)}
                      {listing.premium < 0 && (
                        <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                          마이너스P
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 매물 정보 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">매물 정보</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50 w-24">타입</td>
                  <td className="px-4 py-2.5 text-gray-900">
                    {listing.type}타입 (전용 {listing.exclusiveArea}㎡)
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">동/호수</td>
                  <td className="px-4 py-2.5 text-gray-900">
                    {listing.dong}동 {listing.ho}호
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">층수</td>
                  <td className="px-4 py-2.5 text-gray-900">
                    {listing.floor}층 ({listing.floor}층/{listing.totalFloors}층)
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">방향</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.direction}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">입주예정</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.moveInDate}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">계약금</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.downPayment}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">중도금</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.middlePayment}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">잔금</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.balance}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 매물 설명 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">매물 설명</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {listing.description}
            </p>
          </div>
        </div>

        {/* 주변 시세 (API) */}
        {avgPrice > 0 && (
          <div className="px-5 pt-6">
            <h2 className="text-sm font-bold text-gray-900 mb-3">주변 시세 (API)</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">동일 단지 평균 매매가</div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-700">
                  {listing.type}타입
                </span>
                <span className="font-bold text-gray-900">{formatPrice(avgPrice)}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-gray-700">현재 매물</span>
                <span className={`font-bold ${priceDiff < 0 ? "text-blue-600" : "text-red-500"}`}>
                  {formatPrice(listing.salePrice)} (평균 대비 {priceDiff < 0 ? "" : "+"}{formatPrice(Math.abs(priceDiff)).replace("만원", "")}만)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 실거래 TOP3 (API) */}
        {nearbyPrices.length > 0 && (
          <div className="px-5 pt-6">
            <h2 className="text-sm font-bold text-gray-900 mb-3">실거래 TOP3 (API)</h2>
            <div className="space-y-2">
              {nearbyPrices.slice(0, 3).map((price, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm text-gray-900">
                      {price.transactionDate} {listing.dong}동 {1000 + index * 100 + 1}호
                    </div>
                    <div className="text-xs text-gray-500">
                      {listing.type} · {formatPrice(price.recentPrice)} · {price.floor}층
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 단지 정보 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">단지 정보</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50 w-24">단지명</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.complexInfo.name}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">주소</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.complexInfo.address}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">세대수</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.complexInfo.totalHouseholds}세대</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">동수</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.complexInfo.totalBuildings}개동</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">최고층</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.complexInfo.maxFloor}층</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">입주예정</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.complexInfo.moveInDate}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">건설사</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.complexInfo.constructor}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 중개사 정보 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">중개사 정보</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <span className="font-medium text-gray-900">{listing.broker.name}</span>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50 w-24">대표</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.broker.representative}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">사업자번호</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.broker.businessNo}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">주소</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.broker.address}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-gray-600 bg-gray-50">등록번호</td>
                  <td className="px-4 py-2.5 text-gray-900">{listing.broker.registrationNo}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 단지 상세페이지 이동 */}
        <div className="px-5 pt-6">
          <Link
            href={`/category/bunyanggwon/${params.id}`}
            className="block w-full py-3 bg-pink-500 text-white text-center font-bold rounded-lg hover:bg-pink-600 transition-colors"
          >
            단지 상세보기
          </Link>
        </div>

        {/* 허위매물 신고 */}
        <div className="px-5 pt-3 pb-4">
          <button className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-500 border border-gray-300 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
            허위매물 신고
          </button>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4 z-20">
        <div className="max-w-lg mx-auto flex gap-3">
          {listing.broker.phone && (
            <a
              href={`tel:${listing.broker.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
            >
              <Phone className="w-5 h-5" />
              전화문의
            </a>
          )}
          <button className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium">
            채팅문의
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { mockBunyanggwon } from "@/lib/mock-bunyanggwon";
import { KakaoMap } from "@/components/map/KakaoMap";
import {
  ChevronLeft,
  Phone,
  MapPin,
  Home,
  Calendar,
  Building2,
  CheckCircle,
} from "lucide-react";

export default function BunyanggwonDetailPage() {
  const params = useParams();
  const item = mockBunyanggwon.find((b) => b.id === params.id);

  if (!item) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">매물 정보를 찾을 수 없습니다.</p>
        </div>
      </MobileLayout>
    );
  }

  const typeLabel = {
    APARTMENT: "아파트",
    OFFICETEL: "오피스텔",
    KNOWLEDGE_INDUSTRY: "지식산업센터",
  }[item.type];

  return (
    <MobileLayout>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/category/bunyanggwon">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-base font-bold text-gray-900 line-clamp-1 flex-1">
            {item.propertyName}
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="pb-20">
        {/* 메인 이미지 */}
        <div className="px-5 pt-4">
          <div className="bg-gray-200 rounded-xl aspect-video flex items-center justify-center mb-4">
            <div className="text-center">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">매물 이미지</p>
            </div>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="px-5 pt-2">
          <div className="flex items-start gap-2 mb-2">
            {item.salesStatus === "VIP" && (
              <span className="text-xs bg-yellow-400 text-black font-bold px-2 py-0.5 rounded flex-shrink-0">
                VIP
              </span>
            )}
            <h2 className="text-xl font-bold text-gray-900 flex-1">
              {item.propertyName}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{item.address}</span>
          </div>

          {/* 매물 유형 및 평형 */}
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
              {typeLabel}
            </span>
            <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
              {item.pyeong}평형
            </span>
            <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
              전용 {item.exclusiveArea}㎡
            </span>
          </div>

          {/* 프리미엄 정보 */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4">
            <div className="text-sm text-gray-600 mb-2">프리미엄 정보</div>
            {item.premiumType === "MINUS" && (
              <div className="text-2xl font-bold text-red-600">
                마이너스 {Math.abs(item.premium).toLocaleString()}만원
              </div>
            )}
            {item.premiumType === "PREMIUM" && (
              <div className="text-2xl font-bold text-blue-600">
                프리미엄 +{item.premium.toLocaleString()}만원
              </div>
            )}
            {item.premiumType === "NONE" && (
              <div className="text-2xl font-bold text-green-600">
                분양가 그대로
              </div>
            )}
            {item.description && (
              <p className="text-sm text-gray-600 mt-2">{item.description}</p>
            )}
          </div>

          {/* 가격 정보 */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">가격 정보</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">매매가</span>
                <span className="text-lg font-bold text-purple-600">
                  {item.price.toLocaleString()}만원
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">평당가</span>
                <span className="text-base font-medium text-gray-900">
                  {item.pricePerPyeong?.toLocaleString()}만원
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">공급면적</span>
                  <span className="text-sm text-gray-900">
                    {item.supplyArea}㎡ (약 {Math.round(item.supplyArea / 3.3)}평)
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">전용면적</span>
                  <span className="text-sm text-gray-900">
                    {item.exclusiveArea}㎡ (약{" "}
                    {Math.round(item.exclusiveArea / 3.3)}평)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 단지 정보 */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">단지 정보</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">단지명</div>
                  <div className="text-sm text-gray-900 font-medium">
                    {item.propertyName}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">소재지</div>
                  <div className="text-sm text-gray-900">{item.address}</div>
                </div>
              </div>
              {item.moveInDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">입주예정</div>
                    <div className="text-sm text-gray-900">
                      {item.moveInDate}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 특징 */}
          {item.features && item.features.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                매물 특징
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 px-3 py-2 bg-green-50 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 위치 지도 */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">위치</h3>
            {item.latitude && item.longitude ? (
              <KakaoMap
                latitude={item.latitude}
                longitude={item.longitude}
                markerTitle={item.propertyName}
                level={3}
                className="rounded-xl aspect-video"
              />
            ) : (
              <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">위치 정보 없음</p>
                </div>
              </div>
            )}
          </div>

          {/* 중개사 정보 */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">중개 문의</h3>
              <span className="text-xs text-purple-600 font-medium">
                {item.agentName}
              </span>
            </div>
            {item.contactPhone && (
              <a
                href={`tel:${item.contactPhone}`}
                className="flex items-center justify-center gap-2 w-full bg-purple-600 text-white rounded-lg py-3 font-medium"
              >
                <Phone className="w-5 h-5" />
                {item.contactPhone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <button className="flex-1 bg-white border border-purple-600 text-purple-600 rounded-lg py-3 font-medium">
            관심 매물
          </button>
          <button className="flex-1 bg-purple-600 text-white rounded-lg py-3 font-medium">
            문의하기
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}

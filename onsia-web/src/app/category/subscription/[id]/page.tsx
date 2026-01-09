"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { mockSubscriptions, depositInfo, deliveryServices } from "@/lib/mock-subscriptions";
import { KakaoMap } from "@/components/map/KakaoMap";
import { ChevronLeft, ChevronDown, Phone, ExternalLink, MapPin, Home } from "lucide-react";

export default function SubscriptionDetailPage() {
  const params = useParams();
  const subscription = mockSubscriptions.find((s) => s.id === params.id);
  const [selectedType, setSelectedType] = useState("24평형");
  const [showAllTypes, setShowAllTypes] = useState(false);

  if (!subscription) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">청약 정보를 찾을 수 없습니다.</p>
        </div>
      </MobileLayout>
    );
  }

  const housingTypes = subscription.housingTypes || [];

  return (
    <MobileLayout>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/category/subscription">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-base font-bold text-gray-900 line-clamp-1 flex-1">
            {subscription.houseName}
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="pb-20">
        {/* 평형 선택 */}
        <div className="px-5 pt-4">
          <div className="relative">
            <button
              onClick={() => setShowAllTypes(!showAllTypes)}
              className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3"
            >
              <span className="text-sm font-medium text-gray-900">
                {selectedType}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  showAllTypes ? "rotate-180" : ""
                }`}
              />
            </button>
            {showAllTypes && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-20">
                {["24평형", "32평형", "35평형", "40평형"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedType(type);
                      setShowAllTypes(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 active:bg-gray-100"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-600 mb-1">주소 / 세대수</div>
              <div className="font-medium text-gray-900">
                {subscription.address.split(" ")[0]} {subscription.address.split(" ")[1]} 대연동 |{" "}
                {subscription.totalHouseholds}세대
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-gray-600 mb-1">입주예정 / 융자율</div>
              <div className="font-medium text-gray-900">
                {subscription.moveInDate} | 건배율 27.3% | 용적률 24%
              </div>
            </div>
          </div>
        </div>

        {/* 단지 홈보 배너 */}
        <div className="px-5 pt-2">
          <div className="bg-black text-white rounded-xl p-8 text-center mb-3">
            <p className="text-sm">단지 홈보 배너 이미지</p>
          </div>
          <button className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium mb-1">
            보러가기
          </button>
        </div>

        {/* 24평형 분양가 */}
        <div className="px-5 pt-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">24평형 분양가</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">타입</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">공급세대</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700">분양가</th>
                </tr>
              </thead>
              <tbody>
                {housingTypes.map((type, idx) => (
                  <tr key={type.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-3 text-gray-900 font-medium">{type.houseTy}타입</td>
                    <td className="px-3 py-3 text-center text-gray-700">
                      {type.totalHouseholds}세대
                    </td>
                    <td className="px-3 py-3 text-right text-purple-600 font-bold">
                      {type.topPrice?.toLocaleString()}만
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full mt-3 bg-purple-600 text-white rounded-lg py-3 font-medium flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            마피 매물보기
          </button>
        </div>

        {/* 분양안내 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">분양안내</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <tbody>
                {subscription.schedule && (
                  <>
                    <tr className="border-b border-gray-200">
                      <td className="px-3 py-3 text-gray-700 bg-gray-50">25.12.12</td>
                      <td className="px-3 py-3 text-gray-900">분양공고</td>
                      <td className="px-3 py-3 text-right text-gray-600">10일 전</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-3 py-3 text-gray-700 bg-gray-50">25.12.22</td>
                      <td className="px-3 py-3 text-gray-900">특별공급</td>
                      <td className="px-3 py-3 text-right text-green-600 font-medium">오늘</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-3 py-3 text-gray-700 bg-gray-50">25.12.23</td>
                      <td className="px-3 py-3 text-gray-900">1순위 청약</td>
                      <td className="px-3 py-3 text-right text-gray-600">1일 후</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-3 py-3 text-gray-700 bg-gray-50">25.12.24</td>
                      <td className="px-3 py-3 text-gray-900">2순위 청약</td>
                      <td className="px-3 py-3 text-right text-gray-600">2일 후</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-3 py-3 text-gray-700 bg-gray-50">25.12.31</td>
                      <td className="px-3 py-3 text-gray-900">당첨자 발표</td>
                      <td className="px-3 py-3 text-right text-gray-600">9일 후</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-3 py-3 text-gray-700 bg-gray-50">26.01.12</td>
                      <td className="px-3 py-3 text-gray-900">계약시작</td>
                      <td className="px-3 py-3 text-right text-gray-600">21일 후</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-3 text-gray-700 bg-gray-50">26.01.14</td>
                      <td className="px-3 py-3 text-gray-900">계약종료</td>
                      <td className="px-3 py-3 text-right text-gray-600">23일 후</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          <button className="w-full mt-3 bg-blue-500 text-white rounded-lg py-3 font-medium">
            청약 신청하기
          </button>
        </div>

        {/* 공급정보 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">공급정보</h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">온급위치</span>
              <span className="text-gray-900 font-medium">{subscription.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">공급규모</span>
              <span className="text-gray-900 font-medium">{subscription.totalHouseholds}세대</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">건설사</span>
              <span className="text-gray-900 font-medium">{subscription.developer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">시행사</span>
              <span className="text-gray-900 font-medium">{subscription.constructor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">대표전화</span>
              <a href={`tel:${subscription.phoneNumber}`} className="text-blue-600 font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {subscription.phoneNumber}
              </a>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <button className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" />
              분양 홈페이지 바로가기
            </button>
            <button className="w-full bg-gray-100 text-gray-700 rounded-lg py-3 font-medium">
              입주사 모집 공고 보기
            </button>
          </div>
        </div>

        {/* 단지 홈보 이미지 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">단지 홈보 이미지</h2>
          <div className="bg-black text-white rounded-xl aspect-video flex items-center justify-center">
            <p className="text-sm">[ 단지 영역 ]</p>
          </div>
        </div>

        {/* 빠른 배송 생활권 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">빠른 배송 생활권</h2>
          <div className="grid grid-cols-2 gap-3">
            {deliveryServices.map((service, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">{service.icon}</div>
                <div className="text-xs font-medium text-gray-900 mb-1">{service.name}</div>
                <div className="text-xs text-gray-600">{service.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 주변 상권 정보 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">주변 상권 정보</h2>
          {subscription.latitude && subscription.longitude ? (
            <KakaoMap
              latitude={subscription.latitude}
              longitude={subscription.longitude}
              markerTitle={subscription.houseName}
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

        {/* 청약 예치금 */}
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">청약 예치금</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">주택규모</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">서울/부산</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">기타광역</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">기타시군</th>
                </tr>
              </thead>
              <tbody>
                {depositInfo.map((info, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-3 text-gray-900 font-medium">{info.area}</td>
                    <td className="px-3 py-3 text-center text-gray-700">{info.seoul}</td>
                    <td className="px-3 py-3 text-center text-gray-700">{info.gyeonggi}</td>
                    <td className="px-3 py-3 text-center text-gray-700">{info.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <button className="flex-1 bg-white border border-purple-600 text-purple-600 rounded-lg py-3 font-medium">
            문의하기
          </button>
          <button className="flex-1 bg-purple-600 text-white rounded-lg py-3 font-medium">
            청약 신청하기
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { mockSubscriptions } from "@/lib/mock-subscriptions";
import { ChevronLeft } from "lucide-react";

export default function SubscriptionPage() {
  const [selectedType, setSelectedType] = useState("24평형");

  // 청약 상태별로 분류
  const todaySubscriptions = mockSubscriptions.filter(
    (s) => s.status === "ongoing"
  );
  const upcomingSubscriptions = mockSubscriptions.filter(
    (s) => s.status === "upcoming"
  );
  const endedSubscriptions = mockSubscriptions.filter(
    (s) => s.status === "ended"
  );

  return (
    <MobileLayout>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">분양권 전매</h1>
        </div>

        {/* 타입 필터 */}
        <div className="flex gap-2 px-5 pb-3">
          <button className="px-4 py-2 text-sm rounded-full bg-purple-600 text-white font-medium">
            아파트
          </button>
          <button className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-600 font-medium">
            오피스텔
          </button>
          <button className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-600 font-medium">
            지식산업센터
          </button>
        </div>

        {/* 지역 필터 */}
        <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
          <button className="px-4 py-1.5 text-sm whitespace-nowrap border-2 border-purple-600 rounded-full text-purple-600 font-medium">
            전국
          </button>
          <button className="px-4 py-1.5 text-sm whitespace-nowrap border border-gray-300 rounded-full text-gray-600">
            서울
          </button>
          <button className="px-4 py-1.5 text-sm whitespace-nowrap border border-gray-300 rounded-full text-gray-600">
            경기도
          </button>
          <button className="px-4 py-1.5 text-sm whitespace-nowrap border border-gray-300 rounded-full text-gray-600">
            인천
          </button>
          <button className="px-4 py-1.5 text-sm whitespace-nowrap border border-gray-300 rounded-full text-gray-600">
            부산
          </button>
          <button className="px-4 py-1.5 text-sm whitespace-nowrap border border-gray-300 rounded-full text-gray-600">
            대전
          </button>
        </div>
      </header>

      {/* VIP 매물 섹션 */}
      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-yellow-400 text-black font-bold px-2 py-0.5 rounded">
            VIP
          </span>
          <span className="text-sm font-bold text-gray-900">VIP 매물</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-gray-400 text-sm">이미지 영역</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                용인경남아너스빌 [VIP]
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                경기도 용인시 처인구 역북동
              </p>
              <div className="text-xs text-gray-500 mb-2">
                마이너스P -3,000만
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-purple-600">
                  8억 1,400
                </div>
                <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded-full">
                  이미지 영역
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-start gap-3">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-gray-400 text-sm">이미지 영역</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                중흥S-클래스더포레 [VIP]
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                경기도 구리시 교문동
              </p>
              <div className="text-xs text-gray-500 mb-2">프리미엄</div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-purple-600">
                  8억 1,400
                </div>
                <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded-full">
                  이미지 영역
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 전체 매물 섹션 */}
      <div className="px-5 pt-6 pb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-900">전체 매물</span>
        </div>

        {/* 매물 목록 */}
        <div className="space-y-3">
          {mockSubscriptions.map((subscription) => (
            <Link
              key={subscription.id}
              href={`/category/subscription/${subscription.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 active:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 text-xs text-center px-2">
                    이미지
                    <br />
                    영역
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    {subscription.status === "upcoming" && (
                      <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded flex-shrink-0">
                        오늘
                      </span>
                    )}
                    {subscription.status === "ended" && (
                      <span className="text-xs bg-gray-400 text-white px-1.5 py-0.5 rounded flex-shrink-0">
                        마감
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                      {subscription.houseName}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                    {subscription.address}
                  </p>
                  <div className="text-xs text-gray-500 mb-2">
                    {subscription.totalHouseholds}세대 | {subscription.moveInDate}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">평균 분양가</div>
                      <div className="text-sm font-bold text-purple-600">
                        {subscription.avgPrice?.toLocaleString()}만원
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">평당가</div>
                      <div className="text-sm font-bold text-gray-900">
                        {subscription.avgPricePerPyeong?.toLocaleString()}만원
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}

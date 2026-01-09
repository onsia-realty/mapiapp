"use client";

import Link from "next/link";
import { MobileLayout } from "@/components/layout/MobileLayout";

export default function HomePage() {
  return (
    <MobileLayout>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-5 py-4">
          <div className="text-2xl font-bold text-purple-600 mb-3">🏠 MAPI</div>

          {/* 검색창 */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-5 py-3">
            <span className="text-lg">🔍</span>
            <input
              type="text"
              placeholder="어떤 공간을 찾고 계시나요?"
              className="flex-1 bg-transparent outline-none text-base"
              readOnly
            />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="px-5 pt-5 pb-10">
        {/* 카테고리 */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">카테고리</h2>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {/* 분양권전매 - 큰 카드 */}
          <Link
            href="/category/bunyanggwon"
            className="row-span-2 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 min-h-[160px] relative overflow-hidden active:scale-[0.98] transition-transform"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <div className="text-5xl mb-3">🏗️</div>
              <div className="text-white text-xl font-bold mb-1">분양권전매</div>
              <div className="text-white/90 text-sm">프리미엄 분양권 거래</div>
            </div>
          </Link>

          {/* 이자만 */}
          <Link
            href="/category/ijaman"
            className="bg-white rounded-xl p-5 text-center shadow-md border border-gray-100 active:scale-95 transition-transform relative"
          >
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              HOT
            </span>
            <div className="text-3xl mb-2">💰</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">이자만</div>
            <div className="text-xs text-gray-500">급매물임대</div>
          </Link>

          {/* 청약홈 */}
          <Link
            href="/category/subscription"
            className="bg-white rounded-xl p-5 text-center shadow-md border border-gray-100 active:scale-95 transition-transform relative"
          >
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              NEW
            </span>
            <div className="text-3xl mb-2">📋</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">신규분양정보</div>
            <div className="text-xs text-gray-500">청약홈</div>
          </Link>

          {/* 아파트 */}
          <Link
            href="/category/apartment"
            className="bg-white rounded-xl p-5 text-center shadow-md border border-gray-100 active:scale-95 transition-transform"
          >
            <div className="text-3xl mb-2">🏢</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">아파트</div>
            <div className="text-xs text-gray-500">임대차</div>
          </Link>

          {/* 오피스텔 */}
          <Link
            href="/category/officetel"
            className="bg-white rounded-xl p-5 text-center shadow-md border border-gray-100 active:scale-95 transition-transform"
          >
            <div className="text-3xl mb-2">🏨</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">오피스텔</div>
            <div className="text-xs text-gray-500">임대차</div>
          </Link>

          {/* 사무실 */}
          <Link
            href="/category/office"
            className="bg-white rounded-xl p-5 text-center shadow-md border border-gray-100 active:scale-95 transition-transform"
          >
            <div className="text-3xl mb-2">🏪</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">사무실</div>
            <div className="text-xs text-gray-500">임대차</div>
          </Link>

          {/* 상가 */}
          <Link
            href="/category/store"
            className="bg-white rounded-xl p-5 text-center shadow-md border border-gray-100 active:scale-95 transition-transform"
          >
            <div className="text-3xl mb-2">🏬</div>
            <div className="text-sm font-semibold text-gray-900 mb-1">상가</div>
            <div className="text-xs text-gray-500">임대차</div>
          </Link>
        </div>

        {/* 의뢰 섹션 */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">매물 의뢰하기</h2>
        <div className="flex gap-3 mb-4">
          <button className="flex-1 bg-white border-2 border-purple-600 rounded-xl p-4 text-center active:bg-purple-600 active:text-white transition-colors">
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-semibold text-purple-600">분양권 의뢰</div>
          </button>
          <button className="flex-1 bg-white border-2 border-purple-600 rounded-xl p-4 text-center active:bg-purple-600 active:text-white transition-colors">
            <div className="text-2xl mb-2">🏷️</div>
            <div className="text-sm font-semibold text-purple-600">이자만 의뢰</div>
          </button>
        </div>

        {/* 광고 배너 */}
        <div className="bg-gradient-to-r from-pink-400 to-yellow-300 rounded-xl p-5 text-center text-white">
          <div className="text-lg font-bold mb-2">🎉 중개업소 추천 가입 혜택</div>
          <div className="text-sm opacity-90">매물등록 10회권 지급 / 구인구직 1회권 지급</div>
        </div>
      </div>
    </MobileLayout>
  );
}

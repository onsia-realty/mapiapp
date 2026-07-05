"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";

const TODAY = new Date();
const NEXT_BILLING = new Date(TODAY);
NEXT_BILLING.setMonth(NEXT_BILLING.getMonth() + 1);

const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const PAID_AMOUNT = 14900;
const ORDER_ID = "MAPI_xxxx_STANDARD_" + Date.now();
const CARD_LAST4 = "1234";
const EARLYBIRD_NUMBER = 47;

export default function BillingSuccessPage() {
  return (
    <MobileLayout hideNav>
      <div className="p-5 space-y-5 pt-12">
        {/* 성공 아이콘 */}
        <div className="text-center py-8">
          <div className="inline-flex w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            결제 완료되었습니다!
          </h1>
          <p className="text-base text-gray-600">
            Standard 구독이 시작되었어요
          </p>
        </div>

        {/* 얼리버드 락인 안내 */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-sm font-bold text-orange-900 mb-1">
            🎉 얼리버드 #{EARLYBIRD_NUMBER} 등록 완료!
          </p>
          <p className="text-xs text-orange-700">
            14,900원/월 가격이 평생 락인됩니다 (연속 구독 유지 시)
          </p>
        </div>

        {/* 영수증 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">결제 영수증</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">결제 금액</span>
              <span className="font-bold text-gray-900">
                {PAID_AMOUNT.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제 카드</span>
              <span className="font-medium text-gray-900">
                **** {CARD_LAST4}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">다음 결제일</span>
              <span className="font-medium text-gray-900">
                {formatDate(NEXT_BILLING)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3">
              <span className="text-gray-600">주문번호</span>
              <span className="font-mono text-xs text-gray-700">
                {ORDER_ID.slice(0, 24)}...
              </span>
            </div>
          </div>
        </div>

        {/* 사용 가능 현황 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            지금 바로 시작하세요
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-xl">
                🏢
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">마피 매물 등록</p>
                <p className="text-xs text-gray-500">1건 사용 가능 · 30일 노출</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">
                🏠
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">일반 매물 등록</p>
                <p className="text-xs text-gray-500">10건 사용 가능 · 30일 노출</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-xl">
                💼
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  구인구직 베이직
                </p>
                <p className="text-xs text-gray-500">1건 사용 가능 · 8일 노출</p>
              </div>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Link
          href="/register"
          className="flex items-center justify-center gap-2 w-full h-12 rounded-lg text-white font-semibold transition hover:opacity-90"
          style={{ backgroundColor: "#F97316" }}
        >
          매물 등록하러 가기
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/mypage/subscription"
          className="block w-full h-12 rounded-lg border border-gray-300 text-gray-700 font-semibold text-center leading-[3rem] hover:bg-gray-50 transition"
        >
          마이페이지로
        </Link>
      </div>
    </MobileLayout>
  );
}

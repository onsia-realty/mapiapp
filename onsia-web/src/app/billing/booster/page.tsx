"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Zap, Info } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";

// Mock 데이터 — 실제로는 quota 초과 시 자동 노출
const SCENARIO = {
  type: "MAPI_LISTING" as const, // MAPI_LISTING / GENERAL_LISTING / JOB
  current: { used: 1, limit: 1 },
  property: "한화포레나 102동 503호",
};

const PRICING = {
  MAPI_LISTING: { price: 9900, days: 30, label: "마피 매물 추가 등록" },
  GENERAL_LISTING: { price: 1000, days: 30, label: "일반 매물 추가 등록" },
};

// 정기 구독자(billingKey 보유) 가정
const HAS_BILLING_KEY = true;

export default function BoosterCheckoutPage() {
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const pricing = PRICING[SCENARIO.type];

  const handleOneClick = async () => {
    setProcessing(true);
    // 실제로는 POST /api/billing/booster
    await new Promise((r) => setTimeout(r, 800));
    setProcessing(false);
    setDone(true);
  };

  if (done) {
    return (
      <MobileLayout hideNav>
        <div className="p-5 pt-16 text-center space-y-4">
          <div className="inline-flex w-16 h-16 rounded-full bg-green-100 items-center justify-center text-3xl">
            ✓
          </div>
          <h1 className="text-xl font-bold text-gray-900">결제 완료!</h1>
          <p className="text-sm text-gray-600">
            {pricing.label}이 등록되었습니다
            <br />
            {pricing.days}일간 노출됩니다
          </p>
          <Link
            href="/mypage/subscription"
            className="inline-block mt-4 h-12 px-6 rounded-lg text-white font-semibold leading-[3rem]"
            style={{ backgroundColor: "#F97316" }}
          >
            마이페이지로
          </Link>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hideNav>
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/register">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">추가 등록</h1>
        </div>
      </header>

      <div className="p-5 space-y-5">
        {/* Quota 알림 */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-bold text-orange-900 mb-1">
              마피 매물 {SCENARIO.current.used}/{SCENARIO.current.limit}건 사용 완료
            </p>
            <p className="text-orange-700">
              구독 할당량을 모두 사용하셨어요. 추가 등록하시겠어요?
            </p>
          </div>
        </div>

        {/* 등록할 매물 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            등록할 매물
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-2xl">
              🏢
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                {SCENARIO.property}
              </p>
              <p className="text-xs text-gray-500">분양권 전매 (마피)</p>
            </div>
          </div>
        </div>

        {/* 결제 카드 */}
        <div
          className="bg-white rounded-xl p-5"
          style={{ border: "2px solid #F97316" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5" style={{ color: "#F97316" }} />
            <h2 className="text-base font-bold text-gray-900">
              {pricing.label}
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">노출 기간</span>
              <span className="font-medium text-gray-900">
                {pricing.days}일 보장
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제 수단</span>
              <span className="font-medium text-gray-900">
                {HAS_BILLING_KEY ? "등록된 카드 (**** 1234)" : "카드 입력 필요"}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 items-baseline">
              <span className="text-gray-600">결제 금액</span>
              <span className="text-2xl font-bold text-orange-600">
                {pricing.price.toLocaleString()}
                <span className="text-base font-normal">원</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleOneClick}
            disabled={processing}
            className="w-full h-12 mt-5 rounded-lg text-white font-semibold transition disabled:opacity-50"
            style={{ backgroundColor: "#F97316" }}
            type="button"
          >
            {processing ? (
              "결제 처리 중..."
            ) : HAS_BILLING_KEY ? (
              <>⚡ 원클릭 결제하기 ({pricing.price.toLocaleString()}원)</>
            ) : (
              <>{pricing.price.toLocaleString()}원 결제 진행</>
            )}
          </button>

          {HAS_BILLING_KEY && (
            <p className="text-xs text-center text-gray-500 mt-3">
              정기 구독 카드로 1초 안에 결제 완료
            </p>
          )}
        </div>

        {/* 노출 기간 안내 */}
        <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-900 space-y-1">
          <p className="font-semibold">💡 노출 보장 안내</p>
          <p className="text-blue-700">
            추가 등록한 매물은 결제일로부터 {pricing.days}일간 노출됩니다.
            <br />
            구독이 만료되어도 노출 기간은 보장됩니다.
          </p>
        </div>

        {/* 환불 안내 */}
        <div className="text-xs text-gray-500 text-center pt-2">
          단건 결제는 매물 등록 전에만 환불 가능합니다
        </div>
      </div>
    </MobileLayout>
  );
}

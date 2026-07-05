"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, CreditCard, ShieldCheck } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";

const TODAY = new Date();
const NEXT_BILLING = new Date(TODAY);
NEXT_BILLING.setMonth(NEXT_BILLING.getMonth() + 1);

const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const PRICE = 14900;
const ORIGINAL_PRICE = 29900;
const IS_EARLYBIRD = true;

export default function BillingCheckoutPage() {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handlePay = () => {
    if (!agreed) return;
    // 실제로는 tossPayments.requestBillingAuth 호출
    router.push("/billing/success");
  };

  return (
    <MobileLayout hideNav>
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/billing/plans">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">결제 정보 입력</h1>
        </div>
      </header>

      <div className="p-5 space-y-5">
        {/* 결제 요약 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">결제 요약</h2>

          <div className="flex items-baseline justify-between mb-2">
            <span className="text-base font-bold text-gray-900">
              Standard 구독
            </span>
            {IS_EARLYBIRD && (
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                얼리버드 50% OFF
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mb-4">매월 자동 결제 · 언제든 해지 가능</p>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">첫 결제일</span>
              <span className="font-medium text-gray-900">{formatDate(TODAY)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">다음 결제일</span>
              <span className="font-medium text-gray-900">{formatDate(NEXT_BILLING)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
              <span className="text-gray-600">결제 금액</span>
              <div className="text-right">
                {IS_EARLYBIRD && (
                  <p className="text-xs text-gray-400 line-through">
                    {ORIGINAL_PRICE.toLocaleString()}원
                  </p>
                )}
                <p className="text-2xl font-bold text-orange-600">
                  {PRICE.toLocaleString()}
                  <span className="text-base font-normal">원</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Toss billing 위젯 영역 (목업) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">결제 수단 등록</h2>
          </div>

          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Toss Payments 결제 위젯
            </p>
            <p className="text-xs text-gray-500">
              개발 시 이 영역에 Toss billing 위젯이 임베드됩니다
            </p>
            <p className="text-xs text-gray-400 mt-3 font-mono">
              tossPayments.requestBillingAuth()
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>카드 정보는 Toss Payments에서 안전하게 보관됩니다</span>
          </div>
        </div>

        {/* 약관 동의 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-gray-900 mb-1">
                결제 약관에 동의합니다 <span className="text-red-500">(필수)</span>
              </p>
              <p className="text-xs text-gray-500">
                정기결제·환불정책·개인정보 제3자 제공(Toss Payments)에 동의합니다.
                <Link href="#" className="text-blue-600 underline ml-1">
                  자세히 보기
                </Link>
              </p>
            </div>
          </label>
        </div>

        {/* 결제 버튼 */}
        <button
          onClick={handlePay}
          disabled={!agreed}
          className="w-full h-12 rounded-lg text-white font-semibold transition disabled:opacity-50"
          style={{ backgroundColor: agreed ? "#F97316" : "#9CA3AF" }}
        >
          {PRICE.toLocaleString()}원 결제 진행
        </button>

        <div className="text-xs text-center text-gray-500 pt-2">
          결제 진행 시 첫 결제 즉시 발생 + 매월 자동 갱신
        </div>
      </div>
    </MobileLayout>
  );
}

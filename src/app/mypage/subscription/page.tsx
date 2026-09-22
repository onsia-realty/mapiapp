"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";

// Mock 데이터 — 실제로는 /api/billing/plans-status에서 fetch
const MOCK_SUBSCRIPTION = {
  tier: "STANDARD" as const,
  status: "ACTIVE" as const,
  earlybirdNumber: 47,
  monthlyPrice: 14900,
  isEarlybird: true,
  nextBillingDate: "2026-06-04",
  cardLast4: "1234",
  usage: {
    mapi: { used: 0, limit: 1 },
    general: { used: 3, limit: 10 },
    jobBasic: { used: 0, limit: 1 },
  },
};

const MOCK_BOOSTERS = [
  {
    id: "1",
    type: "마피 매물 추가",
    amount: 9900,
    daysLeft: 12,
    target: "한화포레나 102동 503호",
  },
  {
    id: "2",
    type: "일반 매물 추가",
    amount: 1000,
    daysLeft: 8,
    target: "강남구 역삼동 빌라",
  },
];

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const pct = limit === 0 ? 0 : Math.min((used / limit) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-700">{label}</span>
        <span className="font-medium text-gray-900">
          {used} / {limit}건
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            backgroundColor: pct > 80 ? "#EF4444" : "#F97316",
          }}
        />
      </div>
    </div>
  );
}

export default function MySubscriptionPage() {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const sub = MOCK_SUBSCRIPTION;

  return (
    <MobileLayout>
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/more">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">내 구독</h1>
        </div>
      </header>

      <div className="p-5 space-y-5">
        {/* 현재 플랜 */}
        <div
          className="bg-white rounded-xl p-5"
          style={{ border: "2px solid #F97316" }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-500">현재 플랜</h2>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
              ACTIVE
            </span>
          </div>

          <div className="mb-3">
            <p className="text-xl font-bold text-gray-900">
              Standard{" "}
              <span className="text-orange-600">
                {sub.monthlyPrice.toLocaleString()}원/월
              </span>
            </p>
            {sub.isEarlybird && (
              <p className="text-xs font-bold text-orange-600 mt-1">
                🔥 얼리버드 #{sub.earlybirdNumber}/100 · 가격 평생 락인
              </p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">다음 결제일</span>
              <span className="font-medium text-gray-900">
                {sub.nextBillingDate}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">결제 카드</span>
              <span className="font-medium text-gray-900 flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                **** {sub.cardLast4}
              </span>
            </div>
          </div>
        </div>

        {/* 사용 현황 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">
            이번 달 사용 현황
          </h2>
          <div className="space-y-4">
            <UsageBar
              label="마피 매물"
              used={sub.usage.mapi.used}
              limit={sub.usage.mapi.limit}
            />
            <UsageBar
              label="일반 매물"
              used={sub.usage.general.used}
              limit={sub.usage.general.limit}
            />
            <UsageBar
              label="구인구직 베이직"
              used={sub.usage.jobBasic.used}
              limit={sub.usage.jobBasic.limit}
            />
          </div>
          <p className="text-xs text-gray-500 mt-4">
            매월 {sub.nextBillingDate.slice(-2)}일에 자동으로 리셋됩니다
          </p>
        </div>

        {/* 추가 등록 내역 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            추가 등록 내역
          </h2>
          <div className="space-y-3">
            {MOCK_BOOSTERS.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{b.type}</p>
                  <p className="text-xs text-gray-500">{b.target}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {b.amount.toLocaleString()}원
                  </p>
                  <p className="text-xs text-gray-500">{b.daysLeft}일 남음</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/mypage/booster-history"
            className="flex items-center justify-center gap-1 text-sm text-blue-600 mt-4 pt-3 border-t border-gray-100"
          >
            전체 내역 보기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-2">
          <Link
            href="/mypage/payment-history"
            className="flex items-center justify-between w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50 transition"
          >
            <span className="font-medium">결제 내역</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            href="/mypage/change-card"
            className="flex items-center justify-between w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50 transition"
          >
            <span className="font-medium">카드 변경</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            href="/billing/plans"
            className="flex items-center justify-between w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-50 transition"
          >
            <span className="font-medium">플랜 변경</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <button
            onClick={() => setShowCancelDialog(true)}
            className="flex items-center justify-between w-full h-12 px-4 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition"
            type="button"
          >
            <span className="font-medium">해지하기</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center pt-2">
          문의: support@onsia.kr · 환불정책 7일 내 100%
        </div>
      </div>

      {/* 해지 다이얼로그 (Step 1) */}
      {showCancelDialog && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
          onClick={() => setShowCancelDialog(false)}
        >
          <div
            className="w-full max-w-[480px] bg-white rounded-t-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900">정말 해지하시겠어요?</h3>

            <div className="bg-orange-50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-semibold text-orange-900">
                해지 시 손해보는 점:
              </p>
              <ul className="space-y-1 text-orange-800">
                <li>· 얼리버드 #{sub.earlybirdNumber} 락인 가격(14,900원) 권리 소멸</li>
                <li>· 30일 이내 재가입하지 않으면 정상가(29,900원) 적용</li>
                <li>· 이번 달 미사용 할당량 10건이 있습니다</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              다음 결제일({sub.nextBillingDate})까지는 모든 기능을 사용하실 수 있습니다.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="w-full h-12 rounded-lg text-white font-semibold transition"
                style={{ backgroundColor: "#F97316" }}
                type="button"
              >
                계속 이용하기
              </button>
              <Link
                href="/mypage/subscription/cancel"
                className="block w-full h-12 rounded-lg border border-gray-300 text-gray-500 font-medium text-center leading-[3rem]"
              >
                정말 해지하기
              </Link>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
}

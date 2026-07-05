"use client";

import Link from "next/link";
import { ChevronLeft, Check } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";

const EARLYBIRD_TOTAL = 100;
const EARLYBIRD_USED = 53;
const EARLYBIRD_REMAINING = EARLYBIRD_TOTAL - EARLYBIRD_USED;

export default function BillingPlansPage() {
  const earlybirdAvailable = EARLYBIRD_REMAINING > 0;

  return (
    <MobileLayout hideNav>
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">구독 플랜</h1>
        </div>
      </header>

      <div className="p-5 space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            나에게 맞는 플랜을 선택하세요
          </h2>
          <p className="text-sm text-gray-600">
            언제든 변경/해지 가능합니다
          </p>
        </div>

        {earlybirdAvailable && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-orange-900">
                얼리버드 {EARLYBIRD_REMAINING}/{EARLYBIRD_TOTAL}명 모집 중
              </p>
              <p className="text-xs text-orange-700">
                선착순 50% 할인 + 가격 평생 락인
              </p>
            </div>
          </div>
        )}

        {/* Free 플랜 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Free</h3>
            <span className="text-xs text-gray-500">체험용</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-4">
            0<span className="text-base font-normal text-gray-600">원/월</span>
          </p>
          <ul className="space-y-2 mb-5">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span>일반 매물 1건 등록 (3일 노출)</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <span className="w-4 h-4 mt-0.5 shrink-0">—</span>
              <span>마피 매물 등록 불가</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <span className="w-4 h-4 mt-0.5 shrink-0">—</span>
              <span>구인구직 등록 불가</span>
            </li>
          </ul>
          <button
            className="w-full h-12 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            type="button"
          >
            무료로 시작
          </button>
        </div>

        {/* Standard 플랜 (얼리버드) */}
        <div
          className="bg-white rounded-xl p-5 relative shadow-lg"
          style={{
            border: "2px solid #F97316",
            boxShadow: "0 4px 12px rgba(249, 115, 22, 0.2)",
          }}
        >
          <div className="absolute -top-3 left-5 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            ⭐ 추천
          </div>

          <div className="flex items-baseline justify-between mb-3 mt-1">
            <h3 className="text-lg font-bold text-gray-900">Standard</h3>
            {earlybirdAvailable && (
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                얼리버드 50% OFF
              </span>
            )}
          </div>

          <div className="mb-4">
            {earlybirdAvailable ? (
              <>
                <p className="text-2xl font-bold text-orange-600">
                  14,900
                  <span className="text-base font-normal text-gray-600">원/월</span>
                </p>
                <p className="text-sm text-gray-400 line-through">
                  29,900원/월
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                29,900<span className="text-base font-normal text-gray-600">원/월</span>
              </p>
            )}
          </div>

          <ul className="space-y-2 mb-5">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <span>
                <b>마피 매물 1건</b> (30일 노출)
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <span>
                <b>일반 매물 10건</b> (30일 노출)
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <span>
                <b>구인구직 베이직 1건</b> (8일 노출)
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <span>매물 관리 도구 무제한</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <span>추가 등록 원클릭 결제</span>
            </li>
          </ul>

          <Link
            href="/billing/checkout"
            className="block w-full h-12 rounded-lg text-white font-semibold text-center leading-[3rem] transition hover:opacity-90"
            style={{ backgroundColor: "#F97316" }}
          >
            Standard 시작하기
          </Link>

          {earlybirdAvailable && (
            <p className="mt-3 text-xs text-center text-orange-700">
              ⚡ 가격 평생 락인 (연속 구독 시)
            </p>
          )}
        </div>

        <div className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-900">
          <p className="font-semibold mb-1">💡 공인중개사 자격증 인증 시</p>
          <p className="text-blue-700">첫 1개월 무료 — 자격증 인증 후 자동 적용</p>
        </div>

        <div className="text-xs text-gray-500 space-y-1 pt-2">
          <p>· 매월 자동 결제 (언제든 해지 가능)</p>
          <p>· 결제일 7일 내 100% 환불 가능</p>
          <p>· 카드 정보는 Toss Payments에서 안전하게 보관</p>
        </div>

        <div className="flex justify-center gap-4 pt-4 text-xs text-gray-500">
          <Link href="#" className="underline">
            이용약관
          </Link>
          <Link href="#" className="underline">
            개인정보처리방침
          </Link>
          <Link href="#" className="underline">
            환불정책
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
}

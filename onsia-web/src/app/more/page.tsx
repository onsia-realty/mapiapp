"use client";

import Link from "next/link";
import {
  ChevronRight,
  Crown,
  Receipt,
  Heart,
  Briefcase,
  Settings,
  Headphones,
  FileText,
  LogOut,
  User,
  Sparkles,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";

// Mock 사용자 상태 — 실제로는 useSession() 등에서 가져옴
const MOCK_USER = {
  isLoggedIn: true,
  name: "김중개",
  tier: "FREE" as "FREE" | "STANDARD",
  earlybirdRemaining: 47,
};

interface MenuItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

function MenuItem({ href, icon, label, badge }: MenuItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition"
    >
      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
        {icon}
      </div>
      <span className="flex-1 text-base text-gray-900">{label}</span>
      {badge && (
        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
          {badge}
        </span>
      )}
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </Link>
  );
}

export default function MorePage() {
  return (
    <MobileLayout>
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-5 py-4">
          <h1 className="text-lg font-bold text-gray-900">더보기</h1>
        </div>
      </header>

      <div className="space-y-4 pb-6">
        {/* 사용자 정보 카드 */}
        <div className="px-5 pt-4">
          {MOCK_USER.isLoggedIn ? (
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900">
                  {MOCK_USER.name}
                </p>
                <p className="text-xs text-gray-500">
                  {MOCK_USER.tier === "STANDARD"
                    ? "Standard 구독 중"
                    : "Free 플랜 사용 중"}
                </p>
              </div>
              <Link
                href="/mypage"
                className="text-sm text-blue-600 font-medium"
              >
                프로필 →
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="block bg-white rounded-xl border border-gray-200 p-4 text-center hover:bg-gray-50"
            >
              <p className="text-base font-bold text-gray-900">로그인이 필요합니다</p>
              <p className="text-xs text-gray-500 mt-1">
                매물 등록·관심 목록·구독 관리
              </p>
            </Link>
          )}
        </div>

        {/* 요금제 강조 카드 (Free 사용자 업셀) */}
        {MOCK_USER.isLoggedIn && MOCK_USER.tier === "FREE" && (
          <div className="px-5">
            <Link
              href="/billing/plans"
              className="block rounded-xl p-5 text-white relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">💎</div>
                <div className="flex-1">
                  <p className="text-base font-bold mb-1">
                    Standard 구독 시작하기
                  </p>
                  <p className="text-xs opacity-90 mb-3">
                    매물 등록 · 마피 매물 · 구인구직 모두 사용
                  </p>
                  <div className="inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-bold">
                    <Sparkles className="w-3 h-3" />
                    얼리버드 {MOCK_USER.earlybirdRemaining}/100명 남음 · 14,900원
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 mt-1" />
              </div>
            </Link>
          </div>
        )}

        {/* 메인 메뉴 */}
        <div className="bg-white">
          <div className="px-5 py-2 text-xs font-semibold text-gray-500 uppercase">
            구독 · 결제
          </div>
          <MenuItem
            href="/billing/plans"
            icon={<Crown className="w-5 h-5" />}
            label="요금제"
            badge={
              MOCK_USER.tier === "FREE" && MOCK_USER.earlybirdRemaining > 0
                ? "🔥 50% OFF"
                : undefined
            }
          />
          {MOCK_USER.tier === "STANDARD" && (
            <MenuItem
              href="/mypage/subscription"
              icon={<Receipt className="w-5 h-5" />}
              label="내 구독 관리"
            />
          )}
          <MenuItem
            href="/mypage/payment-history"
            icon={<Receipt className="w-5 h-5" />}
            label="결제 내역"
          />
        </div>

        <div className="bg-white">
          <div className="px-5 py-2 text-xs font-semibold text-gray-500 uppercase">
            내 활동
          </div>
          <MenuItem
            href="/favorites"
            icon={<Heart className="w-5 h-5" />}
            label="관심 매물"
          />
          <MenuItem
            href="/register/list"
            icon={<Briefcase className="w-5 h-5" />}
            label="등록한 매물"
          />
          <MenuItem
            href="/jobs"
            icon={<Briefcase className="w-5 h-5" />}
            label="구인구직"
          />
        </div>

        <div className="bg-white">
          <div className="px-5 py-2 text-xs font-semibold text-gray-500 uppercase">
            지원
          </div>
          <MenuItem
            href="/support"
            icon={<Headphones className="w-5 h-5" />}
            label="고객센터"
          />
          <MenuItem
            href="/notice"
            icon={<FileText className="w-5 h-5" />}
            label="공지사항"
          />
          <MenuItem
            href="/settings"
            icon={<Settings className="w-5 h-5" />}
            label="설정"
          />
        </div>

        {MOCK_USER.isLoggedIn && (
          <div className="bg-white">
            <button
              type="button"
              className="flex items-center gap-3 px-4 py-3.5 w-full hover:bg-gray-50 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="flex-1 text-base text-gray-900 text-left">
                로그아웃
              </span>
            </button>
          </div>
        )}

        {/* 약관/정책 푸터 */}
        <div className="px-5 pt-2 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
          <Link href="#" className="underline">이용약관</Link>
          <Link href="#" className="underline">개인정보처리방침</Link>
          <Link href="#" className="underline">환불정책</Link>
          <Link href="#" className="underline">사업자 정보</Link>
        </div>

        <div className="text-center text-xs text-gray-400 pt-2">
          (주) 온시아 · v1.0.0
        </div>
      </div>
    </MobileLayout>
  );
}

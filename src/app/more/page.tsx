"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, Bell, BriefcaseBusiness, Building2, ChevronRight, CircleHelp, Crown, FileText, Heart, HousePlus, LogIn, LogOut, MessageSquareText, Receipt, Settings, ShieldCheck, User } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { clearDemoSession, useDemoSession } from "@/lib/demo-auth";

type Item = { href: string; label: string; icon: React.ElementType; badge?: string };

const ROLE_MENUS: Record<string, Item[]> = {
  broker: [
    { href: "/register", label: "새 매물 등록", icon: HousePlus, badge: "중개사" },
    { href: "/register/list", label: "등록 매물 관리", icon: Building2 },
    { href: "/jobs/write", label: "구인 공고 등록", icon: BriefcaseBusiness },
    { href: "/favorites", label: "관심 매물", icon: Heart },
  ],
  sales: [
    { href: "/jobs/write", label: "분양 현장 공고 등록", icon: BriefcaseBusiness, badge: "분양사" },
    { href: "/register/list", label: "현장·공고 관리", icon: Building2 },
    { href: "/jobs/gujik/1", label: "구직자 정보", icon: User },
    { href: "/billing/plans", label: "광고 상품 안내", icon: Crown },
  ],
  general: [
    { href: "/favorites", label: "관심 매물", icon: Heart, badge: "8" },
    { href: "/request/bunyanggwon", label: "분양권 매물 요청", icon: MessageSquareText },
    { href: "/category/bunyanggwon", label: "분양권 둘러보기", icon: Building2 },
    { href: "/jobs", label: "구인구직", icon: BriefcaseBusiness },
  ],
};

function MenuRow({ item }: { item: Item }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className="flex items-center gap-3 border-b border-[#f0edf3] px-4 py-3.5 last:border-b-0 active:bg-[#f8f6fb]">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eafd] text-[#6f2bd9]"><Icon className="h-[18px] w-[18px]" /></div>
      <span className="flex-1 text-[14px] font-bold text-[#28222f]">{item.label}</span>
      {item.badge && <span className="rounded-full bg-[#fff3d1] px-2 py-0.5 text-[10px] font-black text-[#976915]">{item.badge}</span>}
      <ChevronRight className="h-4 w-4 text-[#bbb4c4]" />
    </Link>
  );
}

export default function MorePage() {
  const router = useRouter();
  const account = useDemoSession();

  const logout = () => {
    clearDemoSession();
    router.push("/login");
  };

  return (
    <MobileLayout>
      <header className="sticky top-0 z-10 border-b border-[#332b45] bg-[#17121f]/95 px-5 py-4 text-white backdrop-blur-xl">
        <div className="flex items-center justify-between"><div><p className="gold-text text-[9px] font-black tracking-[.2em]">MAPI PREMIUM</p><h1 className="mt-0.5 text-lg font-black">더보기</h1></div><button type="button" onClick={() => alert("새 알림이 없습니다.")} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8"><Bell className="h-[18px] w-[18px] text-white/75" /></button></div>
      </header>

      <div className="space-y-4 px-4 pb-8 pt-4">
        {account ? (
          <Link href="/mypage" className="block rounded-[22px] bg-[#211a2c] p-4 text-white shadow-[0_10px_26px_rgba(27,20,38,.16)]">
            <div className="flex items-center gap-3">
              <div className="gold-fill flex h-12 w-12 items-center justify-center rounded-2xl"><User className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="font-black">{account.name}</p><span className="rounded-full border border-[#d7ae54]/40 px-2 py-0.5 text-[9px] font-black text-[#efd587]">{account.roleLabel}</span></div><p className="mt-1 truncate text-[11px] text-white/45">{account.email}</p></div>
              <ChevronRight className="h-5 w-5 text-white/35" />
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/[.06] px-3 py-2 text-[11px] text-white/55"><ShieldCheck className="h-3.5 w-3.5 text-[#dfbd65]" /> 데모 계정으로 로그인 중 · MY 화면 보기</div>
          </Link>
        ) : (
          <Link href="/login" className="block rounded-[22px] border border-[#e6e0eb] bg-white p-5 shadow-[0_5px_18px_rgba(30,24,39,.05)]">
            <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eee8f8]"><LogIn className="h-5 w-5 text-[#6f2bd9]" /></div><div className="flex-1"><p className="font-black text-[#211b29]">데모 로그인</p><p className="mt-1 text-xs text-[#847c8d]">역할별 전용 메뉴를 확인하세요</p></div><ChevronRight className="h-5 w-5 text-[#bbb4c4]" /></div>
          </Link>
        )}

        {account && (
          <section>
            <p className="mb-2 px-1 text-[11px] font-black tracking-wide text-[#918897]">{account.roleLabel} 전용 메뉴</p>
            <div className="overflow-hidden rounded-[20px] border border-[#ebe7ef] bg-white">{ROLE_MENUS[account.role].map((item) => <MenuRow key={item.label} item={item} />)}</div>
          </section>
        )}

        <section>
          <p className="mb-2 px-1 text-[11px] font-black tracking-wide text-[#918897]">구독 · 결제</p>
          <div className="overflow-hidden rounded-[20px] border border-[#ebe7ef] bg-white">
            <MenuRow item={{ href: "/broker-guide", label: "중개사 가입 · 광고 안내", icon: BadgeCheck, badge: "NEW" }} />
            <MenuRow item={{ href: "/billing/plans", label: "요금제 및 광고 상품", icon: Crown, badge: "PROMO" }} />
            <MenuRow item={{ href: "/mypage/subscription", label: "이용 상품 관리", icon: Receipt }} />
          </div>
        </section>

        <section>
          <p className="mb-2 px-1 text-[11px] font-black tracking-wide text-[#918897]">서비스 안내</p>
          <div className="overflow-hidden rounded-[20px] border border-[#ebe7ef] bg-white">
            <MenuRow item={{ href: "/support", label: "고객센터", icon: CircleHelp }} />
            <MenuRow item={{ href: "/notice", label: "공지사항", icon: FileText }} />
            <MenuRow item={{ href: "/settings", label: "설정", icon: Settings }} />
          </div>
        </section>

        {account && <button type="button" onClick={logout} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#ded8e4] bg-white text-sm font-bold text-[#6b6472]"><LogOut className="h-4 w-4" /> 로그아웃</button>}

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-1 text-[10px] text-[#99919f]"><Link href="/policy/terms">이용약관</Link><Link href="/policy/privacy">개인정보처리방침</Link><Link href="/policy/refund">환불정책</Link><Link href="/policy/business">사업자정보</Link><span className="w-full text-center">㈜온시아 · v1.0.0-demo</span></div>
      </div>
    </MobileLayout>
  );
}

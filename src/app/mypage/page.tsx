"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, ChevronRight, Heart, HousePlus, LogOut, MessageSquareText, Phone, Sparkles, User, WalletCards } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { clearDemoSession, useDemoSession } from "@/lib/demo-auth";

const DASHBOARDS = {
  broker: {
    greeting: "중개 업무를 한눈에 관리하세요",
    stats: [["등록 매물", "12"], ["오늘 문의", "7"], ["관심", "38"]],
    actions: [
      { label: "매물 등록", sub: "분양권·이자만", href: "/register", icon: HousePlus },
      { label: "등록 매물", sub: "노출·상태 관리", href: "/register/list", icon: Building2 },
      { label: "구인 등록", sub: "중개 인재 찾기", href: "/jobs/write", icon: BriefcaseBusiness },
      { label: "관심 매물", sub: "저장 목록 보기", href: "/favorites", icon: Heart },
    ],
  },
  sales: {
    greeting: "분양 현장과 상담을 관리하세요",
    stats: [["운영 현장", "4"], ["오늘 문의", "19"], ["지원자", "23"]],
    actions: [
      { label: "현장 공고", sub: "분양 공고 등록", href: "/jobs/write", icon: BriefcaseBusiness },
      { label: "등록 현황", sub: "공고·노출 관리", href: "/register/list", icon: Building2 },
      { label: "구직자 보기", sub: "인재 정보 확인", href: "/jobs/gujik/1", icon: User },
      { label: "이용 상품", sub: "광고·구독 관리", href: "/billing/plans", icon: WalletCards },
    ],
  },
  general: {
    greeting: "내 집 찾기 여정을 이어가세요",
    stats: [["관심 매물", "8"], ["최근 본 매물", "14"], ["문의", "3"]],
    actions: [
      { label: "관심 매물", sub: "찜한 매물 모아보기", href: "/favorites", icon: Heart },
      { label: "분양권 찾기", sub: "프리미엄 매물", href: "/category/bunyanggwon", icon: Building2 },
      { label: "매물 요청", sub: "원하는 조건 남기기", href: "/request/bunyanggwon", icon: MessageSquareText },
      { label: "구인구직", sub: "채용 정보 둘러보기", href: "/jobs", icon: BriefcaseBusiness },
    ],
  },
};

export default function MyPage() {
  const router = useRouter();
  const account = useDemoSession();
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phoneDone, setPhoneDone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  const logout = () => {
    clearDemoSession();
    router.push("/login");
  };

  if (!account) {
    return (
      <MobileLayout>
        <PageHeader title="MY" />
        <div className="px-5 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ece6f8]"><User className="h-7 w-7 text-[#7b2ff7]" /></div>
          <h2 className="mt-5 text-xl font-black text-[#191622]">로그인이 필요해요</h2>
          <p className="mt-2 text-sm leading-6 text-[#7c7687]">역할별 MY 화면과 관리 기능을<br />데모 계정으로 확인해보세요.</p>
          <Link href="/login" className="gold-fill mt-7 inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-sm font-black">데모 로그인 <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </MobileLayout>
    );
  }

  const dashboard = DASHBOARDS[account.role];

  return (
    <MobileLayout>
      <PageHeader title="MY" />
      <div className="space-y-5 px-4 pb-8 pt-4">
        <section className="overflow-hidden rounded-[24px] bg-[#1d1728] p-5 text-white shadow-[0_12px_30px_rgba(29,23,40,.2)]">
          <div className="flex items-start gap-3">
            <div className="gold-fill flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl"><User className="h-6 w-6" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-black">{account.name}</h1>
                <span className="rounded-full border border-[#d7ae54]/45 bg-[#d7ae54]/10 px-2 py-0.5 text-[10px] font-black text-[#ecd17f]">{account.roleLabel}</span>
              </div>
              <p className="mt-1 truncate text-xs text-white/50">{account.company}</p>
              <p className="mt-0.5 truncate text-[11px] text-white/35">{account.email}</p>
            </div>
          </div>
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-[#ecd17f]"><Sparkles className="h-3.5 w-3.5" /> {dashboard.greeting}</p>
            <div className="mt-4 grid grid-cols-3 divide-x divide-white/10">
              {dashboard.stats.map(([label, value]) => <div key={label} className="text-center"><p className="text-xl font-black">{value}</p><p className="mt-1 text-[10px] text-white/45">{label}</p></div>)}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between px-1"><div><p className="text-[11px] font-black text-[#9d7530]">QUICK MENU</p><h2 className="mt-0.5 text-lg font-black text-[#191622]">주요 업무</h2></div><Link href="/more" className="text-xs font-bold text-[#7c7687]">전체 메뉴</Link></div>
          <div className="grid grid-cols-2 gap-3">
            {dashboard.actions.map(({ label, sub, href, icon: Icon }) => (
              <Link key={label} href={href} className="rounded-[20px] border border-[#ebe7ef] bg-white p-4 shadow-[0_4px_14px_rgba(27,23,38,.045)] active:scale-[.98]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eafd] text-[#6f2bd9]"><Icon className="h-5 w-5" /></div>
                <p className="mt-3 text-sm font-black text-[#191622]">{label}</p><p className="mt-1 text-[11px] text-[#8c8497]">{sub}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[20px] border border-[#ebe7ef] bg-white">
          <Link href="/mypage/subscription" className="flex items-center gap-3 px-4 py-4 active:bg-[#f8f6fb]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff5db] text-[#a77718]"><WalletCards className="h-5 w-5" /></div><span className="flex-1 text-sm font-bold text-[#28222f]">이용 상품 관리</span><ChevronRight className="h-4 w-4 text-[#b8b1c2]" /></Link>
          <button type="button" onClick={() => { setPhoneOpen(true); setPhoneDone(false); }} className="flex w-full items-center gap-3 border-t border-[#f0edf3] px-4 py-4 text-left active:bg-[#f8f6fb]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f3ff] text-[#3475ba]"><Phone className="h-5 w-5" /></div><span className="flex-1 text-sm font-bold text-[#28222f]">휴대전화번호 재설정</span><ChevronRight className="h-4 w-4 text-[#b8b1c2]" /></button>
        </section>

        {phoneOpen && (
          <section className="rounded-[20px] border border-[#ddd5e4] bg-white p-4 shadow-[0_8px_22px_rgba(32,24,43,.08)]">
            {phoneDone ? (
              <div className="py-3 text-center"><CheckCircle2 className="mx-auto h-9 w-9 text-[#7b2ff7]" /><p className="mt-3 text-sm font-black text-[#28222f]">휴대전화번호가 저장되었습니다</p><p className="mt-1 text-[11px] text-[#817987]">데모 완료 상태이며 실제 정보는 저장되지 않습니다.</p><button type="button" onClick={() => setPhoneOpen(false)} className="mt-4 h-10 rounded-xl bg-[#211a2c] px-6 text-xs font-black text-white">확인</button></div>
            ) : (
              <form onSubmit={(event) => { event.preventDefault(); setPhoneInput(""); setPhoneDone(true); }}>
                <div className="flex items-center justify-between"><div><h2 className="text-sm font-black text-[#28222f]">휴대전화번호 재설정</h2><p className="mt-1 text-[11px] text-[#817987]">현재 번호 010-****-1234</p></div><button type="button" onClick={() => setPhoneOpen(false)} className="text-xs font-bold text-[#918897]">닫기</button></div>
                <label className="mt-4 block"><span className="mb-2 block text-[11px] font-bold text-[#716979]">새 휴대전화번호</span><input inputMode="numeric" value={phoneInput} onChange={(event) => setPhoneInput(event.target.value.replace(/[^0-9]/g, "").slice(0, 11))} placeholder="숫자만 입력" required minLength={10} className="h-11 w-full rounded-xl border border-[#ddd7e3] px-3 text-sm outline-none focus:border-[#7b2ff7]" /></label>
                <p className="mt-2 text-[10px] leading-4 text-[#9a929f]">입력값은 데모 화면에만 임시 표시되며 저장·전송되지 않습니다. 실제 변경은 개발사 인증 API 연동 대상입니다.</p>
                <button type="submit" className="gold-fill mt-4 h-11 w-full rounded-xl text-xs font-black">번호 저장</button>
              </form>
            )}
          </section>
        )}

        <div className="flex gap-2">
          <Link href="/login" className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[#ddd7e3] bg-white text-xs font-bold text-[#645d6d]">다른 역할 체험</Link>
          <button type="button" onClick={logout} className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#292330] text-xs font-bold text-white"><LogOut className="h-3.5 w-3.5" /> 로그아웃</button>
        </div>
      </div>
    </MobileLayout>
  );
}

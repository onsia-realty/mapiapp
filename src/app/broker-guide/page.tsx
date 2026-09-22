import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, Building2, CheckCircle2, Crown, FileCheck2, HousePlus, Megaphone } from "lucide-react";

const STEPS = [
  { icon: Building2, title: "중개사 정보 등록", description: "사무소·대표자·사업자 정보를 입력합니다." },
  { icon: FileCheck2, title: "자격 서류 인증", description: "사업자등록증과 공인중개사 자격증을 제출합니다." },
  { icon: BadgeCheck, title: "관리자 승인", description: "승인 후 중개사 프로필과 전용 메뉴가 활성화됩니다." },
  { icon: HousePlus, title: "매물·구인 등록", description: "분양권·이자만 매물과 구인 공고를 관리합니다." },
];

export default function BrokerGuidePage() {
  return (
    <main className="min-h-screen bg-[var(--surface-muted)] pb-28">
      <header className="bg-[#17121f] px-5 pb-8 pt-[max(18px,env(safe-area-inset-top))] text-white">
        <div className="mx-auto max-w-[430px]"><Link href="/more" className="grid h-10 w-10 place-items-center rounded-xl bg-white/8" aria-label="뒤로가기"><ArrowLeft className="h-5 w-5" /></Link><p className="gold-text mt-7 text-[10px] font-black tracking-[.2em]">MAPI PARTNER</p><h1 className="mt-1 text-[27px] font-black leading-tight">중개사 가입부터<br />광고·매물 관리까지</h1><p className="mt-3 text-[13px] leading-6 text-white/55">기존 앱에서 외부 링크로 빠지던 중개사 가입·광고 안내를 데모 내부 흐름으로 연결했습니다.</p><Link href="/signup" className="gold-fill mt-6 flex h-13 items-center justify-center gap-2 rounded-2xl text-sm font-black">중개사 등록 시작 <ArrowRight className="h-4 w-4" /></Link></div>
      </header>
      <div className="mx-auto max-w-[430px] space-y-4 px-4 pt-5">
        <section className="rounded-[22px] border border-[#ead99c] bg-[#fff9e9] p-5"><div className="flex items-start gap-3"><span className="gold-fill grid h-11 w-11 shrink-0 place-items-center rounded-[14px]"><Crown className="h-5 w-5" /></span><div><p className="text-[10px] font-black tracking-[1px] text-[#9d7530]">VERIFIED BROKER BENEFIT</p><h2 className="mt-1 text-lg font-black text-[#3a2c10]">자격증 인증 시 첫 1개월 무료</h2><p className="mt-1 text-[11px] leading-5 text-[#7a6536]">관리자 승인 후 Standard 상품 체험과 중개사 프로필 노출을 연결합니다.</p></div></div></section>
        <section className="rounded-[22px] border border-[var(--line)] bg-white p-5"><h2 className="text-lg font-black text-[var(--brand-ink)]">가입·승인 절차</h2><div className="mt-4 space-y-4">{STEPS.map(({ icon: Icon, title, description }, index) => <div key={title} className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-[var(--brand-purple-soft)] text-[var(--brand-purple)]"><Icon className="h-5 w-5" /></span><div className="flex-1 border-b border-[var(--line)] pb-4 last:border-0"><p className="text-[10px] font-black text-[var(--brand-purple)]">STEP {index + 1}</p><p className="mt-0.5 text-[14px] font-black text-[var(--brand-ink)]">{title}</p><p className="mt-1 text-[11px] text-[var(--text-muted)]">{description}</p></div></div>)}</div></section>
        <section className="rounded-[22px] border border-[var(--line)] bg-white p-5"><div className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-[var(--brand-purple)]" /><h2 className="text-lg font-black text-[var(--brand-ink)]">연결되는 기능</h2></div><div className="mt-4 grid grid-cols-2 gap-2">{["분양권·이자만 등록", "등록 매물 관리", "중개사 구인 공고", "광고·구독 상품", "상담 의뢰 확인", "지역 전문 프로필"].map((item) => <div key={item} className="flex items-center gap-2 rounded-[13px] bg-[var(--surface-muted)] px-3 py-3 text-[11px] font-bold text-[#5e5666]"><CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--brand-purple)]" />{item}</div>)}</div></section>
        <Link href="/billing/plans" className="flex items-center justify-between rounded-[20px] bg-[var(--brand-ink)] p-5 text-white"><div><p className="text-[10px] font-black text-[#e4c36d]">PRICING</p><p className="mt-1 text-[14px] font-black">요금제·광고 상품 확인</p></div><ArrowRight className="h-5 w-5" /></Link>
      </div>
    </main>
  );
}


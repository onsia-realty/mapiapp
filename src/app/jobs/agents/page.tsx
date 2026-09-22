"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Building2, ChevronRight, Clock3, MapPin, Plus, ShieldCheck, SlidersHorizontal, Sparkles } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

const IMG = {
  city: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=600&fit=crop",
  street: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=700&h=500&fit=crop",
  office: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&h=500&fit=crop",
  apartment: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&h=500&fit=crop",
  house: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&h=500&fit=crop",
  tower: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=700&h=500&fit=crop",
  urban: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=700&h=500&fit=crop",
};

const REGIONS = [
  { name: "전국", image: IMG.city }, { name: "서울", image: IMG.street, hot: true },
  { name: "경기남부", image: IMG.apartment, hot: true }, { name: "인천", image: IMG.urban },
  { name: "부산", image: IMG.tower },
];

type Badge = "VIP" | "HOT" | "NEW";
interface AgentJob {
  title: string; office: string; region: string; property: string; pay: string;
  summary: string; tags: string[]; image: string; badge?: Badge; due?: string;
}

const PREMIUM: AgentJob[] = [
  { title: "마포 대단지 전담 공인중개사", office: "한강프라임공인중개사사무소", region: "서울 마포구", property: "아파트 · 입주장", pay: "기본급 280만 + 성과급", summary: "신축 대단지 전속 매물과 기존 고객 DB를 함께 운영합니다.", tags: ["광고비 지원", "고객 DB", "주 5일 협의"], image: IMG.city, badge: "VIP", due: "D-5" },
  { title: "강남 상업용 부동산 경력 중개사", office: "시그니처리얼티 강남본점", region: "서울 강남구", property: "상가 · 사무실", pay: "성과보수 60% 지급", summary: "기업 이전과 수익형 부동산을 담당할 경력 파트너를 찾습니다.", tags: ["법인 고객", "전문 교육", "팀 인센티브"], image: IMG.street, badge: "VIP", due: "D-8" },
];

const RECOMMENDED: AgentJob[] = [
  { title: "광교 신도시 아파트 중개", office: "광교센트럴부동산", region: "경기 수원", property: "아파트", pay: "월 300만 + 인센티브", summary: "공동중개 경험자 우대", tags: ["주 5일", "차량 지원"], image: IMG.house, badge: "HOT" },
  { title: "송도 오피스텔 전담 중개", office: "송도퍼스트공인중개사", region: "인천 연수구", property: "오피스텔", pay: "수수료 55% 지급", summary: "신입 실무교육 제공", tags: ["신입 가능", "중식 제공"], image: IMG.urban, badge: "NEW" },
  { title: "해운대 고급주거 컨설턴트", office: "마린시티리얼티", region: "부산 해운대", property: "아파트 · 빌라", pay: "면접 후 협의", summary: "고객 상담 경력 우대", tags: ["성과급", "고객 DB"], image: IMG.tower },
  { title: "판교 상가 임대차 담당", office: "판교밸리부동산", region: "경기 성남", property: "상가 · 사무실", pay: "기본급 260만 + 성과급", summary: "기업 임차 문의 다수", tags: ["주 5일", "경력 우대"], image: IMG.office, badge: "NEW" },
];

const URGENT: AgentJob[] = [
  { title: "동탄 입주장 함께할 소속 공인중개사", office: "동탄역더샵공인중개사", region: "경기 화성", property: "신축 아파트", pay: "중개보수 50% + 월 인센티브", summary: "입주 매물 120건 확보 · 바로 상담 가능한 분을 모십니다.", tags: ["즉시 출근", "매물 확보", "주차 지원"], image: IMG.apartment, badge: "HOT", due: "오늘 마감" },
  { title: "전월세 실무 가능한 공인중개사", office: "연남우리동네부동산", region: "서울 마포구", property: "원룸 · 빌라", pay: "월 270만 + 계약 인센티브", summary: "온라인 광고 문의 응대와 현장 안내를 담당합니다.", tags: ["주 5일", "식대 지원", "경력 1년+"], image: IMG.house, badge: "NEW", due: "D-3" },
  { title: "검단 신도시 매매 전담 중개사", office: "검단금빛공인중개사", region: "인천 서구", property: "아파트", pay: "성과보수 최대 65%", summary: "지역 매물 광고와 고객 관리에 강점 있는 분을 우대합니다.", tags: ["광고 지원", "자율 출근", "팀 보너스"], image: IMG.city, due: "D-7" },
];

const LATEST: AgentJob[] = [
  { title: "잠실 재건축 전문 중개 파트너", office: "엘스단지공인중개사", region: "서울 송파", property: "아파트", pay: "협의", summary: "", tags: [], image: IMG.apartment, badge: "NEW" },
  { title: "수지 상가 임대차 경력직", office: "수지스타부동산", region: "경기 용인", property: "상가", pay: "월 320만+", summary: "", tags: [], image: IMG.street },
  { title: "청라 오피스텔 소속 중개사", office: "청라호수부동산", region: "인천 서구", property: "오피스텔", pay: "수수료 55%", summary: "", tags: [], image: IMG.urban, badge: "HOT" },
  { title: "센텀 기업 이전 컨설턴트", office: "센텀비즈리얼티", region: "부산 해운대", property: "사무실", pay: "면접 협의", summary: "", tags: [], image: IMG.tower },
];

function BadgeMark({ badge }: { badge?: Badge }) {
  if (!badge) return null;
  if (badge === "VIP") return <span className="gold-fill rounded-full px-2 py-1 text-[9px] font-black tracking-[.5px]">VIP</span>;
  return <span className={cn("rounded-full px-2 py-1 text-[9px] font-black", badge === "HOT" ? "bg-[#FFF0F1] text-[#E8424A]" : "bg-[#EAF8EF] text-[#189454]")}>{badge}</span>;
}

function SectionTitle({ eyebrow, title, hint, gold }: { eyebrow: string; title: string; hint?: string; gold?: boolean }) {
  return <div className="mb-3.5"><p className={cn("mb-1 text-[10px] font-black tracking-[1.2px]", gold ? "text-[var(--brand-gold)]" : "text-[var(--brand-purple)]")}>{eyebrow}</p><div className="flex items-end justify-between gap-3"><h2 className="text-[19px] font-black tracking-[-.55px] text-[var(--text-strong)]">{title}</h2>{hint && <p className="pb-0.5 text-[10.5px] font-semibold text-[var(--text-muted)]">{hint}</p>}</div></div>;
}

function WideCard({ job, premium = false }: { job: AgentJob; premium?: boolean }) {
  return <Link href="/jobs/guin1" className="relative block overflow-hidden rounded-[20px] border border-[var(--line)] bg-white p-3.5 shadow-[0_6px_20px_rgba(27,23,38,.05)] active:scale-[.985]">
    {premium && <span className="gold-fill absolute left-0 top-0 h-full w-[3px]" />}
    <div className="flex gap-3.5"><div className="relative h-[132px] w-[132px] shrink-0 overflow-hidden rounded-[16px]"><Image src={job.image} alt={job.office} fill sizes="132px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" /><span className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-1 text-[9px] font-bold text-white backdrop-blur">{job.property}</span></div>
    <div className="flex min-w-0 flex-1 flex-col"><div className="flex items-center justify-between gap-2"><span className="truncate text-[10.5px] font-bold text-[var(--text-muted)]">{job.region}</span><div className="flex items-center gap-1.5"><BadgeMark badge={job.badge} /><Bookmark className="h-4 w-4 text-[#C8C2D1]" /></div></div><h3 className="mt-1 line-clamp-2 text-[15px] font-black leading-[1.35] tracking-[-.35px] text-[var(--brand-ink)]">{job.title}</h3><p className="mt-1 truncate text-[11px] font-medium text-[var(--text-muted)]">{job.office}</p><p className={cn("mt-auto text-[14px] font-black", premium ? "text-[#9D7530]" : "text-[var(--brand-purple)]")}>{job.pay}</p>{job.due && <span className="mt-1 text-[10px] font-bold text-[#E5484D]">{job.due}</span>}</div></div>
    <p className="mt-3 line-clamp-1 border-t border-[#F1EEF4] pt-3 text-[11.5px] font-medium text-[#675F73]">{job.summary}</p><div className="mt-2 flex flex-wrap gap-1.5">{job.tags.map((tag) => <span key={tag} className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[10px] font-bold text-[#6D6678]">{tag}</span>)}</div>
  </Link>;
}

function GridCard({ job }: { job: AgentJob }) {
  return <Link href="/jobs/guin1" className="overflow-hidden rounded-[18px] border border-[var(--line)] bg-white shadow-[0_4px_14px_rgba(27,23,38,.045)] active:scale-[.98]"><div className="relative h-[112px]"><Image src={job.image} alt={job.office} fill sizes="190px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" /><span className="absolute bottom-2 left-2 text-[10px] font-bold text-white">{job.region}</span><span className="absolute right-2 top-2"><BadgeMark badge={job.badge} /></span></div><div className="p-3"><p className="text-[9.5px] font-bold text-[var(--text-muted)]">{job.property}</p><h3 className="mt-1 line-clamp-2 min-h-[38px] text-[13.5px] font-black leading-[1.38] tracking-[-.3px] text-[var(--brand-ink)]">{job.title}</h3><p className="mt-1 truncate text-[10.5px] text-[var(--text-muted)]">{job.office}</p><p className="mt-2 truncate text-[12px] font-black text-[var(--brand-purple)]">{job.pay}</p><div className="mt-2.5 flex flex-wrap gap-1 border-t border-[#F1EEF4] pt-2.5">{job.tags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-[var(--brand-purple-soft)] px-2 py-1 text-[9px] font-bold text-[var(--brand-purple)]">{tag}</span>)}</div></div></Link>;
}

function CompactCard({ job }: { job: AgentJob }) {
  return <Link href="/jobs/guin1" className="flex items-center gap-3 rounded-[16px] border border-[var(--line)] bg-white p-3 shadow-[0_3px_12px_rgba(27,23,38,.035)] active:scale-[.985]"><div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[13px]"><Image src={job.image} alt={job.office} fill sizes="58px" className="object-cover" /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-1.5"><span className="text-[10px] font-bold text-[var(--text-muted)]">{job.region} · {job.property}</span><BadgeMark badge={job.badge} /></div><h3 className="mt-1 truncate text-[13.5px] font-black text-[var(--brand-ink)]">{job.title}</h3><p className="mt-0.5 truncate text-[10.5px] text-[var(--text-muted)]">{job.office}</p></div><div className="max-w-[78px] shrink-0 text-right"><p className="text-[9.5px] font-bold text-[var(--text-muted)]">급여 조건</p><p className="mt-1 text-[12px] font-black text-[var(--brand-purple)]">{job.pay}</p></div></Link>;
}

export default function AgentJobsPage() {
  const [activeRegion, setActiveRegion] = useState("전국");
  return <MobileLayout><PageHeader title="공인중개사 구인" /><div className="pb-40 pt-4">
    <section className="px-4"><Link href="/jobs/guin1" className="group relative block h-[210px] overflow-hidden rounded-[22px] bg-[var(--brand-ink)] shadow-[0_14px_30px_rgba(27,23,38,.16)] active:scale-[.99]"><Image src={IMG.city} alt="공인중개사 채용" fill priority sizes="398px" className="object-cover transition-transform duration-500 group-active:scale-[1.02]" /><div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(20,15,31,.96)_5%,rgba(27,23,38,.7)_58%,rgba(27,23,38,.12)_100%)]" /><div className="absolute inset-0 flex flex-col justify-between p-5"><div className="flex items-center justify-between"><span className="gold-fill rounded-full px-3 py-1.5 text-[9.5px] font-black tracking-[.8px]">MAPI PARTNER</span><span className="rounded-full bg-black/30 px-2.5 py-1.5 text-[9.5px] font-bold text-white backdrop-blur">검증 중개업소</span></div><div><p className="mb-1.5 text-[11px] font-bold text-[#D7CFE2]">좋은 중개는 좋은 사람에서 시작됩니다</p><h1 className="text-[23px] font-black leading-[1.25] tracking-[-.7px] text-white">경력과 지역에 맞는<br />중개업소를 만나보세요</h1><div className="mt-3 flex items-center gap-1 text-[11px] font-extrabold text-[#F0D894]">프리미엄 채용공고 보기 <ChevronRight className="h-3.5 w-3.5" /></div></div></div></Link></section>
    <section className="mt-4"><div className="hide-scrollbar flex gap-2.5 overflow-x-auto px-4 pb-1 pt-1"><button type="button" aria-label="상세 필터" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-white"><SlidersHorizontal className="h-[18px] w-[18px] text-[#6E6787]" /></button>{REGIONS.map((region) => { const active = region.name === activeRegion; return <button key={region.name} type="button" onClick={() => setActiveRegion(region.name)} className={cn("relative flex h-11 shrink-0 items-center gap-2 rounded-full border pl-1.5 pr-4", active ? "border-[var(--brand-ink)] bg-[var(--brand-ink)] text-white" : "border-[var(--line)] bg-white text-[var(--brand-ink)]")}><span className="relative h-8 w-8 overflow-hidden rounded-full"><Image src={region.image} alt="" fill sizes="32px" className="object-cover" /></span><span className="text-[13px] font-black">{region.name}</span>{region.hot && <span className="absolute -right-1 -top-1 rounded-full bg-[#F04452] px-1.5 py-0.5 text-[8px] font-black text-white">HOT</span>}</button>; })}</div></section>
    <section className="mt-6 px-4"><SectionTitle eyebrow="PREMIUM OFFICE" title="추천 중개업소 채용" hint="MAPI 선별 공고" gold /><div className="space-y-3">{PREMIUM.map((job) => <WideCard key={job.title} job={job} premium />)}</div></section>
    <section className="mt-7 px-4"><SectionTitle eyebrow="RECOMMENDED" title="조건 좋은 추천 공고" hint="전체보기" /><div className="grid grid-cols-2 gap-3">{RECOMMENDED.map((job) => <GridCard key={job.title} job={job} />)}</div></section>
    <section className="mt-7 px-4"><SectionTitle eyebrow="HIRING NOW" title="즉시 채용 공고" hint="빠른 지원 가능" /><div className="mb-3 grid grid-cols-3 gap-2"><div className="rounded-[14px] bg-[#F1EBFF] p-2.5"><Clock3 className="h-4 w-4 text-[var(--brand-purple)]" /><p className="mt-2 text-[10px] font-bold text-[#6E6787]">빠른 연락</p></div><div className="rounded-[14px] bg-[#FFF7E7] p-2.5"><ShieldCheck className="h-4 w-4 text-[#A97819]" /><p className="mt-2 text-[10px] font-bold text-[#6E6787]">자격 확인</p></div><div className="rounded-[14px] bg-[#EBF8F1] p-2.5"><Building2 className="h-4 w-4 text-[#168451]" /><p className="mt-2 text-[10px] font-bold text-[#6E6787]">실무 중심</p></div></div><div className="space-y-3">{URGENT.map((job) => <WideCard key={job.title} job={job} />)}</div></section>
    <section className="mt-7 px-4"><SectionTitle eyebrow="LATEST JOBS" title="지역별 최신 공고" hint={`${activeRegion} 기준`} /><div className="mb-3 flex items-center gap-2 rounded-[14px] bg-[var(--brand-ink)] px-3.5 py-3 text-white"><MapPin className="h-4 w-4 text-[var(--brand-gold)]" /><span className="text-[11px] font-bold">관심 지역의 채용공고를 먼저 보여드려요.</span><Sparkles className="ml-auto h-4 w-4 text-[#EBD79A]" /></div><div className="space-y-2.5">{LATEST.map((job) => <CompactCard key={job.title} job={job} />)}</div></section>
    <section className="mx-4 mt-7 flex items-center gap-3 rounded-[18px] border border-[#D7AE54]/25 bg-[#211B29] p-4 text-white"><span className="gold-fill grid h-10 w-10 shrink-0 place-items-center rounded-[13px]"><Building2 className="h-5 w-5" /></span><div><p className="text-[13px] font-black">중개업소 채용 담당자이신가요?</p><p className="mt-1 text-[10.5px] text-white/55">MAPI에서 검증된 인재를 빠르게 만나보세요.</p></div><ChevronRight className="ml-auto h-4 w-4 text-white/50" /></section>
  </div><Link href="/jobs/write" className="fixed bottom-[104px] left-1/2 z-30 inline-flex translate-x-[50px] items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#7B2FF7,#A855F7)] py-3 pl-3.5 pr-4 text-[13.5px] font-black text-white shadow-[0_8px_22px_rgba(123,47,247,.48)] transition-transform active:scale-95"><Plus className="h-4 w-4" strokeWidth={2.7} /> 공고 등록</Link></MobileLayout>;
}

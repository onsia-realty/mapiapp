"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, BriefcaseBusiness, Building2, ChevronRight, Clock3, MapPin, ShieldCheck, Sparkles, UserRoundSearch, Users } from "lucide-react";
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
};

const REGIONS = [
  { name: "전국", count: 24 }, { name: "서울", count: 7 }, { name: "경기남부", count: 6 },
  { name: "경기북부", count: 3 }, { name: "인천", count: 4 }, { name: "부산", count: 2 }, { name: "대전", count: 2 },
];

type JobAudience = "공인중개사" | "분양상담사";

interface JobItem {
  id: string;
  audience: JobAudience;
  title: string;
  company: string;
  region: string;
  property: string;
  pay: string;
  summary: string;
  tags: string[];
  image: string;
  badge?: "PREMIUM" | "HOT" | "NEW";
  due?: string;
}

const HOT_JOBS: JobItem[] = [
  { id: "hot-sales", audience: "분양상담사", title: "힐스빌리지 수지구청역 분양팀", company: "MAPI 파트너스", region: "경기남부", property: "아파트", pay: "팀 RT 600만원", summary: "광고비 50% 지원 · 신규 현장 첫 조직", tags: ["광고비 지원", "일비", "식사"], image: IMG.apartment, badge: "PREMIUM", due: "즉시 투입" },
  { id: "hot-agent", audience: "공인중개사", title: "마포 대단지 전담 공인중개사", company: "한강프라임공인중개사", region: "서울", property: "신축 아파트", pay: "기본급 280만 + 성과급", summary: "전속 매물과 기존 고객 DB를 함께 운영합니다.", tags: ["고객 DB", "주 5일", "광고 지원"], image: IMG.city, badge: "HOT", due: "D-5" },
  { id: "hot-songdo", audience: "분양상담사", title: "송도 센트럴파크 오피스텔 팀원", company: "시그니처디앤씨", region: "인천", property: "오피스텔", pay: "팀원 RT 720만원", summary: "본사 광고 진행 · 초보자 현장 교육 제공", tags: ["교육", "숙소비", "영업비"], image: IMG.tower, badge: "NEW", due: "D-3" },
];

const REGION_JOBS: JobItem[] = [
  { id: "seoul-agent", audience: "공인중개사", title: "강남 상업용 부동산 경력 중개사", company: "시그니처리얼티 강남", region: "서울", property: "상가·사무실", pay: "성과보수 60%", summary: "법인 이전과 수익형 부동산을 담당합니다.", tags: ["법인 고객", "경력 우대"], image: IMG.street, badge: "HOT" },
  { id: "south-sales", audience: "분양상담사", title: "동탄역 신축 대단지 팀장·팀원", company: "더원개발", region: "경기남부", property: "아파트", pay: "팀 RT 900만원", summary: "대규모 광고 집행과 고객 DB를 지원합니다.", tags: ["광고비", "DB 지원"], image: IMG.apartment, badge: "NEW" },
  { id: "north-sales", audience: "분양상담사", title: "옥정중앙역 역세권 현장 첫 조직", company: "에이치파트너스", region: "경기북부", property: "아파트", pay: "팀원 RT 650만원", summary: "본부·팀·팀원 동시 모집 중입니다.", tags: ["첫 조직", "식사"], image: IMG.house },
  { id: "incheon-agent", audience: "공인중개사", title: "청라 오피스텔 소속 공인중개사", company: "청라호수부동산", region: "인천", property: "오피스텔", pay: "수수료 55%", summary: "신입 실무교육과 온라인 광고를 제공합니다.", tags: ["신입 가능", "교육"], image: IMG.tower, badge: "NEW" },
  { id: "busan-sales", audience: "분양상담사", title: "해운대 하이엔드 주거상품 상담사", company: "마린시티디앤씨", region: "부산", property: "생활형숙박시설", pay: "팀 RT 1,000만원", summary: "고객 상담 경력자를 우대합니다.", tags: ["숙소비", "인센티브"], image: IMG.office },
  { id: "daejeon-agent", audience: "공인중개사", title: "도안신도시 입주장 중개 파트너", company: "도안센트럴부동산", region: "대전", property: "아파트", pay: "월 300만 + 인센티브", summary: "입주 매물 확보와 공동중개를 지원합니다.", tags: ["매물 확보", "주차 지원"], image: IMG.city },
];

const CANDIDATES = [
  { id: "gujik1", role: "공인중개사", title: "아파트 입주장·전월세 실무 가능합니다", region: "서울·경기", career: "경력 10년", skills: ["자격증 인증", "즉시 근무"], availability: "즉시협의" },
  { id: "gujik2", role: "분양상담사", title: "신규 현장 팀원으로 합류 희망합니다", region: "경기남부", career: "경력 3년", skills: ["아파트", "TM 가능"], availability: "즉시가능" },
  { id: "gujik3", role: "분양상담사", title: "본부·팀 세팅 가능한 경력 팀장입니다", region: "전국", career: "경력 8년", skills: ["팀 운영", "현장 오픈"], availability: "협의가능" },
];

function Badge({ value }: { value?: JobItem["badge"] }) {
  if (!value) return null;
  return <span className={cn("rounded-full px-2 py-1 text-[9px] font-black tracking-[.4px]", value === "PREMIUM" ? "gold-fill" : value === "HOT" ? "bg-[#FFEAED] text-[#E13D55]" : "bg-[#E8F8EF] text-[#168B4D]")}>{value}</span>;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="mb-3.5"><p className="text-[10px] font-black tracking-[1.2px] text-[var(--brand-purple)]">{eyebrow}</p><h2 className="mt-1 text-[20px] font-black tracking-[-.65px] text-[var(--brand-ink)]">{title}</h2></div>;
}

function CompactJob({ job }: { job: JobItem }) {
  return <Link href="/jobs/guin1" className="flex gap-3 rounded-[18px] border border-[var(--line)] bg-white p-3 shadow-[0_4px_14px_rgba(27,23,38,.045)] active:scale-[.985]"><div className="relative h-[90px] w-[90px] shrink-0 overflow-hidden rounded-[14px]"><Image src={job.image} alt={job.title} fill sizes="90px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" /><span className="absolute bottom-2 left-2 text-[9px] font-bold text-white">{job.property}</span></div><div className="flex min-w-0 flex-1 flex-col"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold text-[var(--brand-purple)]">{job.audience} · {job.region}</span><Badge value={job.badge} /></div><h3 className="mt-1 line-clamp-2 text-[14px] font-black leading-[1.35] tracking-[-.3px] text-[var(--brand-ink)]">{job.title}</h3><p className="mt-auto truncate text-[12px] font-black text-[#9A702C]">{job.pay}</p><div className="mt-1 flex gap-1">{job.tags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-[9px] font-bold text-[var(--text-muted)]">{tag}</span>)}</div></div></Link>;
}

export default function JobsPage() {
  const [mainTab, setMainTab] = useState<"구인" | "구직">("구인");
  const [activeRegion, setActiveRegion] = useState("전국");
  const visibleJobs = activeRegion === "전국" ? REGION_JOBS : REGION_JOBS.filter((job) => job.region === activeRegion);

  return <MobileLayout>
    <PageHeader title="구인구직">
      <div className="flex items-center justify-between px-4 pb-3"><div className="flex rounded-full bg-[#F3F0FA] p-1">{(["구인", "구직"] as const).map((tab) => <button key={tab} type="button" onClick={() => setMainTab(tab)} className={cn("rounded-full px-5 py-1.5 text-[13.5px] font-bold transition-colors", mainTab === tab ? "bg-[#1B1330] text-white" : "text-[#6E6787]")}>{tab}</button>)}</div><Link href={mainTab === "구인" ? "/jobs/write" : "/jobs/gujik/write"} className="rounded-full bg-[var(--brand-purple)] px-4 py-2 text-[12px] font-black text-white shadow-[0_4px_12px_rgba(123,47,247,.28)]">{mainTab === "구인" ? "공고 등록" : "구직 등록"}</Link></div>
    </PageHeader>

    {mainTab === "구인" ? <div className="space-y-7 px-4 pb-12 pt-4">
      <section className="relative overflow-hidden rounded-[24px] bg-[#21182D] p-5 text-white shadow-[0_14px_30px_rgba(32,23,42,.18)]"><div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[var(--brand-purple)]/30 blur-3xl" /><div className="relative"><div className="flex items-center gap-1.5 text-[10px] font-black tracking-[1.2px] text-[#E7C66D]"><ShieldCheck className="h-3.5 w-3.5" /> VERIFIED JOB NETWORK</div><h1 className="mt-2 text-[24px] font-black leading-[1.25] tracking-[-.8px]">좋은 사람과 좋은 현장을<br />더 빠르게 연결합니다</h1><p className="mt-2 text-[11.5px] leading-5 text-white/55">공인중개사 채용부터 분양 현장 RT·지원 조건까지 한눈에 비교하세요.</p><div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">{[{ value: "24", label: "진행 공고" }, { value: "9", label: "이번 주 신규" }, { value: "7", label: "즉시 투입" }].map((stat) => <div key={stat.label}><p className="text-[19px] font-black text-[#E7C66D]">{stat.value}</p><p className="text-[9.5px] font-semibold text-white/45">{stat.label}</p></div>)}</div></div></section>

      <section><SectionTitle eyebrow="CHOOSE YOUR CAREER" title="어떤 일을 찾고 있나요?" /><div className="grid grid-cols-2 gap-3"><Link href="/jobs/agents" className="group relative min-h-[178px] overflow-hidden rounded-[22px] bg-white p-4 shadow-[0_7px_22px_rgba(27,23,38,.07)] active:scale-[.98]"><div className="absolute -right-7 -top-7 h-28 w-28 rounded-full bg-[#EEE7FF]" /><span className="relative grid h-11 w-11 place-items-center rounded-[14px] bg-[var(--brand-purple)] text-white"><BriefcaseBusiness className="h-5 w-5" /></span><p className="relative mt-5 text-[18px] font-black tracking-[-.5px] text-[var(--brand-ink)]">공인중개사</p><p className="relative mt-1 text-[10.5px] leading-4 text-[var(--text-muted)]">지역 매물·입주장 중심<br />검증된 중개사무소</p><div className="relative mt-3 flex items-center gap-1 text-[10.5px] font-black text-[var(--brand-purple)]">공고 11개 <ChevronRight className="h-3.5 w-3.5" /></div></Link><Link href="/jobs/sales" className="group relative min-h-[178px] overflow-hidden rounded-[22px] bg-[#21182D] p-4 text-white shadow-[0_7px_22px_rgba(27,23,38,.12)] active:scale-[.98]"><div className="absolute -right-7 -top-7 h-28 w-28 rounded-full bg-[#D7AE54]/15" /><span className="gold-fill relative grid h-11 w-11 place-items-center rounded-[14px]"><Users className="h-5 w-5" /></span><p className="relative mt-5 text-[18px] font-black tracking-[-.5px]">분양상담사</p><p className="relative mt-1 text-[10.5px] leading-4 text-white/50">현장·RT·지원 조건을<br />한 번에 비교</p><div className="gold-text relative mt-3 flex items-center gap-1 text-[10.5px] font-black">공고 13개 <ChevronRight className="h-3.5 w-3.5" /></div></Link></div></section>

      <section><SectionTitle eyebrow="TRENDING NOW" title="지금 뜨는 HOT 공고" /><div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{HOT_JOBS.map((job, index) => <Link key={job.id} href="/jobs/guin1" className="w-[286px] shrink-0 snap-start overflow-hidden rounded-[22px] border border-[var(--line)] bg-white shadow-[0_8px_22px_rgba(27,23,38,.07)] active:scale-[.985]"><div className="relative h-[156px]"><Image src={job.image} alt={job.title} fill sizes="286px" loading={index === 0 ? "eager" : "lazy"} className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#17101F]/85 via-transparent to-black/10" /><div className="absolute left-3 top-3 flex items-center gap-1.5"><Badge value={job.badge} /><span className="rounded-full bg-black/45 px-2 py-1 text-[9px] font-bold text-white backdrop-blur">{job.audience}</span></div><div className="absolute bottom-3 left-3 right-3"><p className="text-[10px] font-bold text-white/70">{job.property} · {job.region}</p><h3 className="mt-1 line-clamp-2 text-[17px] font-black leading-[1.3] tracking-[-.45px] text-white">{job.title}</h3></div></div><div className="p-4"><div className="flex items-center justify-between gap-3"><p className="text-[15px] font-black text-[#9A702C]">{job.pay}</p><span className="flex items-center gap-1 text-[10px] font-bold text-[#E5484D]"><Clock3 className="h-3 w-3" />{job.due}</span></div><p className="mt-2 line-clamp-1 text-[11px] text-[var(--text-muted)]">{job.summary}</p><div className="mt-3 flex gap-1.5">{job.tags.map((tag) => <span key={tag} className="rounded-full bg-[var(--brand-purple-soft)] px-2.5 py-1 text-[9.5px] font-bold text-[var(--brand-purple)]">{tag}</span>)}</div></div></Link>)}</div></section>

      <section><SectionTitle eyebrow="FIND BY AREA" title="지역별 현장" /><div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{REGIONS.map((region) => <button key={region.name} type="button" onClick={() => setActiveRegion(region.name)} className={cn("shrink-0 rounded-[14px] border px-3.5 py-2.5 text-left transition", activeRegion === region.name ? "border-[#21182D] bg-[#21182D] text-white shadow-[0_5px_12px_rgba(27,19,48,.16)]" : "border-[var(--line)] bg-white text-[var(--text-muted)]")}><span className="block text-[12px] font-black">{region.name}</span><span className={cn("mt-0.5 block text-[9px] font-semibold", activeRegion === region.name ? "text-white/50" : "text-[#A49EAD]")}>{region.count}개 현장</span></button>)}</div><div className="space-y-3">{visibleJobs.map((job) => <CompactJob key={job.id} job={job} />)}</div>{visibleJobs.length === 0 && <div className="rounded-[18px] border border-dashed border-[var(--line)] bg-white py-10 text-center text-[12px] font-bold text-[var(--text-muted)]">등록된 현장을 준비 중입니다.</div>}</section>

      <section className="overflow-hidden rounded-[22px] border border-[#D7AE54]/30 bg-[#FFF9EA] p-5"><div className="flex items-start gap-3"><span className="gold-fill grid h-11 w-11 shrink-0 place-items-center rounded-[14px]"><Sparkles className="h-5 w-5" /></span><div><p className="text-[15px] font-black text-[var(--brand-ink)]">채용 공고를 등록하시나요?</p><p className="mt-1 text-[10.5px] leading-4 text-[var(--text-muted)]">직책·보수·지원 조건을 명확히 적으면 더 좋은 지원자를 빠르게 만날 수 있어요.</p></div></div><Link href="/jobs/write" className="mt-4 flex w-full items-center justify-center gap-1 rounded-[14px] bg-[#21182D] py-3.5 text-[12px] font-black text-white">구인 공고 등록 <ChevronRight className="h-4 w-4" /></Link></section>
    </div> : <div className="space-y-6 px-4 pb-12 pt-4">
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#5E28BE] to-[#2B174B] p-5 text-white"><UserRoundSearch className="absolute -bottom-5 -right-3 h-32 w-32 text-white/8" /><p className="text-[10px] font-black tracking-[1.2px] text-[#E7C66D]">TALENT POOL</p><h1 className="mt-2 text-[23px] font-black tracking-[-.7px]">현장에 맞는 인재를<br />직접 만나보세요</h1><p className="mt-2 text-[11px] leading-5 text-white/55">자격·경력·근무 가능 지역을 확인하고 면접을 제안할 수 있습니다.</p><div className="mt-4 flex gap-2"><span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold">공인중개사 8명</span><span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold">분양상담사 14명</span></div></section>
      <section><SectionTitle eyebrow="READY TO WORK" title="바로 만날 수 있는 인재" /><div className="space-y-3">{CANDIDATES.map((post) => <Link key={post.id} href={`/jobs/gujik/${post.id}`} className="block rounded-[20px] border border-[var(--line)] bg-white p-4 shadow-[0_5px_16px_rgba(27,23,38,.05)] active:scale-[.985]"><div className="flex items-center justify-between"><span className="flex items-center gap-1 rounded-full bg-[var(--brand-purple-soft)] px-2.5 py-1 text-[10px] font-black text-[var(--brand-purple)]"><BadgeCheck className="h-3 w-3" />{post.role}</span><span className="rounded-full bg-[#EAF8EF] px-2.5 py-1 text-[9.5px] font-black text-[#188A4D]">{post.availability}</span></div><h3 className="mt-3 text-[15px] font-black leading-[1.4] tracking-[-.35px] text-[var(--brand-ink)]">{post.title}</h3><div className="mt-2 flex items-center gap-3 text-[10.5px] font-semibold text-[var(--text-muted)]"><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{post.region}</span><span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{post.career}</span></div><div className="mt-3 flex gap-1.5 border-t border-[#F1EEF4] pt-3">{post.skills.map((skill) => <span key={skill} className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[9.5px] font-bold text-[#6D6678]">{skill}</span>)}</div></Link>)}</div></section>
      <Link href="/jobs/gujik/write" className="flex items-center justify-between rounded-[20px] bg-[#21182D] p-5 text-white"><div><p className="text-[15px] font-black">내 경력을 알려주세요</p><p className="mt-1 text-[10.5px] text-white/50">좋은 현장의 면접 제안을 받을 수 있어요.</p></div><span className="gold-fill grid h-10 w-10 place-items-center rounded-full"><ChevronRight className="h-5 w-5" /></span></Link>
    </div>}
  </MobileLayout>;
}

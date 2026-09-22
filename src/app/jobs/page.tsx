"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, BriefcaseBusiness, MapPin, Users } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

const IMG = {
  city: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=1600&fit=crop",
  street: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1000&h=1400&fit=crop",
  office: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1000&h=1400&fit=crop",
  apartment: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&h=1400&fit=crop",
  house: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&h=1400&fit=crop",
  tower: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1000&h=1400&fit=crop",
};

type JobAudience = "공인중개사" | "분양상담사";
interface JobItem { id: string; audience: JobAudience; title: string; region: string; pay: string; image: string; due: string; }

const HOT_JOBS: JobItem[] = [
  { id: "hot-sales", audience: "분양상담사", title: "힐스빌리지 수지구청역\n분양팀 첫 조직", region: "경기남부", pay: "팀 RT 600만원", image: IMG.apartment, due: "NOW" },
  { id: "hot-agent", audience: "공인중개사", title: "마포 대단지 전담\n공인중개사", region: "서울", pay: "기본급 280만 + 성과급", image: IMG.city, due: "D−5" },
  { id: "hot-songdo", audience: "분양상담사", title: "송도 센트럴파크\n오피스텔 팀원", region: "인천", pay: "팀원 RT 720만원", image: IMG.tower, due: "D−3" },
];

const PLACES = [
  { name: "서울", english: "SEOUL", count: 7, image: IMG.street },
  { name: "경기남부", english: "GYEONGGI S.", count: 6, image: IMG.apartment },
  { name: "인천", english: "INCHEON", count: 4, image: IMG.tower },
  { name: "부산", english: "BUSAN", count: 2, image: IMG.house },
];

const REGION_JOBS: JobItem[] = [
  { id: "seoul-agent", audience: "공인중개사", title: "강남 상업용 부동산\n경력 중개사", region: "서울", pay: "성과보수 60%", image: IMG.street, due: "HOT" },
  { id: "south-sales", audience: "분양상담사", title: "동탄역 신축 대단지\n팀장·팀원", region: "경기남부", pay: "팀 RT 900만원", image: IMG.apartment, due: "NEW" },
  { id: "north-sales", audience: "분양상담사", title: "옥정중앙역 역세권\n현장 첫 조직", region: "경기북부", pay: "팀원 RT 650만원", image: IMG.house, due: "OPEN" },
  { id: "incheon-agent", audience: "공인중개사", title: "청라 오피스텔 소속\n공인중개사", region: "인천", pay: "수수료 55%", image: IMG.tower, due: "NEW" },
  { id: "busan-sales", audience: "분양상담사", title: "해운대 하이엔드\n주거상품 상담사", region: "부산", pay: "팀 RT 1,000만원", image: IMG.office, due: "HOT" },
  { id: "daejeon-agent", audience: "공인중개사", title: "도안신도시 입주장\n중개 파트너", region: "대전", pay: "월 300만 + 인센티브", image: IMG.city, due: "OPEN" },
];

const CANDIDATES = [
  { id: "gujik1", role: "공인중개사", title: "아파트 입주장·전월세 실무 가능합니다", region: "서울·경기", career: "10년", status: "즉시" },
  { id: "gujik2", role: "분양상담사", title: "신규 현장 팀원으로 합류 희망합니다", region: "경기남부", career: "3년", status: "즉시" },
  { id: "gujik3", role: "분양상담사", title: "본부·팀 세팅 가능한 경력 팀장입니다", region: "전국", career: "8년", status: "협의" },
];

function EditorialHeading({ index, eyebrow, children }: { index: string; eyebrow: string; children: React.ReactNode }) {
  return <div className="mb-5 flex items-start justify-between"><div><p className="text-[9px] font-black tracking-[2.4px] text-[#7952D8]">{eyebrow}</p><h2 className="mt-2 whitespace-pre-line text-[29px] font-black leading-[1.05] tracking-[-1.35px] text-[#17131D]">{children}</h2></div><span className="font-serif text-[13px] italic text-[#A59DAA]">{index}</span></div>;
}

export default function JobsPage() {
  const [mainTab, setMainTab] = useState<"구인" | "구직">("구인");
  const [activeRegion, setActiveRegion] = useState("전국");
  const visibleJobs = activeRegion === "전국" ? REGION_JOBS.slice(0, 3) : REGION_JOBS.filter((job) => job.region === activeRegion);

  return <MobileLayout>
    <PageHeader title="MAPI JOBS">
      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex gap-5">{(["구인", "구직"] as const).map((tab) => <button key={tab} type="button" onClick={() => setMainTab(tab)} className={cn("relative pb-1 text-[14px] font-black", mainTab === tab ? "text-[#17131D]" : "text-[#B2ABB7]")}>{tab}{mainTab === tab && <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#17131D]" />}</button>)}</div>
        <Link href={mainTab === "구인" ? "/jobs/write" : "/jobs/gujik/write"} className="flex items-center gap-1 text-[11px] font-black text-[#17131D]">{mainTab === "구인" ? "공고 올리기" : "프로필 올리기"}<ArrowUpRight className="h-3.5 w-3.5" /></Link>
      </div>
    </PageHeader>

    {mainTab === "구인" ? <main className="overflow-hidden bg-[#F4F0E8] pb-16">
      <section className="relative h-[540px] overflow-hidden bg-[#17131D] text-white">
        <Image src={IMG.city} alt="도시의 새로운 현장" fill priority sizes="430px" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-[#17131D]/95" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5 text-[9px] font-bold tracking-[1.8px] text-white/70"><span>CAREER ISSUE 01</span><span>2026 / MAPI</span></div>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-7"><p className="mb-3 font-serif text-[13px] italic text-[#E6C56D]">The next place is calling.</p><h1 className="text-[48px] font-black leading-[.96] tracking-[-2.8px]">다음 현장을<br />먼저 만나다.</h1><div className="mt-6 flex items-end justify-between border-t border-white/25 pt-4"><p className="text-[11px] leading-[1.65] text-white/65">중개와 분양의 기회가<br />가장 빠르게 모이는 곳</p><span className="grid h-11 w-11 place-items-center rounded-full border border-white/50"><ArrowDown className="h-4 w-4" /></span></div></div>
      </section>

      <section className="px-4 py-14">
        <EditorialHeading index="01" eyebrow="CHOOSE YOUR FIELD">당신의 다음<br />커리어는 어디인가요?</EditorialHeading>
        <div className="space-y-3">
          <Link href="/jobs/agents" className="group relative block h-[245px] overflow-hidden bg-[#E7E0D5]"><Image src={IMG.office} alt="공인중개사 채용" fill sizes="398px" className="object-cover transition duration-500 group-active:scale-105" /><div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-transparent" /><div className="absolute inset-y-0 left-0 flex w-[72%] flex-col justify-between p-5 text-white"><span className="grid h-9 w-9 place-items-center rounded-full border border-white/40"><BriefcaseBusiness className="h-4 w-4" /></span><div><p className="text-[10px] font-bold tracking-[1.4px] text-white/60">LICENSED AGENT · 11 OPEN</p><p className="mt-1 text-[29px] font-black tracking-[-1px]">공인중개사</p></div></div><ArrowUpRight className="absolute bottom-5 right-5 h-6 w-6 text-white" /></Link>
          <Link href="/jobs/sales" className="group relative block h-[245px] overflow-hidden bg-[#201827]"><Image src={IMG.apartment} alt="분양상담사 채용" fill sizes="398px" className="object-cover transition duration-500 group-active:scale-105" /><div className="absolute inset-0 bg-gradient-to-r from-[#4C238D]/90 via-[#3A1C62]/45 to-black/10" /><div className="absolute inset-y-0 left-0 flex w-[72%] flex-col justify-between p-5 text-white"><span className="grid h-9 w-9 place-items-center rounded-full border border-white/40"><Users className="h-4 w-4" /></span><div><p className="text-[10px] font-bold tracking-[1.4px] text-[#E6C56D]">SALES CREW · 13 OPEN</p><p className="mt-1 text-[29px] font-black tracking-[-1px]">분양상담사</p></div></div><ArrowUpRight className="absolute bottom-5 right-5 h-6 w-6 text-white" /></Link>
        </div>
      </section>

      <section className="bg-[#17131D] py-14 text-white">
        <div className="px-4"><EditorialHeading index="02" eyebrow="TRENDING NOW"><span className="text-white">지금 가장<br />뜨거운 현장.</span></EditorialHeading></div>
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {HOT_JOBS.map((job, index) => <Link key={job.id} href="/jobs/guin1" className="relative h-[430px] w-[330px] shrink-0 snap-center overflow-hidden bg-black"><Image src={job.image} alt={job.title.replace("\n", " ")} fill sizes="330px" loading={index === 0 ? "eager" : "lazy"} className="object-cover" /><div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" /><div className="absolute inset-x-0 top-0 flex justify-between p-5 text-[9px] font-black tracking-[1.5px]"><span>{String(index + 1).padStart(2, "0")} / HOT</span><span className="text-[#E6C56D]">{job.due}</span></div><div className="absolute inset-x-0 bottom-0 p-5"><p className="text-[10px] font-bold tracking-[1px] text-white/60">{job.audience} · {job.region}</p><h3 className="mt-2 whitespace-pre-line text-[27px] font-black leading-[1.12] tracking-[-1px]">{job.title}</h3><div className="mt-5 flex items-center justify-between border-t border-white/30 pt-4"><span className="text-[13px] font-black text-[#E6C56D]">{job.pay}</span><ArrowUpRight className="h-5 w-5" /></div></div></Link>)}
        </div>
        <p className="px-4 pt-4 text-right text-[9px] font-bold tracking-[1.2px] text-white/40">SWIPE TO EXPLORE →</p>
      </section>

      <section className="px-4 py-14">
        <EditorialHeading index="03" eyebrow="FIND YOUR PLACE">도시를 고르면<br />기회가 보입니다.</EditorialHeading>
        <button type="button" onClick={() => setActiveRegion("전국")} className={cn("mb-4 text-[11px] font-black tracking-[1.4px]", activeRegion === "전국" ? "text-[#17131D] underline underline-offset-4" : "text-[#A59DAA]")}>ALL 24</button>
        <div className="-mr-4 flex gap-2 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{PLACES.map((place) => <button key={place.name} type="button" onClick={() => setActiveRegion(place.name)} className={cn("relative h-[260px] w-[154px] shrink-0 overflow-hidden text-left transition", activeRegion === place.name && "ring-2 ring-[#7952D8] ring-offset-2 ring-offset-[#F4F0E8]")}><Image src={place.image} alt={`${place.name} 채용 현장`} fill sizes="154px" className="object-cover grayscale-[20%]" /><div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/75" /><div className="absolute inset-x-0 bottom-0 p-4 text-white"><p className="text-[9px] font-bold tracking-[1.2px] text-white/55">{place.english}</p><p className="mt-0.5 text-[22px] font-black">{place.name}</p><p className="mt-1 text-[10px] text-[#E6C56D]">{place.count} OPEN</p></div></button>)}</div>
        <div className="mt-4 border-t border-[#CFC8BD]">{visibleJobs.map((job, index) => <Link key={job.id} href="/jobs/guin1" className="grid grid-cols-[38px_1fr_auto] items-start gap-2 border-b border-[#CFC8BD] py-5"><span className="font-serif text-[12px] italic text-[#9D958A]">{String(index + 1).padStart(2, "0")}</span><div><p className="text-[9px] font-black tracking-[.8px] text-[#7952D8]">{job.audience} · {job.region}</p><h3 className="mt-1 whitespace-pre-line text-[17px] font-black leading-[1.3] tracking-[-.45px] text-[#17131D]">{job.title}</h3><p className="mt-2 text-[11px] font-black text-[#8C641B]">{job.pay}</p></div><ArrowUpRight className="mt-1 h-4 w-4 text-[#17131D]" /></Link>)}{visibleJobs.length === 0 && <p className="border-b border-[#CFC8BD] py-10 text-center text-[12px] font-bold text-[#8B838E]">등록 준비 중인 지역입니다.</p>}</div>
      </section>

      <section className="mx-4 border-t border-[#17131D] pt-6"><p className="font-serif text-[15px] italic text-[#7952D8]">Build your team.</p><div className="mt-2 flex items-end justify-between"><h2 className="text-[28px] font-black leading-[1.1] tracking-[-1.2px] text-[#17131D]">좋은 사람을 찾는<br />가장 빠른 시작.</h2><Link href="/jobs/write" className="grid h-14 w-14 place-items-center rounded-full bg-[#17131D] text-white"><ArrowUpRight className="h-5 w-5" /></Link></div></section>
    </main> : <main className="overflow-hidden bg-[#F4F0E8] pb-16">
      <section className="relative h-[500px] overflow-hidden bg-[#301C50] text-white"><Image src={IMG.office} alt="새로운 커리어를 찾는 인재" fill priority sizes="430px" className="object-cover opacity-55" /><div className="absolute inset-0 bg-gradient-to-b from-[#4A2283]/25 to-[#17131D]/95" /><div className="absolute inset-x-0 bottom-0 p-5 pb-8"><p className="font-serif text-[13px] italic text-[#E6C56D]">People make the place.</p><h1 className="mt-3 text-[45px] font-black leading-[.98] tracking-[-2.5px]">경력보다 먼저,<br />사람을 봅니다.</h1><p className="mt-5 text-[11px] leading-[1.7] text-white/60">현장을 이해하는 사람과<br />새로운 제안을 연결합니다.</p></div></section>
      <section className="px-4 py-14"><EditorialHeading index="01" eyebrow="TALENT EDIT">지금 만날 수 있는<br />현장의 사람들.</EditorialHeading><div className="border-t border-[#CFC8BD]">{CANDIDATES.map((post, index) => <Link key={post.id} href={`/jobs/gujik/${post.id}`} className="grid grid-cols-[42px_1fr_auto] gap-2 border-b border-[#CFC8BD] py-6"><span className="font-serif text-[13px] italic text-[#9D958A]">{String(index + 1).padStart(2, "0")}</span><div><p className="text-[9px] font-black tracking-[1px] text-[#7952D8]">{post.role} · {post.status}</p><h3 className="mt-2 text-[18px] font-black leading-[1.35] tracking-[-.55px] text-[#17131D]">{post.title}</h3><p className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[#8B838E]"><MapPin className="h-3 w-3" />{post.region} · 경력 {post.career}</p></div><ArrowUpRight className="mt-1 h-4 w-4" /></Link>)}</div></section>
      <section className="mx-4 bg-[#17131D] px-5 py-7 text-white"><p className="text-[9px] font-bold tracking-[1.6px] text-[#E6C56D]">OPEN PROFILE</p><h2 className="mt-3 text-[27px] font-black leading-[1.15] tracking-[-1px]">당신의 다음 현장이<br />먼저 찾아오도록.</h2><Link href="/jobs/gujik/write" className="mt-7 flex items-center justify-between border-t border-white/25 pt-4 text-[12px] font-black">구직 프로필 등록 <ArrowUpRight className="h-5 w-5" /></Link></section>
    </main>}
  </MobileLayout>;
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, SlidersHorizontal, Bookmark } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

/* =========================================================================
   구인구직 — 분양의신 섹션 위계 재현 + MAPI 브랜딩
   ① 히어로 AD 배너(대형)
   ② 지역 사진칩 + 필터
   ③ 🏆 프리미엄 대표 현장 — 가로형 대형 카드 (썸네일 150 ─ 설명)
   ④ 👍 MAPI 추천 현장 — 2단 그리드 (썸네일 상단 / 설명 하단)
   ⑤ 🔥 적극 채용중인 공고 — 1단 그리드 (썸네일 | 설명)
   ⑥ ⚡ 오늘의 핵심 공고 — 소형 썸네일 + 현장명/설명 컴팩트 리스트
   ========================================================================= */

const IMG = {
  city1: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=600&fit=crop",
  city2: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=600&fit=crop",
  city3: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=600&fit=crop",
  apt1: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=600&fit=crop",
  apt2: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop",
  apt3: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&h=600&fit=crop",
  apt4: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=600&h=600&fit=crop",
  apt5: "https://images.unsplash.com/photo-1517541866997-ea18e32ea9e9?w=600&h=600&fit=crop",
};

const REGIONS = [
  { name: "전국", image: IMG.city1 },
  { name: "서울", image: IMG.city2, hot: true },
  { name: "경기남부", image: IMG.city3, hot: true },
  { name: "인천", image: IMG.apt1 },
  { name: "부산", image: IMG.apt3 },
];

const POS_COLORS: Record<string, string> = {
  본부장: "bg-[#FEE2E2] text-[#DC2626]",
  팀장: "bg-[#EDE9FE] text-[#7B2FF7]",
  팀: "bg-[#DCFCE7] text-[#16A34A]",
  팀원: "bg-[#CFFAFE] text-[#0891B2]",
  영맨: "bg-[#FEF3C7] text-[#D97706]",
};

const WEL_ICONS: Record<string, string> = {
  영업비: "📢", MGM: "🎁", 광고비: "🅰️", 일비: "💰", 식사: "🍴", 숙소비: "🏠", 교육: "📚", 인센티브: "🏆",
};

interface FeeRow {
  p: string;
  amount: string;
}
interface JobPost {
  id: string;
  type: string;
  region: string;
  title: string;
  teaser: string;
  fees: FeeRow[];
  wel: string[];
  image: string;
  flyer?: { line1: string; line2: string; sub?: string; grad: string };
  badge?: "HOT" | "NEW";
}

/* ── Mock (가상 데이터) — 분양의신 밀도로 채움 ── */

// ③ 프리미엄 대표 현장 (가로형 대형)
const PREMIUM_POSTS: JobPost[] = [
  {
    id: "guin1", type: "아파트", region: "경기",
    title: "힐스빌리지 수지구청역", teaser: "수지 주거의 판을 바꾸다! 초역세권 대단지",
    fees: [{ p: "팀", amount: "600" }],
    wel: ["영업비", "MGM", "광고비", "일비"],
    image: IMG.apt1,
    flyer: { line1: "힐스빌리지", line2: "수지구청역", sub: "광고비 50% 지원", grad: "linear-gradient(150deg,#FF5A79,#FFB56B)" },
    badge: "HOT",
  },
  {
    id: "guin1", type: "아파트", region: "경기남부",
    title: "그랑베르 동탄역 3차", teaser: "조건변경 들어갑니다! 수수료 파격인상",
    fees: [
      { p: "본부장", amount: "150" },
      { p: "팀장", amount: "300" },
    ],
    wel: ["영업비", "MGM", "광고비", "일비"],
    image: IMG.apt2,
    flyer: { line1: "GRANDVERT", line2: "그랑베르 동탄역", sub: "계약축하금 지급", grad: "linear-gradient(150deg,#7E22CE,#2C1B55)" },
  },
];

// ④ 추천 현장 (2단 그리드)
const RECOMMEND_POSTS: JobPost[] = [
  {
    id: "guin1", type: "아파트", region: "인천",
    title: "루체팰리스 검단신도시", teaser: "인천 검단 대단지 입주장",
    fees: [{ p: "팀장", amount: "400" }], wel: ["일비", "숙소비"],
    image: IMG.city1, badge: "NEW",
  },
  {
    id: "guin1", type: "오피스텔", region: "인천",
    title: "센트럴마크 송도", teaser: "역세권 오피스텔 초기 분양",
    fees: [{ p: "팀원", amount: "350" }], wel: ["교육"],
    image: IMG.city2, badge: "NEW",
  },
  {
    id: "guin1", type: "아파트", region: "경기",
    title: "포레나힐 의왕 민간임대", teaser: "일비 2만원 · 즉시 투입",
    fees: [{ p: "팀장", amount: "250" }], wel: ["일비"],
    image: IMG.apt4, badge: "HOT",
  },
  {
    id: "guin1", type: "아파트", region: "경기",
    title: "어반포레 운정신도시", teaser: "파주 운정 대단지 상담사 모집",
    fees: [{ p: "팀원", amount: "300" }], wel: ["숙소비", "일비"],
    image: IMG.apt5, badge: "NEW",
  },
];

// ⑤ 적극 채용중인 공고 (1단 그리드)
const ACTIVE_POSTS: JobPost[] = [
  {
    id: "guin1", type: "오피스텔", region: "인천",
    title: "마리나베이 청라 오피스텔", teaser: "8~10% 할인분양 · 광고비 50% 지원!",
    fees: [{ p: "팀", amount: "1,300" }],
    wel: ["광고비", "일비", "식사"],
    image: IMG.apt3,
    flyer: { line1: "팀 600~1,300", line2: "할인분양 현장", sub: "광고비 50% 지원", grad: "linear-gradient(150deg,#2563EB,#0F2154)" },
    badge: "NEW",
  },
  {
    id: "guin1", type: "아파트", region: "서울 마포",
    title: "샘플 아파트 공인 중개사", teaser: "대단지 입주장, 정예 세일즈 팀 합류 기회",
    fees: [
      { p: "팀장", amount: "330" },
      { p: "팀원", amount: "670" },
    ],
    wel: ["식사", "숙소비", "인센티브"],
    image: IMG.city1,
    badge: "HOT",
  },
  {
    id: "guin1", type: "아파트", region: "경기남부",
    title: "블루아 시그니처 안성 47", teaser: "수수료 1,000만 (계약 400 / 입주 600)",
    fees: [{ p: "팀장", amount: "1,000" }],
    wel: ["영업비", "숙소비"],
    image: IMG.city2,
    flyer: { line1: "수수료", line2: "1,000만 (400/600)", sub: "광고비 50% 지원", grad: "linear-gradient(150deg,#B45309,#5C2D06)" },
  },
];

// ⑥ 오늘의 핵심 공고 (소형 썸네일 리스트)
const TODAY_POSTS: JobPost[] = [
  { id: "guin1", type: "아파트", region: "경기남부", title: "리버뷰 더리브 남양주", teaser: "1,414세대 대단지 · 26년 하반기 신규현장", fees: [{ p: "팀장", amount: "330" }], wel: [], image: IMG.apt1, badge: "NEW" },
  { id: "guin1", type: "지산", region: "경기", title: "테크노밸리 지식산업센터", teaser: "판교 인접 · 사전예약 접수 중", fees: [{ p: "영맨", amount: "180" }], wel: [], image: IMG.apt4 },
  { id: "guin1", type: "상가", region: "서울", title: "메가스퀘어 상가 분양", teaser: "역세권 스트리트몰 · 즉시 수익", fees: [{ p: "팀원", amount: "220" }], wel: [], image: IMG.apt5 },
  { id: "guin1", type: "아파트", region: "부산", title: "오션마크 해운대", teaser: "바다조망 하이엔드 · 경력자 우대", fees: [{ p: "본부장", amount: "500" }], wel: [], image: IMG.city3, badge: "HOT" },
  { id: "guin1", type: "오피스텔", region: "서울", title: "노블어반 강남역", teaser: "강남 초역세권 · 신입 환영", fees: [{ p: "영맨", amount: "150" }], wel: [], image: IMG.city2 },
  { id: "guin1", type: "아파트", region: "인천", title: "파크시티 영종국제도시", teaser: "숙소 제공 · 지방 지원자 환영", fees: [{ p: "팀원", amount: "280" }], wel: [], image: IMG.apt3 },
];

/* ── 공용 조각 ── */

function PosBadge({ p, size = "md" }: { p: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "font-extrabold rounded-md whitespace-nowrap",
        size === "sm" ? "text-[10.5px] px-1.5 py-0.5" : "text-[12px] px-2 py-1",
        POS_COLORS[p] ?? "bg-[#EDE9FE] text-[#7B2FF7]"
      )}
    >
      {p}
    </span>
  );
}

function StateBadge({ badge }: { badge?: "HOT" | "NEW" }) {
  if (!badge) return null;
  return (
    <span
      className={cn(
        "text-[10px] font-extrabold px-1.5 py-0.5 rounded-[5px] shrink-0",
        badge === "HOT" ? "bg-[#FEE2E2] text-[#EF4444]" : "bg-[#DCFCE7] text-[#16A34A]"
      )}
    >
      {badge}
    </span>
  );
}

function FeeLine({ fee, size = "md" }: { fee: FeeRow; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-1.5">
      <PosBadge p={fee.p} size={size === "sm" ? "sm" : "md"} />
      <span className="text-[11px] text-[#C9C2DC] font-extrabold">RT</span>
      <span
        className={cn(
          "font-extrabold text-[#1B1330] tracking-[-0.5px]",
          size === "sm" ? "text-[17px]" : "text-[22px]"
        )}
      >
        {fee.amount}
      </span>
      <span className="text-[12px] font-bold text-[#6E6787] -ml-0.5">만원</span>
    </div>
  );
}

function WelChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-white border border-[#EFEBF7] text-[11px] px-2 py-1 rounded-lg whitespace-nowrap">
      <span className="text-[10px]">{WEL_ICONS[label] ?? "✅"}</span>
      <span className="text-[#6E6787] font-semibold">{label}</span>
      <span className="text-[#EF4444] font-extrabold">제공</span>
    </span>
  );
}

// 플라이어형 썸네일 — 실서비스에선 현장 광고 이미지로 교체
function FlyerThumb({ post, className, textScale = 1 }: { post: JobPost; className?: string; textScale?: number }) {
  return (
    <div className={cn("relative shrink-0 rounded-2xl overflow-hidden", className)}>
      {post.flyer ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-2"
          style={{ background: post.flyer.grad }}
        >
          <div className="text-white/90 font-bold leading-tight" style={{ fontSize: 11 * textScale }}>
            {post.flyer.line1}
          </div>
          <div className="text-white font-extrabold leading-tight mt-0.5 break-keep" style={{ fontSize: 15 * textScale }}>
            {post.flyer.line2}
          </div>
          {post.flyer.sub && (
            <div
              className="mt-1.5 bg-white/25 text-white font-bold px-2 py-0.5 rounded-full"
              style={{ fontSize: 9 * textScale }}
            >
              {post.flyer.sub}
            </div>
          )}
        </div>
      ) : (
        <Image src={post.image} alt={post.title} fill className="object-cover" sizes="200px" />
      )}
    </div>
  );
}

function SectionHead({ emoji, title, sub, more }: { emoji: string; title: string; sub?: string; more?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-base">{emoji}</span>
      <h2 className="text-base font-extrabold text-[#1B1330] tracking-[-0.3px]">{title}</h2>
      {sub && <span className="text-[11px] text-[#A49BBE] font-medium">{sub}</span>}
      {more && (
        <button type="button" className="ml-auto text-[12px] font-semibold text-[#A49BBE]">
          {more}
        </button>
      )}
    </div>
  );
}

/* ── 카드 3종 ── */

// 가로형 대형 카드 (프리미엄·적극 채용) — 썸네일 150px | 설명
function JobCardWide({ post, vip }: { post: JobPost; vip?: boolean }) {
  return (
    <Link
      href={`/jobs/${post.id}`}
      className="block bg-white rounded-[20px] p-3.5 shadow-[0_2px_10px_rgba(27,19,48,.05)] active:scale-[0.98] transition-transform"
    >
      <div className="flex gap-3.5">
        <div className="relative">
          <FlyerThumb post={post} className="w-[150px] h-[150px]" textScale={1.05} />
          {vip && (
            <span
              className="absolute top-0 left-0 z-10 text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-br-lg rounded-tl-2xl"
              style={{ background: "linear-gradient(135deg,#E0A93B,#C8832A)" }}
            >
              VIP
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11.5px] font-bold text-[#9A93AC]">
              {post.type} · {post.region}
            </span>
            <span className="flex items-center gap-1.5">
              <StateBadge badge={post.badge} />
              <Bookmark className="w-4 h-4 text-[#C9C2DC]" strokeWidth={2} />
            </span>
          </div>
          <div className="text-[16px] font-extrabold text-[#1B1330] tracking-[-0.3px] leading-[1.3] mt-1 line-clamp-2">
            {post.title}
          </div>
          <div className="text-[12px] text-[#6E6787] mt-1 line-clamp-1">{post.teaser}</div>
          <div className="mt-auto pt-1.5 space-y-1.5">
            {post.fees.map((fee) => (
              <FeeLine key={fee.p} fee={fee} size={post.fees.length > 1 ? "sm" : "md"} />
            ))}
          </div>
        </div>
      </div>

      {post.wel.length > 0 && (
        <div className="flex gap-1.5 mt-3 pt-3 border-t border-[#F3F0FA] overflow-x-auto">
          {post.wel.map((w) => (
            <WelChip key={w} label={w} />
          ))}
        </div>
      )}
    </Link>
  );
}

// 2단 그리드 카드 (추천 현장) — 썸네일 상단 / 설명 하단
function JobCardGrid({ post }: { post: JobPost }) {
  return (
    <Link
      href={`/jobs/${post.id}`}
      className="bg-white rounded-[16px] overflow-hidden shadow-[0_3px_12px_rgba(27,19,48,.05)] active:scale-[0.97] transition-transform"
    >
      <div className="relative h-[118px]">
        <FlyerThumb post={post} className="absolute inset-0 !rounded-none" />
        <span className="absolute top-2.5 left-2.5 bg-black/40 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
          {post.type} · {post.region}
        </span>
        <span className="absolute top-2.5 right-2.5">
          <StateBadge badge={post.badge} />
        </span>
      </div>
      <div className="p-3">
        <div className="text-[13.5px] font-extrabold text-[#1B1330] leading-[1.35] line-clamp-2 min-h-[37px]">
          {post.title}
        </div>
        <div className="text-[11px] text-[#9A93AC] mt-0.5 truncate">{post.teaser}</div>
        <div className="mt-2">
          <FeeLine fee={post.fees[0]} size="sm" />
        </div>
        {post.wel.length > 0 && (
          <div className="flex gap-1 mt-2.5 pt-2.5 border-t border-[#F3F0FA] flex-wrap">
            {post.wel.slice(0, 2).map((w) => (
              <WelChip key={w} label={w} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// 컴팩트 리스트 (오늘의 핵심 공고) — 작은 썸네일 + 현장명/설명
function JobCardCompact({ post }: { post: JobPost }) {
  return (
    <Link
      href={`/jobs/${post.id}`}
      className="flex items-center gap-3 bg-white rounded-[14px] p-3 shadow-[0_2px_10px_rgba(27,19,48,.04)] active:scale-[0.98] transition-transform"
    >
      <div className="relative w-[52px] h-[52px] shrink-0 rounded-xl overflow-hidden">
        <Image src={post.image} alt={post.title} fill className="object-cover" sizes="52px" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] text-[#9A93AC] font-bold">
            {post.type} · {post.region}
          </span>
          <StateBadge badge={post.badge} />
        </div>
        <div className="text-[13.5px] font-bold text-[#1B1330] truncate mt-0.5">{post.title}</div>
        <div className="text-[11px] text-[#9A93AC] truncate mt-0.5">{post.teaser}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] text-[#9A93AC] font-bold">{post.fees[0].p}</div>
        <div className="text-[14.5px] font-extrabold text-[#7B2FF7] tracking-[-0.4px]">
          {post.fees[0].amount}
          <span className="text-[10.5px] font-bold text-[#A49BBE] ml-0.5">만원</span>
        </div>
      </div>
    </Link>
  );
}

export default function SalesJobsPage() {
  const [activeRegion, setActiveRegion] = useState("전국");

  return (
    <MobileLayout>
      <PageHeader title="분양상담사 구인" />

      {(
        <div className="pt-4 pb-24">
          {/* ① 히어로 현장 광고 배너 (대형) */}
          <div className="px-4">
            <Link
              href="/jobs/guin1"
              className="block relative h-[200px] rounded-[20px] overflow-hidden active:scale-[0.98] transition-transform"
            >
              <Image src={IMG.apt2} alt="히어로 광고" fill className="object-cover" sizes="390px" priority />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1B1330]/90 via-[#1B1330]/55 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-center">
                <span
                  className="self-start text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md mb-2.5"
                  style={{ background: "linear-gradient(135deg,#E0A93B,#C8832A)" }}
                >
                  AD
                </span>
                <div className="text-white text-[20px] font-extrabold tracking-[-0.4px] leading-[1.35]">
                  샘플지구 엘리프 한신더휴
                  <br />
                  팀장님 및 팀원 모집
                </div>
                <div className="text-[#EBD79A] text-[13px] font-bold mt-2">
                  광고비 50% 지원!! · 마피 중개사
                </div>
              </div>
            </Link>
          </div>

          {/* ② 지역 사진 칩 + 필터 */}
          <div className="flex items-center gap-2.5 px-4 mt-4 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => alert("상세 필터 (데모)")}
              aria-label="필터"
              className="shrink-0 w-11 h-11 rounded-full bg-white border border-[#E9E4F5] flex items-center justify-center"
            >
              <SlidersHorizontal className="w-[18px] h-[18px] text-[#6E6787]" strokeWidth={2} />
            </button>
            {REGIONS.map((region) => {
              const active = activeRegion === region.name;
              return (
                <button
                  key={region.name}
                  type="button"
                  onClick={() => setActiveRegion(region.name)}
                  className={cn(
                    "relative shrink-0 flex items-center gap-2 rounded-full pl-1.5 pr-4 py-1.5 border transition-colors",
                    active ? "bg-[#1B1330] border-[#1B1330]" : "bg-white border-[#E9E4F5]"
                  )}
                >
                  <span className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image src={region.image} alt={region.name} fill className="object-cover" sizes="32px" />
                  </span>
                  <span className={cn("text-[13.5px] font-extrabold", active ? "text-white" : "text-[#1B1330]")}>
                    {region.name}
                  </span>
                  {region.hot && (
                    <span className="absolute -top-1.5 -right-1 bg-[#EF4444] text-white text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full">
                      🔥HOT
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ③ 프리미엄 대표 현장 — 가로형 대형 */}
          <section className="px-4 mt-5">
            <SectionHead emoji="🏆" title="프리미엄 대표 현장" sub="에디터 큐레이션" more="상품 안내" />
            <div className="space-y-3">
              {PREMIUM_POSTS.map((post, i) => (
                <JobCardWide key={i} post={post} vip />
              ))}
            </div>
          </section>

          {/* ④ 추천 현장 — 2단 그리드 */}
          <section className="px-4 mt-7">
            <SectionHead emoji="👍" title="MAPI 추천 현장" more="전체보기 →" />
            <div className="grid grid-cols-2 gap-3">
              {RECOMMEND_POSTS.map((post, i) => (
                <JobCardGrid key={i} post={post} />
              ))}
            </div>
          </section>

          {/* ⑤ 적극 채용중인 공고 — 1단 그리드 */}
          <section className="px-4 mt-7">
            <SectionHead emoji="🔥" title="적극 채용중인 공고" sub="지금 바로 투입" more="전체보기 →" />
            <div className="space-y-3">
              {ACTIVE_POSTS.map((post, i) => (
                <JobCardWide key={i} post={post} />
              ))}
            </div>
          </section>

          {/* ⑥ 오늘의 핵심 공고 — 소형 썸네일 컴팩트 리스트 */}
          <section className="px-4 mt-7">
            <SectionHead emoji="⚡" title="오늘의 핵심 공고" more="최신순" />
            <div className="space-y-2.5">
              {TODAY_POSTS.map((post, i) => (
                <JobCardCompact key={i} post={post} />
              ))}
            </div>
          </section>
        </div>
      )}

      <Link
        href="/jobs/write"
        className="fixed bottom-24 z-20 left-1/2 translate-x-[55px] inline-flex items-center gap-1.5 text-white text-[13.5px] font-extrabold rounded-full pl-3.5 pr-4 py-3 shadow-[0_6px_16px_rgba(123,47,247,.4)] active:scale-95 transition-transform"
        style={{ background: "linear-gradient(135deg,#7B2FF7,#A855F7)" }}
      >
        <Plus className="w-4 h-4" strokeWidth={2.6} />
        공고 등록
      </Link>
    </MobileLayout>
  );
}
